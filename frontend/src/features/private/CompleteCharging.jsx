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
  transferCard,
  fetchCards,
  saveDesCard,
  fetchSavedDesCards,
  deleteDesCard,
} from "../account/accountSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { UseAppDispatch, UseAppSelector } from "../../store/configureStore";
import CardTransferForm from "./CardTransferInfo";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import { toPersianNumbers } from "../../util/util";
import { sendOtp, verifyOtp } from "../account/accountSlice";
import Charging from "./Charging";

const CompleteCharging = ({ mobile, chargeAmount }) => {
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
  const pooyaRef = useRef(null);
  const cvv2Ref = useRef(null);
  const exDate = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [userCards, setUserCards] = useState([]);
  const [userDesCards, setUserDesCards] = useState([]);
  const [currentComponent, setCurrentComponent] = useState(false);
  const [initialCard, setInitialCard] = useState("");
  const [amount, setAmount] = useState("");
  const [helpSnackbarOpen, setHelpSnackbarOpen] = useState(false);
  const [showPasswordPooya, setShowPasswordPooya] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { cardNumberr } = location.state || {};
  const [isInitialized, setIsInitialized] = useState(false);
  const [ownersName, setOwnersName] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timer, setTimer] = useState(120);
  const [showCharging, setShowCharging] = useState(false);

  const getOperator = (mobile) => {
    const prefix = mobile.substring(0, 4);
    if (["0910", "0911", "0912"].includes(prefix)) {
      return { name: "همراه اول", color: "#a0eaf5", textColor: "#3d4849" };
    } else if (["0935", "0936", "0937"].includes(prefix)) {
      return { name: "ایرانسل", color: "#ffcc00", textColor: "#445355" };
    } else if (["0920", "0921"].includes(prefix)) {
      return { name: "رایتل", color: "#800080", textColor: "#fff" };
    } else {
      return { name: "اپراتور ناشناخته", color: "#bdbdbd" };
    }
  };

  const operatorInfo = getOperator(mobile);

  const handleButtonClick = () => {
    setCurrentComponent("cardTransfer");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTogglePasswordPooya = () => {
    setShowPasswordPooya(!showPasswordPooya);
  };

  const banks = {
    603799: {
      name: "ملی",
      icon: <img src="/BankIcons/meli.png" alt="ملی" />,
      iconWidth: "50px",
      iconHeight: "44px",
    },
    589210: {
      name: "سپه",
      icon: <img src="/BankIcons/sepah.png" alt="سپه" />,
      iconWidth: "42px",
      iconHeight: "42px",
    },
    621986: {
      name: "سامان",
      icon: <img src="/BankIcons/saman.png" alt="سامان" />,
      iconWidth: "34px",
      iconHeight: "34px",
    },
    622106: {
      name: "پارسیان",
      icon: <img src="/BankIcons/parsian.png" alt="پارسیان" />,
      iconWidth: "66px",
      iconHeight: "66px",
    },
    589463: {
      name: "رفاه کارگران",
      icon: <img src="/BankIcons/refah.png" alt="رفاه کارگران" />,
      iconWidth: "32px",
      iconHeight: "32px",
    },
    502229: {
      name: "پاسارگاد",
      icon: <img src="/BankIcons/pasargad.png" alt="پاسارگاد" />,
      iconWidth: "22px",
      iconHeight: "30px",
    },
    610433: {
      name: "ملت",
      icon: <img src="/BankIcons/melat.png" alt="ملت" />,
      iconWidth: "30px",
      iconHeight: "30px",
    },
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
      } else {
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
      } else {
        setIsInvalidDesCard(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleHelpSnackbarClose = () => {
    setHelpSnackbarOpen(false);
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

  useEffect(() => {
    const fetchUserDesCards = async () => {
      try {
        const Descards = await dispatch(fetchSavedDesCards()).unwrap();
        console.log(Descards);

        if (Array.isArray(Descards)) {
          setUserDesCards(Descards);
        } else {
          setUserDesCards([]);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
        setUserDesCards([]);
      }
    };

    fetchUserDesCards();
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      initialCard: "",
      dynamicPassword: "",
      cvv2: "",
      cardMonth: "",
      cardYear: "",
      saveCard: false,
    },
    validationSchema: Yup.object({
      initialCard: Yup.string()
        .matches(
          /^\d{4}-\d{4}-\d{4}-\d{4}$/,
          "شماره کارت مبدا را کامل وارد کنید."
        )
        .required("شماره کارت مبدا الزامی است"),
      dynamicPassword: Yup.string()
        .matches(/^\d{1,5}$/, "رمز پویای معتبر وارد کنید")
        .required("لطفا رمز پویای خود را وارد کنید"),
      cvv2: Yup.string()
        .matches(/^\d{3,4}$/, "کد CVV2 را کامل وارد کنید.")
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
      if (isInvalidCard || isInvalidDesCard) {
        formik.setTouched({
          initialCard: true,
          desCard: true,
        });
        return;
      }

      const errors = await formik.validateForm();

      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          initialCard: true,
          dynamicPassword: true,
          amount: true,
          cvv2: true,
          cardMonth: true,
          cardYear: true,
        });
        return;
      }
      const formattedValues = {
        ...values,
        initialCard: values.initialCard.replace(/-/g, ""),
        desCard: values.desCard.replace(/-/g, ""),
      };
      dispatch(transferCard(formattedValues))
        .unwrap()
        .then((response) => {
          setCurrentComponent(true);
          setInitialCard(values.initialCard);
        })
        .catch((error) => {
          const errorMessage = error.error.detail;
          if (errorMessage.includes("مبدا")) {
            formik.setFieldError("initialCard", " ");
          }
          toast.error(errorMessage, { autoClose: 3000 });
        });
    },
  });

  useEffect(() => {
    if (!isInitialized && cardNumberr && !formik.values.initialCard) {
      formik.setFieldValue("initialCard", formatCardNumber(cardNumberr));
      setIsInitialized(true);
    }
  }, [cardNumberr, formik, isInitialized]);

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

  const formatAmountNumber = (value) => {
    if (!value) return value;
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);
  const handleDynamicPasswordClick = () => {
    // dispatch(sendOtp())
    //   .unwrap()
    //   .then(() => {
    //     setTimer(120);
    //     setIsTimerActive(true);
    //   })
    //   .catch(() => {
    //    // setShowTransfer(true);
    //   });
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds} : ${minutes}`;
  };
  if (showCharging) {
    return <Charging />; 
}

  return (
    <>
      {!currentComponent ? (
        <Box
          maxWidth="full"
          sx={{
            paddingY: { xs: 5, sm: 0 },
            paddingTop:{xs:2},
            paddingX: { xs: 1.5, sm: 18, md: 46 },
            height: { sm: "125vh", xs: "70vh" },
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              mb: 2,
              paddingTop: { xs: 0, sm: 2 },
              paddingBottom: { xs: 8, sm: 4 },
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Paper
                elevation={3}
                sx={{
                  paddingY: { xs: 3.6, md: 4 },
                  borderRadius: 3,
                  width: "100%",
                  paddingX: { xs: 2.9, sm: 7 },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: operatorInfo.color,
                    color: operatorInfo.textColor,
                    borderRadius: "8px",
                    paddingY: 2.5,
                    paddingX:4,
                    textAlign: "center",
                    mb: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ alignSelf: "flex-start" }}
                  >{`شارژ ${operatorInfo.name}`}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ alignSelf: "flex-start" , fontSize:'1rem' }}
                    >
                      مبلغ:
                    </Typography>
                    <Typography
                      sx={{ alignSelf: "flex-end", fontSize: "1rem" }}
                    >
                      {`${toPersianDigits(
                        chargeAmount
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      )} ریال`}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ marginBottom: 2 }}
                ></Box>
                <Box sx={{ display: "grid", gap: 0.6, mb: 4 }}>
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
                        PopperProps={{
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, 0],
                              },
                            },
                          ],
                        }}
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => {
                          const firstSixDigits = option.value.substring(0, 6);
                          const bank = banks[firstSixDigits];

                          return (
                            <li
                              {...props}
                              style={{
                                backgroundColor: "#f3f4f9",
                                paddingY: 0.1,
                                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.01)",
                                transition: "background-color 0.3s ease",
                                zIndex: -10,
                                fontSize: { xs: "0.7rem", sm: "0.9rem" },
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#ececec")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f7f7f7")
                              }
                            >
                              {bank ? (
                                <>
                                  <img
                                    src={bank.icon.props.src}
                                    alt={bank.icon.props.alt}
                                    style={{
                                      width: bank.iconWidth,
                                      height: bank.iconHeight,
                                      marginLeft: "3px",
                                      scale: "70%",
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
                        inputValue={formik.values.initialCard || ""}
                        onInputChange={(event, newValue) => {
                          const formattedNumber = formatCardNumber(newValue);
                          formik.setFieldValue("initialCard", formattedNumber);
                          handleCardNumberChange({
                            target: { value: newValue },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="شماره کارت"
                            fullWidth
                            name="initialCard"
                            value={formik.values.initialCard}
                            onChange={handleCardNumberChange}
                            onKeyDown={(e) => handleKeyDown(e, pooyaRef)}
                            inputRef={IncardNum}
                            inputProps={{ maxLength: 19, ...params.inputProps }}
                            error={
                              isInvalidCard ||
                              (formik.touched.initialCard &&
                                Boolean(formik.errors.initialCard))
                            }
                            helperText={
                              (isInvalidCard && "شماره کارت اشتباه است") ||
                              (formik.touched.initialCard &&
                              formik.errors.initialCard &&
                              formik.errors.initialCard.trim() !== ""
                                ? formik.errors.initialCard
                                : null)
                            }
                            InputLabelProps={{
                              sx: {
                                color:
                                  formik.touched.initialCard &&
                                  (formik.errors.initialCard || isInvalidCard)
                                    ? "red"
                                    : "grey",
                                "&.Mui-focused": {
                                  color: "#1C3AA9",
                                  fontSize: {
                                    xs: "1.01rem",
                                    sm: "1.3rem",
                                    md: "1.4rem",
                                    lg: "1.5rem",
                                  },
                                  transform: {
                                    xs: "translate(8px, -17px) scale(0.85)",
                                    sm: "translate(13px, -14px) scale(0.75)",
                                    md: "translate(12px, -14px) scale(0.70)", 
                                    lg: "translate(10px, -22px) scale(0.65)", 
                                  },
                                },
                                "&.Mui-error": {
                                  color: "pink",
                                },
                                fontSize: "1rem",
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                "& fieldset": {
                                  borderColor:
                                    formik.touched.initialCard &&
                                    Boolean(formik.errors.initialCard) &&
                                    isInvalidCard
                                      ? "red"
                                      : "",
                                },
                              },
                              textAlign: "center",
                              justifyContent: "center",
                              marginBottom: 2,
                              borderRadius: "8px",
                              position: "relative",
                              zIndex: 10,
                            }}
                          />
                        )}
                      />
                    )}
                  </motion.div>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      justifyContent: "space-between",
                      maxHeight: "200px",
                      width: "100%",
                    }}
                  >
                    <TextField
                      label="رمز پویا"
                      fullWidth
                      variant="outlined"
                      value={formik.values.dynamicPassword}
                      onKeyDown={(e) => handleKeyDown(e, cvv2Ref)}
                      inputRef={pooyaRef}
                      type={showPasswordPooya ? "text" : "password"}
                      {...formik.getFieldProps("dynamicPassword")}
                      error={
                        formik.touched.dynamicPassword &&
                        Boolean(formik.errors.dynamicPassword)
                      }
                      helperText={
                        formik.touched.dynamicPassword &&
                        formik.errors.dynamicPassword
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordPooya}
                              style={{ fontSize: "1.2rem", color: "navy" }}
                            >
                              {showPasswordPooya ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "10px" },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "gray",
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
                            "&.Mui-error": {
                              color: "pink",
                            },
                          },
                          fontSize: "1rem",
                        },
                      }}
                      FormHelperTextProps={{
                        sx: {
                          height: "1.5rem",
                          marginTop: "0.5rem",
                        },
                      }}
                      sx={{
                        mr: 2,
                        width: "70%",
                        "& .MuiFormHelperText-root": {
                          position: "absolute",
                          bottom: "-1.6rem",
                        },
                      }}
                      onKeyPress={(event) => {
                        const keyCode = event.key;
                        if (!/^\d$/.test(keyCode)) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <Box
                      sx={{
                        bgcolor: "navy",
                        borderRadius: "10px",
                        paddingY: 0.2,
                        transition: "opacity 0.3s ease",
                        "&:hover": {
                          opacity: 0.5,
                        },
                        width: {sm:"30%" , xs:"38%"},
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        sx={{
                          color: isTimerActive ? "white" : "white",
                          borderRadius: "10px",
                          paddingY: 2,
                          whiteSpace: "nowrap",
                          bgcolor: isTimerActive ? "navy" : "transparent",
                          transition: "background-color 0.3s ease",
                          cursor: isTimerActive ? "not-allowed" : "pointer",
                        }}
                        onClick={handleDynamicPasswordClick}
                        disabled={isTimerActive}
                      >
                        <span
                          style={{
                            color: "white",
                            fontSize: isTimerActive ? "1.2rem" : "0.9rem",
                          }}
                        >
                          {isTimerActive
                            ? toPersianNumbers(formatTime(timer))
                            : "دریافت رمز پویا"}
                        </span>
                      </Button>
                    </Box>
                  </Box>
                  <motion.div {...animationProps}>
                    <TextField
                      label="CVV2"
                      type={showPassword ? "text" : "password"}
                      {...formik.getFieldProps("cvv2")}
                      fullWidth
                      name="cvv2"
                      value={formik.values.cvv2}
                      onChange={formik.handleChange}
                      onKeyDown={(e) => {
                        handleKeyDown(e, exDate);
                        if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      inputRef={cvv2Ref}
                      inputProps={{
                        maxLength: 4,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      error={formik.touched.cvv2 && Boolean(formik.errors.cvv2)}
                      helperText={formik.touched.cvv2 && formik.errors.cvv2}
                      InputLabelProps={{
                        sx: {
                          color: "grey",
                          "&.Mui-focused": {
                            color: "#1C3AA9",
                            fontSize: {
                              xs: "1.01rem", // تغییر اندازه در کوچکترین صفحه
                              sm: "1.3rem", // برای صفحه کوچک
                              md: "1.4rem", // برای صفحه متوسط
                              lg: "1.5rem", // برای صفحه بزرگ
                            },
                            transform: {
                              xs: "translate(10px, -15px) scale(0.85)",
                              sm: "translate(13px, -14px) scale(0.75)",
                              md: "translate(12px, -14px) scale(0.70)", // برای صفحه متوسط
                              lg: "translate(10px, -22px) scale(0.65)", // برای صفحه بزرگ
                            },
                          },
                          fontSize: "0.9rem",
                          "&.Mui-error": {
                            color: "pink",
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePassword}
                              style={{ fontSize: "1.2rem", color: "navy" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "10px" },
                      }}
                    />
                  </motion.div>
                  <motion.div {...animationProps}>
                    <Box sx={{}}>
                      <Typography
                        sx={{ fontSize: "13px", mb: 1, ml: 2, color: "gray" }}
                      >
                        تاریخ انقضا:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
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
                            }
                          }}
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
                                fontSize: {
                                  xs: "1.01rem", // تغییر اندازه در کوچکترین صفحه
                                  sm: "1.3rem", // برای صفحه کوچک
                                  md: "1.4rem", // برای صفحه متوسط
                                  lg: "1.5rem", // برای صفحه بزرگ
                                },
                                transform: {
                                  xs: "translate(10px, -15px) scale(0.85)",
                                  sm: "translate(13px, -14px) scale(0.75)",
                                  md: "translate(12px, -14px) scale(0.70)", // برای صفحه متوسط
                                  lg: "translate(10px, -22px) scale(0.65)", // برای صفحه بزرگ
                                },
                              },
                              fontSize: "0.9rem",
                              "&.Mui-error": {
                                color: "pink",
                              },
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "13px",
                            },
                          }}
                        />
                        <Typography
                          sx={{ fontSize: { sm: "30px", xs: "25px" } }}
                        >
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
                            }
                          }}
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
                                fontSize: {
                                  xs: "1.01rem", // تغییر اندازه در کوچکترین صفحه
                                  sm: "1.3rem", // برای صفحه کوچک
                                  md: "1.4rem", // برای صفحه متوسط
                                  lg: "1.5rem", // برای صفحه بزرگ
                                },
                                transform: {
                                  xs: "translate(10px, -15px) scale(0.85)",
                                  sm: "translate(13px, -14px) scale(0.75)",
                                  md: "translate(12px, -14px) scale(0.70)", // برای صفحه متوسط
                                  lg: "translate(10px, -22px) scale(0.65)", // برای صفحه بزرگ
                                },
                              },
                              fontSize: "0.9rem",
                              "&.Mui-error": {
                                color: "pink",
                              },
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "13px",
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
                    onClick={()=>setShowCharging(true)}
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
        <CardTransferForm
          ownerName={ownersName}
          initailCard={initialCard}
          amount={amount}
        />
      )}
    </>
  );
};

export default CompleteCharging;
