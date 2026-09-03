// ================================
// Codes.jsx - توليد الأكواد وجدول الأكواد المتقدم
// ================================

import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Chip, TextField, MenuItem, Snackbar, Alert, Pagination, InputAdornment, Divider } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from "react";
import axios from '../../api/axiosClient';
import GenerateCodesModal from '../codes/GenerateCodesModal';
import { useAuth } from "../../contexts/AuthContext";

const Codes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [codes, setCodes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({open:false,message:'',severity:'success'});
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneTempValue, setPhoneTempValue] = useState('');
  const [buyCodeMessages, setBuyCodeMessages] = useState({ ar: '', en: '', de: '' });
  const [messageTempValues, setMessageTempValues] = useState({ ar: '', en: '', de: '' });
  const { can } = useAuth();
  const limit = 10;

  const fetchPlans = async () => {
    try {
      const res = await axios.get('/plans');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWhatsAppPhone = async () => {
    try {
      const res = await axios.get('/settings/whatsapp-phone');
      setWhatsappPhone(res.data.phone || '');
      setBuyCodeMessages({
        ar: res.data.messages?.ar || 'مرحبا اريد شراء كود',
        en: res.data.messages?.en || 'Hello, I want to buy a code',
        de: res.data.messages?.de || 'Hallo, ich möchte einen Code kaufen',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const saveWhatsAppPhone = async () => {
    try {
      await axios.post('/settings/whatsapp-phone', {
        phone: phoneTempValue,
        messageAr: messageTempValues.ar,
        messageEn: messageTempValues.en,
        messageDe: messageTempValues.de,
      });
      setWhatsappPhone(phoneTempValue);
      setBuyCodeMessages(messageTempValues);
      setIsEditingPhone(false);
      setSnackbar({open:true,message:'رقم WhatsApp تم حفظه بنجاح',severity:'success'});
    } catch (err) {
      setSnackbar({open:true,message:'حدث خطأ في حفظ الرقم',severity:'error'});
      console.error(err);
    }
  };

  const fetchCodes = async () => {
    try {
      const params = { page, limit };
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if(filterPlan) params.planId = filterPlan;
      if(filterStatus) params.status = filterStatus;
      const res = await axios.get('/codes', { params });
      setCodes(res.data.codes);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchWhatsAppPhone();
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [filterPlan, filterStatus, searchQuery, page]);


const formatCsvValue = (value) => {
  const stringValue = value == null ? '' : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const exportCodes = () => {
  if (!codes.length) return;

  const headers = ["Code", "Access Type", "Duration", "Created At", "Expires At"];
  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  };

  const rows = codes.map((c) => [
    c.code || '',
    c.planId?.accessType || c.accessType || 'Unknown',
    durationM(c.planId?.durationMonths || c.planId?.durationDays || c.durationDays),
    formatDate(c.createdAt),
    formatDate(c.expiresAt),
  ]);
 
  const delimiter = ';';
  const csvContent = '\uFEFF' + [headers, ...rows]
    .map((row) => row.map((cell) => formatCsvValue(cell)).join(delimiter))
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const accessType = codes[0]?.planId?.accessType || codes[0]?.accessType || 'plan';
  const duration = codes[0]?.planId?.durationMonths || codes[0]?.planId?.durationDays || codes[0]?.durationDays || 'all';
  const fileName = `${accessType}_${duration}_codes.csv`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const durationM = (durationDays) => {
  const durationMonths = ({ 30: 1, 90: 3, 180: 6, 365: 12 }[durationDays] || durationDays);
  if (durationMonths === 1) return "1 Month";
  if (durationMonths === 3) return "3 Months";
  if (durationMonths === 6) return "6 Months";
  if (durationMonths === 12) return "1 Year";
  return `${durationMonths} Months`;
  };
  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb:3 }}>
        <Typography variant="h4">إدارة الأكواد</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
          توليد أكواد
        </Button>
      </Box>

      {/* قسم إعدادات رقم WhatsApp */}
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 70%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 2, bgcolor: '#dcfce7', color: '#16a34a' }}>
              <WhatsAppIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>إعدادات شراء الأكواد</Typography>
              <Typography variant="body2" color="text.secondary">بيانات التواصل والرسالة التي تظهر عند طلب شراء كود</Typography>
            </Box>
          </Box>
        </Box>
        
        {!isEditingPhone ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, .7fr) 1fr' }, gap: 3, alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">رقم WhatsApp للتواصل</Typography>
              <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700, direction: 'ltr', textAlign: 'right' }}>
                {whatsappPhone || 'لم يتم تعيين رقم'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography variant="body2" color="text.secondary">الرسالة الحالية</Typography>
              <Typography sx={{ p: 1.25, bgcolor: 'rgba(255,255,255,.8)', border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>{buyCodeMessages.ar}</Typography>
            </Box>
            {can('updateAppSettings') && (
              <Button variant="outlined" startIcon={<EditIcon />} sx={{ gridColumn: { xs: '1', md: '1 / -1' }, justifySelf: { md: 'start' } }}
                onClick={() => {
                  setIsEditingPhone(true);
                  setPhoneTempValue(whatsappPhone);
                  setMessageTempValues(buyCodeMessages);
                }}
              >
                تعديل الإعدادات
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, .7fr) 1fr' }, gap: 2 }}>
            <TextField 
              label="رقم WhatsApp"
              placeholder="+966541234567"
              value={phoneTempValue}
              onChange={(e) => setPhoneTempValue(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 2 }}>
              <TextField label="رسالة الشراء بالعربية" value={messageTempValues.ar} onChange={(e) => setMessageTempValues({ ...messageTempValues, ar: e.target.value })} fullWidth multiline />
              <TextField label="رسالة الشراء بالإنجليزية" value={messageTempValues.en} onChange={(e) => setMessageTempValues({ ...messageTempValues, en: e.target.value })} fullWidth multiline />
              <TextField label="رسالة الشراء بالألمانية" value={messageTempValues.de} onChange={(e) => setMessageTempValues({ ...messageTempValues, de: e.target.value })} fullWidth multiline />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' }, display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
              <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={saveWhatsAppPhone}>حفظ التغييرات</Button>
              <Button variant="outlined" startIcon={<CloseIcon />} onClick={() => setIsEditingPhone(false)}>إلغاء</Button>
            </Box>
          </Box>
        )}
        <Divider sx={{ mt: 2 }} />
      </Paper>

      <Box sx={{ display:'flex', gap:2, mb:2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField label="البحث عن كود" placeholder="اكتب جزءًا من الكود" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} sx={{ minWidth: { xs: '100%', md: 280 }, flex: 1 }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }} />
        <TextField select label="تصفية الخطة" value={filterPlan} onChange={(e)=>{setFilterPlan(e.target.value); setPage(1);}} sx={{minWidth:150}}>
          <MenuItem value="">جميع الخطط</MenuItem>
          {plans.map(plan=>(
            <MenuItem key={plan._id} value={plan._id}>{plan.accessType} ({durationM(plan.durationMonths || plan.durationDays)})</MenuItem>
          ))}
        </TextField>

        <TextField select label="الحالة" value={filterStatus} onChange={(e)=>{setFilterStatus(e.target.value); setPage(1);}} sx={{minWidth:150}}>
          <MenuItem value="">الكل</MenuItem>
          <MenuItem value="used">مستخدم</MenuItem>
          <MenuItem value="unused">غير مستخدم</MenuItem>
        </TextField>
      </Box>
  <Button
      variant="contained"
      color="primary"
      onClick={exportCodes}
      disabled={!codes.length}
      sx={{ mr: 2 }}
    >
      تحميل ملف الأكواد (CSV)
    </Button>


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Used By</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {codes.map(c=>(
              <TableRow key={c._id}>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.planId ? `${c.accessType} (${durationM(c.planId.durationMonths || c.planId.durationDays)})` : 'Unknown'}</TableCell>
                <TableCell>{c.usedBy?.name || '-'}</TableCell>
                <TableCell>
                  {c.isUsed ? <Chip label="Used" color="success" /> : <Chip label="Unused" sx={{background:'orange',color:'white'}} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display:'flex', justifyContent:'center', mt:2 }}>
        <Pagination count={totalPages} page={page} onChange={(e,value)=>setPage(value)} color="secondary" />
      </Box>

      <GenerateCodesModal
        open={modalOpen}
        handleClose={()=>setModalOpen(false)}
        onGenerated={()=>{ setSnackbar({open:true,message:'Codes generated successfully',severity:'success'}); fetchCodes(); }}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar({...snackbar,open:false})}>
        <Alert severity={snackbar.severity} sx={{width:'100%'}}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Codes;