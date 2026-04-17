import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "../../api/axiosClient";
import Alert from "@mui/material/Alert";

const GenerateCodesModal = ({ open, handleClose, onGenerated }) => {

  const [quantity, setQuantity] = useState(1);
  const [planId, setPlanId] = useState("");
  const [accessType, setAccessType] = useState("");
  const [targetIds, setTargetIds] = useState([]);
  const [availableTargets, setAvailableTargets] = useState([]);

  const [plans, setPlans] = useState([]);
  const [downloadAfterGenerate, setDownloadAfterGenerate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // جلب الخطط من السيرفر
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/plans");
        setPlans(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load plans");
      }
    };
    if (open) fetchPlans();
  }, [open]);

  // جلب الأهداف المتاحة بناءً على accessType
  useEffect(() => {
    const fetchTargets = async () => {
      if (!accessType) return;
      try {
        let endpoint = "";
        if (accessType === "section") endpoint = "/sections";
        else if (accessType === "topic") endpoint = "/topics";
        else if (accessType === "research") endpoint = "/learningResearch/all";
        else if (accessType === "lecture") endpoint = "/lecture/all";
        if (endpoint) {
          const res = await axios.get(endpoint);
          setAvailableTargets(res.data);
        } else {
          setAvailableTargets([]);
        }
      } catch (err) {
        console.error(err);
        setAvailableTargets([]);
      }
    };
    fetchTargets();
  }, [accessType]);

  const generateCodes = async (download = false) => {
    setError("");

    // Validation
    if (!quantity || quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    if (!planId) {
      setError("Please select a plan");
      return;
    }
    if (accessType && accessType !== "app" && targetIds.length === 0) {
      setError(`Please select at least one ${accessType}`);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        accessType,
        quantity,
        planId,
        targetIds: accessType !== "app" ? targetIds.map(id => ({
          resourceType: accessType,
          resourceId: id
        })) : [],
        expiresIn: 365
      };

      const res = await axios.post("/codes/generate", payload);
      const newCodes = res.data.codes;

      if (download) {
        const plan = plans.find(p => p._id === planId);
        exportNewCodes(
          newCodes,
          plan?.accessType || "plan",
          plan?.durationDays || "duration"
        );
      }

      // Reset form
      setQuantity(1);
      setPlanId("");
      setAccessType("");
      setTargetIds([]);
      setError("");

      onGenerated?.();
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to generate codes";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Codes</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            inputProps={{ min: 1 }}
            disabled={loading}
          />

          <TextField
            select
            label="Select Plan"
            value={planId}
            onChange={(e) => {
              setPlanId(e.target.value);
              const p = plans.find(p => p._id === e.target.value);
              setAccessType(p?.accessType || "");
              setTargetIds([]);
            }}
            disabled={loading}
          >
            {plans.map(plan => (
              <MenuItem key={plan._id} value={plan._id}>
                {plan.accessType} ({durationM(plan.durationDays)})
              </MenuItem>
            ))}
          </TextField>

          {accessType && accessType !== "app" && (
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Select Targets</InputLabel>
              <Select
                multiple
                value={targetIds}
                onChange={(e) => setTargetIds(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={availableTargets.find(t => t._id === value)?.name || value} />
                    ))}
                  </Box>
                )}
              >
                {availableTargets.length === 0 ? (
                  <MenuItem disabled>No {accessType} found</MenuItem>
                ) : (
                  availableTargets.map(target => (
                    <MenuItem key={target._id} value={target._id}>
                      {target.name || target.title || target._id}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          )}



          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => generateCodes(false)}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Only"}
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => generateCodes(true)}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate + Download"}
            </Button>
          </Box>

        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateCodesModal;