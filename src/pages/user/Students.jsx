import { useEffect, useState } from "react";
import { Box, TextField, Chip, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../api/axiosClient";

const Students = () => {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  // تحديد لون الاشتراك
  const getSubscriptionColor = (expireDate) => {

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

              const color = getSubscriptionColor(sub?.expireDate);

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

    </Box>

  );

};

export default Students;