import React, { useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { toPersianNumbers } from "../../../util/util";
import TransactionList from "../TransactionList";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ShareIcon from "@mui/icons-material/Share";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const RechargeReciept = ({
  transactionDate,
  initialCard,
  amount,
  transactionStatus,
  mobileNumber,
  onBack,
}) => {
  const navigate = useNavigate();
  const [showTransaction, setShowTransaction] = useState(false);
  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      iconWidth: "25px",
      iconHeight: "25px",
    },
    502229: {
      name: "پاسارگاد",
      icon: <img src="/BankIcons/pasargad.png" alt="پاسارگاد" />,
      iconWidth: "22px",
      iconHeight: "29px",
    },
    610433: {
      name: "ملت",
      icon: <img src="/BankIcons/melat.png" alt="ملت" />,
      iconWidth: "30px",
      iconHeight: "30px",
    },
  };

  const getBankInfo = (cardNumber) => {
    const firstSixDigits = cardNumber?.replace(/\D/g, "").substring(0, 6);
    return banks[firstSixDigits];
  };

  const getOperator = (mobile) => {
    const prefix = mobile.substring(0, 4);
    if (["0910", "0911", "0912" , "0919" , "0913" , "0914" , "0915" , "0916" , "0917" , "0918" , "0991" , "0992" , "0993"].includes(prefix)) {
      return { name: "همراه اول", color: "#a0eaf5", textColor: "#3d4849" , logo: "/OPIcons/hamrah.png"};
    } else if (["0935", "0936", "0937" , "0938" , "0939" , "0901" , "0902" , "0903" , "0904" , "0905"].includes(prefix)) {
      return { name: "ایرانسل", color: "#f4c403", textColor: "#445355" , logo: "/OPIcons/irancell.png"};
    } else if (["0920", "0921" , "0922" , "0923"].includes(prefix)) {
      return { name: "رایتل", color: "#800080", textColor: "#fff" , logo: "/OPIcons/rightel.png"};
    } else {
      return { name: "اپراتور ناشناخته", color: "#bdbdbd" };
    }
  };
  const operatorInfo = getOperator(mobileNumber);

  const initailBankInfo = getBankInfo(initialCard);

  if (showTransaction) {
    return <TransactionList />;
  }
  const maskCardNumber = (cardNumber) => {
    return `\u200E${cardNumber.slice(0, 7)}${cardNumber
      .slice(7, -4)
      .replace(/\d/g, "*")}${cardNumber.slice(-4)}`;
  };
  const formatCardNumber = (cardNumber) => {
    return cardNumber.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1-");
  };

  const shareInfo = `\u200Fتاریخ:  ${toPersianNumbers(
    transactionDate
  )} \nکارت : ${initialCard}\n \n مبلغ: ${toPersianNumbers(
    formatAmount(amount)
  )} ریال`;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "رسید تراکنش",
          text: shareInfo,
        })
        .then(() => console.log("اشتراک‌گذاری موفق بود"))
        .catch((error) => console.log("خطا در اشتراک‌گذاری:", error));
    } else {
      toast.error("مرورگر شما از قابلیت اشتراک‌گذاری پشتیبانی نمی‌کند.");
    }
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
      <Container
        sx={{
          height: { xs: "auto", sm: "100vh" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: { xs: 20, sm: 46 },
          paddingTop: { xs: 10, sm: 38 },
        }}
      >
        <Box
          sx={{
            maxWidth: 500,
            width: { xs: 500, sm: 400 },
            mx: "auto",
            paddingY: 0,
            paddingX: 0,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#d0d0d0 " : "white",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: transactionStatus === true ? "green" : "red",
                border: `1.4px solid ${
                  transactionStatus === true ? "#569f4b" : "red"
                }`,
                borderRadius: "4px",
                p: 2,
              }}
            >
              {transactionStatus === true ? (
                <CheckCircleIcon sx={{ color: (theme) =>
                  theme.palette.mode === "dark" ? "#356d2d" : "green", marginRight: "8px" }} />
              ) : (
                <CancelIcon sx={{ color: "red", marginRight: "8px" }} />
              )}
              {transactionStatus === true ? "درخواست موفق" : "درخواست ناموفق"}
            </Typography>
          </Box>

          <Box sx={{ paddingY: 2, paddingX: 1.2 }}>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,
              }}
            >
              <Typography sx={{ fontSize: "1.2rem" }}>نوع تراکنش:</Typography>
              <Typography sx={{ fontSize: "1.1rem" }}>خرید شارژ</Typography>
            </Box>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,
              }}
            >
              <Typography sx={{ fontSize: "1.2rem" }}>تاریخ:</Typography>
              <Typography sx={{ fontSize: "1.1rem" }}>
                {toPersianNumbers(transactionDate)}
              </Typography>
            </Box>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,
              }}
            >
              <Typography sx={{ fontSize: "1.2rem" }}>مبلغ:</Typography>
              <Typography sx={{ fontSize: "1.1rem" }}>
                {toPersianNumbers(formatAmount(amount))} ریال
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,
              }}
            >
              <Typography sx={{ fontSize: "1.2rem" }}>شماره کارت :</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: "1.1rem" }}>
                  {initialCard
                    ? toPersianNumbers(
                        maskCardNumber(formatCardNumber(initialCard))
                      )
                    : "شماره کارت یافت نشد"}
                </Typography>
                {initailBankInfo?.icon && (
                  <Box sx={{ marginLeft: "4px" }}>
                    <img
                      src={initailBankInfo.icon.props.src}
                      alt={initailBankInfo.name}
                      width={initailBankInfo.iconWidth}
                      height={initailBankInfo.iconHeight}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,
              }}
            >
              <Typography sx={{ fontSize: "1.2rem" }}>نام بانک :</Typography>
              <Typography sx={{ fontSize: "1.1rem" }}>{initialCard ?`بانک ${
                getBankInfo(initialCard).name || 'نا مشخص'
              }` : 'نام بانک یافت نشد'}</Typography>
            </Box>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,
              }}
            >
              <Typography sx={{ fontSize: "1.2rem" }}>شماره موبایل:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' , gap:1 }}>
              <Typography sx={{ fontSize: "1.1rem" }}>
                {toPersianNumbers(mobileNumber)}
              </Typography>
              <Box sx={{  }}>
          <img src={operatorInfo.logo}
                  alt={`${operatorInfo.name} logo`}
                  style={{
                    width:'35px',
                    height:'35px',
                    borderRadius:'10px'
                  }}
                  />
            </Box>
            </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingY: 1,
                color: transactionStatus === true ? "green" : "#56575b",
              }}
            >
              <Typography sx={{ fontSize: "1.2rem" }}>اشتراک گذاری</Typography>
              <ShareIcon
                onClick={handleShare}
                style={{
                  marginRight: "10px",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              />
            </Box>

            <Button
              sx={{
                mt: 1,
                textAlign: "center",
                width: "100%",
                py: 1,
                borderRadius: "10px",
                border: 1,
                borderColor: "grey.700",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1rem" },
                ":hover": { color: "grey.600" },
              }}
              onClick={() => setShowTransaction(true)}
            >
              بازگشت
            </Button>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};

export default RechargeReciept;
