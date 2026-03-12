// ================================
// Codes.jsx - توليد الأكواد وجدول الأكواد المتقدم
// ================================

import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Chip, TextField, MenuItem, Snackbar, Alert, Pagination } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from "react";
import axios from '../../api/axiosClient';
import GenerateCodesModal from '../codes/GenerateCodesModal';

const Codes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [codes, setCodes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({open:false,message:'',severity:'success'});
  const limit = 10;

  const fetchPlans = async () => {
    try {
      const res = await axios.get('/plans');
      setPlans(res.data);
    } catch (err) {
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
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [filterPlan, filterStatus, page]);


const exportCodes = () => {

  if (!codes.length) return;

  const headers = ["Code","Plan","Duration","UsedBy","Status"];

  const rows = codes.map(c => [
    c.code,
  ]);

  const csvContent =
    [headers, ...rows]
      .map(e => e.join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // اسم الملف
  const accessType = codes[0]?.planId?.accessType || "plan";
  const duration = codes[0]?.planId?.duration || "duration";

  const fileName = `${accessType}_${duration}_months.csv`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
};

const   durationM =   (durationDays) => {

   if(durationDays==30) return "1 Month" 
    else if (durationDays==90) return "3 Months" 
      else if(durationDays==180) return "6 Months" 
    else  return "1 Year" 

       
 
  };
  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb:3 }}>
        <Typography variant="h4">Codes Management</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
          Generate Codes
        </Button>
      </Box>

      <Box sx={{ display:'flex', gap:2, mb:2 }}>
        <TextField select label="Filter Plan" value={filterPlan} onChange={(e)=>{setFilterPlan(e.target.value); setPage(1);}} sx={{minWidth:150}}>
          <MenuItem value="">All Plans</MenuItem>
          {plans.map(plan=>(
            <MenuItem key={plan._id} value={plan._id}>{plan.accessType} ({durationM(plan.durationDays)})</MenuItem>
          ))}
        </TextField>

        <TextField select label="Status" value={filterStatus} onChange={(e)=>{setFilterStatus(e.target.value); setPage(1);}} sx={{minWidth:150}}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="used">Used</MenuItem>
          <MenuItem value="unused">Unused</MenuItem>
        </TextField>
      </Box>
  <Button variant="contained" color="primary" onClick={exportCodes} sx={{ mr: 2 }}>
      Export CSV
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