// CustomSnackbar.js
import React from "react";
import {
  Snackbar,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Switch,
  Button,
  IconButton,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CiFilter } from "react-icons/ci";


const CustomSnackbar = ({ open, onClose , onApplyFilter  }) => {
  const [transactionType, setTransactionType] = React.useState("both");

  const handleTransactionTypeChange = (event, newType) => {
    if (newType !== null) {
      setTransactionType(newType);
    }
  };

  const handleApplyClick = () => {
    console.log(transactionType)
    onApplyFilter(transactionType);
    onClose();
  };

  return (
    <>
      <Backdrop
        open={open}
        onClick={onClose}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        //sx={{ width: '100%' }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "400px",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              fontSize: "1.2rem",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              borderBottom: "1px solid #ccc",
              paddingBottom: "8px",
              width: "100%",
              mb: 3,
            }}
          >
            <CiFilter style={{ fontSize: "1.5rem" }} />
            <Typography variant="h6" gutterBottom>
              فیلتر سوابق تراکنش
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              marginBottom: "16px",
              flexDirection: "row",
              gap: 1,
              width: "100%",
              justifyContent: "center",
              fontSize: { sm: "0.8rem" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ mb: 0.6 }}
                style={{ color: "#858585" }}
              >
                نوع تراکنش
              </Typography>
              <ToggleButtonGroup
                value={transactionType}
                exclusive
                onChange={handleTransactionTypeChange}
                sx={{
                  marginBottom: 0.5, // فاصله زیر فیلد را کم کنید
                  height: "48px", // ارتفاع را به صورت دستی تنظیم کنید
                  "& .MuiToggleButton-root": {
                    height: "100%", // ارتفاع دکمه‌ها را همسان کنید
                  },
                }}
              >
                <ToggleButton value="both">هر دو</ToggleButton>
                <ToggleButton value="cardToCard">انتقال وجه</ToggleButton>
                <ToggleButton value="recharge">خرید شارژ</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 0.5,
                fontSize: { sm: "0.8rem" },
              }}
            >
              <Typography
                variant="body1"
                style={{ color: "#858585", marginBottom: 0.9 }}
              >
                تعداد (حداکثر ۳۰۰)
              </Typography>
              <TextField
                type="number"
                variant="outlined"
                //size="small"
                defaultValue="10"
                inputProps={{ min: 1, max: 300 }}
                sx={{
                  borderRadius: "4px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                  },
                  height: { xs: "51px", sm: "50px" },
                  fontSize: { sm: "0.8rem" },
                }}
              />
            </Box>
          </Box>
          {/* 
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Typography>تاریخ</Typography>
            <Switch />
          </Box> */}

          <Button variant="contained" color="primary" onClick={handleApplyClick}>
            اعمال فیلتر
          </Button>
        </Box>
      </Snackbar>
    </>
  );
};

export default CustomSnackbar;
