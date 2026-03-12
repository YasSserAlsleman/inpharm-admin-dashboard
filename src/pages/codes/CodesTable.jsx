import { Table, TableHead, TableRow, TableCell, TableBody, Chip, Paper, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

const CodesTable = ({ refreshFlag }) => {
  const [codes, setCodes] = useState([]);

  const fetchCodes = async () => {
    try {
      const res = await axios.get("/codes");
      setCodes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, [refreshFlag]); // سيعيد التحميل عند تحديث refreshFlag

  return (
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
          {codes.map((c) => (
            <TableRow key={c._id}>
              <TableCell>{c.code}</TableCell>
<TableCell>{c.planId ? `${c.planId.name} (${c.planId.duration} month)` : "Unknown"}</TableCell>              <TableCell>{c.usedBy?.name || "-"}</TableCell>
              <TableCell>
                {c.isUsed ? <Chip label="Used" color="success" />
                  : <Chip label="Unused" sx={{ background: "orange", color: "white" }} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CodesTable;