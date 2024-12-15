import React , {useState} from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import {toPersianNumbers} from '../../util/util';
import Transfer from './Transfer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShareIcon from "@mui/icons-material/Share";
import { toast } from 'react-toastify';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const BankReceipt = ({ownersName , transactionDate, initailCard, desCard, amount, transactionStatus }) => {
    const navigate = useNavigate();
    const [showTransfer, setShowTransfer] = useState(false); 
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
      icon: <img src="/BankIcons/refah.png" alt="رفاه کارگران" />, iconWidth: "27px",iconHeight: "27px",
    },
    502229: {
      name: "پاسارگاد",
      icon: <img src="/BankIcons/pasargad.png" alt="پاسارگاد" />, iconWidth: "22px",iconHeight: "30px",
    },
    610433: { name: "ملت", icon: <img src="/BankIcons/melat.png" alt="ملت" />, iconWidth: "30px",iconHeight: "30px", },
  };

  const getBankInfo = (cardNumber) => {
    const firstSixDigits = cardNumber?.replace(/\D/g, '').substring(0, 6);
    return banks[firstSixDigits];
  };

  const initailBankInfo = getBankInfo(initailCard);
  const desBankInfo = getBankInfo(desCard);

  if (showTransfer){
    return <Transfer/>
  }
  const maskCardNumber = (cardNumber) => {
    return `\u200E${cardNumber.slice(0, 6)}${cardNumber.slice(6, -4).replace(/\d/g, '*')}${cardNumber.slice(-2)}`;
  };
  
  const shareInfo = `\u200Fتاریخ:  ${toPersianNumbers(transactionDate)} \nکارت مبدا: ${initailCard}\nکارت مقصد${maskCardNumber(desCard)} : \n مبلغ: ${toPersianNumbers(formatAmount(amount))} ریال`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'رسید تراکنش',
        text: shareInfo,
      })
      .then(() => console.log('اشتراک‌گذاری موفق بود'))
      .catch((error) => console.log('خطا در اشتراک‌گذاری:', error));
    } else {
      toast.error('مرورگر شما از قابلیت اشتراک‌گذاری پشتیبانی نمی‌کند.');
    }
  };  

  return (
    <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    <Container sx={{ height: {xs:'70vh' , sm:'100vh'},display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom:{sm:10},  }}>

    <Box sx={{ maxWidth: 500,width:{xs:500 , sm:400} ,mx: 'auto', paddingY: 0, paddingX: 0, borderRadius: 2, boxShadow: 3, bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#dddddd" : "white",}}>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: transactionStatus === 'success' ? 'green' : 'white' , bgcolor: transactionStatus === 'success' ? '#b6e9d2' : 'red' , p:2}}>
        {transactionStatus === 'success' ? (
                                <CheckCircleIcon sx={{ color: 'green', marginRight: '8px' }} />  
                            ) : (
                                <CancelIcon sx={{ color: 'white', marginRight: '8px' }} />  
                            )}
          {transactionStatus === 'success' ? 'تراکنش موفق' : 'تراکنش ناموفق'}
         

          {transactionStatus === 'success' && (
                <ShareIcon onClick={handleShare} style={{ marginRight: '10px', cursor: 'pointer' }} />
              )}
        </Typography>
      </Box>

      
      <Box sx={{paddingY:2 , paddingX:1.2}}> 
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed gray', paddingY: 1, color: '#56575b'  }}>
        <Typography sx={{fontSize:'1.2rem'}}>تاریخ:</Typography>
        <Typography sx={{fontSize:'1.1rem'}}>{toPersianNumbers(transactionDate)}</Typography>
      </Box>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed gray', paddingY: 1, color: '#56575b'  }}>
        <Typography sx={{fontSize:'1.2rem'}}>مبلغ:</Typography>
        <Typography sx={{fontSize:'1.1rem'}}>{toPersianNumbers(formatAmount(amount))} ریال</Typography>
      </Box>
      
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed gray', paddingY: 1, color: '#56575b' }}>
        <Typography sx={{fontSize:'1.2rem'}}>کارت مبدا:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
         
          <Typography sx={{fontSize:'1.1rem'}}>{toPersianNumbers(initailCard)}</Typography>
          {initailBankInfo?.icon && (
            <Box sx={{ marginLeft: '4px' }}>
              <img src={initailBankInfo.icon.props.src} alt={initailBankInfo.name} width={initailBankInfo.iconWidth} height={initailBankInfo.iconHeight} />
            </Box>
          )}
        </Box>
      </Box>
      

      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed gray', paddingY: 1, color: '#56575b' }}>
        <Typography sx={{fontSize:'1.2rem'}}>کارت مقصد:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        
          <Typography sx={{fontSize:'1.1rem'}}>{toPersianNumbers(desCard)}</Typography>
          {desBankInfo?.icon && (
            <Box sx={{ marginLeft: '4px' }}>
              <img src={desBankInfo.icon.props.src} alt={desBankInfo.name} width={desBankInfo.iconWidth} height={desBankInfo.iconHeight} />
            </Box>
          )}

        </Box>
        </Box>
        {transactionStatus === 'success' ? (
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed gray', paddingY: 1, color: '#56575b'  }}>
        <Typography sx={{fontSize:'1.2rem'}}>نام دارنده کارت:</Typography>
        <Typography sx={{fontSize:'1.1rem'}}>{ownersName}</Typography>
      </Box> ) :( '')}
        
        <Typography sx={{color:'#ec5b54' , textAlign:'center' , fontWeight:'bold'}}>{transactionStatus === 'failed' ? 'خطا در انجام عملیات' :''}</Typography>
        <Button sx={{
            mt:3,
                  textAlign: "center",
                  width: "100%",
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
          بازگشت
        </Button>
        </Box>
      
    </Box>
    
   </Container>
   </motion.div>
  );
  
};

export default BankReceipt;
