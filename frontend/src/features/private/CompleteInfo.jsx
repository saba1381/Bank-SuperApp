import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { UseAppDispatch } from "../../store/configureStore";
import { completeUserProfile } from "../account/accountSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";


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

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("نام را وارد کنید")
    .matches(/^[\u0600-\u06FF\s]+$/, "نام باید به زبان فارسی باشد"),
  lastName: Yup.string()
    .required("نام خانوادگی را وارد کنید")
    .matches(/^[\u0600-\u06FF\s]+$/, "نام خانوادگی باید به زبان فارسی باشد"),
    username: Yup.string()
    .required("نام کاربری را وارد کنید")
    .min(5, "نام کاربری باید حداقل 5 کاراکتر باشد")
    .max(15, "نام کاربری باید حداکثر 15 کاراکتر باشد")
    .matches(/^[a-zA-Z0-9]+$/, "نام کاربری فقط می‌تواند شامل حروف و اعداد باشد"),
  password: Yup.string()
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
    .required("رمز عبور را وارد کنید"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "رمز عبور و تکرار آن باید مطابقت داشته باشند"
    )
    .required("تکرار رمز عبور را وارد کنید"),
    email: Yup.string()
    .email('ایمیل معتبر وارد کنید'),
    gender: Yup.string()
});

export default function CompleteInfo() {
  const [showActivationCode, setShowActivationCode] = useState(false);
  const [mobile, setMobile] = useState("");
  const dispatch = UseAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const emailRef = useRef(null);
  const genderRef = useRef(null);


  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      username: "",
      gender: "",
      email: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, setStatus, setErrors }) => {
      try {
        const response = await dispatch(
          completeUserProfile({
            username: values.username,
            gender: values.gender,
            first_name: values.firstName,   
            last_name: values.lastName,
            password: values.password,
            email: values.email,
          })
        );
  
        if (response.meta.requestStatus === "fulfilled") {
          localStorage.removeItem('isNewUser');
          toast.success("پروفایل با موفقیت تکمیل شد!");
          setTimeout(() => {
            window.location.href = "/cp";  
          }, 5000);
        } else {
          if (response.payload && response.payload.error) {
            setErrors(response.payload.error);  
          } else {
            setStatus("خطایی رخ داده است.");
          }
        }
      } catch (error) {
        setStatus("خطایی در سرور رخ داده است.");
        toast.error("خطایی در سمت سرور رخ داده است");  
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleKeyDown = (event, nextFieldRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextFieldRef.current.focus();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingX: { sm: 3, md: 4 },
        paddingTop: { md: 7, xs: 1 },
        paddingBottom: 12,
        maxHeight: "auto",
        minHeight: "auto",
        overflowY: "auto",
      }}
    >
      <Helmet>
        <title>  تکمیل اطلاعات </title>
      </Helmet>

        <StyledPaper sx={{ p: { xs: 2, md: 7 } }}>
          <Typography variant="h3" align="center" gutterBottom>
            <GradientText>تکمیل پروفایل </GradientText>
          </Typography>

          {formik.status && (
            <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
              {formik.status}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="نام"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
              inputRef={firstNameRef}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
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
                  color: "lightgrey",
                  "&.Mui-focused": {
                    color: "lightgrey",
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
              label="نام خانوادگی"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={(e) => handleKeyDown(e, usernameRef)}
              inputRef={lastNameRef}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
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
                  color: "lightgrey",
                  "&.Mui-focused": {
                    color: "lightgrey",
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
  label="نام کاربری"
  name="username"
  value={formik.values.username}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  onKeyDown={(e) => handleKeyDown(e, passwordRef)} 
  inputRef={usernameRef} 
  error={formik.touched.username && Boolean(formik.errors.username)}
  helperText={formik.touched.username && formik.errors.username}
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
  }}
  InputLabelProps={{
    sx: {
      color: "lightgrey",
      "&.Mui-focused": {
        color: "lightgrey",
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
              onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
              inputRef={passwordRef}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
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
                    color: "lightgrey",
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
              label="تکرار رمز عبور"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
              inputRef={confirmPasswordRef}
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
                    color: "lightgrey",
                  },
                  "&.Mui-error": {
                    color: "pink",
                  },
                },
              }}
            />

            <TextField
                  fullWidth
                  id="email"
                  name="email"
                  margin="normal"
                  label="ایمیل(اختیاری)"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, genderRef)}
                  inputRef={emailRef}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
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
                        mt:2
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "lightgrey",
                      "&.Mui-focused": {
                        color: "lightgrey",
                      },
                      "&.Mui-error": {
                        color: "pink",
                      },
                    },
                  }}
                />

<Select
  id="gender"
  name="gender"
  inputRef={genderRef}
  value={formik.values.gender || ""}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  fullWidth
  displayEmpty
  margin="normal"
  error={formik.touched.gender && Boolean(formik.errors.gender)}
  sx={{marginTop:2}}
  inputProps={{
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
>
  <MenuItem value="">
    <em style={{color:"lightgray"}}> جنسیت (اختیاری)</em>
  </MenuItem>
  <MenuItem value="male">مرد</MenuItem>
  <MenuItem value="female">زن</MenuItem>
</Select>


            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 3,
                mt: 4,
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                mt={2}
                sx={{ width: "50%" }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    <ArrowRightAltIcon style={{ fontSize: "1.5rem" }} />
                  }
                  fullWidth
                  disabled={formik.isSubmitting}
                  sx={{
                    width: "100%",
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  ادامه
                </Button>
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                mt={2}
                sx={{ width: "50%" }}
              >
                <MuiLink
                  component={Link}
                  to="/sign-in"
                  underline="none"
                  variant="body2"
                  color="primary"
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    py: 1,
                    borderRadius: 7,
                    border: 1,
                    borderColor: "grey.300",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    ":hover": { color: "grey.600" },
                  }}
                >
                  <Typography>بازگشت</Typography>
                  <FaLongArrowAltLeft />
                </MuiLink>
              </Box>
            </Box>
          </form>
        </StyledPaper>
      
    </Box>
  );
}
