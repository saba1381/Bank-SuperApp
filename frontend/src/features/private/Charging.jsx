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
  IconButton,
  Backdrop,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { purple } from "@mui/material/colors";
import InputAdornment from "@mui/material/InputAdornment";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchCards,
  chargeUser
} from "../account/accountSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { UseAppDispatch, UseAppSelector } from "../../store/configureStore";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiSimCard2Fill } from "react-icons/ri";
import {toPersianNumbers} from '../../util/util'
import CompleteCharging from "./CompleteCharging";

const Charging = () => {
  const [userCards, setUserCards] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isInvalidCard, setIsInvalidCard] = useState(false);
  const [isInvalidDesCard, setIsInvalidDesCard] = useState(false);
  const [bankColor, setBankColor] = useState("black");
  const [textColor, setTextColor] = useState("white");
  const dispatch = UseAppDispatch();
  const amountRef = useRef(null);
  const mobileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentComponent, setCurrentComponent] = useState(false);
  const [amount, setAmount] = useState("");
  const [mobile, setMobile] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [helpSnackbarOpen, setHelpSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { cardNumberr } = location.state || {};
  const [isInitialized, setIsInitialized] = useState(false);
  const [ownersName, setOwnersName] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState("");
  const amountOptions = ["50000", "100000", "200000", "500000", "1000000"];


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



  const detectOperator = (number) => {
    const prefix = number.slice(0, 4);
    if (/^0911|0912|0919|0910|0913|0914|0915|0916|0917|0918|0919|0991|0990|0992|0993/.test(prefix)) {
      setSelectedOperator("همراه اول");
    } else if (/^0935|0936|0937|0938|0939|0901|0902|0903|0904|0905/.test(prefix)) {
      setSelectedOperator("ایرانسل");
    } else if (/^0921|0920|0922|0923/.test(prefix)) {
      setSelectedOperator("رایتل");
    } else {
      setSelectedOperator("");
    }
  };



  const formik = useFormik({
    initialValues: {
      mobile: "",
      amount: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
      .matches(
        /^(0911|0912|0919|0910|0913|0914|0915|0916|0917|0918|0991|0990|0992|0993|0935|0936|0937|0938|0939|0901|0902|0903|0904|0905|0921|0920|0922|0923)\d{7}$/,
        "شماره موبایل معتبر وارد کنید"
      )
        .required("شماره موبایل را وارد کنید"),
      amount: Yup.string()
        .matches(/^(?!0)\d{1,16}$/, "مبلغ را به درستی وارد کنید")
        .required("مبلغ را وارد کنید")
        .max(16, "مبلغ نمی‌تواند بیشتر از ۱۶ رقم باشد"),
    }),
    onSubmit: async (values) => {
      const formattedAmount = values.amount.replace(/,/g, ""); 
      const formattedValues = {
        mobile_number: values.mobile,
        amount: formattedAmount
      };
      setMobile(values.mobile);
      setAmount(values.amount);
      
      try {
        await dispatch(chargeUser(formattedValues)).unwrap(); 
        setCurrentComponent(true) 
    } catch (error) {
        setCurrentComponent(false); 
    }
      
    },
  });

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
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
    return formattedValue;
  };

  const handleAmountChange = (event) => {
    const value = event.target.value.replace(/,/g, "");
    const formattedValue = formatAmountNumber(value); 
    setAmount(formattedValue); 
    formik.setFieldValue("amount", value); 
  };



  const handleMobileChange = (e) => {
    formik.handleChange(e);
    detectOperator(e.target.value);
  };

  return (
    <>
      {!currentComponent ? (
        <Box
          maxWidth="full"
          sx={{
            paddingY: { xs: 8, sm: 0 },
            paddingX: { xs: 1.5, sm: 18, md:36},
            height: { sm: "90vh", xs: "70vh" },
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              mb: 2,
              paddingTop: { xs: 0.3, sm: 2 },
              paddingBottom: { xs: 8, sm: 4 },
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Paper
                elevation={3}
                sx={{
                  paddingY: { xs: 4, md: 4 },
                  borderRadius: 3,
                  width: "100%",
                  paddingX: { xs: 2.9, sm: 3 , md:6 },
                }}
              >
                <Box sx={{ display: "grid", gap: 0.6, mb: 4 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", alignContent:'center', mb: 2.5 , bgcolor:'#ebd4f7' , paddingY:1.5, width:'100%' , borderRadius:'10px' , alignItems:'center'}}
                  >
                    {["همراه اول", "ایرانسل", "رایتل"].map((operator) => (
                      <Box
                        key={operator}
                        sx={{ position: "relative", cursor: "pointer", mx: 2 }}
                        onClick={() => setSelectedOperator(operator)}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color:
                              selectedOperator === operator
                                ? "black"
                                : "#605f61",
                          }}
                        >
                          {operator}
                        </Typography>
                        {selectedOperator === operator && (
                          <motion.div
                            layoutId="underline"
                            style={{
                              position: "absolute",
                              bottom: -2,
                              left: 0,
                              right: 0,
                              height: "2px",
                              backgroundColor: "#1C3AA9",
                            }}
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "100%" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                  <motion.div {...animationProps}>
                    <TextField
                      label="شماره موبایل"
                      variant="outlined"
                      fullWidth
                      name="mobile"
                      autoComplete="off"
                      value={formik.values.mobile}
                      onKeyDown={(e) => handleKeyDown(e, amountRef)}
                      inputRef={amountRef}
                      onChange={handleMobileChange}
                      error={
                        formik.touched.mobile && Boolean(formik.errors.mobile)
                      }
                      helperText={formik.touched.mobile && formik.errors.mobile}
                      InputLabelProps={{
                        sx: {
                          color: "grey",
                          textAlign: "center",

                          "&.Mui-focused": {
                            color: "#1C3AA9",
                            fontSize: {
                              xs: "1.01rem",
                              sm: "1.3rem",
                              md: "1.4rem",
                              lg: "1.5rem",
                            },
                            transform: {
                              xs: "translate(4px, -20px) scale(0.85)",
                              sm: "translate(6px, -18px) scale(0.75)",
                              md: "translate(6px, -18px) scale(0.70)",
                              lg: "translate(10px, -22px) scale(0.65)",
                            },
                          },
                          fontSize: "1.1rem",
                          "&.Mui-error": {
                            color: "pink",
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <span
                              style={{
                                color:
                                  formik.touched.mobile && formik.errors.mobile
                                    ? "red"
                                    : "gray",
                                fontSize: "1.2rem",
                               
                              }}
                            >
                              <RiSimCard2Fill />
                            </span>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "10px" },
                      }}
                      sx={{ marginBottom: 2 }}
                    />
                  </motion.div>
                  <motion.div {...animationProps}>
      <Autocomplete
        freeSolo
        options={amountOptions.map(formatAmountNumber)}
        onInputChange={(event, newValue) => {
          const rawValue = newValue.replace(/,/g, "");
          formik.setFieldValue("amount", rawValue);
        }}
        value={formatAmountNumber(formik.values.amount)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="مبلغ"
            variant="outlined"
            fullWidth
            name="amount"
            autoComplete="off"
            value={amount}
            onChange={handleAmountChange}
            inputRef={amountRef}
            inputProps={{
              ...params.inputProps,
              maxLength: 16,
              inputMode: "numeric",
              style: {
                textAlign: "right", 
                direction: "rtl",  
              },
              readOnly: true,
            }}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            InputLabelProps={{
              sx: {
                color: "grey",
                textAlign: "center",
                "&.Mui-focused": {
                  color: "#1C3AA9",
                  fontSize: {
                    xs: "1.01rem",
                    sm: "1.3rem",
                    md: "1.4rem",
                    lg: "1.5rem",
                  },
                  transform: {
                    xs: "translate(10px, -15px) scale(0.85)",
                    sm: "translate(13px, -14px) scale(0.75)",
                    md: "translate(12px, -14px) scale(0.70)",
                    lg: "translate(10px, -22px) scale(0.65)",
                  },
                },
                fontSize: "1.1rem",
                "&.Mui-error": {
                  color: "pink",
                },
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <span
                    style={{
                      color: formik.touched.amount && formik.errors.amount ? "red" : "gray", marginLeft:-15
                    }}
                  >
                    ریال
                  </span>
                  <MdOutlineKeyboardArrowDown style={{ marginLeft: -30,marginRight:15 ,color: "gray" , fontSize:'1.7rem'}} />
                </InputAdornment>
              ),
              sx: { borderRadius: "10px" },
            }}
          />
        )}
        sx={{ width: "100%" }}
      />
    </motion.div>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: 1.4,
                    mt: 0.4,
                  }}
                >
                  <Button
                    color="primary"
                    type="submit"
                    fullWidth
                    sx={{
                      width: "50%",
                      bgcolor: "navy",
                      "&:hover": { bgcolor: "primary.dark" },
                      whiteSpace: "nowrap",
                      fontSize: "0.9rem",
                      color: "white",
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
                      width: "50%",
                      py: 1,
                      borderRadius: 7,
                      border: 1,
                      borderColor: "grey.700",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      ":hover": { color: "grey.600" },
                      fontSize: "0.9rem",
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
            <Backdrop
              open={helpSnackbarOpen}
              sx={{
                zIndex: (theme) => theme.zIndex.modal - 1,
                bgcolor: "rgba(0, 0, 0, 0.5)",
              }}
            />
          </Box>
        </Box>
      ) : (
        <CompleteCharging
        chargeAmount={amount}
          mobile={mobile}
        />
      )}
    </>
  );
};

export default Charging;
