import { useEffect, useState } from "react";
import { Box, TextField, Chip, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Card, CardContent, Typography, Divider, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../api/axiosClient";

const Students = () => {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // جلب الطلاب
  const fetchStudents = async () => {

    try {

      setLoading(true);

      const res = await axios.get("/users?role=student");

      setStudents(res.data || []);
    } catch (err) {

      console.error(err);

      setStudents([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // فتح تفاصيل الطالب
  const handleOpenModal = async (student) => {
    try {
      const res = await axios.get(`/users/student/${student._id}`);
      setSelectedStudent(res.data);
      setOpenModal(true);
    } catch (err) {
      console.error("خطأ في تحميل بيانات الطالب:", err);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
    setSelectedSubscription(null);
    setRevokeReason("");
  };

  // إلغاء تفعيل اشتراك
  const handleRevokeSubscription = async (subscriptionId) => {
    if (!selectedStudent) return;
    
    if (!window.confirm(`هل أنت متأكد من إلغاء هذا الاشتراك؟`)) return;

    try {
      setRevokeLoading(true);
      await axios.delete(`/users/${selectedStudent._id}/subscriptions/${subscriptionId}`, {
        data: { reason: revokeReason || "إلغاء بواسطة المسؤول" }
      });
      
      // تحديث بيانات الطالب
      const res = await axios.get(`/users/student/${selectedStudent._id}`);
      setSelectedStudent(res.data);
      setSelectedSubscription(null);
      setRevokeReason("");
      
      alert("✅ تم إلغاء الاشتراك بنجاح");
    } catch (err) {
      console.error("خطأ في إلغاء الاشتراك:", err);
      alert("❌ فشل في إلغاء الاشتراك");
    } finally {
      setRevokeLoading(false);
    }
  };

  // تحديد لون الاشتراك
  const getSubscriptionColor = (expireDate, status) => {
    
    if (status === "revoked") return "error";
    if (!expireDate) return "default";

    const now = new Date();

    const expire = new Date(expireDate);

    const diffDays =
      (expire - now) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "error";

    if (diffDays <= 7) return "warning";

    return "success";

  };

  const columns = [

    { field: "name", headerName: "Name", flex: 1 },

    { field: "email", headerName: "Email", flex: 1 },

    {
      field: "subscriptions",
      headerName: "Subscriptions",
      flex: 2,
      renderCell: (params) => {

        const subs = params?.row?.subscriptions || [];

        if (!subs.length) return "-";

        return (

          <Stack direction="row" spacing={1} flexWrap="wrap">

            {subs.map((sub, index) => {

              const plan = sub?.planId?.name || "Plan";

              const type = sub?.accessType || "";

              const expire = sub?.expireDate
                ? new Date(sub.expireDate).toLocaleDateString()
                : "";

              const color = getSubscriptionColor(sub?.expireDate, sub?.status);

              return (

                <Chip
                  key={index}
                  label={`${plan} (${type}) - ${expire}`}
                  size="small"
                  color={color}
                  variant="outlined"
                />

              );

            })}

          </Stack>

        );

      }
    },

    {
      field: "progress",
      headerName: "Progress",
      flex: 1,
      valueGetter: (params) =>
        params?.row?.progress?.length || 0
    },

    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      valueGetter: (params) => {

        const date = params?.row?.createdAt;

        return date
          ? new Date(date).toLocaleDateString()
          : "-";

      }
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenModal(params.row)}
        >
          👁️ عرض التفاصيل
        </Button>
      )
    }

  ];

  // البحث
  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <Box>

      <TextField
        label="Search Student"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <DataGrid
        rows={filtered || []}
        columns={columns}
        getRowId={(row) => row._id}
        autoHeight
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {/* Modal لعرض تفاصيل الطالب */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>👤 تفاصيل بروفايل الطالب</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedStudent && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* معلومات الطالب الأساسية */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>📋 معلومات أساسية</Typography>
                  <Stack spacing={1}>
                    <Box><strong>الاسم:</strong> {selectedStudent.name}</Box>
                    <Box><strong>البريد الإلكتروني:</strong> {selectedStudent.email}</Box>
                    <Box><strong>السنة الأكاديمية:</strong> {selectedStudent.academicYear || "غير محدد"}</Box>
                    <Box><strong>رقم الهاتف:</strong> {selectedStudent.phone || "غير محدد"}</Box>
                    <Box><strong>تاريخ التسجيل:</strong> {new Date(selectedStudent.createdAt).toLocaleDateString('ar-SA')}</Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* الاشتراكات */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>🎯 الاشتراكات</Typography>
                  {selectedStudent.subscriptions?.length > 0 ? (
                    <Stack spacing={2}>
                      {selectedStudent.subscriptions.map((sub, idx) => (
                        <Card key={idx} variant="outlined" sx={{ p: 2, bgcolor: sub.status === "revoked" ? "#ffe0e0" : "#f5f5f5" }}>
                          <Stack spacing={1}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Box>
                                <Typography variant="subtitle2"><strong>نوع الاشتراك:</strong> {sub.accessType}</Typography>
                                <Typography variant="body2"><strong>الخطة:</strong> {sub.planId?.name || "N/A"}</Typography>
                                <Typography variant="body2"><strong>تاريخ الانتهاء:</strong> {sub.expireDate ? new Date(sub.expireDate).toLocaleDateString('ar-SA') : "غير محدد"}</Typography>
                                <Typography variant="body2"><strong>الحالة:</strong> <Chip label={sub.status} size="small" color={sub.status === "active" ? "success" : sub.status === "revoked" ? "error" : "warning"} /></Typography>
                                <Typography variant="body2"><strong>تاريخ التفعيل:</strong> {new Date(sub.activatedAt).toLocaleDateString('ar-SA')}</Typography>
                              </Box>
                              {sub.status === "active" && (
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  onClick={() => setSelectedSubscription(sub._id)}
                                >
                                  🔴 إلغاء
                                </Button>
                              )}
                            </Box>
                          </Stack>
                        </Card>
                      ))}
                    </Stack>
                  ) : (
                    <Alert severity="info">لا توجد اشتراكات نشطة</Alert>
                  )}
                </CardContent>
              </Card>

              {/* نموذج إلغاء الاشتراك */}
              {selectedSubscription && (
                <Card sx={{ p: 2, bgcolor: "#fff3cd" }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>⚠️ إلغاء الاشتراك</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="سبب الإلغاء *"
                    placeholder="أدخل السبب الكامل لإلغاء الاشتراك"
                    value={revokeReason}
                    onChange={(e) => setRevokeReason(e.target.value)}
                    error={selectedSubscription && !revokeReason.trim()}
                    helperText={selectedSubscription && !revokeReason.trim() ? "سبب الإلغاء إجباري" : ""}
                    sx={{ mb: 2 }}
                  />
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRevokeSubscription(selectedSubscription)}
                      disabled={revokeLoading || !revokeReason.trim()}
                    >
                      {revokeLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : "تأكيد الإلغاء"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedSubscription(null);
                        setRevokeReason("");
                      }}
                    >
                      إلغاء
                    </Button>
                  </Stack>
                </Card>
              )}

              {/* السجل التاريخي */}
              {selectedStudent.subscriptionHistory?.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>📜 السجل التاريخي</Typography>
                    <Stack spacing={1}>
                      {selectedStudent.subscriptionHistory.slice().reverse().map((entry, idx) => (
                        <Box key={idx} sx={{ p: 1, bgcolor: "#f9f9f9", borderLeft: "3px solid #1976d2" }}>
                          <Typography variant="body2"><strong>{entry.action}:</strong> {new Date(entry.timestamp).toLocaleDateString('ar-SA')}</Typography>
                          {entry.reason && <Typography variant="caption">السبب: {entry.reason}</Typography>}
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>إغلاق</Button>
        </DialogActions>
      </Dialog>

    </Box>

  );

};

export default Students;