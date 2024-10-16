import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import {transferCard,fetchCards } from "../account/accountSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { UseAppDispatch, UseAppSelector } from "../../store/configureStore";
import CardTransferForm from './CardTransferInfo';


const Transfer = () => {
  const [bankName, setBankName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const yearInputRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isInvalidCard, setIsInvalidCard] = useState(false);
  const [isInvalidDesCard, setIsInvalidDesCard] = useState(false);
  const [bankColor, setBankColor] = useState("black");
  const [textColor, setTextColor] = useState("white");
  const dispatch = UseAppDispatch();
  const IncardNum = useRef(null);
  const DesCardNum = useRef(null);
  const amountRef = useRef(null);
  const cvv2Ref = useRef(null);
  const exDate = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [userCards, setUserCards] = useState([]);
  const [currentComponent, setCurrentComponent] = useState(false);
  const [initialCard, setInitialCard] = useState("");
  const [desCard, setDesCard] = useState("");
  const [amount, setAmount] = useState("");

  const handleButtonClick = () => {
    setCurrentComponent("cardTransfer");
  };


  const banks = {
    603799: { name: "ملی", icon: <img src="/BankIcons/meli.png" alt="ملی" />, iconWidth: "51px",iconHeight: "46px",},
    589210: { name: "سپه", icon: <img src="/BankIcons/sepah.png" alt="سپه" />, iconWidth: "44px",iconHeight: "44px", },
    621986: {
      name: "سامان",
      icon: <img src="/BankIcons/saman.png" alt="سامان" />, iconWidth: "36px",iconHeight: "36px",
    },
    622106: {
      name: "پارسیان",
      icon: <img src="/BankIcons/parsian.png" alt="پارسیان" />, iconWidth: "68px",iconHeight: "68px",
    },
    589463: {
      name: "رفاه کارگران",
      icon: <img src="/BankIcons/refah.png" alt="رفاه کارگران" />, iconWidth: "34px",iconHeight: "34px",
    },
    502229: {
      name: "پاسارگاد",
      icon: <img src="/BankIcons/pasargad.png" alt="پاسارگاد" />, iconWidth: "24px",iconHeight: "32px",
    },
    610433: { name: "ملت", icon: <img src="/BankIcons/melat.png" alt="ملت" />, iconWidth: "31px",iconHeight: "31px", },
  };


  const bankColors = {
    603799: "#004d99",
    589210: "#eead32 ",
    621986: "#8ae7f9 ",
    622106: "#c83a08 ",
    589463: "#9b14ee ",
    502229: "#080808",
    610433: "#df117e",
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
    const digits = cardNumber.replace(/\D/g, ""); 
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
    formik.setFieldValue("initialCard", formattedNumber);

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
    if (inputValue.length === 16) {
      if (!isValidCardNumber(inputValue)) {
        setIsInvalidCard(true);
      }
      else {
        setIsInvalidCard(false); 
    }
    }
  };
  const handleDesCardChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    if (inputValue.length > 16) return;

    const formattedNumber = formatCardNumber(inputValue);
    formik.setFieldValue("desCard", formattedNumber);

    const firstSixDigits = inputValue.substring(0, 6);
    const bank = banks[firstSixDigits];

    if (inputValue.length >= 6) {
      if (bank) {
        if (bankName !== bank.name) {
          setBankName(bank.name);
          const color = bankColors[firstSixDigits] || "red";
          setBankColor(color);
          setTextColor(getTextColor(color));
          setIsInvalidDesCard(false);
        }
      } else {
        if (bankName !== "کارت ناشناخته است") {
          setBankName("کارت ناشناخته است");
          setIsInvalidDesCard(true);
        }
      }
    } else {
      if (inputValue.length === 0) {
        setBankName("");
        setIsInvalidDesCard(false);
      } else {
        if (bankName !== "") {
          setBankName("");
          setIsInvalidDesCard(false);
        }
      }
    }

    if (inputValue.length === 16) {
      if (!isValidCardNumber(inputValue)) {
        setIsInvalidDesCard(true);
      }else {
        setIsInvalidDesCard(false); 
    }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const cards = await dispatch(fetchCards()).unwrap();
      
        if (Array.isArray(cards)) {
          setUserCards(cards);
        } else {
          setUserCards([]); 
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
        setUserCards([]); 
      }
    };

    fetchUserCards();
  }, [dispatch]);


  const formik = useFormik({
    initialValues: {
      initialCard: "",
      desCard: "",
      amount: "",
      cvv2: "",
      cardMonth: "",
      cardYear: "",
    },
    validationSchema: Yup.object({
      initialCard: Yup.string()
        .matches(
          /^\d{4}-\d{4}-\d{4}-\d{4}$/,
          "شماره کارت مبدا را کامل وارد کنید."
        )
        .required("شماره کارت مبدا الزامی است"),
      desCard: Yup.string()
        .matches(
          /^\d{4}-\d{4}-\d{4}-\d{4}$/,
          "شماره کارت مقصد را کامل وارد کنید."
        )
        .required("شماره کارت مقصد الزامی است"),
      amount: Yup.string()
        .matches(/^\d{1,16}$/, "مبلغ را به درستی وارد کنید")
        .required("مبلغ را به ریال وارد کنید")
        .max(16, "مبلغ نمی‌تواند بیشتر از ۱۶ رقم باشد"),

      cvv2: Yup.string()
        .matches(/^\d{3}$/, "کد شما معتبر نیست")
        .required("cvv2 را وارد کنید"),
      cardMonth: Yup.string()
        .matches(/^\d{1,2}$/, "ماه معتبر نیست")
        .test("length", "ماه باید دو رقمی باشد", (val) => val.length === 2)
        .test(
          "month",
          "ماه معتبر نیست",
          (val) => parseInt(val, 10) >= 1 && parseInt(val, 10) <= 12
        )
        .required("ماه الزامی است"),
      cardYear: Yup.string()
        .matches(/^\d{2}$/, "سال معتبر نیست")
        .required("سال الزامی است"),
    }),
    onSubmit: async (values) => {
      dispatch(transferCard(values))
        .unwrap()
        .then(() => {
          setCurrentComponent(true);
          console.log(values.initialCard);
          setInitialCard(values.initialCard);
          setDesCard(values.desCard);
          setAmount(values.amount);
        })
        .catch((error) => {
          console.error("خطا در انتقال:", error);
        });
    },
  });

  const handleMonthChange = (e) => {
    formik.handleChange(e);
    if (e.target.value.length === 2) {
      yearInputRef.current.focus();
    }
  };

  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const handleKeyDown = (event, nextFieldRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextFieldRef.current.focus();
    }
  };
  const handleBackClick = () => {
    const previousPage = location.state?.from || "/cp";
    navigate(previousPage);
  };
  const formatAmountNumber = (value) => {
    if (!value) return value;
    const cleanedValue = value.replace(/\D/g, ""); 
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    
    <Box
      maxWidth="full"
      sx={{
        paddingY: 0.1,
        paddingX: { xs: 0.3, sm: 8, md: 34 },
        height: { sm: "130vh", xs: "70vh" },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {!currentComponent ? (
      <Box
        sx={{
          width: "100%",
          mb: 2,
          paddingY: { xs: 10, sm: 2 },
          
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Paper
            elevation={3}
            sx={{ p: { xs: 5, md: 4 }, borderRadius: 6, width: "100%" }}
          >
            <Box sx={{ display: "grid", gap: 2, mb: 4 }}>
            <motion.div 
  initial={{ opacity: 0, y: -20 }} 
  animate={{ opacity: 1, y: 0 }} 
  exit={{ opacity: 0, y: -20 }} 
  transition={{ duration: 0.5 }}
>
  {Array.isArray(userCards) && (
    <Autocomplete
      freeSolo
      options={userCards.map((card) => ({
        label: `${formatCardNumber(card.card_number)}`, 
        value: card.card_number, 
      }))}
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => {
        const firstSixDigits = option.value.substring(0, 6);
        const bank = banks[firstSixDigits]; 

        return (
          <li {...props} style={{
            backgroundColor: "#f7f7f7",
            borderRadius: "8px",
            padding: "10px",
            margin: "5px 0",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ececec"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f7f7f7"}
          >
            {bank ? (
              <>
                <img
                  src={bank.icon.props.src} 
                  alt={bank.icon.props.alt} 
                  style={{
                    width: bank.iconWidth, 
                    height: bank.iconHeight, 
                    marginLeft: "12px", 
                  }}
                />
                {option.label}
              </>
            ) : (
              option.label
            )}
          </li>
        );
      }}
      inputValue={formik.values.initialCard} 
      onInputChange={(event, newValue) => {
        const formattedNumber = formatCardNumber(newValue); 
        formik.setFieldValue("initialCard", formattedNumber); 
        handleCardNumberChange({ target: { value: newValue } }); 
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            <>
              کارت مبدا <span style={{ color: 'red' }}>*</span>
            </>
          }
          fullWidth
          name="initialCard"
          value={formik.values.initialCard}
          onChange={handleCardNumberChange}
          onKeyDown={(e) => handleKeyDown(e, DesCardNum)}
          inputRef={IncardNum}
          inputProps={{ maxLength: 19, ...params.inputProps }}
          error={
            isInvalidCard ||
            (formik.touched.initialCard && Boolean(formik.errors.initialCard))
          }
          helperText={
            (isInvalidCard && "شماره کارت اشتباه است") ||
            (formik.touched.initialCard && formik.errors.initialCard)
          }
          InputLabelProps={{
            sx: {
              color: isInvalidCard ? "red" : "grey",
              "&.Mui-focused": {
                color: "#1C3AA9",
                fontSize: { xs: "1.3rem" },
                transform: "translate(-3px, -18px) scale(0.75)",
              },
              "&.Mui-error": {
                color: "pink",
              },
              fontSize: "1rem",
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
            marginBottom:2,
            borderRadius: "8px",
          }}
        />
      )}
    />
  )}
</motion.div>

              <motion.div {...animationProps}>
                <TextField
                  label={<>
                     به کارت <span style={{ color: 'red' }}>*</span>
                  </>}
                  fullWidth
                  name="desCard"
                  autoComplete="off"
                  value={formik.values.desCard}
                  onChange={handleDesCardChange}
                  onKeyDown={(e) => handleKeyDown(e, amountRef)}
                  inputRef={DesCardNum}
                  inputProps={{ maxLength: 19 }}
                  error={
                    isInvalidDesCard ||
                    (formik.touched.desCard && Boolean(formik.errors.desCard))
                  }
                  helperText={
                    (isInvalidDesCard && "شماره کارت اشتباه است") ||
                    (formik.touched.desCard && formik.errors.desCard)
                  }
                  InputLabelProps={{
                    sx: {
                      color: isInvalidDesCard
                        ? "red"
                        : formik.touched.desCard && formik.errors.desCard
                        ? "red"
                        : "grey",
                      "&.Mui-focused": {
                        color: "#1C3AA9",
                        fontSize: { xs: "1.3rem" , sm:'1.4rem' },
                        transform: "translate(-1px, -15px) scale(0.75)",
                      },
                      "&.Mui-error": {
                        color: "pink",
                      },
                      fontSize:'1.1rem'
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: isInvalidDesCard
                          ? "red"
                          : formik.touched.desCard && formik.errors.desCard
                          ? "red"
                          : "",
                      },
                    },
                    textAlign: "center",
                    justifyContent: "center",
                    marginBottom:2
                  }}
                />
              </motion.div>
              <motion.div {...animationProps}>
                <TextField
                  label={<>
                     مبلغ <span style={{ color: 'red' }}>*</span>
                  </>}
                  variant="outlined"
                  fullWidth
                  name="amount"
                  autoComplete="off"
                  value={formatAmountNumber(formik.values.amount)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, ''); 
                    formik.setFieldValue("amount", rawValue); 
                  }}
                  onKeyDown={(e) => handleKeyDown(e, cvv2Ref)}
                  inputRef={amountRef}
                  inputProps={{ maxLength: 16 , inputMode: 'numeric'}}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  InputLabelProps={{
                    sx: {
                      color: "grey",
                      textAlign: "center",
                      
                      "&.Mui-focused": {
                        color: "#1C3AA9",
                        fontSize: { xs: "1.3rem" , sm:'1.4rem' },
                        transform: "translate(6px, -16px) scale(0.75)",
                      },
                      fontSize:'1.1rem',
                      "&.Mui-error": {
                        color: "pink",
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" >
                         <span style={{ color: formik.touched.amount && formik.errors.amount ? 'red' : 'gray' }}>
          ریال
        </span>
                      </InputAdornment>
                    ),
                  }}
                  sx={{marginBottom:2}}
              
                />
              </motion.div>
              <motion.div {...animationProps}>
                <TextField
                  label={<>
                    CVV2 <span style={{ color: 'red' }}>*</span>
                 </>}
                  fullWidth
                  name="cvv2"
                  value={formik.values.cvv2}
                  onChange={formik.handleChange}
                  onKeyDown={(e) => {
                    handleKeyDown(e, exDate)
                    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                      
                      e.preventDefault();
                    }}}
                  inputRef={cvv2Ref}
                  inputProps={{ maxLength: 3 , inputMode: 'numeric', pattern: '[0-9]*'}}
                  error={formik.touched.cvv2 && Boolean(formik.errors.cvv2)}
                  helperText={formik.touched.cvv2 && formik.errors.cvv2}
                  InputLabelProps={{
                    sx: {
                      color: "grey",
                      "&.Mui-focused": {
                        color: "#1C3AA9",
                        fontSize: { xs: "1.3rem" , sm:'1.4rem' },
                        transform: "translate(1px, -16px) scale(0.75)",
                      },
                      fontSize:'0.9rem',
                      "&.Mui-error": {
                        color: "pink",
                      },
                    },
                  }}
                />
              </motion.div>
              <motion.div {...animationProps}>
                <Box sx={{}}>
                  <Typography
                    sx={{ fontSize: "13px", mb: 1, ml: 2, color: "gray" }}
                  >
                    تاریخ انقضا: <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 , mt:2 }}>
                    <TextField
                      label="ماه"
                      fullWidth
                      name="cardMonth"
                      value={formik.values.cardMonth}
                      onChange={handleMonthChange}
                      inputProps={{ maxLength: 2 }}
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }}}
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
                          "&.Mui-focused": {
                        color: "#1C3AA9",
                        fontSize: { xs: "1.3rem" , sm:'1.4rem' },
                        transform: "translate(6px, -16px) scale(0.75)",
                      },
                          fontSize:'0.9rem',
                      "&.Mui-error": {
                        color: "pink",
                      },
                        },
                      }}
                    />
                    <Typography sx={{ fontSize: { sm: "30px", xs: "25px" } }}>
                      /
                    </Typography>
                    <TextField
                      label="سال"
                      fullWidth
                      name="cardYear"
                      value={formik.values.cardYear}
                      onChange={formik.handleChange}
                      inputProps={{ maxLength: 2 }}
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }}}
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
                          "&.Mui-focused": {
                        color: "#1C3AA9",
                        fontSize: { xs: "1.3rem" , sm:'1.4rem' },
                        transform: "translate(6px, -16px) scale(0.75)",
                      },
                          fontSize:'0.9rem',
                      "&.Mui-error": {
                        color: "pink",
                      },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </motion.div>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 1.4,
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{
                  width: "80%",
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                onClick={formik.handleSubmit}
              >
                تایید و ادامه
              </Button>

              <Button
                color="primary"
                onClick={handleBackClick}
                endIcon={<KeyboardBackspaceIcon />}
                sx={{
                  textAlign: "center",
                  width: "100%",
                  py: 1,
                  borderRadius: 7,
                  border: 1,
                  borderColor: "grey.700",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ":hover": { color: "grey.600" },
                }}
              >
                بازگشت
              </Button>
            </Box>
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
      ) : (
        <CardTransferForm initailCard={initialCard} desCard={desCard} amount={amount}/>
      )}
    </Box>
  );
};

export default Transfer;
