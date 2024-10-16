import React from 'react';
import { Box, Card, Typography, Grid, List, ListItem, Divider, IconButton, Select, MenuItem, LinearProgress } from '@mui/material';
import { ArrowBack, ArrowForward, MoreVert } from '@mui/icons-material';
import { motion } from 'framer-motion';  // اضافه کردن Framer Motion

// تبدیل اعداد انگلیسی به فارسی
const toPersianNumber = (num) => {
  return num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

// داده‌های تراکنش
const transactions = [
  { id: 1, type: 'واریز', amount: 300000, date: '۱۴۰۱/۰۶/۰۹', balance: 357699, color: 'green' },
  { id: 2, type: 'برداشت', amount: 80000, date: '۱۴۰۱/۰۶/۰۸', balance: 57999, color: 'red' },
  { id: 3, type: 'برداشت', amount: 1060000, date: '۱۴۰۱/۰۶/۰۷', balance: 139699, color: 'red' },
  { id: 4, type: 'برداشت', amount: 106000, date: '۱۴۰۱/۰۶/۰۷', balance: 1143999, color: 'red' },
];

const TransactionList = () => {
  // تنظیمات انیمیشن برای ظاهر شدن صفحه
  const pageVariants = {
    hidden: { opacity: 0, y: 20 }, // مخفی و کمی پایین تر از موقعیت اصلی
    visible: { opacity: 1, y: 0 }, // نمایش و بازگشت به موقعیت اصلی
  };

  const pageTransition = {
    type: 'spring',
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
      <Box sx={{ padding: 2, maxWidth: 600, margin: '0 auto', direction: 'rtl', backgroundColor: '#f8f9fa' }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#6200ea', padding: '16px', borderRadius: '8px 8px 0 0' }}>
          <IconButton>
            <ArrowBack sx={{ color: '#fff' }} />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#fff', flexGrow: 1, textAlign: 'center' }}>
            گردش حساب
          </Typography>
        </Box>

        {/* اطلاعات حساب */}
        <Card sx={{ marginTop: 2, padding: 2, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="body2">شماره حساب</Typography>
            <Select defaultValue={357699} size="small" sx={{ minWidth: 100 }}>
              <MenuItem value={357699}>{toPersianNumber(357699)} ریال</MenuItem>
            </Select>
          </Grid>
          <Typography variant="caption" sx={{ color: 'gray', marginTop: '8px', display: 'block' }}>
            سود سرمایه‌گذاری کوتاه مدت
          </Typography>
          <LinearProgress variant="determinate" value={75} sx={{ marginTop: 1 }} />
        </Card>

        {/* تنظیمات فیلتر */}
        <Grid container justifyContent="space-between" alignItems="center" sx={{ marginTop: 2 }}>
          <Typography variant="body2" sx={{ color: 'gray' }}>تعداد</Typography>
          <Select defaultValue={10} size="small" sx={{ minWidth: 60 }}>
            <MenuItem value={5}>۵</MenuItem>
            <MenuItem value={10}>۱۰</MenuItem>
          </Select>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Grid>

        {/* لیست تراکنش‌ها */}
        <List sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', marginTop: 2 }}>
          {transactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <ListItem sx={{ padding: '12px 16px' }}>
                <Grid container justifyContent="space-between" alignItems="center">
                  
                  {/* ستون راست: مبلغ و نوع */}
                  <Grid item xs={5}>
                    <Typography
                      variant="body1"
                      sx={{ color: transaction.color, fontWeight: 'bold', fontSize: '1rem' }}
                    >
                      {toPersianNumber(transaction.amount.toLocaleString())} <span>ریال</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transaction.type}
                    </Typography>
                  </Grid>

                  {/* ستون چپ: مانده و تاریخ */}
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {toPersianNumber(transaction.balance.toLocaleString())} ریال
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transaction.date}
                    </Typography>
                  </Grid>

                  {/* آیکون فلش */}
                  <Grid item>
                    {transaction.type === 'واریز' ? (
                      <ArrowForward style={{ color: transaction.color }} />
                    ) : (
                      <ArrowBack style={{ color: transaction.color }} />
                    )}
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
