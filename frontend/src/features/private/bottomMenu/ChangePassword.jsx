import React, { useState , useRef} from "react";
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
import { changePassword } from "../../account/accountSlice";
import { unwrapResult, unwrap } from "@reduxjs/toolkit";
import { motion } from "framer-motion";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate ,useLocation  } from 'react-router-dom';


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
  const passwordRef = useRef(null);
  const newpasswordRef = useRef(null)
  const confirmPasswordRef = useRef(null);
  const theme = useTheme();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin/setting/edit-password';
  const isCpPage = location.pathname === '/cp/setting/edit-password';

  const dispatch = UseAppDispatch();

  const handleKeyDown = (event, nextFieldRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextFieldRef.current.focus();
    }
  };

  const handleBackClick = () => {
    if (isAdminPage) {
      navigate('/admin/setting'); // هدایت به صفحه تنظیمات ادمین
    } else if (isCpPage) {
      navigate('/cp/setting'); // هدایت به صفحه تنظیمات کاربر
    } else {
      navigate('/'); // در صورتی که صفحه در مسیرهای دیگر باشد
    }
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
          changePassword({
            current_password: values.currentPassword,
            new_password: values.newPassword,
          })
        ).unwrap();


        
        setSnackbarMessage(response.detail);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        formik.resetForm();
        setTimeout(() => {
          navigate("/cp/setting");
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
        // backgroundColor: theme.palette.background.paper,
        zIndex: 1,
        boxShadow: "0 -2px 2px rgba(0,0,0,0.1)",
        overflowY: "auto",
        width: "100%",
        paddingX: {xs:2, sm: 20, md: 45 },
        paddingTop: 1,
        paddingBottom: 4,
        height:'100%'

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
          paddingTop:{md:4},
          color: "#fff",
        }}
      ></Box>

      <Container sx={{ paddingBottom: 4, paddingY:4,marginTop:10, backgroundColor: theme.palette.background.paper,
          borderRadius: "20px",
          boxShadow: 3,}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, width: '100%' ,  }}>
  <Button
    onClick={handleSnackbarOpen}
    variant="outlined"
    sx={{ paddingX: 3, paddingY: 1, fontSize: 14, height: '40px' , color: theme.palette.mode === "dark" ? "#abd4f6" : "primary",
      borderColor: theme.palette.mode === "dark" ? "#abd4f6" : "primary", }}
  >
    راهنما
  </Button>
  
  <Button
    variant="contained"
    color="primary"
    onClick={handleBackClick}
    endIcon={<KeyboardBackspaceIcon />}
    sx={{ paddingX: 3, paddingY: 2, fontSize: 14, height: '40px'}}
  >
    بازگشت
  </Button>
</Box>

        {overlayOpen && <Overlay />}

        <Snackbar
          open={overlayOpen}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "center", horizontal: "center" }}
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
            
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1500, 
          }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="info"
            sx={{ width: "100%", borderRadius: "20px" , zIndex:1300 }}
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
                      {showPassword ? <VisibilityOff style={{fontSize:'20px'}} /> : <Visibility style={{fontSize:'20px'}} />}
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
                      {showNewPassword ? <VisibilityOff style={{fontSize:'20px'}} /> : <Visibility style={{fontSize:'20px'}} />}
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
                      {showConfirmPassword ? <VisibilityOff style={{fontSize:'20px'}}/> : <Visibility style={{fontSize:'20px'}} />}
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
            ثبت
          </Button>
        </form>
        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            mt:{sm:'90px'},
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

export default ChangePassword;
