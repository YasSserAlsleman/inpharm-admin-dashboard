import { useEffect, useState } from "react";
import {
  Box,
  Button,
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

  // حذف المدير
  const handleDeleteManager = async (id) => {
    if (id === currentUser?.id) return alert("لا يمكنك حذف حسابك الخاص من هنا");
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

  // إنشاء أعمدة DataGrid من الصلاحيات
  const permissionColumns = permissionGroups.flatMap(group =>
    group.permissions.map(p => ({
      field: p.key,
      headerName: p.label,
      width: 150,
      renderCell: (params) => (
        <Checkbox
          checked={params?.row?.permissions?.[p.key] || false}
          disabled={!can('updateManagerPermissions') || params.row._id === currentUser?.id}
          onChange={(e) =>
            updatePermissions(params.row._id, {
              ...(params.row.permissions || {}),
              [p.key]: e.target.checked
            })
          }
        />
      )
    }))
  );

  const columns = [
    { field: "name", headerName: "Name", width: 180 },
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
          <MenuItem value="student">Student</MenuItem>
        </Select>
      )
    },
    ...permissionColumns,
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        can('deleteUser') && params.row._id !== currentUser?.id && (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteManager(params.row._id)}
          >
            🗑️ حذف
          </Button>
        )
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