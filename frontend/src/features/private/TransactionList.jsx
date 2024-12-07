import React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  List,
  ListItem,
  Divider,
  IconButton,
  Snackbar,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FiEdit } from "react-icons/fi";
import { RxCheckCircled } from "react-icons/rx";
import { RxCrossCircled } from "react-icons/rx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toPersianNumbers } from "../../util/util";
import { UseAppDispatch, UseAppSelector } from "../../store/configureStore";
import {
  fetchTransactionsHistory,
  fetchTransactionsCardToCard,
  fetchTransactionsRecharge,
  DeleteTransaction,
} from "../account/accountSlice";
import { VscSettings } from "react-icons/vsc";
import CustomSnackbar from "./CustomSnackbar";
import CardToCardReciept from "./TransactionHistory/CardToCardReciept";
import RechargeReciept from "./TransactionHistory/RechargeReceipt";

const banks = {
  603799: {
    name: "ملی",
    icon: <img src="/BankIcons/meli.png" alt="ملی" />,
    iconWidth: "45px",
    iconHeight: "45px",
  },
  589210: {
    name: "سپه",
    icon: <img src="/BankIcons/sepah.png" alt="سپه" />,
    iconWidth: "38px",
    iconHeight: "38px",
  },
  621986: {
    name: "سامان",
    icon: <img src="/BankIcons/saman.png" alt="سامان" />,
    iconWidth: "30px",
    iconHeight: "30px",
  },
  622106: {
    name: "پارسیان",
    icon: <img src="/BankIcons/parsian.png" alt="پارسیان" />,
    iconWidth: "60px",
    iconHeight: "60px",
  },
  589463: {
    name: "رفاه کارگران",
    icon: <img src="/BankIcons/refah.png" alt="رفاه کارگران" />,
    iconWidth: "18px",
    iconHeight: "20px",
  },
  502229: {
    name: "پاسارگاد",
    icon: <img src="/BankIcons/pasargad.png" alt="پاسارگاد" />,
    iconWidth: "20px",
    iconHeight: "28px",
  },
  610433: {
    name: "ملت",
    icon: <img src="/BankIcons/melat.png" alt="ملت" />,
    iconWidth: "25px",
    iconHeight: "25px",
  },
};

