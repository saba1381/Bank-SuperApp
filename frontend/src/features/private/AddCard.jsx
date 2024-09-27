import React, { useState, useRef , useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography ,Snackbar, Alert} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UseAppDispatch } from '../../store/configureStore';
import { addCard } from '../account/accountSlice';
import { unwrapResult ,unwrap } from '@reduxjs/toolkit';



const AddCard = ({ onBack , onCardAdded }) => {
  const [bankName, setBankName] = useState(''); 
  const [cardNumber, setCardNumber] = useState('');
  const yearInputRef = useRef(null); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  const [isInvalidCard, setIsInvalidCard] = useState(false);
  const [bankColor, setBankColor] = useState('black');  
  const [textColor, setTextColor] = useState('white');
  const dispatch = UseAppDispatch();

  const banks = {
    '603799': { name: 'ملی', icon: <img src="/BankIcons/meli.png" alt="ملی" /> },
    '589210': { name: 'سپه', icon: <img src="/BankIcons/sepah.png" alt="سپه" /> },
    '621986': { name: 'سامان', icon: <img src="/BankIcons/saman.png" alt="سامان" /> },
    '622106': { name: 'پارسیان', icon: <img src="/BankIcons/parsian.png" alt="پارسیان" /> },
    '589463': { name: 'رفاه کارگران', icon: <img src="/BankIcons/refah.png" alt="رفاه کارگران" /> },
    '502229': { name: 'پاسارگاد', icon: <img src="/BankIcons/pasargad.png" alt="پاسارگاد" /> },
    '610433': { name: 'ملت', icon: <img src="/BankIcons/melat.png" alt="ملت" /> },
  };
  

  const bankColors = {
    '603799': '#004d99',
    '589210': '#eead32 ',
    '621986': '#8ae7f9 ', 
    '622106': '#c83a08 ',
    '589463': '#9b14ee ', 
    '502229': '#080808', 
    '610433': '#df117e', 
  };

  const getTextColor = (backgroundColor) => {
    // استفاده از فرمول نسبت روشنایی برای تشخیص روشن یا تیره بودن رنگ
    const color = backgroundColor.substring(1); // حذف علامت #
    const rgb = parseInt(color, 16); 
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? 'black' : 'white'; 
  };

  const formatCardNumber = (number) => {
    return number.replace(/\D/g, '')
      .replace(/(.{4})/g, '$1-')
      .replace(/-$/, '');
  };

  const toPersianDigits = (number) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return number.replace(/\d/g, (d) => persianDigits[d]);
  };



  const handleCardNumberChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ''); 
    if (inputValue.length > 16) return;

    const formattedNumber = formatCardNumber(inputValue);
    formik.setFieldValue('cardNumber', formattedNumber);

    const firstSixDigits = inputValue.substring(0, 6);
    const bank = banks[firstSixDigits];

    if (inputValue.length >= 6) {
        if (bank) {
            if (bankName !== bank.name) {  
                setBankName(bank.name);
                const color = bankColors[firstSixDigits] || 'red'; 
                setBankColor(color); 
                setTextColor(getTextColor(color));
                setIsInvalidCard(false);  
            }
        } else {
            if (bankName !== 'کارت ناشناخته است') { 
                setBankName('کارت ناشناخته است');
                setIsInvalidCard(true);  
            }
        }
    } else {
        if (bankName !== '') { 
            setBankName(''); 
            setIsInvalidCard(false);  
        }
    }
};



  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      name: '',
      cardMonth: '',
      cardYear: ''
    },
    validationSchema: Yup.object({
      cardNumber: Yup.string()
        .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, 'شماره کارت خود را کامل وارد کنید.')
        .required('شماره کارت الزامی است'),
        name: Yup.string()
        .matches(/^[\u0600-\u06FF\s]+$/, 'نام و نام خانوادگی باید فارسی باشد')  
        .test('has-two-parts', 'لطفا نام و نام خانوادگی خود را کامل وارد کنید', function (value) {
          return value && value.trim().split(/\s+/).length >= 2;  
        })
        .required('نام و نام خانوادگی الزامی است'),
      cardMonth: Yup.string()
        .matches(/^\d{1,2}$/, 'ماه باید یک یا دو رقمی باشد')
        .test('length', 'ماه باید دو رقمی باشد', (val) => val.length === 2)
        .test('month', 'ماه باید بین 1 تا 12 باشد', (val) => parseInt(val, 10) >= 1 && parseInt(val, 10) <= 12)
        .required('ماه الزامی است'),
      cardYear: Yup.string()
        .matches(/^\d{2}$/, 'سال باید دو رقمی باشد')
        .required('سال الزامی است')
    }),
    onSubmit: async (values) => {
      try {
        
        const cardData = {
          card_number: values.cardNumber.replace(/-/g, ''), 
          full_name: values.name,
          expiration_month: values.cardMonth,
          expiration_year: values.cardYear,
          bank_name: bankName 
        };
        
        await dispatch(addCard(cardData)).unwrap(); 

        setSnackbarMessage('کارت با موفقیت ثبت شد');
       setSnackbarOpen(true);
        setSnackbarSeverity('success');
        formik.resetForm();
        setBankName('');
        onCardAdded();
        setTimeout(() => {
          onBack();  
        }, 4000);
        
      } catch (error) {
        setSnackbarMessage(error.error);
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        formik.resetForm();
        setBankName('');
      }
    }
    
  });

  const handleMonthChange = (e) => {
    formik.handleChange(e);
    if (e.target.value.length === 2) {
      yearInputRef.current.focus(); 
    }
  };



  return (
    <Box maxWidth="full">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end'}}>
        <Button variant="contained" color="primary" onClick={onBack} endIcon={<KeyboardBackspaceIcon />}>
          بازگشت
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          mb: 2,
          
        }}
      >
       
          <form onSubmit={formik.handleSubmit}>
            <Paper elevation={3} sx={{ p: {xs:2 , md:4}, borderRadius: 6 ,width:'100%'}}>
              <Typography
                variant="h4"
                sx={{
                  mb: 1,
                  textAlign: 'center',
                  fontSize: {
                    xs: '1.3rem',
                    sm: '2rem',
                    md: '1.7rem',
                  },
                  color: 'black'
                }}
              >
                ثبت کارت جدید
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  textAlign: 'center',
                  fontSize: '0.6rem',
                  color: 'gray'
                }}
              >
                برای تعریف کارت جدید در موبایل بانک، اطلاعات زیر را وارد کنید.
              </Typography>
              <Box sx={{ display: 'grid', gap: 2, mb: 4 }}>
              <TextField
  label="شماره کارت"
  fullWidth
  name="cardNumber"
  value={formik.values.cardNumber}
  onChange={handleCardNumberChange}
  inputProps={{ maxLength: 19 }}
  error={isInvalidCard || (formik.touched.cardNumber && Boolean(formik.errors.cardNumber))}
  helperText={(isInvalidCard && 'شماره کارت اشتباه است') || (formik.touched.cardNumber && formik.errors.cardNumber)}
  InputLabelProps={{
    sx: {
      color: isInvalidCard ? 'red' : 'lightgrey', 
    }
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: isInvalidCard ? 'red' : '', 
      }
    },
    textAlign:'center',
    justifyContent:'center'
  }}
