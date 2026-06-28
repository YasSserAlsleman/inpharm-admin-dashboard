// ================================
// Codes.jsx - توليد الأكواد وجدول الأكواد المتقدم
// ================================

import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Chip, TextField, MenuItem, Snackbar, Alert, Pagination } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({open:false,message:'',severity:'success'});
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneTempValue, setPhoneTempValue] = useState('');
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
    } catch (err) {
      console.error(err);
    }
  };

  const saveWhatsAppPhone = async () => {
    try {
      await axios.post('/settings/whatsapp-phone', { phone: phoneTempValue });
      setWhatsappPhone(phoneTempValue);
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
  }, [filterPlan, filterStatus, page]);


const formatCsvValue = (value) => {
  const stringValue = value == null ? '' : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const exportCodes = () => {
  if (!codes.length) return;

  const headers = ["Code", "Plan", "Duration", "UsedBy", "Status"];

  const rows = codes.map((c) => [
    formatCsvValue(c.code || ''),
    formatCsvValue(c.planId?.accessType || c.accessType || 'Unknown'),
    formatCsvValue(durationM(c.planId?.durationDays || c.durationDays)),
    formatCsvValue(c.usedBy?.name || c.usedBy || '-'),
    formatCsvValue(c.isUsed ? 'Used' : 'Unused'),
  ]);
 
  const delimiter = ';';
  const csvContent = '\uFEFF' + [headers, ...rows]
    .map((row) => row.map((cell) => formatCsvValue(cell)).join(delimiter))
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const accessType = codes[0]?.planId?.accessType || codes[0]?.accessType || 'plan';
  const duration = codes[0]?.planId?.durationDays || codes[0]?.durationDays || 'all';
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

   if(durationDays==30) return "1 Month" 
    else if (durationDays==90) return "3 Months" 
      else if(durationDays==180) return "6 Months" 
    else  return "1 Year" 

       
 
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
      <Box sx={{ 
        backgroundColor: '#f5f5f5', 
        padding: 2, 
        borderRadius: 2, 
        marginBottom: 3,
        border: '1px solid #ddd'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb:2 }}>
          <Typography variant="h6">⚙️ إعدادات WhatsApp</Typography>
        </Box>
        
        {!isEditingPhone ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#666' }}>رقم WhatsApp للتواصل:</Typography>
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                {whatsappPhone || 'لم يتم تعيين رقم'}
              </Typography>
            </Box>
            {can('updateAppSettings') && (
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  setIsEditingPhone(true);
                  setPhoneTempValue(whatsappPhone);
                }}
              >
                تعديل
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField 
              label="رقم WhatsApp"
              placeholder="+966541234567"
              value={phoneTempValue}
              onChange={(e) => setPhoneTempValue(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <Button 
              variant="contained" 
              color="success"
              onClick={saveWhatsAppPhone}
            >
              حفظ
            </Button>
            <Button 
              variant="outlined"
              onClick={() => setIsEditingPhone(false)}
            >
              إلغاء
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ display:'flex', gap:2, mb:2 }}>
        <TextField select label="تصفية الخطة" value={filterPlan} onChange={(e)=>{setFilterPlan(e.target.value); setPage(1);}} sx={{minWidth:150}}>
          <MenuItem value="">جميع الخطط</MenuItem>
          {plans.map(plan=>(
            <MenuItem key={plan._id} value={plan._id}>{plan.accessType} ({durationM(plan.durationDays)})</MenuItem>
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
                <TableCell>{c.planId ? `${c.accessType} (${durationM(c.planId.durationDays)})` : 'Unknown'}</TableCell>
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