const TransactionList = () => {
  const dispatch = UseAppDispatch();
  const navigate = useNavigate();

  const transactions = UseAppSelector((state) => state.account.transactions);
  const loading = UseAppSelector((state) => state.account.isLoading);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("both");
  const [transactionCount, setTransactionCount] = useState(0);
  const [prevTransactionType, setPrevTransactionType] = useState("both");
  const [currentComponent, setCurrentComponent] = useState(false);

  const handleApplyFilter = (selectedType, count) => {
    console.log(selectedType, count);
    setTransactionType(selectedType);
    setTransactionCount(count);
  };
  const fetchTransactions = () => {
    if (transactionType === "cardToCard") {
      dispatch(fetchTransactionsCardToCard(transactionCount));
    } else if (transactionType === "recharge") {
      dispatch(fetchTransactionsRecharge(transactionCount));
    } else {
      dispatch(fetchTransactionsHistory(transactionCount));
    }
  };

  useEffect(() => {
    if (transactionType !== prevTransactionType) {
      setTransactionCount(0);
      setPrevTransactionType(transactionType);
    }
  }, [transactionType, prevTransactionType]);

  useEffect(() => {
    fetchTransactions();
  }, [dispatch, transactionType, transactionCount]);

  useEffect(() => {
    if (transactionCount > 0) {
      if (transactionType === "cardToCard") {
        dispatch(fetchTransactionsCardToCard(transactionCount));
      } else if (transactionType === "recharge") {
        dispatch(fetchTransactionsRecharge(transactionCount));
      } else {
        dispatch(fetchTransactionsHistory(transactionCount));
      }
      //setTransactionCount(0);
    }
  }, [dispatch, transactionType, transactionCount]);
  const handleTransactionCountChange = (e) => {
    const value = Math.min(300, Math.max(0, Number(e.target.value)));
    setTransactionCount(value);
  };

  const filteredTransactions =
    transactionCount > 0
      ? transactions.slice(0, transactionCount)
      : transactions;

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const pageTransition = {
    type: "spring",
    stiffness: 50,
    damping: 20,
  };

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getBankInfo = (cardNumber) => {
    const firstSixDigits = cardNumber?.replace(/\D/g, "").substring(0, 6);
    return banks[firstSixDigits];
  };

  const handleSettingsClick = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleDetails = (transaction) => {
    if (transaction.transaction_type === "card_to_card") {
      console.log(transaction);
      setCurrentComponent(
        <CardToCardReciept
          ownerName={transaction.desCardOwner}
          initialCard={transaction.initialCard}
          desCard={transaction.desCard}
          amount={transaction.amount}
          transactionStatus={transaction.status}
          transactionDate={transaction.created_at}
          onBack={() => setCurrentComponent(false)}
        />
      );
    } else if (transaction.transaction_type === "recharge") {
      console.log(transaction);
      setCurrentComponent(
        <RechargeReciept
          initialCard={transaction.card_number}
          amount={transaction.amount}
          transactionStatus={transaction.status}
          transactionDate={transaction.timestamp}
          mobileNumber={transaction.mobile_number}
          onBack={() => setCurrentComponent(false)}
        />
      );
    }
  };

  const handleDelete = (transactionId) => {
    dispatch(DeleteTransaction(transactionId))
      .unwrap()
      .then(() => {
        fetchTransactions();
      })
      .catch((error) => {});
  };

  const handleTransactionTypeChange = (event, newType) => {
    if (newType !== null) {
      setTransactionType(newType);
    }
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      transition={pageTransition}
    >
      {!currentComponent ? (
        <Box
          sx={{
            padding: 2,
            maxWidth: 600,
            margin: "0 auto",
            //backgroundColor: "#f8f9fa",
            maxHeight: "auto",
            minHeight: "auto",
            overflowY: "auto",
            paddingBottom: { xs: "20%", sm: 11, md: 13 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#6200ea",
              padding: "16px",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#fff", flexGrow: 1, textAlign: "center" }}
            >
              سوابق تراکنش
            </Typography>
            <IconButton onClick={() => navigate("/cp")}>
              <ArrowBack
                sx={{
                  color: "#fff",
                  fontSize: { xs: "1.5rem", sm: "1.2rem" },
                  marginLeft: -1.7,
                }}
              />
            </IconButton>
          </Box>

          <Card
            sx={{
              marginTop: 2,
              padding: 2,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "navy.800" }}
            >
              این اطلاعات شامل سوابق عملیات تراکنش شما در موبایل بانک است
            </Typography>
          </Card>
          <Box
            sx={{
              display: "flex",
              mt: 1,
              width: "100%",
              gap: 1,
              alignItems: "center",
              paddingTop: 2,
              justifyContent: "center",
            }}
          >
            {/* <Box
            sx={{
              display: "flex",
              justifyContent: "center",

              width: "20%",
              bgcolor: "#ebebeb",
              borderRadius: "20px",
              "&:hover": {
                bgcolor: "#d3d3d3",
              },
              cursor: "pointer",
              border: "1px solid #d6d6d6",
            }}
          >
            <IconButton
              onClick={handleSettingsClick}
              sx={{
                color: "#6200ea",
                "&:hover": {
                  color: "grey",
                },
                height: "40px",
                width: "40px",
                borderColor: "grey",
              }}
            >
              <VscSettings
                style={{
                  color: "#6200ea",
                  fontSize: "1.38rem",
                }}
              />
            </IconButton>
          </Box> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* <Typography
                variant="body1"
                sx={{ mb: 0.6 }}
                style={{ color: "#858585" }}
              >
                نوع تراکنش
              </Typography> */}
              <ToggleButtonGroup
                value={transactionType}
                exclusive
                onChange={handleTransactionTypeChange}
                sx={{
                  marginBottom: 0.5,
                  height: "48px",
                  "& .MuiToggleButton-root": {
                    height: "100%",
                  },
                }}
              >
                <ToggleButton value="both">هر دو</ToggleButton>
                <ToggleButton value="cardToCard">انتقال وجه</ToggleButton>
                <ToggleButton value="recharge">خرید شارژ</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <TextField
              variant="outlined"
              //size="small"
              value={transactionCount === 0 ? "" : transactionCount}
              sx={{
                borderRadius: "10px",
                marginRight: "8px",
                width: "30%",
                height: "40px",
                "& .MuiOutlinedInput-root": {
                  height: "100%",
                },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                },
                height: { xs: "52px", sm: "52px" },
              }}
              autoComplete="off"
              placeholder="تعداد"
              type="number"
              inputProps={{
                min: 0,
                max: 300,
              }}
              onChange={handleTransactionCountChange}
            />
          </Box>
          <CustomSnackbar
            open={snackbarOpen}
            onClose={handleSnackbarClose}
            onApplyFilter={handleApplyFilter}
            transactionCount={transactionCount}
          />

          <List
            sx={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              marginTop: 2,
            }}
          >
            {loading ? (
              <Typography align="center">در حال بارگذاری...</Typography>
            ) : filteredTransactions && filteredTransactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <ListItem sx={{ padding: "10px 10px" }}>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      {/* Status Icon */}
                      <Grid item>
                        {transaction.status ? (
                          <Typography
                            sx={{ color: "green", fontSize: "1.3rem" }}
                          >
                            <RxCheckCircled />
                          </Typography>
                        ) : (
                          <Typography sx={{ color: "red", fontSize: "1.5rem" }}>
                            <RxCrossCircled />
                          </Typography>
                        )}
                      </Grid>
                      {/* bank's name and Type */}
                      <Grid
                        item
                        xs={5}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          width: "60%",
                          marginLeft: { xs: 0.1, sm: 1 },
                        }}
                      >
                        <Typography
                          sx={{ color: "#363532", fontSize: "0.9rem" }}
                        >
                          {transaction.transaction_type === "recharge"
                            ? "خرید شارژ"
                            : "انتقال وجه"}{" "}
                          {transaction.desCardOwner &&
                            ` - ${transaction.desCardOwner}`}
                        </Typography>
                        <Typography
                          sx={{
                            color: "grey",
                            fontSize: "0.8rem",
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 1,
                          }}
                        >
                          {transaction.initialCard &&
                            getBankInfo(transaction.initialCard)?.icon && (
                              <Box sx={{ marginRight: "3px" }}>
                                <img
                                  src={
                                    getBankInfo(transaction.initialCard).icon
                                      .props.src
                                  }
                                  alt={
                                    getBankInfo(transaction.initialCard).name
                                  }
                                  width={
                                    getBankInfo(transaction.initialCard)
                                      .iconWidth
                                  }
                                  height={
                                    getBankInfo(transaction.initialCard)
                                      .iconHeight
                                  }
                                />
                              </Box>
                            )}
                          {transaction.card_number &&
                            getBankInfo(transaction.card_number)?.icon && (
                              <Box sx={{ marginRight: "8px" }}>
                                <img
                                  src={
                                    getBankInfo(transaction.card_number).icon
                                      .props.src
                                  }
                                  alt={
                                    getBankInfo(transaction.card_number).name
                                  }
                                  width={
                                    getBankInfo(transaction.card_number)
                                      .iconWidth
                                  }
                                  height={
                                    getBankInfo(transaction.card_number)
                                      .iconHeight
                                  }
                                />
                              </Box>
                            )}
                          {transaction.initialCard &&
                            `بانک ${getBankInfo(transaction.initialCard).name}`}
                          {transaction.card_number &&
                            `بانک ${getBankInfo(transaction.card_number).name}`}
                        </Typography>
                      </Grid>

                      {/* Date and Time and amount*/}
                      <Grid
                        item
                        xs={6}
                        textAlign="right"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            color: "#56575b",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              color: transaction.status ? "green" : "red",
                              fontWeight: "bold",
                              fontSize: "0.98rem",
                            }}
                          >
                            {toPersianNumbers(formatAmount(transaction.amount))}{" "}
                            ریال
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#363532", fontSize: "0.9rem" }}
                        >
                          {transaction.created_at
                            ? toPersianNumbers(transaction.created_at)
                            : toPersianNumbers(transaction.timestamp)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "10px",
                      paddingLeft: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(transaction.id)}
                      sx={{
                        flexGrow: 1,
                        borderTopLeftRadius: "4px",
                        borderBottomLeftRadius: "4px",
                        borderBottomRightRadius: "0px",
                        borderTopRightRadius: "0px",
                        bgcolor: "#f1f1f1",
                        color: "#0e5ec4",
                        borderRightColor: "#d6d6d6",
                        borderLeft: "none",
                        borderTop: "none",
                        borderBottom: "none",
                        "&:hover": {
                          bgcolor: "#d6d6d6",
                          borderColor: "#d6d6d6",
                          color: "#0e5ec4",
                          borderLeft: "none",
                          borderTop: "none",
                          borderBottom: "none",
                        },
                      }}
                    >
                      حذف
                    </Button>
                    <Button
                      //variant="outlined"
                      startIcon={<FiEdit />}
                      onClick={() => handleDetails(transaction)}
                      sx={{
                        flexGrow: 1,
                        marginRight: 1,
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                        borderBottomLeftRadius: "0px",
                        borderTopLeftRadius: "0px",
                        bgcolor: "#f1f1f1",
                        color: "#0e5ec4",
                        borderColor: "#717070",
                        "&:hover": {
                          bgcolor: "#d6d6d6",
                        },
                      }}
                    >
                      جزئیات
                    </Button>
                  </Box>
                  {index < filteredTransactions.length -1 && (
                    <Divider
                      sx={{ borderWidth: "7px", borderColor: "#f8f8f8" }}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              <Typography align="center">هیچ تراکنشی برای شما نیست.</Typography>
            )}
          </List>
        </Box>
      ) : (
        currentComponent
      )}
    </motion.div>
  );
};

export default TransactionList;