/>

<TextField
  label="نام بانک"
  fullWidth
  value={bankName}
  InputProps={{ readOnly: true }}
  error={isInvalidCard}
  InputLabelProps={{
    sx: {
      color: isInvalidCard ? 'red' : 'lightgrey', 
    }
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: isInvalidCard ? 'red' : '', 
      }
    }
  }}
/>

                <TextField
                  label="نام و نام خانوادگی"
                  fullWidth
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  inputProps={{ maxLength: 15 }}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  InputLabelProps={{
                    sx: {
                      color: 'lightgrey',
                    }
                  }}
                />
                <Box sx={{}}>
                 <Typography sx={{fontSize:'13px' , mb:1 , ml:2 , color:'gray'}}>تاریخ انقضا:</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
               
                  <TextField
                    label="ماه"
                    fullWidth
                    name="cardMonth"
                    value={formik.values.cardMonth}
                    onChange={handleMonthChange}
                    inputProps={{ maxLength: 2 }}
                    error={formik.touched.cardMonth && Boolean(formik.errors.cardMonth)}
                    helperText={formik.touched.cardMonth && formik.errors.cardMonth}
                    InputLabelProps={{
                      sx: {
                        color: 'lightgrey',
                      }
                    }}
                  />
                  <Typography sx={{fontSize:'25px'}}>/</Typography>
                  <TextField
                    label="سال"
                    fullWidth
                    name="cardYear"
                    value={formik.values.cardYear}
                    onChange={formik.handleChange}
                    inputProps={{ maxLength: 2 }}
                    inputRef={yearInputRef}
                    error={formik.touched.cardYear && Boolean(formik.errors.cardYear)}
                    helperText={formik.touched.cardYear && formik.errors.cardYear}
                    InputLabelProps={{
                      sx: {
                        color: 'lightgrey',
                      }
                    }}
                  />
                </Box>
              </Box>
              </Box>
              {bankName && formik.values.cardNumber.replace(/\D/g, '').length >= 6 && !isInvalidCard &&(

             
<Paper
sx={{
paddingX: 6,
paddingY:2 ,
backgroundColor: bankColor,  
color: 'white',
borderRadius: 6,
boxShadow: 3,
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
gap: 1,
mb: 2,
position: 'relative', 
}}
>

<Typography variant="h5" sx={{ color: textColor}}>
{formik.values.cardNumber ? toPersianDigits(formik.values.cardNumber) : '•••• •••• •••• ••••'}
</Typography>

<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
<Typography variant="body2" sx={{ flexGrow: 1 ,  color: textColor }}>
{formik.values.cardYear && formik.values.cardMonth
? toPersianDigits(`تاریخ انقضا: ${formik.values.cardYear}/${formik.values.cardMonth}`)
: ''}
</Typography>
<Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'right' ,  color: textColor  }}>
{formik.values.name}
</Typography>
</Box>

</Paper>



              )}
          

              <Button variant="contained" color="primary" type="submit" fullWidth sx={{ p: 3 }}>
                ثبت کارت جدید
              </Button>
            </Paper>
          </form>
          <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Box>
    </Box>
  );
};

export default AddCard;
