import React, { useState } from "react";
import { Box, Button, TextField, Alert, Typography } from "@mui/material";
import axios from "../../api/axiosClient";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";

export default function ChangePassword() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage(t("passwordChange.passwordMismatch"));
      return;
    }

    try {
      setLoading(true);
      const res = await axios.patch("/users/me/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setSuccessMessage(res.data.message || t("passwordChange.updatedSuccess"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || t("common.error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="card max-w-xl mx-auto">
      <Typography variant="h5" className="font-bold mb-4">
        {t("passwordChange.title")}
      </Typography>

      <Box
        sx={{
          mb: 3,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          backgroundColor: "action.hover"
        }}
      >
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          {t("adminInfo.title")}
        </Typography>
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Typography>
            <strong>{t("adminInfo.name")}:</strong> {user?.name || t("common.notAvailable")}
          </Typography>
          <Typography>
            <strong>{t("adminInfo.email")}:</strong> {user?.email || t("common.notAvailable")}
          </Typography>
          <Typography>
            <strong>{t("adminInfo.role")}:</strong>{" "}
            {t(`adminInfo.roles.${user?.role}`, { defaultValue: user?.role || t("common.notAvailable") })}
          </Typography>
          {user?.phone && (
            <Typography>
              <strong>{t("adminInfo.phone")}:</strong> {user.phone}
            </Typography>
          )}
        </Box>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label={t("passwordChange.currentPassword")}
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <TextField
          label={t("passwordChange.newPassword")}
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <TextField
          label={t("passwordChange.confirmPassword")}
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {t("button.save")}
        </Button>
      </form>
    </Box>
  );
}
