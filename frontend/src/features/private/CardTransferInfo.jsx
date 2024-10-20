import React, { useState , useEffect } from 'react';
import { Button, Typography, Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TbCreditCardPay } from "react-icons/tb";
import CloseIcon from '@mui/icons-material/Close';
import Transfer from './Transfer';
import { motion } from 'framer-motion'; 
import {toPersianNumbers} from '../../util/util'
import {sendOtp , verifyOtp} from '../account/accountSlice';
import { UseAppDispatch } from "../../store/configureStore";
import { toast } from 'react-toastify';
import BankReceipt from './BankReceipt';

const CardTransferForm = ({initailCard , desCard , amount}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);
  const [timer, setTimer] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const dispatch = UseAppDispatch();
  const [showReceipt, setShowReceipt] = useState(false); 
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionDate, setTransactionDate] = useState(null);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
    dispatch(sendOtp())
      .unwrap()
      .then(() => {
        setTimer(120); 
        setIsTimerActive(true);
      })
      .catch(() => {
        setShowTransfer(true);
      });
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} : ${minutes}`;
  };

  const formik = useFormik({
    initialValues: {
      dynamicPassword: '',
    },
    validationSchema: Yup.object({
      dynamicPassword: Yup.string()
        .matches(/^\d{1,5}$/, "رمز پویای معتبر وارد کنید")
        .required("لطفا رمز پویای خود را وارد کنید"),
    }),
    onSubmit: (values) => {
      if (!isTimerActive) {
        toast.error("ابتدا لطفا در خواست ارسال رمز پویا دهید.", { autoClose: 3000 });
        return; 
      }
      const otpPayload = { otp: values.dynamicPassword };
      dispatch(verifyOtp(otpPayload))
        .unwrap()
        .then((response) => {
          setTransactionStatus('success'); 
          setShowReceipt(true);
          setTimer(null);
          setIsTimerActive(false);
          formik.resetForm();
          const transactionDate = response.transaction_date; 
          setTransactionDate(transactionDate);
          console.log(response.transaction_date)
          //toast.success("رمز پویا با موفقیت تایید شد" , {autoClose : 3000});
        })
        .catch((error) => {
          setTransactionStatus('failed');
          setShowReceipt(true);
          const transactionDate = error.error.transaction_date; 
          setTransactionDate(transactionDate);
          const errorMessage = error.error.detail;
          //toast.error(errorMessage , {autoClose:3000});
        });
    },
  });

  if (showReceipt) {
    return <BankReceipt transactionDate={transactionDate} initailCard={initailCard} desCard={desCard} amount={amount} transactionStatus={transactionStatus} />;
  }

  if (showTransfer) {
    return <Transfer />; 
}
const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const banks = {
    603799: { name: "ملی", icon: <img src="/BankIcons/meli.png" alt="ملی" />, iconWidth: "50px",iconHeight: "44px",},
    589210: { name: "سپه", icon: <img src="/BankIcons/sepah.png" alt="سپه" />, iconWidth: "42px",iconHeight: "42px", },
    621986: {
      name: "سامان",
      icon: <img src="/BankIcons/saman.png" alt="سامان" />, iconWidth: "34px",iconHeight: "34px",
    },
    622106: {
      name: "پارسیان",
      icon: <img src="/BankIcons/parsian.png" alt="پارسیان" />, iconWidth: "66px",iconHeight: "66px",
    },
    589463: {
      name: "رفاه کارگران",
      icon: <img src="/BankIcons/refah.png" alt="رفاه کارگران" />, iconWidth: "32px",iconHeight: "32px",
    },
    502229: {
      name: "پاسارگاد",
      icon: <img src="/BankIcons/pasargad.png" alt="پاسارگاد" />, iconWidth: "22px",iconHeight: "30px",
    },
    610433: { name: "ملت", icon: <img src="/BankIcons/melat.png" alt="ملت" />, iconWidth: "30px",iconHeight: "30px", },
  };

  const firstSixDigits = desCard?.replace(/\D/g, '').substring(0, 6);
  const bankInfo = banks[firstSixDigits];

  return (
    
    <Box sx={{

        height: 'auto', 
        paddingBottom:{sm:10}

      }}>
    <Box sx={{ maxWidth: 400, mx: 'auto', paddingY: 3,paddingX:1, borderRadius: 2, boxShadow: 3, bgcolor: 'white' }}>
     <Box 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',  
    mb: 2 ,
    borderBottom:'1px solid gray',
    paddingBottom:1

  }}
>
  
  <Typography 
    variant="h6" 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      fontWeight: 'bold', 
      fontSize: '1.2rem', 
      color: '#1C3AA9'  
    }}
  >
    <TbCreditCardPay style={{ fontSize: '1.5rem', marginLeft: '0.5rem' }} />
    کارت به کارت
  </Typography>

  {/* Close Button */}
  <IconButton 
    aria-label="close" 
    sx={{ 
      color: 'gray'  ,
      fontSize:'1.6rem'
    }}
    onClick={()=>setShowTransfer(true)}
  >
    <CloseIcon />
  </IconButton>
</Box>

      <Box sx={{ mb: 1 , display:'flex' , justifyContent:'space-between'  , borderBottom: '1px dashed gray',paddingY:1, color:'#56575b'}}>
        <Typography variant="body1">مبدا:</Typography>
        <Typography>{toPersianNumbers(initailCard)}</Typography>
      </Box>

      {/* Destination Card */}
      <Box sx={{ mb: 1 , display:'flex' , justifyContent:'space-between' , borderBottom: '1px dashed gray',paddingY:1 , color:'#56575b'}}>
        <Typography variant="body1">مقصد:</Typography>
        <Typography>{toPersianNumbers(desCard)}</Typography>
      </Box>

      {/* Card Holder */}
      <Box sx={{ mb: 1 , display:'flex' , justifyContent:'space-between' , borderBottom: '1px dashed gray',paddingY:1 , color:'#56575b'}}>
        <Typography variant="body1">نام دارنده کارت:</Typography>
        <Typography>صبا بصیری</Typography>
      </Box>

      {/* Static Display for Amount */}
      <Box variant="body1" sx={{ mb: 2 , display:'flex' , justifyContent:'space-between' , borderBottom: '1px dashed gray',paddingY:1 , color:'#56575b'}}>
        مبلغ:
        <Typography> {toPersianNumbers(formatAmount(amount))} ریال </Typography>
            
      </Box>

      {bankInfo ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between', paddingBottom: 0.3, color: '#56575b' }}>
            <Typography variant="body1">نام بانک:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 1 }}>{`بانک ${bankInfo.name}`}</Typography>
              {bankInfo.icon && (
                <img src={bankInfo.icon.props.src} alt={bankInfo.name} width={bankInfo.iconWidth} height={bankInfo.iconHeight} />
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between', paddingBottom: 0.3, color: '#56575b' }}>
            <Typography variant="body1">نام بانک:</Typography>
            <Typography>نامشخص</Typography>
          </Box>
        )}

    
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, justifyContent:'space-between', maxHeight:'200px' , width:'100%'}}>
      <TextField
              label="رمز پویا"
              variant="outlined"
              value={formik.values.dynamicPassword}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              {...formik.getFieldProps('dynamicPassword')}
              error={formik.touched.dynamicPassword && Boolean(formik.errors.dynamicPassword)}
              helperText={formik.touched.dynamicPassword && formik.errors.dynamicPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} style={{ fontSize: '1.2rem', color: 'navy' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: '10px' }
              }}
              InputLabelProps={{
                sx: { color: 'gray', "&.Mui-focused": { color: "#1C3AA9", fontSize: { xs: "0.96rem" } , "&.Mui-error": {
                    color: "pink",
                  }, } }
              }}
              FormHelperTextProps={{
                sx: {
                  height: '1.5rem', 
                  marginTop: '0.5rem',
                }
              }}
              sx={{
                mr: 2, width: '70%' ,
                "& .MuiFormHelperText-root": {
                  position: 'absolute', 
                  bottom: '-1.6rem',
                }
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
            bgcolor: 'navy', 
            borderRadius: '10px', 
            paddingY: 0.2,
            transition: 'opacity 0.3s ease', 
            '&:hover': {
              opacity: 0.5, 
            },
            width:'30%',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
          }}
        >
          <Button 
            sx={{ 
              color: isTimerActive ? 'white' : 'white', 
              borderRadius: '10px', 
              paddingY: 2,
              whiteSpace: 'nowrap',
              bgcolor: isTimerActive ? 'navy' : 'transparent', 
              transition: 'background-color 0.3s ease',
              cursor: isTimerActive ? 'not-allowed' : 'pointer'
            }}
            onClick={handleDynamicPasswordClick}
            disabled={isTimerActive}
          >
            <span style={{color:'white' , fontSize: isTimerActive ? '1.2rem' : '0.9rem' }}>{isTimerActive ? toPersianNumbers(formatTime(timer)) : 'دریافت رمز پویا'}</span>
          </Button>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' , alignItems:'center' , gap:3 , width:'100%'}}>
      <Button  sx={{bgcolor:'navy' , color:'white' , borderRadius: '10px' , width:'50%'  , '&:hover': {
      bgcolor: 'darkblue',  
      opacity: 0.8,  
    },
    '&:active': {
      bgcolor: 'navy',  
      opacity: 1,  
    },
    '&:focus': {
      outline: 'none', 
    },}}
    onClick={formik.handleSubmit} >
          تایید
        </Button>
        <Button sx={{
                  textAlign: "center",
                  width: "50%",
                  py: 1,
                  borderRadius: '10px',
                  border: 1,
                  borderColor: "grey.700",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ":hover": { color: "grey.600" },
                }}
                onClick={()=>setShowTransfer(true)}
                >
          انصراف
        </Button>
        
      </Box>
    </Box>
    </Box>
  );
};

export default CardTransferForm;
