import React, { useState } from 'react';
import { Button, Typography, Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TbCreditCardPay } from "react-icons/tb";
import CloseIcon from '@mui/icons-material/Close';
import Transfer from './Transfer';
import { motion } from 'framer-motion'; 

const CardTransferForm = ({initailCard , desCard , amount}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
      console.log(values);
      // You can handle form submission here
    },
  });
  if (showTransfer) {
    return <Transfer />; 
}
const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    
    <Box sx={{
        overflowY: 'auto',  
        height: 'auto', 
        paddingBottom:{sm:10}

      }}>
    <Box sx={{ maxWidth: 400, mx: 'auto', paddingY: 3,paddingX:1.5, borderRadius: 2, boxShadow: 3, bgcolor: 'white' }}>
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

      <Box sx={{ mb: 1 , display:'flex' , justifyContent:'space-between'  , borderBottom: '1px dashed gray',paddingY:1}}>
        <Typography variant="body1">کارت مبدا:</Typography>
        <Typography>{initailCard}</Typography>
      </Box>

      {/* Destination Card */}
      <Box sx={{ mb: 1 , display:'flex' , justifyContent:'space-between' , borderBottom: '1px dashed gray',paddingY:1}}>
        <Typography variant="body1">کارت مقصد:</Typography>
        <Typography>{desCard}</Typography>
      </Box>

      {/* Card Holder */}
      <Box sx={{ mb: 1 , display:'flex' , justifyContent:'space-between' , borderBottom: '1px dashed gray',paddingY:1}}>
        <Typography variant="body1">نام دارنده کارت:</Typography>
        <Typography>صبا بصیری</Typography>
      </Box>

      {/* Static Display for Amount */}
      <Box variant="body1" sx={{ mb: 2 , display:'flex' , justifyContent:'space-between' , borderBottom: '1px dashed gray',paddingY:1}}>
        مبلغ:
        <Typography> {formatAmount(amount)} ریال </Typography>
            
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between', paddingBottom:0.3 }}>
        <Typography variant="body1">نام بانک:</Typography>
        <Typography>بانک پاسارگاد</Typography>
      </Box>

    
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, justifyContent:'space-between', maxHeight:'200px'}}>
      <TextField
              label="رمز پویا"
              variant="outlined"
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
          }}
        >
          <Button 
            sx={{ 
              color: 'white',  
              borderRadius: '10px', 
              paddingY: 2,
              whiteSpace: 'nowrap',
              width: '100%',
              bgcolor: 'transparent', 
            }}
          >
            دریافت رمز پویا
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
