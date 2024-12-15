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
  Menu,
  MenuItem,
  useTheme,
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
  const [userDesCards, setUserDesCards] = useState([]);
  const [currentComponent, setCurrentComponent] = useState(false);
  const [initialCard, setInitialCard] = useState("");
  const [desCard, setDesCard] = useState("");
  const [amount, setAmount] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [helpSnackbarOpen, setHelpSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { cardNumberr } = location.state || {};
  const [isInitialized, setIsInitialized] = useState(false);
  const [ownersName, setOwnersName] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const handleOpenMenu = (event) => {
    if (userCards.length > 0) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectCard = (cardNumber) => {
    const formattedNumber = formatCardNumber(cardNumber);
    formik.setFieldValue("desCard", formattedNumber);
    handleCloseMenu();
  };
  const [anchorElSource, setAnchorElSource] = useState(null);

  const handleOpenMenuSource = (event) => {
    if (userCards.length > 0) {
      setAnchorElSource(event.currentTarget);
    }
  };

  const handleCloseMenuSource = () => {
    setAnchorElSource(null);
  };

  const handleSelectSourceCard = (cardNumber) => {
    const formattedNumber = formatCardNumber(cardNumber);
    formik.setFieldValue("initialCard", formattedNumber);
    handleCloseMenuSource();
  };

  const handleButtonClick = () => {
    setCurrentComponent("cardTransfer");
  };

  const handleHelpSnackbarOpen = () => {
    setHelpSnackbarOpen(true);
    setOverlayOpen(true);
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
    setOverlayOpen(true);
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
      iconWidth: "28px",
      iconHeight: "34px",
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
      desCard: "",
      amount: "",
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
      desCard: Yup.string()
        .matches(
          /^\d{4}-\d{4}-\d{4}-\d{4}$/,
          "شماره کارت مقصد را کامل وارد کنید."
        )
        .required("شماره کارت مقصد الزامی است"),
      amount: Yup.string()
        .matches(/^(?!0)\d{1,16}$/, "مبلغ را به درستی وارد کنید")
        .required("مبلغ را به ریال وارد کنید")
        .max(16, "مبلغ نمی‌تواند بیشتر از ۱۶ رقم باشد"),
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
    validateOnBlur: false,
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
          desCard: true,
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
          setDesCard(values.desCard);
          setAmount(values.amount);
          const cardsName = response.desCard_owner;
          setOwnersName(cardsName);

          if (values.saveCard) {
            dispatch(
              saveDesCard({ des_card: values.desCard.replace(/-/g, "") })
            ).catch((error) => {
              toast.error("Failed to save card", { autoClose: 3000 });
            });
          }
        })
        .catch((error) => {
          const errorMessage = error.error.detail;
          if (errorMessage.includes("مبدا")) {
            formik.setFieldError("initialCard", " ");
          }
          if (errorMessage.includes("مقصد")) {
            formik.setFieldError("desCard", " ");
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
  const handleBackClick = () => {
    const previousPage = location.state?.from || "/cp";
    navigate(previousPage);
  };
  const formatAmountNumber = (value) => {
    if (!value) return value;
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDelete = (cardToDelete) => {
    const formattedCardNumber = cardToDelete.replace(/-/g, "");
    dispatch(deleteDesCard(cardToDelete))
      .then(() => {
        console.log("کارت با موفقیت حذف شد");
        setUserDesCards((prevCards) =>
          prevCards.filter((card) => card.des_card !== cardToDelete)
        );
      })
      .catch((error) => {
        console.error("خطا در حذف کارت", error);
      });
  };

  return (
    <>
      {!currentComponent ? (
        <Box
          maxWidth="full"
          sx={{
            paddingY: 0,
            paddingX: { xs: 1.5, sm: 8, md: 34 },
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
              paddingTop: { xs: 4, sm: 2 },
              paddingBottom: { xs: 13, sm: 12 },
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Paper
                elevation={3}
                sx={{
                  paddingY: { xs: 4, md: 4 },
                  borderRadius: 3,
                  width: "100%",
                  paddingX: { xs: 2.9, sm: 7 },
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ marginBottom: 2 }}
                >
                  <Typography variant="h5" align="start" gutterBottom>
                    کارت به کارت
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<HelpOutlineIcon style={{ fontSize: "13px" }} />}
                    onClick={handleHelpSnackbarOpen}
                    sx={{
                      ml: 2,
                      fontSize: "13px",
                      color:
                        theme.palette.mode === "dark" ? "#abd4f6" : "primary",
                      borderColor:
                        theme.palette.mode === "dark" ? "#abd4f6" : "primary",
                      padding: (0, 0, 0, 2),
                      display: "flex",
                      height: "5px",
                    }}
                  >
                    راهنما
                  </Button>
                </Box>
                <Box sx={{ display: "grid", gap: 0.6, mb: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TextField
                      label={
                        <>
                          کارت مبدا <span style={{ color: "red" }}>*</span>
                        </>
                      }
                      fullWidth
                      name="initialCard"
                      value={formik.values.initialCard}
                      onClick={handleOpenMenuSource}
                      onChange={(e) => {
                        formik.setFieldValue("initialCard", e.target.value);
                        handleCardNumberChange(e);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, DesCardNum)}
                      inputRef={IncardNum}
                      inputProps={{ maxLength: 19 }}
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
                              : theme.palette.mode === "dark"
                              ? "#ffffff"
                              : "grey",
                          "&.Mui-focused": {
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : "#4f4f4f",
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
                          "&.Mui-error": { color: "pink" },
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
                    <Menu
                      anchorEl={anchorElSource}
                      open={Boolean(anchorElSource)}
                      onClose={handleCloseMenuSource}
                      PaperProps={{
                        style: {
                          maxHeight: 200,
                          width: "auto",
                        },
                      }}
                    >
                      {userCards.map((card) => {
                        const firstSixDigits = card.card_number.substring(0, 6);
                        const bank = banks[firstSixDigits];
                        return (
                          <MenuItem
                            key={card.card_number}
                            onClick={() =>
                              handleSelectSourceCard(card.card_number)
                            }
                            style={{
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "#474646"
                                  : "#f3f4f9",

                              paddingY: 0.1,
                              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.01)",
                              fontSize: "0.9rem",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                theme.palette.mode === "dark"
                                  ? "#818181"
                                  : "#e7ecec")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                theme.palette.mode === "dark"
                                  ? "#474646"
                                  : "white")
                            }
                          >
                            {bank && (
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
                            )}
                            {formatCardNumber(card.card_number)}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TextField
                      label={
                        <>
                          به کارت <span style={{ color: "red" }}>*</span>
                        </>
                      }
                      fullWidth
                      name="desCard"
                      value={formik.values.desCard}
                      onClick={handleOpenMenu}
                      autoComplete="off"
                      onChange={(e) => {
                        formik.setFieldValue("desCard", e.target.value);
                        handleDesCardChange(e);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, amountRef)}
                      inputRef={DesCardNum}
                      inputProps={{ maxLength: 19 }}
                      error={
                        isInvalidDesCard ||
                        (formik.touched.desCard &&
                          Boolean(formik.errors.desCard))
                      }
                      helperText={
                        (isInvalidDesCard && "شماره کارت اشتباه است") ||
                        (formik.touched.desCard &&
                        formik.errors.desCard &&
                        formik.errors.desCard.trim() !== ""
                          ? formik.errors.desCard
                          : null)
                      }
                      InputLabelProps={{
                        sx: {
                          color:
                            formik.touched.desCard &&
                            (formik.errors.desCard || isInvalidDesCard)
                              ? "red"
                              : theme.palette.mode === "dark"
                              ? "#ffffff"
                              : "grey",
                          "&.Mui-focused": {
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : "#4f4f4f",
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
                          "&.Mui-error": { color: "pink" },
                          fontSize: "1rem",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          "& fieldset": {
                            borderColor:
                              formik.touched.desCard &&
                              Boolean(formik.errors.desCard) &&
                              isInvalidDesCard
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
                    {userDesCards.length > 0 && (
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        PaperProps={{
                          style: {
                            maxHeight: 200,
                            width: "30ch",
                          },
                        }}
                      >
                        {userDesCards.map((card) => {
                          const firstSixDigits = card.des_card.substring(0, 6);
                          const bank = banks[firstSixDigits];
                          return (
                            <MenuItem
                              key={card.des_card}
                              onClick={() => handleSelectCard(card.des_card)}
                              style={{
                                backgroundColor:
                                  theme.palette.mode === "dark"
                                    ? "#474646"
                                    : "#f3f4f9",
                                paddingY: 0.1,
                                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.01)",
                                fontSize: "0.9rem",
                                transition: "background-color 0.3s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  theme.palette.mode === "dark"
                                    ? "#818181"
                                    : "#e7ecec")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  theme.palette.mode === "dark"
                                    ? "#474646"
                                    : "white")
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                 
                                  }}
                                >
                                  {bank && (
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
                                  )}
                                  {formatCardNumber(card.des_card)}
                                </div>
                                <ClearIcon
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(card.des_card);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    marginRight:4,
                                    marginBottom:2,
                                    fontSize:17,
                                    color: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "#ffffff"
                                        : "#4f4f4f",
                                    "&:hover": {
                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? "#ffffff"
                                          : "red",
                                    },
                                  }}
                                />
                              </div>
                            </MenuItem>
                          );
                        })}
                      </Menu>
                    )}
                  </motion.div>
                  <motion.div {...animationProps}>
                    <TextField
                      label={
                        <>
                          مبلغ <span style={{ color: "red" }}>*</span>
                        </>
                      }
                      variant="outlined"
                      fullWidth
                      name="amount"
                      autoComplete="off"
                      value={formatAmountNumber(formik.values.amount)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, "");
                        formik.setFieldValue("amount", rawValue);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, cvv2Ref)}
                      inputRef={amountRef}
                      inputProps={{ maxLength: 16, inputMode: "numeric" }}
                      error={
                        formik.touched.amount && Boolean(formik.errors.amount)
                      }
                      helperText={formik.touched.amount && formik.errors.amount}
                      InputLabelProps={{
                        sx: {
                          color: (theme) =>
                            theme.palette.mode === "dark" ? "#ffffff" : "grey",
                          textAlign: "center",

                          "&.Mui-focused": {
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : "#4f4f4f",
                            fontSize: {
                              xs: "1.01rem",
                              sm: "1.3rem",
                              md: "1.4rem",
                              lg: "1.5rem",
                            },
                            transform: {
                              xs: "translate(10px, -15px) scale(0.85)",
                              sm: "translate(13px, -14px) scale(0.75)",
                              md: "translate(12px, -14px) scale(0.70)", // برای صفحه متوسط
                              lg: "translate(10px, -22px) scale(0.65)", // برای صفحه بزرگ
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
                                  formik.touched.amount && formik.errors.amount
                                    ? "red"
                                    : "gray",
                              }}
                            >
                              ریال
                            </span>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "10px" },
                      }}
                      sx={{ marginBottom: 2 }}
                    />
                  </motion.div>
                  <motion.div {...animationProps}>
                    <TextField
                      label={
                        <>
                          CVV2 <span style={{ color: "red" }}>*</span>
                        </>
                      }
                      type={showPassword ? "text" : "password"}
                      {...formik.getFieldProps("cvv2")}
                      fullWidth
                      name="cvv2"
                      value={formik.values.cvv2}
                      onBlur={formik.handleBlur}
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
                          color: (theme) =>
                            theme.palette.mode === "dark" ? "#ffffff" : "grey",
                          "&.Mui-focused": {
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : "#4f4f4f",
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
                              style={{ fontSize: "1.2rem" }}
                              sx={{ color: theme.palette.text.primary }}
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
                        sx={{
                          fontSize: "13px",
                          mb: 1,
                          ml: 2,
                          color: (theme) =>
                            theme.palette.mode === "dark" ? "white" : "grey",
                        }}
                      >
                        تاریخ انقضا: <span style={{ color: "red" }}>*</span>
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
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#ffffff"
                                  : "grey",
                              "&.Mui-focused": {
                                color: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#ffffff"
                                    : "grey",
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
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#ffffff"
                                  : "grey",
                              "&.Mui-focused": {
                                color: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#ffffff"
                                    : "grey",
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.saveCard || false}
                      onChange={(event) =>
                        formik.setFieldValue("saveCard", event.target.checked)
                      }
                      name="saveCard"
                      sx={{
                        color:
                          theme.palette.mode === "dark" ? "white" : purple[500],
                        mr: -0.5,
                        "&.Mui-checked": {
                          color:
                            theme.palette.mode === "dark"
                              ? "#e7ecec"
                              : purple[700],
                        },
                      }}
                    />
                  }
                  label="ذخیره‌ی کارت مقصد"
                  sx={{ mt: -4 }}
                />
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
                    type="submit"
                    fullWidth
                    sx={{
                      width: "50%",
                      bgcolor: theme.palette.mode === "dark" ? "white" : "navy",
                      "&:hover": {
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.dark
                            : theme.palette.primary.main,
                        color:
                          theme.palette.mode === "dark"
                            ? "primary.400"
                            : "white",
                      },
                      whiteSpace: "nowrap",
                      fontSize: "0.9rem",
                      color:
                        theme.palette.mode === "dark" ? "primary" : "white",
                    }}
                    onClick={formik.handleSubmit}
                  >
                    تایید و ادامه
                  </Button>

                  <Button
                    onClick={handleBackClick}
                    endIcon={<KeyboardBackspaceIcon />}
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
            <Snackbar
              open={helpSnackbarOpen}
              onClose={handleSnackbarClose}
              autoHideDuration={8000}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  onClick={handleHelpSnackbarClose}
                >
                  ×
                </IconButton>
              }
              sx={{ top: 250, width: { sm: "500px" } }}
            >
              <Alert
                onClose={handleHelpSnackbarClose}
                severity="info"
                sx={{ width: "100%", borderRadius: "20px" }}
              >
                <Typography variant="h5">سرویس انتقال کارت به کارت</Typography>
                <Typography>
                  {" "}
                  به منظور انتقال وجه کارت به کارت، پس از انتخاب کارت مبدا،
                  شماره کارت مقصد را وارد کنید. درصورتی که اطلاعات کارت مقصد بیش
                  از این در موبایل بانک ذخیره شده است، با لمس تصویر مرتبط
                  میتوانید کارت مورد نظر را انتخاب کنید.
                </Typography>
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      ) : (
        <CardTransferForm
          ownerName={ownersName}
          initailCard={initialCard}
          desCard={desCard}
          amount={amount}
        />
      )}
    </>
  );
};

export default Transfer;
