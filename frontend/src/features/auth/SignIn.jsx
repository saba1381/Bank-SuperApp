import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BiErrorCircle } from "react-icons/bi";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
  Link as MuiLink,
  IconButton,
  Snackbar,
  Alert,
  InputAdornment,
  useTheme
} from "@mui/material";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UseAppDispatch } from "../../store/configureStore";
import { signInUser } from "../account/accountSlice";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";


const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: "600px",
  width: "100%",
  padding: theme.spacing(4),
  margin: theme.spacing(5, 0),
  borderRadius: "16px",
  boxShadow: theme.shadows[3],
}));

const GradientText = styled("span")({
  background: "linear-gradient(to right, #6B46C1, #6B46C1, #4299E1, #3182CE)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

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

const validationSchema = Yup.object({
  userName: Yup.string().required("نام کاربری خود را وارد کنید"),
  password: Yup.string().required("رمز عبور را وارد کنید"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = UseAppDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      formik.resetForm();
    } else {
      formik.setFieldValue("userName", localStorage.getItem("userName") || "");
      formik.setFieldValue("mobile", localStorage.getItem("mobile") || "");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setLoading(true);
      localStorage.removeItem("access_token");

      if (values.rememberMe) {
        localStorage.setItem("userName", values.userName);
      } else {
        localStorage.removeItem("userName");
      }

      try {
        const result = await dispatch(
          signInUser({
            username: values.userName,
            password: values.password,
          })
        );

        if (result.meta.requestStatus === "fulfilled") {
          localStorage.setItem("access_token", result.payload.access);
          localStorage.setItem("refresh_token", result.payload.refresh);
          window.location.assign("/cp");
        } else {
          setFieldError("general", "نام کاربری یا رمز عبور اشتباه است.");
        }
      } catch (error) {
        setFieldError("general", "خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
      }

      setSubmitting(false);
      setLoading(false);
    },
  });

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
    setOverlayOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setOverlayOpen(false);
  };
  const handleKeyDown = (event, nextFieldRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextFieldRef.current.focus();
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: { xs: "80vh", md: "90vh" },
          paddingTop: { sm: 2 },
        }}
      >
        <Helmet>
          <title>ورود به موبایل بانک</title>
        </Helmet>

        <StyledPaper
          sx={{
            paddingY: { xs: 2, sm: 3, md: 6 },
            paddingX: { xs: 3, sm: 6, md: 6 },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" align="start" gutterBottom>
              <GradientText>ورود به موبایل بانک</GradientText>
            </Typography>
            <Button
              variant="outlined"
              startIcon={<HelpOutlineIcon style={{ fontSize: "13px" }} />}
              onClick={handleSnackbarOpen}
              sx={{
                ml: 2,
                fontSize: "13px",
                padding: (0, 0, 0, 2),
                display: "flex",
                height: "5px",
              }}
            >
              راهنما
            </Button>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            {formik.errors.general && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                gap={1}
                bgcolor="lightpink"
                p={1}
                borderRadius={4}
                mt={2}
                pr={2}
                mb={2}
              >
                <BiErrorCircle className="text-pink-500" />
                <Typography variant="body2" color="error">
                  {formik.errors.general}
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="نام کاربری"
              name="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              inputRef={userNameRef}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
              variant="outlined"
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
                      borderColor: "red",
                    },
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "grey",

                  "&.Mui-focused": {
                    color: "#1C3AA9",
                    fontSize: {
                      xs: "1.1rem",
                      sm: "1.3rem",
                      md: "1.4rem",
                      lg: "1.5rem",
                    },
                    transform: {
                      xs: "translate(-2px, -15px) scale(0.85)",
                      sm: "translate(5px, -14px) scale(0.75)",
                      md: "translate(3px, -14px) scale(0.70)",
                      lg: "translate(2px, -22px) scale(0.65)",
                    },
                  },
                  "&.Mui-error": {
                    color: "pink",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="رمز عبور"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputRef={passwordRef}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              variant="outlined"
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
                      borderColor: "red",
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
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: "1.3rem" }} />
                      ) : (
                        <Visibility sx={{ fontSize: "1.3rem" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: {
                  color: "grey",

                  "&.Mui-focused": {
                    color: "#1C3AA9",
                    fontSize: {
                      xs: "1.1rem",
                      sm: "1.3rem",
                      md: "1.4rem",
                      lg: "1.5rem",
                    },
                    transform: {
                      xs: "translate(2px, -15px) scale(0.85)",
                      sm: "translate(7px, -15px) scale(0.75)",
                      md: "translate(3px, -14px) scale(0.70)",
                      lg: "translate(2px, -22px) scale(0.65)",
                    },
                  },
                  "&.Mui-error": {
                    color: "pink",
                  },
                },
              }}
            />

            <Box display="flex" justifyContent="space-between" mt={2} gap={1}>
              <MuiLink
                component={Link}
                to="/register"
                underline="none"
                variant="body2"
                color="primary"
                sx={{
                  textAlign: "center",
                  width: "100%",
                  py: 1,
                  borderRadius: 4,
                  border: 1,
                  borderColor: "grey.300",
                  ":hover": { color: "grey.600" },
                }}
              >
                ثبت نام
              </MuiLink>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={formik.isSubmitting}
                sx={{
                  width: "80%",
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                  borderRadius: 4,
                }}
              >
                {loading ? (
                  <CircularProgress size={26} sx={{ color: "white" }} />
                ) : (
                  "ورود"
                )}
              </Button>
            </Box>


            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label="مرا به خاطر بسپار"
              />
            </Box>
          </form>
        </StyledPaper>

        {overlayOpen && <Overlay />}

        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          autoHideDuration={6000}
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
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="info"
            sx={{ width: "100%", borderRadius: "20px" }}
          >
            <Typography variant="h5">صفحه ورود:</Typography>
            <Typography>
              {" "}
              برای ورود به موبایل بانک نام کاربری و رمز عبور خود را وارد کنید.
              اگر حساب کاربری ندارید ، ابتدا ثبت نام کنید.
            </Typography>
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
