import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Modal,
  Box,
  Tooltip as MuiTooltip,
} from "@mui/material";
import { BsGraphUp, BsPeople } from "react-icons/bs";
import { MdAttachMoney, MdClose, MdDelete } from "react-icons/md";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { UseAppDispatch, UseAppSelector } from "../../../store/configureStore";
import {
  CountOfUsers,
  CountOfTransactions,
  CountOfTransactionsStatus,
} from "../../account/accountSlice";
import { toPersianNumbers } from "../../../util/util";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { RiUserSearchFill } from "react-icons/ri";
import { BiTransfer } from "react-icons/bi";
import { FaSimCard } from "react-icons/fa";
dayjs.extend(jalaliday);

const colors = ["#4caf50", "#ff9800", "#2196f3", "#f44336"];

const initialUserData = [
  {
    id: 1,
    username: "user1",
    nationalCode: "1234567890",
    phoneNumber: "09121234567",
    fullName: "علی محمدی",
    gender: "مرد",
    email: "user1@example.com",
    profilePicture: null,
  },
  {
    id: 2,
    username: "user2",
    nationalCode: "0987654321",
    phoneNumber: "09121112233",
    fullName: "فاطمه حسینی",
    gender: "زن",
    email: "user2@example.com",
    profilePicture: "https://example.com/user2.jpg",
  },
];

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const loading = UseAppSelector((state) => state.account.isLoading);
  const dispatch = UseAppDispatch();
  const userCount = UseAppSelector((state) => state.account.userCount);
  const navigate = useNavigate();
  const [date, setDate] = useState(
    dayjs().calendar("jalali").locale("fa").format("dddd D MMMM")
  );
  const [time, setTime] = useState(dayjs().format("HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(dayjs().calendar("jalali").locale("fa").format("dddd D MMMM"));
      setTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const transactionCount = UseAppSelector(
    (state) => state.account.transactionCount
  );
  const transactionStatus = UseAppSelector(
    (state) => state.account.transactionStatus
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = (id) => {
    setUserData((prevData) => prevData.filter((user) => user.id !== id));
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  useEffect(() => {
    dispatch(CountOfUsers());
    dispatch(CountOfTransactions());
    dispatch(CountOfTransactionsStatus());
  }, [dispatch]);
  const chartData = [
    {
      name: "کارت به کارت موفق",
      value: transactionStatus?.card_to_card.successful || 0,
    },
    {
      name: "کارت به کارت ناموفق",
      value: transactionStatus?.card_to_card.unsuccessful || 0,
    },
    {
      name: "خرید شارژ موفق",
      value: transactionStatus?.recharge.successful || 0,
    },
    {
      name: "خرید شارژ ناموفق",
      value: transactionStatus?.recharge.unsuccessful || 0,
    },
  ];

  return (
    <motion.div initial="initial" animate="animate" variants={pageTransition}>
      <Container maxWidth="lg" sx={{ pt: 5, pb: 13, paddingX: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={4}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                elevation={5}
                sx={{
                  paddingX: 2,
                  paddingY: 4,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  borderRadius: "15px",
                  flexDirection: "column",
                  height: 175,
                }}
              >
                <CalendarMonthIcon style={{ color: "#981eec", fontSize: 50 }} />

                <Typography
                  variant="h5"
                  sx={{ marginTop: 1, marginBottom: 0.1 }}
                >
                  {toPersianNumbers(date)}
                </Typography>
                <Typography variant="h5">{toPersianNumbers(time)}</Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={6} sm={6} md={4}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                elevation={5}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: "15px",
                  height: 175,
                }}
                onClick={() => navigate("/admin/user-list")}
              >
                <RiUserSearchFill
                  size={50}
                  color="#ec7f33"
                  style={{ marginTop: 8 }}
                />
                <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
                  لیست کاربران
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={6} sm={6} md={4}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                elevation={5}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: "15px",
                  height: 175,
                }}
                onClick={() => navigate("/admin/transfers")}
              >
                <BiTransfer
                  size={53}
                  color="#ec33ac"
                  style={{ marginTop: 8 }}
                />
                <Typography
                  variant="h6"
                  sx={{ mt: 2, fontWeight: "bold", fontSize: 18 }}
                >
                  تراکنش های انتقال وجه
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={6} sm={6} md={4}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                elevation={5}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: "15px",
                  height: 175,
                }}
                onClick={() => navigate("/admin/recharges")}
              >
                <FaSimCard size={50} color="#7ab3f4" style={{ marginTop: 8 }} />
                <Typography
                  variant="h6"
                  sx={{ mt: 2, fontWeight: "bold", fontSize: 18 }}
                >
                  تراکنش های خرید شارژ
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {[
            {
              icon: <BsPeople size={50} color="#2196f3" />,
              label: "تعداد کاربران",
              value: userCount ? toPersianNumbers(userCount) : "نامشخص",
            },
            {
              icon: <FaMoneyBillTrendUp size={46} color="#4caf50" />,
              label: "تعداد تراکنش‌ها",
              value: transactionCount
                ? toPersianNumbers(transactionCount)
                : "نامشخص",
            },
          ].map((card, index) => (
            <Grid item xs={6} sm={6} md={4} key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paper
                  elevation={5}
                  sx={{
                    paddingY: 3,
                    paddingX: 2,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    textAlign: "center",
                    borderRadius: "15px",
                    transition: "0.3s",
                  }}
                >
                  {card.icon}
                  <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    {card.value}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}

          {/* نمودار */}
          <Grid item xs={12}>
            <Paper elevation={5} sx={{ p: 3, borderRadius: "15px" }}>
              <Typography variant="h6" align="center" gutterBottom>
                آنالیز تراکنش‌ها
              </Typography>
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
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      formatter={(value) => (
                        <span style={{ marginRight: "6px" }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default AdminDashboard;
