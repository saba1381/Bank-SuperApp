import React, { useState , useEffect} from "react";
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

} from "@mui/material";
import { FaChevronLeft } from "react-icons/fa";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UseAppDispatch } from "../../../store/configureStore";
import { changePassword } from "../../account/accountSlice";
import { unwrapResult, unwrap } from "@reduxjs/toolkit";
import { motion } from "framer-motion";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ onBack }) => {
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

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const dispatch = UseAppDispatch();

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
          changePassword({
            current_password: values.currentPassword,
            new_password: values.newPassword,
          })
        ).unwrap();


        
        setSnackbarMessage(response.detail);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        formik.resetForm();
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
        backgroundColor: "#F5F5F9",
        zIndex: 1,
        boxShadow: "0 -2px 2px rgba(0,0,0,0.1)",
        overflowY: "auto",
        width: "100%",
        paddingX: { sm: 4, md: 35 },
        paddingY: 4,

      }}
    >
     
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          backgroundColor: "#6B20B1",
          padding: "15px",
          color: "#fff",
        }}
      ></Box>

      <Container sx={{ paddingBottom: 4, paddingY: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, width: '100%' }}>
  <Button
    onClick={handleSnackbarOpen}
    variant="outlined"
    sx={{ mb: 2, paddingX: 3, fontSize: 17 }}
  >
    راهنما
  </Button>
  
  <Button
    variant="contained"
    color="primary"
    onClick={() => navigate("/cp/setting")}
    endIcon={<KeyboardBackspaceIcon />}
  >
    بازگشت
  </Button>
</Box>

        {overlayOpen && <Overlay />}

        <Snackbar
          open={overlayOpen}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              ×
            </IconButton>
          }
          sx={{
            position: 'fixed',
            top: 90,
            left: 0,
            right: 0,
            zIndex: 1300, // عدد zIndex بزرگتر از هدر شما
          }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="info"
            sx={{ width: "100%", borderRadius: "20px" }}
          >
            <Typography variant="h6">تغییر رمز موبایل بانک:</Typography>
            <Typography>
              جهت تغییر رمز موبایل بانک ، رمز فعلی خود و رمز جدید مورد نظر را
              وارد کرده و کلید "تغییر" را لمس کنید . توجه داشته باشید پس از
              تغییر موفق رمز عبور، رمز قبلی غیر فعال شده و در دفعات بعدی ورود،
              می بایست رمز جدید را وارد نمایید.
            </Typography>
          </Alert>
        </Snackbar>

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
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            position: 'fixed',
            top: 74,
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

export default ChangePassword;
