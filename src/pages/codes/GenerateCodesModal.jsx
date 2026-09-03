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
      };

      const res = await axios.post("/codes/generate", payload);
      const newCodes = res.data.codes;

      if (download) {
        const plan = plans.find(p => p._id === planId);
        exportNewCodes(newCodes, plan);
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

  const exportNewCodes = (codes, plan) => {
    const headers = ["Code", "Access Type", "Duration", "Created At", "Expires At"];

    const formatCsvValue = (value) => {
      const stringValue = value == null ? "" : String(value);
      return /[",\n]/.test(stringValue)
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
    };
    const formatDate = (value) => {
      if (!value) return "";
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
    };

    const rows = codes.map((code) => {
      const codeData = typeof code === "string" ? { code } : code || {};

      return [
        codeData.code,
        codeData.accessType || plan?.accessType,
        durationM(plan?.durationMonths || plan?.durationDays),
        formatDate(codeData.createdAt),
        formatDate(codeData.expiresAt)
      ].map(formatCsvValue);
    });

    const csvContent = "\uFEFF" + [headers, ...rows]
      .map((row) => row.join(";"))
      .join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const accessType = plan?.accessType || codes[0]?.accessType || "plan";
    const duration = plan?.durationMonths || plan?.durationDays || "duration";
    const safeDuration = durationM(duration);

    const fileName = `${accessType}_${safeDuration}.csv`;

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const durationM = (duration) => {
    const durationMonths = ({ 30: 1, 90: 3, 180: 6, 365: 12 }[duration] || duration);
    if (durationMonths === 1) return "1 Month";
    if (durationMonths === 3) return "3 Months";
    if (durationMonths === 6) return "6 Months";
    if (durationMonths === 12) return "1 Year";
    return `${durationMonths} Months`;



  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Codes</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Quantity"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantity}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setQuantity(numericValue ? Number(numericValue) : "");
            }}
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
                {plan.accessType} ({durationM(plan.durationMonths || plan.durationDays)})
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