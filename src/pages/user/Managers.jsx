import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../api/axiosClient";
import { useAuth } from "../../contexts/AuthContext";

import { permissionGroups } from "../user/permissions";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState({});
  const [permissionEditorOpen, setPermissionEditorOpen] = useState(false);
  const [nameEditorOpen, setNameEditorOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingPermissions, setEditingPermissions] = useState({});
  const { can, user: currentUser } = useAuth();

  // جلب الطاقم (مدراء وأدمن)
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users?role=staff");
      setManagers(res.data || []);
    } catch (err) {
      console.error(err);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // إنشاء مدير
  const createManager = async () => {
    try {
      await axios.post("/users/create-manager", {
        name,
        email,
        password,
        permissions
      });

      setOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setPermissions({});

      fetchManagers();
    } catch (err) {
      console.error(err);
    }
  };

  // تحديث صلاحيات المدير
  const updatePermissions = async (id, newPermissions) => {
    try {
      await axios.patch(`/users/${id}/permissions`, {
        permissions: newPermissions
      });

      fetchManagers();
    } catch (err) {
      console.error(err);
    }
  };

  const updateName = async (id, newName) => {
    try {
      await axios.patch(`/users/${id}`, { name: newName });
      fetchManagers();
    } catch (err) {
      console.error(err);
    }
  };

  const openPermissionEditor = (manager) => {
    setSelectedManager(manager);
    setEditingPermissions(manager.permissions || {});
    setPermissionEditorOpen(true);
  };

  const closePermissionEditor = () => {
    setSelectedManager(null);
    setEditingPermissions({});
    setPermissionEditorOpen(false);
  };

  const savePermissionChanges = async () => {
    if (!selectedManager) return;
    await updatePermissions(selectedManager._id, editingPermissions);
    closePermissionEditor();
  };

  const openNameEditor = (manager) => {
    setSelectedManager(manager);
    setEditingName(manager.name || "");
    setNameEditorOpen(true);
  };

  const closeNameEditor = () => {
    setSelectedManager(null);
    setEditingName("");
    setNameEditorOpen(false);
  };

  const saveNameChanges = async () => {
    if (!selectedManager) return;
    const trimmedName = String(editingName || "").trim();
    if (!trimmedName || trimmedName === selectedManager.name) {
      closeNameEditor();
      return;
    }
    await updateName(selectedManager._id, trimmedName);
    closeNameEditor();
  };

  // تغيير الدور الوظيفي
  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.patch(`/users/${id}/role`, {
        role: newRole
      });
      fetchManagers();
    } catch (err) {
      console.error(err);
      alert("Failed to change role");
    }
  };

  // حذف المدير أو المستخدم
  const handleDeleteManager = async (id, role) => {
    if (id === currentUser?.id) return alert("لا يمكنك حذف حسابك الخاص من هنا");

    const requiredPermission = role === 'manager' ? 'deleteManager' : 'deleteUser';
    if (!can(requiredPermission)) {
      return alert("ليس لديك صلاحية لحذف هذا المستخدم");
    }

    if (!window.confirm("هل أنت متأكد من حذف هذا الحساب نهائياً؟")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      alert("✅ تم حذف الحساب بنجاح");
      fetchManagers();
    } catch (err) {
      console.error("خطأ في حذف الحساب:", err);
      alert("❌ فشل في حذف الحساب");
    }
  };

  const getPermissionSummary = (permissions = {}) => {
    const granted = permissionGroups
      .flatMap(group => group.permissions)
      .filter(p => permissions?.[p.key])
      .map(p => p.label);

    if (!granted.length) {
      return (
        <Typography variant="body2" color="textSecondary">
          No permissions
        </Typography>
      );
    }

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {granted.slice(0, 3).map((label) => (
          <Chip key={label} label={label} size="small" />
        ))}
        {granted.length > 3 && (
          <Chip label={`+${granted.length - 3} more`} size="small" />
        )}
      </Box>
    );
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 180
    },
    { field: "email", headerName: "Email", width: 220 },
    {
      field: "role",
      headerName: "Role",
      width: 140,
      renderCell: (params) => (
        <Select
          value={params.row.role}
          size="small"
          fullWidth
          disabled={!can('changeUserRole') || params.row._id === currentUser?.id}
          onChange={(e) => handleRoleChange(params.row._id, e.target.value)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
        </Select>
      )
    },
    {
      field: "permissions",
      headerName: "Permissions",
      flex: 1,
      minWidth: 240,
      sortable: false,
      renderCell: (params) => getPermissionSummary(params.row.permissions)
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {params.row._id !== currentUser?.id && can('updateManagerPermissions') && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => openNameEditor(params.row)}
            >
              ✏️ تعديل
            </Button>
          )}
          {can('updateManagerPermissions') && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => openPermissionEditor(params.row)}
            >
              صلاحيات
            </Button>
          )}
          {params.row._id !== currentUser?.id && params.row.role === 'student' && can('deleteUser') && (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteManager(params.row._id, params.row.role)}
            >
              🗑️ حذف
            </Button>
          )}
          {params.row._id !== currentUser?.id && params.row.role === 'manager' && can('deleteManager') && (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteManager(params.row._id, params.row.role)}
            >
              🗑️ حذف
            </Button>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box>

      {can('createManager') && (
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          Create Staff (Manager)
        </Button>
      )}

      <DataGrid
        rows={managers || []}
        columns={columns}
        getRowId={(row) => row._id}
        autoHeight
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
      />

      <Dialog open={nameEditorOpen} onClose={closeNameEditor} maxWidth="sm" fullWidth>
        <DialogTitle>تعديل اسم المدير</DialogTitle>
        <DialogContent>
          {selectedManager && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                {selectedManager.email}
              </Typography>
              <TextField
                label="الاسم"
                fullWidth
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button onClick={closeNameEditor}>إلغاء</Button>
                <Button variant="contained" onClick={saveNameChanges}>
                  حفظ
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={permissionEditorOpen} onClose={closePermissionEditor} maxWidth="md">
        <DialogTitle>Update Permissions</DialogTitle>
        <DialogContent>
          {selectedManager && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                {selectedManager.name}
              </Typography>

              {permissionGroups.map(group => (
                <Box key={group.title} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {group.title}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <FormGroup>
                    {group.permissions.map(p => (
                      <FormControlLabel
                        key={p.key}
                        control={
                          <Checkbox
                            checked={!!editingPermissions[p.key]}
                            onChange={(e) =>
                              setEditingPermissions({
                                ...editingPermissions,
                                [p.key]: e.target.checked
                              })
                            }
                          />
                        }
                        label={p.label}
                      />
                    ))}
                  </FormGroup>
                </Box>
              ))}

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
                <Button onClick={closePermissionEditor}>Cancel</Button>
                <Button variant="contained" onClick={savePermissionChanges}>
                  Save
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        <DialogTitle>Create Staff Account</DialogTitle>

        <DialogContent>

          <TextField
            label="Name"
            fullWidth
            sx={{ mb: 2, mt: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* الصلاحيات */}
          {permissionGroups.map(group => (
            <Box key={group.title} sx={{ mt: 2 }}>

              <Typography variant="subtitle1" fontWeight="bold">
                {group.title}
              </Typography>

              <Divider sx={{ mb: 1 }} />

              <FormGroup row>
                {group.permissions.map(p => (
                  <FormControlLabel
                    key={p.key}
                    control={
                      <Checkbox
                        checked={permissions[p.key] || false}
                        onChange={(e) =>
                          setPermissions({
                            ...permissions,
                            [p.key]: e.target.checked
                          })
                        }
                      />
                    }
                    label={p.label}
                  />
                ))}
              </FormGroup>

            </Box>
          ))}

          <Button
            variant="contained"
            onClick={createManager}
            sx={{ mt: 3 }}
          >
            Create
          </Button>

        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Managers;