import React, { useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Card,
  Tooltip as MuiTooltip,
  Button,
  Box,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { UseAppDispatch, UseAppSelector } from "../../../store/configureStore";
import { toPersianNumbers } from "../../../util/util";
import { fetchUsers } from "../../account/accountSlice";

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = UseAppDispatch();
  const { users, isLoading } = UseAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  const mockUserData = [
    {
      id: 1,
      username: "user1",
      nationalCode: "1234567890",
      phoneNumber: "09123456789",
      fullName: "علی احمدی",
      gender: "مرد",
      email: "user1@example.com",
      profilePicture: null,
    },
    {
      id: 2,
      username: "user2",
      nationalCode: "0987654321",
      phoneNumber: "09234567890",
      fullName: "زهرا محمدی",
      gender: "زن",
      email: "user2@example.com",
      profilePicture: null,
    },
    // Add more mock users if needed
  ];

  const handleDelete = (id) => {
    console.log(`Delete user with id: ${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ py: 4 , paddingBottom:10, px: { xs: 1.2, sm: 4 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#6200ea",
            padding: "16px",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#fff", flexGrow: 1, textAlign: "center" }}
          >
            لیست کاربران
          </Typography>
          <IconButton onClick={() => navigate("/admin")}>
            <ArrowBack
              sx={{
                color: "#fff",
                fontSize: { xs: "1.5rem", sm: "1.2rem" },
                marginLeft: -3,
              }}
            />
          </IconButton>
        </Box>
        <Card
          sx={{
            marginTop: 2,
            padding: 2,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body2" align="center" sx={{ color: "navy.800" }}>
            این صفحه شامل اطلاعات مربوط به کاربران ثبت نام شده در موبایل بانک
            است.
          </Typography>
        </Card>
        {isLoading ? (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            در حال بارگذاری...
          </Typography>
        ) : users.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            شما هیچ کارت بانکی را هنوز ثبت نکرده‌اید.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "15px",
              mt: 2,
              boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
            }}
          >
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#1976d2",
                        px: 1,
                        textAlign: "center",
                      }}
                    >
                      نام کاربری
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#388e3c" }}>
                      کد ملی
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                      شماره موبایل
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#388e3c",
                        textAlign: "center",
                      }}
                    >
                      نام و نام خانوادگی
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                      جنسیت
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#388e3c" }}>
                      ایمیل
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#1976d2",
                        textAlign: "center",
                      }}
                    >
                      عکس پروفایل
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#388e3c" }}>
                      آخرین ورود
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#d32f2f" }}
                    >
                      عملیات
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => {
                    const profileImageURL =
                      user?.profile_image &&
                      user.profile_image.startsWith("/media/")
                        ? `http://127.0.0.1:8000${user.profile_image}`
                        : user?.profile_image
                        ? `http://127.0.0.1:8000/media/${user.profile_image}`
                        : "/default-profile.png";

                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <TableCell sx={{ px: 1, textAlign: "center" }}>
                          {user.username}
                        </TableCell>
                        <TableCell sx={{px: 1}}>
                          {user.national_code
                            ? toPersianNumbers(user.national_code)
                            : "نامشخص"}
                        </TableCell >
                        <TableCell sx={{ textAlign: "center" }}>
                          {user.phone_number
                            ? toPersianNumbers(user.phone_number)
                            : "ثبت نشده"}
                        </TableCell>
                        <TableCell sx={{px: 1}}>
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell sx={{px: 2}}>
                          {user.gender === "male"
                            ? "مرد"
                            : user.gender === "female"
                            ? "زن"
                            : "ثبت نشده"}
                        </TableCell>
                        <TableCell sx={{px: 1}}>{user.email || "ثبت نشده"}</TableCell>
                        <TableCell sx={{px: 2}}>
                          <Avatar src={profileImageURL} alt={user.username} />
                        </TableCell>
                        <TableCell>{user.last_login_shamsi ?( toPersianNumbers(user.last_login_shamsi) || "پس از ثبت نام وارد نشده" ) : 'نامشخص'}</TableCell>
                        <TableCell sx={{ px: 3 }}>
                          <MuiTooltip title="حذف">
                            <IconButton
                              onClick={() => handleDelete(user.id)}
                              color="error"
                              sx={{
                                "&:hover": { color: "#d32f2f" },
                                fontSize: { xs: 25, sm: 20 },
                              }}
                            >
                              <MdDelete />
                            </IconButton>
                          </MuiTooltip>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        )}
      </Box>
    </motion.div>
  );
};

export default UserList;
