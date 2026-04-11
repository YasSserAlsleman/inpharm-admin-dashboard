import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "../../api/axiosClient";

const GenerateCodesModal = ({ open, handleClose, onGenerated }) => {

  const [quantity, setQuantity] = useState(1);
  const [planId, setPlanId] = useState("");
  const [accessType, setAccessType] = useState("");

  const [plans, setPlans] = useState([]);
  const [downloadAfterGenerate, setDownloadAfterGenerate] = useState(false);
  // جلب الخطط من السيرفر
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/plans"); // API يعيد جميع الخطط
        setPlans(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlans();
  }, []);

  const generateCodes = async (download = false) => {

    try {

      const res = await axios.post("/codes/generate", {
        accessType,
        quantity,
        planId,
       });

      const newCodes = res.data.codes;

      if (download) {

        const plan = plans.find(p => p._id === planId);

        exportNewCodes(
          newCodes,
          plan?.accessType || "plan",
          plan?.durationDays || "duration"
        );

      }

      handleClose();

    } catch (err) {

      console.error(err);

    }

  };

  const exportNewCodes = (codes, accessType, durationDays) => {

    const headers = ["Code"];

    const rows = codes.map(c => [c.code]);

    const csvContent =
      [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const safeDuration = durationM(durationDays);

    const fileName = `${accessType}_${safeDuration}.csv`;

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    link.click();
  };

  const durationM = (durationDays) => {

    if (durationDays == 30) return "1 Month"
    else if (durationDays == 90) return "3 Months"
    else if (durationDays == 180) return "6 Months"
    else return "1 Year"



  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Generate Codes</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>



          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <TextField
            select
            label="Select Plan"
            value={planId}
            onChange={(e) => {
              setPlanId(e.target.value);
              const p =plans.find(p => p._id === e.target.value);
              setAccessType(p.accessType);

            }}
          >
            {plans.map(plan => (
              <MenuItem key={plan._id} value={plan._id}>
                {plan.accessType} ({durationM(plan.durationDays)})
              </MenuItem>
            ))}
          </TextField>



          <Box sx={{ display: "flex", gap: 2 }}>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                generateCodes(false);
              }}
            >
              Generate Only
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={() => {
                generateCodes(true);
              }}
            >
              Generate + Download
            </Button>

          </Box>

        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateCodesModal;