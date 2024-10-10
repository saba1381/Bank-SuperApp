import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UseAppDispatch } from "../../store/configureStore";
import { addCard, fetchCards } from "../account/accountSlice";
import { useNavigate } from "react-router-dom";
import InputAdornment from '@mui/material/InputAdornment';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const AddCard = () => {
  const [bankName, setBankName] = useState("");
  const yearInputRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isInvalidCard, setIsInvalidCard] = useState(false);
  const [bankColor, setBankColor] = useState("black");
  const [textColor, setTextColor] = useState("white");
  const dispatch = UseAppDispatch();
  const navigate = useNavigate();
  const cardNum = useRef(null);
  const yourName = useRef(null);
  const exDate = useRef(null);


  const banks = {
    603799: { name: "ملی", icon: <img src="/BankIcons/meli.png" alt="ملی" />, iconWidth: "55px",iconHeight: "50px",},
    589210: { name: "سپه", icon: <img src="/BankIcons/sepah.png" alt="سپه" />, iconWidth: "48px",iconHeight: "48px", },
    621986: {
      name: "سامان",
      icon: <img src="/BankIcons/saman.png" alt="سامان" />, iconWidth: "40px",iconHeight: "40px",
    },
    622106: {
      name: "پارسیان",
      icon: <img src="/BankIcons/parsian.png" alt="پارسیان" />, iconWidth: "70px",iconHeight: "70px",
    },
    589463: {
      name: "رفاه کارگران",
      icon: <img src="/BankIcons/refah.png" alt="رفاه کارگران" />, iconWidth: "38px",iconHeight: "38px",
    },
    502229: {
      name: "پاسارگاد",
      icon: <img src="/BankIcons/pasargad.png" alt="پاسارگاد" />, iconWidth: "30px",iconHeight: "38px",
    },
    610433: { name: "ملت", icon: <img src="/BankIcons/melat.png" alt="ملت" />, iconWidth: "35px",iconHeight: "35px", },
  };

  const bankColors = {
    603799: "#faf6fc",
    589210: "#f8cf82",
    621986: "#8ae7f9 ",
    622106: "#f1b2a2",
    589463: "#9b14ee ",
    502229: "#080808",
    610433: "#f54994",
  };

  const getTextColor = (backgroundColor) => {
    const color = backgroundColor.substring(1);
    const rgb = parseInt(color, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? "black" : "white";
  };

  const formatCardNumber = (number) => {
    return number
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1-")
      .replace(/-$/, "");
  };

  const toPersianDigits = (number) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return number.replace(/\d/g, (d) => persianDigits[d]);
  };


  const isValidCardNumber = (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, ''); // حذف همه کاراکترهای غیر عددی
    let sum = 0;
    let isSecond = false;
  
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = parseInt(digits[i], 10);
  
      if (isSecond) {
        d = d * 2;
        if (d > 9) {
          d -= 9;
        }
      }
  
      sum += d;
      isSecond = !isSecond;
    }
  
    return sum % 10 === 0;
  };

  const handleCardNumberChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    if (inputValue.length > 16) return;
  
    const formattedNumber = formatCardNumber(inputValue);
    formik.setFieldValue("cardNumber", formattedNumber);
  
    const firstSixDigits = inputValue.substring(0, 6);
    const bank = banks[firstSixDigits];
  
    if (inputValue.length >= 6) {
      if (bank) {
        if (bankName !== bank.name) {
          setBankName(bank.name);
          const color = bankColors[firstSixDigits] || "red";
          setBankColor(color);
          setTextColor(getTextColor(color));
          setIsInvalidCard(false);
        }
      } else {
        if (bankName !== "کارت ناشناخته است") {
          setBankName("کارت ناشناخته است");
          setIsInvalidCard(true);
        }
      }
    } else {
      if (inputValue.length === 0) {
        setBankName("");
        setIsInvalidCard(false);
      } else {
        if (bankName !== "") {
          setBankName("");
          setIsInvalidCard(false);
        }
      }
    }
  
    // چک کردن معتبر بودن کارت
    if (inputValue.length === 16) {
      if (!isValidCardNumber(inputValue)) {
        
        setIsInvalidCard(true);
      }
    }
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      cardNumber: "",
      name: "",
      cardMonth: "",
      cardYear: "",
    },
    validationSchema: Yup.object({
      cardNumber: Yup.string()
        .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "شماره کارت خود را کامل وارد کنید.")
        .required("شماره کارت الزامی است"),
      name: Yup.string()
        .matches(/^[\u0600-\u06FF\s]+$/, "نام کارت باید فارسی باشد")
        .required("نام کارت الزامی است"),
      cardMonth: Yup.string()
        .matches(/^\d{1,2}$/, "ماه باید یک یا دو رقمی باشد")
        .test("month", "ماه معتبر نیست", (val) => !val || (parseInt(val, 10) >= 1 && parseInt(val, 10) <= 12)),
      cardYear: Yup.string()
        .matches(/^\d{2}$/, "سال معتبر نیست")
    }),
    
    onSubmit: async (values) => {
      try {
        const cardData = {
          card_number: values.cardNumber.replace(/-/g, ""),
          full_name: values.name,
          expiration_month: values.cardMonth || null,
          expiration_year: values.cardYear || null,
          bank_name: bankName,
        };

        await dispatch(addCard(cardData)).unwrap();

        setSnackbarMessage("کارت با موفقیت ثبت شد");
        setSnackbarOpen(true);
        setSnackbarSeverity("success");
        formik.resetForm();
        setBankName("");
        dispatch(fetchCards());
        setTimeout(() => {
          navigate("/cp/user-cards/");
        }, 3000);
      } catch (error) {
        setSnackbarMessage(error.error);
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
        formik.resetForm();
        setBankName("");
      }
    },
  });

  const handleMonthChange = (e) => {
    formik.handleChange(e);
    if (e.target.value.length === 2) {
      yearInputRef.current.focus();
    }
  };

  const renderExpirationDate = () => {
    if (!formik.values.cardMonth || !formik.values.cardYear) {
      return null; // اگر تاریخ انقضا وارد نشده است، چیزی نمایش ندهد
    }
    return `تاریخ انقضا: ${toPersianDigits(formik.values.cardYear)}/${toPersianDigits(formik.values.cardMonth)}`;
  };
  
  

  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const handleKeyDown = (event, nextFieldRef) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        nextFieldRef.current.focus();
    }
};

  return (
    <Box
      maxWidth="full"
      sx={{ paddingY: 4, paddingX: { xs: 1, sm: 2, md: 4 } , height:{sm:'160vh' , xs:'105vh'} }}
    >
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/cp/user-cards")}
          endIcon={<KeyboardBackspaceIcon />}
          sx={{fontSize:'1.1rem'}}
        >
          بازگشت
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          mb: 2,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Paper
            elevation={3}
            sx={{ p: { xs: 1, md: 4 }, borderRadius: 6, width: "100%" }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                textAlign: "center",
                fontSize: {
                  xs: "1.6rem",
                  sm: "2rem",
                  md: "1.7rem",
                },
                color: "black",
              }}
            >
              ثبت کارت جدید
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                textAlign: "center",
                fontSize: "0.9rem",
                color: "gray",
              }}
            >
              برای تعریف کارت جدید در موبایل بانک، اطلاعات زیر را وارد کنید.
            </Typography>
            <Box sx={{ display: "grid", gap: 4, mb: 4  }}>
              <motion.div {...animationProps}>
                <TextField
                  label="شماره کارت"
                  fullWidth
                  name="cardNumber"
                  value={formik.values.cardNumber}
                  onChange={handleCardNumberChange}
                  onKeyDown={(e) => handleKeyDown(e, yourName)}
                  inputRef={cardNum}
                  slotProps={{input:{ startAdornment: (
                    <InputAdornment position="start">
                      {banks[formik.values.cardNumber.replace(/\D/g, "").substring(0, 6)] && (
    React.cloneElement(banks[formik.values.cardNumber.replace(/\D/g, "").substring(0, 6)].icon, {
      style: {
        width: banks[formik.values.cardNumber.replace(/\D/g, "").substring(0, 6)].iconWidth,
        height: banks[formik.values.cardNumber.replace(/\D/g, "").substring(0, 6)].iconHeight,
      },
    })
  )}
                    </InputAdornment>
                  ), }}}
                  inputProps={{maxLength: 19, style:{direction:'rtl'}}}
                  error={
                    isInvalidCard ||
                    (formik.touched.cardNumber &&
                      Boolean(formik.errors.cardNumber))
                  }
                  helperText={
                    (isInvalidCard && "شماره کارت اشتباه است") ||
                    (formik.touched.cardNumber && formik.errors.cardNumber)
                  }
                  InputLabelProps={{
                    sx: {
                      color: isInvalidCard ? "red" : "grey",
                      '&.Mui-focused': {
                                    color: '#1C3AA9',
                                    fontSize: {xs: '1.3rem'},
                                    transform: 'translate(-3px, -18px) scale(0.75)'
                                },
                                '&.Mui-error': {
                                    color: 'pink',
                                },
                                 fontSize:'1rem'
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: isInvalidCard ? "red" : "",
                      },
                    },
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                />
              
              </motion.div>
              <motion.div {...animationProps}>
                <TextField
                  label="نام بانک"
                  fullWidth
                  value={bankName}
                  InputProps={{ readOnly: true }}
                  error={isInvalidCard}
                  
                  InputLabelProps={{
                    sx: {
                      color: isInvalidCard ? "red" : "grey",
                      '&.Mui-focused': {
                                    color: '#1C3AA9',
                                    fontSize: {xs: '1.3rem'},
                                    transform: 'translate(-1px, -14px) scale(0.75)'
                                },
                                '&.Mui-error': {
                                    color: 'pink',
                                },
                                 fontSize:'1rem'
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: isInvalidCard ? "red" : "",
                      },
                    },
                 
                  }}
                />
              </motion.div>
              <motion.div {...animationProps}>
                <TextField
                  label="نام کارت"
                  fullWidth
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onKeyDown={(e) => handleKeyDown(e, exDate)}
                  inputRef={yourName}
                  inputProps={{ maxLength: 15 }}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  InputLabelProps={{
                    sx: {
                      color: "grey",
                      '&.Mui-focused': {
                                    color: '#1C3AA9',
                                    fontSize: {xs: '1.3rem'},
                                    transform: 'translate(-3px, -14px) scale(0.75)'
                                },
                                '&.Mui-error': {
                                    color: 'pink',
                                },
                                fontSize:'1rem'
                               
                    },
                  }}
                />
              </motion.div>
              <motion.div {...animationProps}>
                <Box sx={{}}>
                  <Typography
                    sx={{ fontSize: "16px", mb: 1, ml: 2, color: "grey" }}
                  >
                    تاریخ انقضا:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      label="ماه"
                      fullWidth
                      name="cardMonth"
                      value={formik.values.cardMonth}
                      onChange={handleMonthChange}
                      inputProps={{ maxLength: 2 }}
                      inputRef={exDate}
                      error={
                        formik.touched.cardMonth &&
                        Boolean(formik.errors.cardMonth)
                      }
                      helperText={
                        formik.touched.cardMonth && formik.errors.cardMonth
                      }
                      InputLabelProps={{
                        sx: {
                          color: "grey",
                          '&.Mui-focused': {
                                    color: '#1C3AA9',
                                    fontSize: {xs: '1.3rem'},
                                    transform: 'translate(6px, -14px) scale(0.75)'
                                },
                                '&.Mui-error': {
                                    color: 'pink',
                                },
                                 fontSize:'1rem'
                        },
                      }}
                    />
                    <Typography sx={{ fontSize: {sm:'30px' , xs:'25px'} }}>/</Typography>
                    <TextField
                      label="سال"
                      fullWidth
                      name="cardYear"
                      value={formik.values.cardYear}
                      onChange={formik.handleChange}
                      inputProps={{ maxLength: 2 }}
                      inputRef={yearInputRef}
                      error={
                        formik.touched.cardYear &&
                        Boolean(formik.errors.cardYear)
                      }
                      helperText={
                        formik.touched.cardYear && formik.errors.cardYear
                      }
                      InputLabelProps={{
                        sx: {
                          color: "grey",
                          '&.Mui-focused': {
                                    color: '#1C3AA9',
                                    fontSize: {xs: '1.3rem'},
                                    transform: 'translate(6px, -14px) scale(0.75)'
                                },
                                '&.Mui-error': {
                                    color: 'pink',
                                },
                                 fontSize:'1rem'
                        },
                      }}
                    />
                  </Box>
                </Box>
              </motion.div>
            </Box>
            {bankName &&
  formik.values.cardNumber.replace(/\D/g, "").length >= 6 &&
  !isInvalidCard && (
    <Paper
      sx={{
        paddingX: 1,
        paddingY: 2,
        backgroundColor: bankColor,
        color: "white",
        borderRadius: 6,
        boxShadow: 3,
        display: "flex",
        flexDirection: "row",
        gap: 1,
        mb: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          gap: 6,
        }}
      >
<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  {banks[formik.values.cardNumber.replace(/\D/g, "").substring(0, 6)] && (
    React.cloneElement(banks[formik.values.cardNumber.replace(/\D/g, "").substring(0, 6)].icon, {
      style: {
        width: banks[formik.values.cardNumber.replace(/\D/g, "").substring(0, 6)].iconWidth,
        height: banks[formik.values.cardNumber.replace(/\D/g, "").substring(0, 6)].iconHeight,
      },
    })
  )}
  <Typography

    sx={{ flexGrow: 1, textAlign: "left", color: textColor , width:'40%' , fontSize:{xs:'17px' , md:'20px'}}}
  >
    {formik.values.name ? `کارت ${formik.values.name}` : ""}
  </Typography>
</Box>

        <Typography
          sx={{ color: textColor, textAlign: "center", justifyContent: "center", width:'47%' , fontSize:{xs:'17px' , sm:'21px'} }}
        >
          {formik.values.cardNumber
            ? toPersianDigits(formik.values.cardNumber)
            : "•••• •••• •••• ••••"}
        </Typography>
      </Box>
    </Paper>
  )}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ p: 3 }}
            >
              ثبت کارت جدید
            </Button>
          </Paper>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddCard;
