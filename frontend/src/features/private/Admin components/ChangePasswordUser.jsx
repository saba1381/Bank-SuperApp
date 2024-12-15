import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  Container,
  Snackbar,
  InputAdornment,
  useTheme
} from "@mui/material";
import { FaChevronLeft } from "react-icons/fa";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UseAppDispatch } from "../../../store/configureStore";
import { changeUserPassword } from "../../account/accountSlice";
import { unwrapResult, unwrap } from "@reduxjs/toolkit";
import { motion } from "framer-motion";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useLocation } from "react-router-dom";
import { toPersianNumbers } from "../../../util/util";


const ChangePasswordUser = () => {
    const { state } = useLocation();
    const { id , first_name , last_name, nationalCode} = state;
  const [showHelp, setShowHelp] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpenHelp, setSnackbarOpenHelp] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const newpasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const theme = useTheme();



  const GradientText = styled("span")({
    background: "linear-gradient(to right, #6B46C1, #6B46C1, #4299E1, #3182CE)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin/change-user-password";

  const dispatch = UseAppDispatch();

  const handleKeyDown = (event, nextFieldRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextFieldRef.current.focus();
    }
  };

  const handleBackClick = () => {

      navigate("/admin/user-list");

  };

 
  const Overlay = styled("div")(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }));

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setOverlayOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("پر کردن این فیلد ضروری است"),
      newPassword: Yup.string().required("پر کردن این فیلد ضروری است"),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword"), null],
          "رمز عبور جدید و تکرار آن باید یکسان باشند"
        )
        .required("پر کردن این فیلد ضروری است"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await dispatch(
          changeUserPassword({
            current_password: values.currentPassword,
            new_password: values.newPassword,
            id
          })
        ).unwrap();

        setSnackbarMessage(response.detail);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        formik.resetForm();
        setTimeout(() => {
          navigate("/admin/user-list");
        }, 3000);
      } catch (error) {
        if (error && error.error) {
          const serverErrors = error.error;

          setSnackbarMessage(serverErrors);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.log("Snackbar Open:", snackbarOpen);
          formik.resetForm();
        } else {
          setSnackbarOpen(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("خطایی رخ داده است.");
        }

        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
  });

  const handleSnackbarOpen = () => {
    setSnackbarOpenHelp(true);
    setOverlayOpen(true);
  };

  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 72,
        zIndex: 1,
        boxShadow: "0 -2px 2px rgba(0,0,0,0.1)",
        overflowY: "auto",
        width: "100%",
        paddingX: {xs:2, sm: 17, md: 30, lg: 46 },
        paddingY: 4,
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
          backgroundColor: "#f6f4f8",
          padding: "15px",
          color: "#fff",
        }}
      ></Box>

      <Container
        sx={{
          paddingBottom: 4,
          paddingY: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "20px",
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            width: "100%",
          }}
        >
            
          <Typography variant="h4" align="start" gutterBottom>
            <GradientText>تغییر رمز عبور کاربر</GradientText>
          </Typography>


          <Button
            variant="contained"
            color="primary"
            onClick={handleBackClick}
            endIcon={<KeyboardBackspaceIcon />}
            sx={{ paddingX: 3, paddingY: 2, fontSize: 14, height: "40px" }}
          >
            بازگشت
          </Button>
        </Box>
        <Box sx={{display:'flex' , justifyContent:'space-between' , gap:1 , mb:2}}>
        <Typography sx={{fontSize:'15px !important'}}>
                  نام و نام خانوادگی : {first_name} {last_name}
          </Typography>
          <Typography sx={{fontSize:'15px !important'}}>
                  کدملی : {toPersianNumbers(nationalCode)}
          </Typography>
          </Box>

        {overlayOpen && <Overlay />}

        <form onSubmit={formik.handleSubmit}>
          <motion.div {...animationProps}>
            <TextField
              fullWidth
              id="currentPassword"
              name="currentPassword"
              type={showPassword ? "text" : "password"}
              label="رمز فعلی"
              variant="outlined"
              sx={{ mb: 2, "& label": { color: "#808080" } }}
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onKeyDown={(e) => handleKeyDown(e, newpasswordRef)}
              inputRef={passwordRef}
              error={
                formik.touched.currentPassword &&
                Boolean(formik.errors.currentPassword)
              }
              helperText={
                formik.touched.currentPassword && formik.errors.currentPassword
              }
              InputProps={{
                style: { textAlign: "right" },
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "lightgrey",
                    },
                    "&:hover fieldset": {
                      borderColor: "pink",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "pink",
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "pink",
                    },
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{color: theme.palette.text.primary}}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: {
                  color: "lightgrey",
                  "&.Mui-focused": {
                    color: "#808080",
                  },
                  "&.Mui-error": {
                    color: "pink",
                  },
                },
              }}
            />
          </motion.div>

          <motion.div {...animationProps}>
            <TextField
              fullWidth
              id="newPassword"
              name="newPassword"
              label="رمز جدید"
              type={showNewPassword ? "text" : "password"}
              variant="outlined"
              sx={{ mb: 2, "& label": { color: "#808080" } }}
              onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
              inputRef={newpasswordRef}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
              InputProps={{
                style: { textAlign: "right" },
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "lightgrey",
                    },
                    "&:hover fieldset": {
                      borderColor: "pink",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "pink",
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "pink",
                    },
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowNewPassword}
                      edge="end"
                      sx={{color: theme.palette.text.primary}}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: {
                  color: "lightgrey",
                  "&.Mui-focused": {
                    color: "#808080",
                  },
                  "&.Mui-error": {
                    color: "pink",
                  },
                },
              }}
            />
          </motion.div>

          <motion.div {...animationProps}>
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="تکرار رمز جدید"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              sx={{ mb: 2, "& label": { color: "#808080" } }}
              value={formik.values.confirmPassword}
              inputRef={confirmPasswordRef}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              InputProps={{
                style: { textAlign: "right" },
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "lightgrey",
                    },
                    "&:hover fieldset": {
                      borderColor: "pink",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "pink",
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "pink",
                    },
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      sx={{color: theme.palette.text.primary}}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: {
                  color: "lightgrey",
                  "&.Mui-focused": {
                    color: "#808080",
                  },
                  "&.Mui-error": {
                    color: "pink",
                  },
                },
              }}
            />
          </motion.div>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ fontSize: "16px", mt: 1 }}
          >
            تغییر
          </Button>
        </form>
        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            mt: { sm: "90px" },
            top: 84,
            left: 0,
            right: 0,
            zIndex: 1300,
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              ×
            </IconButton>
          }
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%", borderRadius: "20px" }}
          >
            <Typography>{snackbarMessage}</Typography>
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ChangePasswordUser;
