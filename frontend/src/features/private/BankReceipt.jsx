import React , {useState} from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import {toPersianNumbers} from '../../util/util';
import Transfer from './Transfer';
import { useNavigate } from 'react-router-dom';

const BankReceipt = ({ initailCard, desCard, amount, transactionStatus }) => {
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
  

  return (
    <Container sx={{ height: '70vh',display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Box sx={{ maxWidth: 500,width:{xs:500 , sm:400} ,mx: 'auto', paddingY: 0, paddingX: 0, borderRadius: 2, boxShadow: 3, bgcolor: 'white' }}>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: transactionStatus === 'success' ? 'green' : 'white' , bgcolor: transactionStatus === 'success' ? '#b6e9d2' : 'red' , p:2}}>
          {transactionStatus === 'success' ? 'تراکنش موفق' : 'تراکنش ناموفق'}
        </Typography>
      </Box>
      <Box sx={{paddingY:2 , paddingX:1.5}}> 
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
  );
  
};

export default BankReceipt;
