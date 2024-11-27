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
  Container
} from "@mui/material";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import ActivationCode from "./ActivationCode";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { UseAppDispatch } from "../../store/configureStore";
import { registerUser } from "../account/accountSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
//import { toPersianNumbers } from '../../util/util';

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
  nationalId: Yup.string()
    .matches(/^[0-9]*$/, "کدملی باید شامل اعداد باشد")
    .length(10, "کدملی باید 10 رقم باشد")
    .required("کد ملی را وارد کنید"),
  mobile: Yup.string()
    .matches(/^[0-9]*$/, "شماره موبایل باید شامل اعداد باشد")
    .matches(/^(09)[0-9]{9}$/, "شماره موبایل معتبر نیست")
    .required("شماره موبایل را وارد کنید"),
});

export default function Register() {
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
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const nationalIdRef = useRef(null);
  const mobileRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      nationalId: "",
      mobile: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, setStatus, setErrors }) => {
      try {
        const response = await dispatch(
          registerUser({
            phone_number: values.mobile,
            national_code: values.nationalId,
          })
        );

        if (response.meta.requestStatus === "fulfilled") {
          setMobile(values.mobile);
          localStorage.setItem("phone_number", values.mobile);
          localStorage.setItem("national_code", values.nationalId);
          setShowActivationCode(true);
        } else {
          if (response.payload && response.payload.error) {
            setErrors(response.payload.error);
          } else {
            setStatus("خطایی رخ داده است.");
          }
        }
      } catch (error) {
        if (error.response) {
          setStatus(
            `خطای شبکه: ${error.response.status}, ${error.response.data}`
          );
        } else {
          setStatus("خطایی در سرور رخ داده است.");
        }
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
    <Container>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingX: {sm: 6, md: 4 },
        paddingY: {xs:18 ,  sm: 2, md: 3 },
        height:'80vh'
      }}
    >
      <Helmet>
        <title>ثبت نام در موبایل بانک</title>
      </Helmet>
      {!showActivationCode ? (
        <StyledPaper sx={{ p: { xs: 3, md: 7 } }}>
          <Typography variant="h3" align="center" gutterBottom>
            <GradientText>ثبت نام در موبایل بانک</GradientText>
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
              label="کد ملی"
              name="nationalId"
              value={formik.values.nationalId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={(e) => handleKeyDown(e, mobileRef)}
              inputRef={nationalIdRef}
              error={
                formik.touched.nationalId && Boolean(formik.errors.nationalId)
              }
              helperText={formik.touched.nationalId && formik.errors.nationalId}
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
              label="شماره موبایل"
              name="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputRef={mobileRef}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 3,
                mt: 1,
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
      ) : (
        <ActivationCode mobile={mobile} />
      )}
    </Box>
    </Container>
  );
}
