// ================================
// Plans.jsx - إدارة الخطط
// ================================

import { Box, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, IconButton, Snackbar, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import axios from "../../api/axiosClient";
import { MenuItem } from "@mui/material";
const Plans = () => {
   const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState("");
  const [plans, setPlans] = useState([]);
    const [accessType, setAccessType] = useState("app");
  
  const [snackbar, setSnackbar] = useState({open:false,message:'',severity:'success'});

  const fetchPlans = async () => {
    try {
      const res = await axios.get("/plans");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const addPlan = async () => {
    if (!accessType || !duration || !price) {
      setSnackbar({open:true,message:'All fields required',severity:'error'});
      return;
    }
    try {
      await axios.post("/plans", { accessType:accessType, durationDays : Number(duration), price: Number(price) });
      setAccessType("app"); setDuration(30); setPrice("");
      fetchPlans();
      setSnackbar({open:true,message:'Plan added successfully',severity:'success'});
    } catch (err) {
      console.error(err);
      setSnackbar({open:true,message:'Failed to add plan',severity:'error'});
    }
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/plans/${id}`);
      fetchPlans();
      setSnackbar({open:true,message:'Plan deleted',severity:'success'});
    } catch (err) {
      console.error(err);
      setSnackbar({open:true,message:'Failed to delete plan',severity:'error'});
    }
  };
  const   durationM =   (durationDays) => {

   if(durationDays==30) return "1 Month" 
    else if (durationDays==90) return "3 Months" 
      else if(durationDays==180) return "6 Months" 
    else  return "1 Year" 

       
 
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Manage Plans</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      

<TextField
  select
  label="Access Type"
  value={accessType}
  onChange={(e) => setAccessType(e.target.value)}
>
  <MenuItem value="app">App</MenuItem>
  <MenuItem value="section">Section</MenuItem>
  <MenuItem value="topic">Topic</MenuItem>
  <MenuItem value="research">Research</MenuItem>
  <MenuItem value="lecture">Lecture</MenuItem>
</TextField>
<TextField
 select
 label="Duration"
 value={duration}
 onChange={(e)=>setDuration(e.target.value)}
>

<MenuItem value={30}>1 Month</MenuItem>
<MenuItem value={90}>3 Months</MenuItem>
<MenuItem value={180}>6 Months</MenuItem>
<MenuItem value={365}>1 Year</MenuItem>

</TextField>


        <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Button variant="contained" color="secondary" onClick={addPlan}>Add Plan</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>access Type</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map(plan => (
              <TableRow key={plan._id}>
                <TableCell>{plan.accessType}</TableCell>
                <TableCell> {durationM(plan.durationDays)}</TableCell>
                <TableCell>${plan.price}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => deletePlan(plan._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar,open:false})}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Plans;
