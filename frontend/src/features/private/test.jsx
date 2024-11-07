import React, { useState } from "react";
import { Container, Typography, Grid, Paper, Modal, Box, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip as MuiTooltip } from "@mui/material";
import { BsGraphUp, BsPeople } from "react-icons/bs";
import { MdAttachMoney, MdClose, MdDelete } from "react-icons/md";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";

// داده نمونه برای نمودار و کاربران
const chartData = [
  { name: "کاربران فعال", value: 400 },
  { name: "کاربران جدید", value: 300 },
  { name: "تراکنش‌های موفق", value: 300 },
  { name: "تراکنش‌های ناموفق", value: 200 },
];
const colors = ["#4caf50", "#ff9800", "#2196f3", "#f44336"];

const initialUserData = [
  { id: 1, username: "user1", nationalCode: "1234567890", phoneNumber: "09121234567", fullName: "علی محمدی", gender: "مرد", email: "user1@example.com", profilePicture: null },
  { id: 2, username: "user2", nationalCode: "0987654321", phoneNumber: "09121112233", fullName: "فاطمه حسینی", gender: "زن", email: "user2@example.com", profilePicture: "https://example.com/user2.jpg" },
  // کاربران بیشتر...
];

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(initialUserData);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // تابع حذف کاربر
  const handleDelete = (id) => {
    setUserData((prevData) => prevData.filter((user) => user.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        داشبورد ادمین
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* کارت‌های اطلاعاتی */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center" }}>
            <BsPeople size={50} color="#2196f3" />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>تعداد کاربران</Typography>
            <Typography variant="h5" color="text.secondary">850</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center" }}>
            <MdAttachMoney size={50} color="#4caf50" />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>تعداد تراکنش‌ها</Typography>
            <Typography variant="h5" color="text.secondary">1200</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center" }}>
            <BsGraphUp size={50} color="#ff9800" />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>درآمد امروز</Typography>
            <Typography variant="h5" color="text.secondary">500,000 تومان</Typography>
          </Paper>
        </Grid>
        
        {/* کارت لیست کاربران */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center", cursor: "pointer" }} onClick={handleOpen}>
            <BsPeople size={50} color="#2196f3" />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>لیست کاربران</Typography>
          </Paper>
        </Grid>

        {/* نمودار */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" align="center" gutterBottom>آنالیز کاربران و تراکنش‌ها</Typography>
            <Box sx={{ height: 300, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* مودال لیست کاربران */}
        <Modal open={open} onClose={handleClose} aria-labelledby="user-list-modal" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ bgcolor: "background.paper", p: 4, borderRadius: 2, width: "80%", maxHeight: "90vh", overflowY: "auto" }}>
            <IconButton onClick={handleClose} sx={{ position: "absolute", top: 16, right: 16 }}>
              <MdClose />
            </IconButton>
            <Typography variant="h5" align="center" gutterBottom>لیست کاربران</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>نام کاربری</TableCell>
                    <TableCell>کد ملی</TableCell>
                    <TableCell>شماره موبایل</TableCell>
                    <TableCell>نام و نام خانوادگی</TableCell>
                    <TableCell>جنسیت</TableCell>
                    <TableCell>ایمیل</TableCell>
                    <TableCell>عکس پروفایل</TableCell>
                    <TableCell>عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.nationalCode}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.gender}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.profilePicture ? (
                          <Avatar src={user.profilePicture} alt={user.username} />
                        ) : (
                          <Avatar>{user.fullName[0]}</Avatar>
                        )}
                      </TableCell>
                      <TableCell>
                        <MuiTooltip title="حذف">
                          <IconButton onClick={() => handleDelete(user.id)} color="error">
                            <MdDelete />
                          </IconButton>
                        </MuiTooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
