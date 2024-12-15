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
  Box,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { UseAppDispatch, UseAppSelector } from "../../../store/configureStore";
import { toPersianNumbers } from "../../../util/util";
import { fetchUsers, DeleteUser } from "../../account/accountSlice";
import { Formik, Form, Field } from "formik";
import { useTheme } from "@mui/material/styles";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { TbPasswordUser } from "react-icons/tb";

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = UseAppDispatch();
  const theme = useTheme();
  const { users, isLoading } = UseAppSelector((state) => state.account);

  const [genderFilter, setGenderFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [limitFilter, setLimitFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const dateFilterLabels = {
    today: "امروز",
    last_7_days: "هفت روز گذشته",
    this_month: "یک ماه گذشته",
    this2_month: "دو ماه گذشته",
    "": "آخرین ورود ها",
  };

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

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleEditClick = (id , first_name , last_name, nationalCode) => {
    setSelectedUserId(id);
    navigate(`/admin/change-user-password/` , {state : {id , first_name , last_name, nationalCode }});
  };
  

  const handleConfirmDelete = () => {
    dispatch(DeleteUser(selectedUserId))
      .unwrap()
      .then(() => {
        setOpenDialog(false);
        setSelectedUserId(null);
        dispatch(fetchUsers());
      })
      .catch((error) => {
        setOpenDialog(false);
        setSelectedUserId(null);
        console.error("Error deleting user:", error);
      });
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedUserId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ paddingTop:4 , paddingBottom: 5, px: { xs: 1.2, sm:6 , md:7} }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#3e0b9c" : "#6200ea",
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
            flexWrap: "nowrap", 
            justifyContent: "space-between", 
            alignItems: "center", 
            gap: 1, 
            marginTop: 1,
            padding: 2,
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#3e0b9c" : "#f5f5f5",
            overflowX: "auto", 
          }}
        >

          <ToggleButtonGroup
            value={genderFilter}
            exclusive
            onChange={handleGenderChange}
            sx={{
              flexShrink: 0, 
              direction: "ltr",
            }}
          >
            <ToggleButton value="all" sx={{color: (theme) =>
                      theme.palette.mode === "dark" ? "#dcdcdc" : "#4f4f4f",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "#ceb6e1" : "grey",
                    "&.Mui-selected": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#444c5e" : "#dceffa",
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#ffffff" : "#4f4f4f",
                      borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "grey" : "grey",
                    },
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#444c5e" : "#dceffa",
                    },
                     paddingX: 2 }}>
              همه
            </ToggleButton>
            <ToggleButton value="male"  sx={{color: (theme) =>
                      theme.palette.mode === "dark" ? "#dcdcdc" : "#4f4f4f",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "#9f9da0" : "grey",
                    "&.Mui-selected": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#444c5e" : "#dceffa",
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#ffffff" : "#4f4f4f",
                      borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "grey" : "grey",
                    },
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#444c5e" : "#dceffa",
                    },
                     paddingX: 2 }}>
              مرد
            </ToggleButton>
            <ToggleButton value="female"  sx={{color: (theme) =>
                      theme.palette.mode === "dark" ? "#dcdcdc" : "#4f4f4f",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "#9f9da0" : "grey",
                    "&.Mui-selected": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#444c5e" : "#dceffa",
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#ffffff" : "#4f4f4f",
                      borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "grey" : "grey",
                    },
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#444c5e" : "#dceffa",
                    },
                     paddingX: 2 }}>
              زن
            </ToggleButton>
          </ToggleButtonGroup>


          <FormControl
            sx={{
              minWidth: { xs: "30%", sm: 200 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "white" : "grey", 
              "& fieldset": {
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "white" : "grey", 
              },
              flexShrink: 0,
            }}
          >
            <Select
              value={dateFilter}
              onChange={handleDateChange}
              displayEmpty
              renderValue={(selected) => dateFilterLabels[selected] || "انتخاب بازه زمانی"}
              sx={{ color:theme.palette.mode === "dark" ? "white" : "grey",  "& .MuiSelect-icon": {
                color: theme.palette.mode === "dark" ? "white" : "grey", 
              }, }}
            >
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
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "#ffffff" : "#4f4f4f", // رنگ border در حالت عادی
                  },
                  "&:hover fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "#ffffff" : "#4f4f4f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "#ffffff" : "#3b82f6",
                  },
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
                    "& .MuiOutlinedInput-root": {
                      height: "100%",
                      "& fieldset": {
                        borderColor: (theme) =>
                          theme.palette.mode === "dark" ? "#ffffff" : "#4f4f4f", // رنگ border در حالت عادی
                      },
                      "&:hover fieldset": {
                        borderColor: (theme) =>
                          theme.palette.mode === "dark" ? "#ffffff" : "#4f4f4f",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: (theme) =>
                          theme.palette.mode === "dark" ? "#ffffff" : "#3b82f6",
                      },
                    },
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "white" : "grey", // حالت دارک
                    "& fieldset": {
                      borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "white" : "grey", // برای حالت فوکوس
                    },
                    "& .MuiInputLabel-root": {
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#ffffff" : "#4f4f4f",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#ffffff" : "#3b82f6",
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
          <Typography variant="h6" sx={{ textAlign: "center" , marginTop:5 }}>
           هیچ کاربری برای نمایش وجود ندارد.
          </Typography>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "15px",
                mt: 3.5,
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
                          color: "#6200ea",
                          px: 1,
                          textAlign: "center",
                        }}
                      >
                        نام کاربری
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#6200ea" }}>
                        کد ملی
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#6200ea" }}>
                        نام و نام خانوادگی
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: "#6200ea",
                          textAlign: "center",
                        }}
                      >
                        شماره موبایل
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#6200ea" }}>
                        جنسیت
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#6200ea" }}>
                        ایمیل
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: "#6200ea",
                          textAlign: "center",
                        }}
                      >
                        عکس پروفایل
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#6200ea" }}>
                        آخرین ورود
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#6200ea" }}>
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
                            {user.username || 'ثبت نشده '}
                          </TableCell>
                          <TableCell sx={{ px: 1 }}>
                            {user.national_code
                              ? toPersianNumbers(user.national_code)
                              : "نامشخص"}
                          </TableCell>
                          <TableCell sx={{ px: 1, textAlign: "center" }}>
                            {user.first_name || 'ثبت'} {user.last_name || 'نشده'}
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
                          <TableCell sx={{ px: 4 }}>
                            <Avatar src={profileImageURL} alt={user.username} />
                          </TableCell>
                          <TableCell>
                            {user.last_login_shamsi
                              ? toPersianNumbers(user.last_login_shamsi) ||
                                "پس از ثبت نام وارد نشده"
                              : "نامشخص"}
                          </TableCell>
                          <TableCell sx={{ px: 1, py:5, display:'flex' , justifyContent:'space-between' , gap:1}}>
                          <MuiTooltip title="ویرایش رمز عبور">
                              <IconButton
                                onClick={() => handleEditClick(user.id , user.first_name ,user.last_name , user.national_code)}
                                color="error"
                                sx={{
                                  color:'#8e56b5',
                                  "&:hover": { color: "#d32f2f" },
                                  fontSize: { xs: 25, sm: 24 },
                                }}
                              >
                                <TbPasswordUser  />
                              </IconButton>
                            </MuiTooltip>
                            <MuiTooltip title="حذف کاربر">
                              <IconButton
                                onClick={() => handleDeleteClick(user.id)}
                                color="error"
                                sx={{
                                  color:'#9b93a0',
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
            <Dialog
              open={openDialog}
              onClose={handleCancelDelete}
              PaperProps={{
                sx: {
                  borderRadius: "16px",
                  zIndex: 1000,
                },
              }}
            >
              <DialogTitle
                color="secondary"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {" "}
                <RiErrorWarningLine /> حذف کاربر
              </DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ color: "navy" }}>
                  آیا از حذف این کاربر مطمئن هستید؟
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "start" }}>
                <Button onClick={handleConfirmDelete} color="secondary">
                  حذف
                </Button>
                <Button onClick={handleCancelDelete} color="primary">
                  لغو
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </motion.div>
  );
};

export default UserList;
