import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, Container } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddCard = ({ onBack }) => {
  const [cardNumber, setCardNumber] = useState('');
  const yearInputRef = useRef(null); // Ref برای فیلد سال

  const formatCardNumber = (number) => {
    return number.replace(/\D/g, '')
      .replace(/(.{4})/g, '$1-')
      .replace(/-$/, '');
  };

  const toPersianDigits = (number) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return number.replace(/\d/g, (d) => persianDigits[d]);
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
        .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, 'شماره کارت باید 16 رقم باشد')
        .required('شماره کارت الزامی است'),
      name: Yup.string()
        .matches(/^[\u0600-\u06FF\s]+$/, 'نام و نام خانوادگی باید فارسی باشد')
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
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
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
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
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
                  onChange={(e) => {
                    const formattedNumber = formatCardNumber(e.target.value);
                    formik.setFieldValue('cardNumber', formattedNumber);
                  }}
                  inputProps={{ maxLength: 19 }}
                  error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                  helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                  InputLabelProps={{
                    sx: {
                      color: 'lightgrey',
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
                <Box sx={{ display: 'flex', gap: 2 }}>
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

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Paper
                  sx={{
                    p: 4,
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: 6,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    mb: 4,
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#ffbf00' }}>
                    {formik.values.cardNumber ? toPersianDigits(formik.values.cardNumber) : '•••• •••• •••• ••••'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {formik.values.cardYear && formik.values.cardMonth
                        ? toPersianDigits(`تاریخ انقضا: ${formik.values.cardYear}/${formik.values.cardMonth}`)
                        : ''}
                    </Typography>
                    <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'right' }}>
                      {formik.values.name}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>

              <Button variant="contained" color="primary" type="submit" fullWidth sx={{ p: 3 }}>
                ثبت کارت جدید
              </Button>
            </Paper>
          </form>
       
      </Box>
    </Box>
  );
};

export default AddCard;
