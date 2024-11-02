import React from 'react';
import { Box, Card, Typography, Grid, List, ListItem, Divider, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {toPersianNumbers} from '../../util/util';

const banks = {
  603799: {
    name: "ملی",
    icon: <img src="/BankIcons/meli.png" alt="ملی" />,
    iconWidth: "55px",
    iconHeight: "55px",
  },
  589210: {
    name: "سپه",
    icon: <img src="/BankIcons/sepah.png" alt="سپه" />,
    iconWidth: "48px",
    iconHeight: "48px",
  },
  621986: {
    name: "سامان",
    icon: <img src="/BankIcons/saman.png" alt="سامان" />,
    iconWidth: "40px",
    iconHeight: "40px",
  },
  622106: {
    name: "پارسیان",
    icon: <img src="/BankIcons/parsian.png" alt="پارسیان" />,
    iconWidth: "70px",
    iconHeight: "70px",
  },
  589463: {
    name: "رفاه کارگران",
    icon: <img src="/BankIcons/refah.png" alt="رفاه کارگران" />,
    iconWidth: "28px",
    iconHeight: "30px",
  },
  502229: {
    name: "پاسارگاد",
    icon: <img src="/BankIcons/pasargad.png" alt="پاسارگاد" />,
    iconWidth: "30px",
    iconHeight: "38px",
  },
  610433: {
    name: "ملت",
    icon: <img src="/BankIcons/melat.png" alt="ملت" />,
    iconWidth: "35px",
    iconHeight: "35px",
  },
};
const transactions = [
  { id: 1, type: 'خرید کد شارژ', amount: 200000, date: '۱۴۰۳/۰۸/۰۹ - ۲۲:۴۳', success: false },
  { id: 2, type: 'انتقال وجه', name: 'صبا بصیری', amount: 50000, date: '۱۴۰۳/۰۸/۰۹ - ۲۲:۰۸', success: false },
  { id: 3, type: 'انتقال وجه', name: 'مریم امینی', amount: 1000000, date: '۱۴۰۳/۰۸/۱۵ - ۱۵:۱۴', success: true },
  // More transactions...
];

const TransactionList = () => {
  const navigate = useNavigate();
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 50,
    damping: 20,
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants} transition={pageTransition}>
      <Box sx={{ padding: 2, maxWidth: 600, margin: '0 auto', backgroundColor: '#f8f9fa' , maxHeight: "auto",
        minHeight: "auto",
        overflowY: "auto", paddingBottom: {xs:9 , sm:11 , md:13}, }}>
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#6200ea', padding: '16px', borderRadius: '8px 8px 0 0' }}>
          <Typography variant="h6" sx={{ color: '#fff', flexGrow: 1, textAlign: 'center' }}>
            سوابق تراکنش
          </Typography>
          <IconButton onClick={() => navigate('/cp')}>
            <ArrowBack sx={{ color: '#fff' , fontSize:{xs:'1.5rem', sm:"1rem"}}} />
          </IconButton>
        </Box>

        <Card sx={{ marginTop: 2, padding: 2, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="body2" align="center" sx={{color:'navy.800'}}>
           این اطلاعات شامل سوابق عملیات تراکنش شما در موبایل بانک است
          </Typography>
        </Card>

        <List sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', marginTop: 2 }}>
          {transactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <ListItem sx={{ padding: '12px 16px' }}>
                <Grid container alignItems="center" justifyContent="space-between" sx={{width:'100%'}}>
                   {/* Status Icon */}
                   <Grid item >
                    {transaction.success ? (
                      <Typography sx={{ color: 'green', fontSize: '1.5rem' }}>✓</Typography>
                    ) : (
                      <Typography sx={{ color: 'red', fontSize: '1.5rem' }}>✕</Typography>
                    )}
                  </Grid>
                  {/* bank's name and Type */}
                  <Grid item xs={5} sx={{display:'flex' , justifyContent:'center',flexDirection:'column' , alignItems:'flex-start' , width:'50%' , marginLeft:1}}>
                    <Typography sx={{color:'#363532' , fontSize:'0.9rem'}}>
                      {transaction.type} {transaction.name && `- ${transaction.name}`}
                    </Typography>
                    <Typography sx={{color:'#363532' , fontSize:'0.9rem'}}>
                      بانک ملت
                    </Typography>
                  </Grid>

                  {/* Date and Time and amount*/}
                  <Grid item xs={6} textAlign="right" sx={{display:'flex' , flexDirection:'column' , alignItems:"flex-end"}}>
                  <Box sx={{mb: 1, display: 'flex', justifyContent: 'space-between',  color: '#56575b' , fontSize:'0.9rem'}}>
                    <Typography variant="body1" sx={{ color: transaction.success ? 'green' : 'red', fontWeight: 'bold' }}>
                      {toPersianNumbers(transaction.amount.toLocaleString())} ریال
                    </Typography>
                    </Box>
                    <Typography variant="caption" sx={{color:'#363532' , fontSize:'0.9rem'}}>
                      {toPersianNumbers(transaction.date)}
                    </Typography>
                  </Grid>

                 
                </Grid>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </motion.div>
  );
};

export default TransactionList;
