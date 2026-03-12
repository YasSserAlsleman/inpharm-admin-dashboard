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
  Divider
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../api/axiosClient";

import { permissionGroups } from "../user/permissions";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState({});

  // جلب المدراء
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users?role=manager");
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

  // إنشاء أعمدة DataGrid من الصلاحيات
  const permissionColumns = permissionGroups.flatMap(group =>
    group.permissions.map(p => ({
      field: p.key,
      headerName: p.label,
      width: 150,
      renderCell: (params) => (
        <Checkbox
          checked={params?.row?.permissions?.[p.key] || false}
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
    ...permissionColumns,
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      valueGetter: (params) => {
        const date = params?.row?.createdAt;
        return date ? new Date(date).toLocaleDateString() : "-";
      }
    }
  ];

  return (
    <Box>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Create Manager
      </Button>

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
        <DialogTitle>Create Manager</DialogTitle>

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