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
  fetchSavedDesCards,
  deleteDesCard,
} from "../account/accountSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { UseAppDispatch, UseAppSelector } from "../../store/configureStore";
import CardTransferForm from "./CardTransferInfo";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import { RiSimCard2Fill } from "react-icons/ri";
import {toPersianNumbers} from '../../util/util'

const Charging = () => {
  const [bankName, setBankName] = useState("");
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
  const [selectedOperator, setSelectedOperator] = useState("همراه اول");
  const amountOptions = ["10000", "50000", "100000", "200000", "500000", "1000000"];

  const handleButtonClick = () => {
    setCurrentComponent("cardTransfer");
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

  const toPersianDigits = (number) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return number.replace(/\d/g, (d) => persianDigits[d]);
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
      mobile: "",
      amount: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .matches(/^091\d{8}$/, "شماره موبایل معتبر وارد کنید ")
        .required("شماره موبایل را وارد کنید"),
      amount: Yup.string()
        .matches(/^\d{1,16}$/, "مبلغ را به درستی وارد کنید")
        .required("مبلغ را به ریال وارد کنید")
        .max(16, "مبلغ نمی‌تواند بیشتر از ۱۶ رقم باشد"),
    }),
    onSubmit: async (values) => {
      setCurrentComponent(true);
      //   if (isInvalidCard || isInvalidDesCard) {
      //     formik.setTouched({
      //       initialCard: true,
      //       desCard: true,
      //     });
      //     return;
      //   }

      //   const errors = await formik.validateForm();

      //   if (Object.keys(errors).length > 0) {
      //     formik.setTouched({
      //       amount: true,
      //     });
      //     return;
      //   }
      //   const formattedValues = {
      //     ...values,
      //     initialCard: values.initialCard.replace(/-/g, ""),
      //     desCard: values.desCard.replace(/-/g, ""),
      //   };
      //   dispatch(transferCard(formattedValues))
      //     .unwrap()
      //     .then((response) => {
      //       setCurrentComponent(true);
      //     //   setInitialCard(values.initialCard);
      //     //   setDesCard(values.desCard);
      //     //   setAmount(values.amount);
      //     //   const cardsName = response.desCard_owner;
      //     //   setOwnersName(cardsName);

      //       if (values.saveCard) {
      //         dispatch(
      //           saveDesCard({ des_card: values.desCard.replace(/-/g, "") })
      //         ).catch((error) => {
      //           toast.error("Failed to save card", { autoClose: 3000 });
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       const errorMessage = error.error.detail;
      //       if (errorMessage.includes("مبدا")) {
      //         formik.setFieldError("initialCard", " ");
      //       }
      //       if (errorMessage.includes("مقصد")) {
      //         formik.setFieldError("desCard", " ");
      //       }
      //       toast.error(errorMessage, { autoClose: 3000 });
      //     });
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
    return toPersianNumbers(formattedValue);
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
            paddingY: { xs: 8, sm: 0 },
            paddingX: { xs: 1.5, sm: 18, md: 34 },
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
                  paddingX: { xs: 2.9, sm: 4 , md:6 },
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
                      onChange={formik.handleChange}
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
                                  formik.touched.amount && formik.errors.amount
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
            inputRef={amountRef}
            inputProps={{
              ...params.inputProps,
              maxLength: 16,
              inputMode: "numeric",
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

export default Charging;
