import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

const NFCForm = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const theme = useTheme();

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required("مبلغ الزامی است")
      .matches(/^[1-9]\d*$/, "مبلغ باید عددی مثبت باشد و با صفر شروع نشود."),
    cardNumber: Yup.string()
      .required("شماره کارت مبدا الزامی است")
      .matches(/^\d{16}$/, "شماره کارت باید 16 رقم باشد"),
    destinationCardNumber: Yup.string()
      .required("شماره کارت مقصد الزامی است")
      .matches(/^\d{16}$/, "شماره کارت باید 16 رقم باشد"),
  });

  const formik = useFormik({
    initialValues: {
      amount: "",
      cardNumber: "",
      destinationCardNumber: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsProcessing(true);
      setPaymentStatus(null);

      // Mock NFC payment process
      setTimeout(() => {
        setIsProcessing(false);
        const success = Math.random() > 0.3; // 70% chance of success
        setPaymentStatus(success ? "success" : "failure");
      }, 3000);
    },
  });

  const formatCardNumber = (value) => {
    return (
      value
        .replace(/\D/g, "")
        .match(/.{1,4}/g)
        ?.join("-") || ""
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      if (/^\d*$/.test(value)) {
        formik.setFieldValue(name, value);
      }
    } else if (name === "cardNumber" || name === "destinationCardNumber") {
      const sanitizedValue = value.replace(/-/g, "");
      if (/^\d*$/.test(sanitizedValue) && sanitizedValue.length <= 16) {
        formik.setFieldValue(name, sanitizedValue);
      }
    }
  };

  const generateQRCodeData = () => {
    return JSON.stringify({
      amount: formik.values.amount,
      cardNumber: formik.values.destinationCardNumber,
    });
  };
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const pageTransition = {
    type: "spring",
    stiffness: 50,
    damping: 20,
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 5,
          p: 3,
          mb: 14,
          border: "1px solid #ccc",
          borderRadius: 2,
          height: "auto",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" align="center" mb={3}>
          پرداخت مبتنی بر NFC
        </Typography>

        {isProcessing ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
            <CircularProgress />
            <Typography mt={2}>در حال پردازش...</Typography>
          </Box>
        ) : paymentStatus ? (
          <Box textAlign="center" mt={3}>
            <Typography
              variant="h6"
              color={
                paymentStatus === "success" ? "success.main" : "error.main"
              }
            >
              {paymentStatus === "success"
                ? "پرداخت موفق بود!"
                : "پرداخت ناموفق بود."}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setPaymentStatus(null);
                formik.resetForm();
              }}
              sx={{
                textAlign: "center",
                width: "50%",
                py: 1,
                borderRadius: 7,
                border: 1,
                borderColor:
                  theme.palette.mode === "dark" ? "grey.400" : "grey.700",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                gap: 1,
                ":hover": {
                  color:
                    theme.palette.mode === "dark"
                      ? "grey.400"
                      : "grey.600",
                },
                fontSize: "0.9rem",
                color:
                  theme.palette.mode === "dark" ? "white" : "primary",
              }}
            >
              بازگشت به فرم
            </Button>
          </Box>
        ) : (
          <form onSubmit={(e) => formik.handleSubmit(e)}>
            <Box mb={3}>
              <TextField
                fullWidth
                id="amount"
                name="amount"
                label="مبلغ (ریال)"
                variant="outlined"
                value={formik.values.amount}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                InputLabelProps={{
                  style: { color: "#9e9e9e" },
                }}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                id="cardNumber"
                name="cardNumber"
                label="شماره کارت مبدا"
                variant="outlined"
                value={formatCardNumber(formik.values.cardNumber)}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.cardNumber && Boolean(formik.errors.cardNumber)
                }
                helperText={
                  formik.touched.cardNumber && formik.errors.cardNumber
                }
                InputLabelProps={{
                  style: { color: "#9e9e9e" },
                }}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                id="destinationCardNumber"
                name="destinationCardNumber"
                label="شماره کارت مقصد"
                variant="outlined"
                value={formatCardNumber(formik.values.destinationCardNumber)}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.destinationCardNumber &&
                  Boolean(formik.errors.destinationCardNumber)
                }
                helperText={
                  formik.touched.destinationCardNumber &&
                  formik.errors.destinationCardNumber
                }
                InputLabelProps={{
                  style: { color: "#9e9e9e" },
                }}
              />
            </Box>

            {formik.values.destinationCardNumber.length === 16 && (
              <Box mb={3} display="flex" justifyContent="center">
                <QRCodeCanvas value={generateQRCodeData()} size={128} />
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                mt: 3,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ py: 1.5, width: "50%" }}
              >
                ادامه
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                sx={{
                  textAlign: "center",
                  width: "50%",
                  py: 1,
                  borderRadius: 7,
                  border: 1,
                  borderColor:
                    theme.palette.mode === "dark" ? "grey.400" : "grey.700",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ":hover": {
                    color:
                      theme.palette.mode === "dark"
                        ? "grey.400"
                        : "grey.600",
                  },
                  fontSize: "0.9rem",
                  color:
                    theme.palette.mode === "dark" ? "white" : "primary",
                }}
                onClick={() => navigate("/cp")}
              >
                بازگشت
                <FaArrowLeftLong style={{ marginRight: 4 }} />
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </motion.div>
  );
};

export default NFCForm;
