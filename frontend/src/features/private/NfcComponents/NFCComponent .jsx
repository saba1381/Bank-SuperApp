import React from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toPersianNumbers } from "../../../util/util";

const formatAmount = (amount) => {
  if (!amount) return "";
  const cleaned = amount.replace(/[^\d]/g, "");
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const AmountInput = () => {
  const theme = useTheme();
  return (

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          paddingBottom:20,
          
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            width: "100%",
            maxWidth: 400,
            background: "linear-gradient(135deg, #4A90E2, #81D4FA)",
            
            borderRadius: "20px",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
            padding: "20px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              textAlign: "center",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            مبلغ
          </Typography>
          <Formik
            initialValues={{ amount: "" }}
            validationSchema={Yup.object({
              amount: Yup.string()
                .required("لطفاً مبلغ را وارد کنید")
                .matches(/^\d+$/, "مبلغ فقط باید شامل اعداد باشد")
                .test(
                  "maxAmount",
                  "مبلغ نباید بیشتر از سه میلیون ریال باشد",
                  (value) => {
                    return parseInt(value) <= 3000000;
                  }
                ),
            })}
            onSubmit={(values, { resetForm }) => {
              alert(`مبلغ وارد شده: ${values.amount}`);
              resetForm();
            }}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#fff",
                    borderRadius: 2,

                    py: 2,
                    px: 3,
                    mb: 2,
                  }}
                >
                  <Field
                    name="amount"
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    placeholder="مبلغ را وارد کنید"
                    value={formatAmount(values.amount)}
                    onChange={(e) => {

                      let value = e.target.value.replace(/[^\d]/g, "");

                      if (parseInt(value) > 3000000) {
                        value = "3000000";
                      }
                      handleChange({
                        target: {
                          name: "amount",
                          value,
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    error={touched.amount && !!errors.amount}
                    helperText={touched.amount && errors.amount}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "25px",
                        fontSize: "1.2rem",
                        color: "#333",
                        bgcolor: "#f9f9f9",
                        direction: "rtl",
                      },
                      "& .MuiInputAdornment-root": { marginLeft: "10px" },
                      "& .MuiInputBase-input": {
                        textAlign: "left",
                        direction: "ltr",
                      },
                      mb: 1,
                      mt: 1,
                      alignItems: "left",
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      mt: 1,
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    }}
                  >
                    {toPersianNumbers(
                      values.amount ? formatAmount(values.amount) : "۰"
                    )}{" "}
                    ریال
                  </Typography>
                </Box>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: "linear-gradient(135deg, #4A90E2, #81D4FA)",
                      color: "#fff",
                      py: 1.5,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      borderRadius: "30px",
                      boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "linear-gradient(135deg, #81D4FA, #4A90E2)",
                      },
                    }}
                  >
                    تایید
                  </Button>
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </Box>

  );
};

export default AmountInput;
