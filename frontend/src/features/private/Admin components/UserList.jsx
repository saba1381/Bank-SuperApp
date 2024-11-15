import React, { useEffect, useState } from "react";
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
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { UseAppDispatch, UseAppSelector } from "../../../store/configureStore";
import { toPersianNumbers } from "../../../util/util";
import { fetchUsers } from "../../account/accountSlice";
import { Formik, Form, Field } from "formik";
import { useTheme } from "@mui/material/styles";

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = UseAppDispatch();
  const theme = useTheme();
  const { users, isLoading } = UseAppSelector((state) => state.account);

  const [genderFilter, setGenderFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [limitFilter, setLimitFilter] = useState("");

  useEffect(() => {
    const params = {};
    if (genderFilter !== "all") params.gender = genderFilter;
    if (dateFilter !== "") params.last_login = dateFilter;
    if (limitFilter) params.limit = limitFilter;

    dispatch(fetchUsers(params));
  }, [dispatch, genderFilter, dateFilter, limitFilter]);

  const handleGenderChange = (event, newGender) => {
    if (newGender !== null) setGenderFilter(newGender);
  };

  const handleDateChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleLimitChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && Number(value) >= 0) {
      setLimitFilter(value);
    }
  };

  const filteredUsers = users.filter((user) => {
    const genderMatch = genderFilter === "all" || user.gender === genderFilter;
    const dateMatch = (() => {
      if (dateFilter === "today") {
        const today = new Date().toISOString().split("T")[0];
        return user.last_login?.startsWith(today);
      } else if (dateFilter === "last_7_days") {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        return new Date(user.last_login) >= last7Days;
      } else if (dateFilter === "this_month") {
        const now = new Date();
        return (
          new Date(user.last_login).getMonth() === now.getMonth() &&
          new Date(user.last_login).getFullYear() === now.getFullYear()
        );
      } else {
        return true;
      }
    })();

    return genderMatch && dateMatch;
  });

  console.log(filteredUsers);

  const handleDelete = (id) => {
    console.log(`Delete user with id: ${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ py: 4, paddingBottom: 10, px: { xs: 1.2, sm: 4 } }}>
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

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap", // المان‌ها در یک خط باقی می‌مانند
            justifyContent: "space-between", // فاصله مناسب بین المان‌ها
            alignItems: "center", // تراز وسط عمودی
            gap: 2, // فاصله یکنواخت بین المان‌ها
            marginTop: 2,
            padding: 2,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f5f5f5",
            overflowX: "auto", // در صورت محدودیت عرض، اسکرول افقی فعال شود
          }}
        >
          {/* فیلتر جنسیت */}
          <ToggleButtonGroup
            value={genderFilter}
            exclusive
            onChange={handleGenderChange}
            sx={{
              flexShrink: 0, // اندازه ثابت
              direction: "ltr",
            }}
          >
            <ToggleButton value="all" sx={{ paddingX: 2 }}>
              همه
            </ToggleButton>
            <ToggleButton value="male" sx={{ paddingX: 2 }}>
              مرد
            </ToggleButton>
            <ToggleButton value="female" sx={{ paddingX: 2 }}>
              زن
            </ToggleButton>
          </ToggleButtonGroup>

          {/* فیلتر تاریخ */}
          <FormControl
            sx={{
              minWidth: { xs: "30%", sm: 200 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
              flexShrink: 0,
            }}
          >
            <Select value={dateFilter} onChange={handleDateChange} displayEmpty>
              <MenuItem value="">همه</MenuItem>
              <MenuItem value="today">امروز</MenuItem>
              <MenuItem value="last_7_days">هفت روز گذشته</MenuItem>
              <MenuItem value="this_month">یک ماه گذشته</MenuItem>
              <MenuItem value="this2_month">دو ماه گذشته</MenuItem>
            </Select>
          </FormControl>

          {/* فیلتر تعداد */}
          <Formik
            initialValues={{ count: "" }}
            onSubmit={(values) => {
              dispatch(
                fetchUsers({
                  gender: genderFilter,
                  date: dateFilter,
                  count: values.count,
                })
              );
            }}
          >
            {({ errors, touched, handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                style={{
                  borderRadius: "10px",
                  marginRight: "4px",
                  width: "30%",
                  height: "40px",
                  "& .MuiOutlinedInput-root": {
                    height: "100%",
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                  "& input[type=number]::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "& input[type=number]::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  borderRadius: "4px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                  },
                  height: { xs: "52px", sm: "52px" },
                }}
              >
                <Field
                  as={TextField}
                  name="count"
                  type="text"
                  label="تعداد"
                  variant="outlined"
                  value={limitFilter}
                  onChange={handleLimitChange}
                  //size="small"
                  error={touched.count && Boolean(errors.count)}
                  helperText={touched.count && errors.count}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "gray",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "navy",
                    },

                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Form>
            )}
          </Formik>
        </Box>

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
                      نام و نام خانوادگی
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#388e3c",
                        textAlign: "center",
                      }}
                    >
                      شماره موبایل
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
                    <TableCell sx={{ fontWeight: "bold", color: "#d32f2f" }}>
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
                        <TableCell sx={{ px: 1 }}>
                          {user.national_code
                            ? toPersianNumbers(user.national_code)
                            : "نامشخص"}
                        </TableCell>
                        <TableCell sx={{ px: 1, textAlign: "center" }}>
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {user.phone_number
                            ? toPersianNumbers(user.phone_number)
                            : "ثبت نشده"}
                        </TableCell>

                        <TableCell sx={{ px: 2 }}>
                          {user.gender === "male"
                            ? "مرد"
                            : user.gender === "female"
                            ? "زن"
                            : "ثبت نشده"}
                        </TableCell>
                        <TableCell sx={{ px: 1 }}>
                          {user.email || "ثبت نشده"}
                        </TableCell>
                        <TableCell sx={{ px: 2 }}>
                          <Avatar src={profileImageURL} alt={user.username} />
                        </TableCell>
                        <TableCell>
                          {user.last_login_shamsi
                            ? toPersianNumbers(user.last_login_shamsi) ||
                              "پس از ثبت نام وارد نشده"
                            : "نامشخص"}
                        </TableCell>
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
