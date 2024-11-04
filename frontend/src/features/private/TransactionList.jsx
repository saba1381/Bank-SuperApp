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
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { RxCheckCircled } from "react-icons/rx";
import { RxCrossCircled } from "react-icons/rx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toPersianNumbers } from "../../util/util";
import { UseAppDispatch, UseAppSelector } from "../../store/configureStore";
import { fetchTransactionsHistory } from "../account/accountSlice";
import { VscSettings } from "react-icons/vsc";
import CustomSnackbar from "./CustomSnackbar";

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
  const loading = UseAppSelector((state) => state.account.loading);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactionsHistory());
  }, [dispatch]);

  //console.log(transactions);

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Box
        sx={{
          padding: 2,
          maxWidth: 600,
          margin: "0 auto",
          backgroundColor: "#f8f9fa",
          maxHeight: "auto",
          minHeight: "auto",
          overflowY: "auto",
          paddingBottom: { xs: 9, sm: 11, md: 13 },
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
          <Typography variant="body2" align="center" sx={{ color: "navy.800" }}>
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
          }}
        >
          <Box
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
              }}
            >
              <VscSettings
                style={{
                  color: "#6200ea",
                  fontSize: "1.38rem",
                }}
              />
            </IconButton>
          </Box>
          
          <TextField
            variant="outlined" 
            size="small" 
            sx={{
              borderRadius: "10px", 
              marginRight: "8px",
              width: "30%",
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "100%", 
              }, 
            }}
            autoComplete="off"
            placeholder="تعداد"
            type="number"
            inputProps={{
              min: 0, 
              max: 300, 
            }}
            onChange={(e) => {
              const value = Math.min(300, Math.max(0, Number(e.target.value)));
              e.target.value = value; 
            }}
          />
        </Box>
        <CustomSnackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          
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
          ) : transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <ListItem sx={{ padding: "12px 10px" }}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: "100%" }}
                  >
                    {/* Status Icon */}
                    <Grid item>
                      {transaction.status ? (
                        <Typography sx={{ color: "green", fontSize: "1.6rem" }}>
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
                        width: "50%",
                        marginLeft: { xs: 0.5, sm: 1 },
                      }}
                    >
                      <Typography sx={{ color: "#363532", fontSize: "0.9rem" }}>
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
                            <Box sx={{ marginRight: "8px" }}>
                              <img
                                src={
                                  getBankInfo(transaction.initialCard).icon
                                    .props.src
                                }
                                alt={getBankInfo(transaction.initialCard).name}
                                width={
                                  getBankInfo(transaction.initialCard).iconWidth
                                }
                                height={
                                  getBankInfo(transaction.initialCard)
                                    .iconHeight
                                }
                              />
                            </Box>
                          )}
                        {transaction.initialCard &&
                          `بانک ${getBankInfo(transaction.initialCard).name}`}
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
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography align="center">هیچ تراکنشی برای شما نیست.</Typography>
          )}
        </List>
        
      </Box>
    </motion.div>
  );
};

export default TransactionList;
