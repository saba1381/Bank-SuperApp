import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Paper, Modal, Box, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip as MuiTooltip } from "@mui/material";
import { BsGraphUp, BsPeople } from "react-icons/bs";
import { MdAttachMoney, MdClose, MdDelete } from "react-icons/md";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion"; 
import { UseAppDispatch, UseAppSelector } from "../../../store/configureStore";
import {
  CountOfUsers,
  CountOfTransactions,
  CountOfTransactionsStatus
} from "../../account/accountSlice";
import { toPersianNumbers } from "../../../util/util";
import { FaMoneyBillTrendUp } from "react-icons/fa6";


const colors = ["#4caf50", "#ff9800", "#2196f3", "#f44336"];

const initialUserData = [
  { id: 1, username: "user1", nationalCode: "1234567890", phoneNumber: "09121234567", fullName: "علی محمدی", gender: "مرد", email: "user1@example.com", profilePicture: null },
  { id: 2, username: "user2", nationalCode: "0987654321", phoneNumber: "09121112233", fullName: "فاطمه حسینی", gender: "زن", email: "user2@example.com", profilePicture: "https://example.com/user2.jpg" },

];

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const loading = UseAppSelector((state) => state.account.isLoading);
  const dispatch = UseAppDispatch();
  const userCount = UseAppSelector((state) => state.account.userCount); 
  const transactionCount = UseAppSelector((state) => state.account.transactionCount); 
  const transactionStatus = UseAppSelector((state) => state.account.transactionStatus);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = (id) => {
    setUserData((prevData) => prevData.filter((user) => user.id !== id));
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  useEffect(()=>{
    dispatch(CountOfUsers());
    dispatch(CountOfTransactions());
    dispatch(CountOfTransactionsStatus());
  } , [dispatch]);
  const chartData = [
    { name: "کارت به کارت موفق", value: transactionStatus?.card_to_card.successful || 0 },
    { name: "کارت به کارت ناموفق", value: transactionStatus?.card_to_card.unsuccessful || 0 },
    { name: "خرید شارژ موفق", value: transactionStatus?.recharge.successful || 0 },
    { name: "خرید شارژ ناموفق", value: transactionStatus?.recharge.unsuccessful || 0 },
  ];

  return (
    <motion.div initial="initial" animate="animate" variants={pageTransition}>
    <Container maxWidth="lg" sx={{ pt: 5, pb: 13, paddingX:4 }}>
      <Grid container spacing={3}>
        
        {/* کارت‌های اطلاعاتی */}
        {[
          { icon: <BsPeople size={50} color="#2196f3" />, label: "تعداد کاربران", value: userCount ?  toPersianNumbers(userCount) : 'نامشخص' },
          { icon: <FaMoneyBillTrendUp size={46} color="#4caf50" />, label: "تعداد تراکنش‌ها", value: transactionCount ? toPersianNumbers(transactionCount) : 'نامشخص' },
          { icon: <BsGraphUp size={50} color="#ff9800" />, label: "درآمد امروز", value: "500,000 تومان" },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper elevation={5} sx={{ p: 3, display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center", borderRadius: "15px", transition: "0.3s" }}>
                {card.icon}
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>{card.label}</Typography>
                <Typography variant="h5" color="text.secondary">{card.value}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
        
        {/* کارت لیست کاربران */}
        <Grid item xs={12} sm={6} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Paper elevation={5} sx={{ p: 3, display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center", cursor: "pointer", borderRadius: "15px" }} onClick={handleOpen}>
              <BsPeople size={50} color="#2196f3" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>لیست کاربران</Typography>
            </Paper>
          </motion.div>
        </Grid>

        {/* نمودار */}
        <Grid item xs={12}>
          <Paper elevation={5} sx={{ p: 3, borderRadius: "15px" }}>
            <Typography variant="h6" align="center" gutterBottom>آنالیز تراکنش‌ها</Typography>
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
          <Box sx={{ bgcolor: "background.paper", p: 4, borderRadius: 3, width: "80%", maxHeight: "90vh", overflowY: "auto", boxShadow: 24 }}>
            <IconButton onClick={handleClose} sx={{ position: "absolute", top: 16, right: 16 }}>
              <MdClose />
            </IconButton>
            <Typography variant="h5" align="center" gutterBottom>لیست کاربران</Typography>
            <TableContainer component={Paper} sx={{ borderRadius: "15px" }}>
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
    </motion.div>
  );
};

export default AdminDashboard;
