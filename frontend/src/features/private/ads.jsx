import React,{useEffect} from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { FcAbout } from "react-icons/fc";
import { motion } from 'framer-motion'; 
import { toPersianNumbers } from "../../util/util";
import { userAds } from '../../features/account/accountSlice';
import { UseAppDispatch } from '../../store/configureStore';
import { useSelector } from 'react-redux';

const MessageBox = () => {
    const dispatch = UseAppDispatch();
    const { ads, isLoading } = useSelector((state) => state.account);
    useEffect(() => {
        dispatch(userAds());
  }, [dispatch]);
    const messages = [
        {
            id: 1,
            date: '1403/06/20',
            time: '15:50',
            content:
                'با اعتبار بانک رفاه به جای ۲۳۳ میلیون فقط با ۱۳۰ میلیون تومان حساب خود را شارژ کنید و از برنامه فرازاه و آدرس https://mehvar.rbpr.ir بهره ببرید.',
        },
        {
            id: 2,
            date: '1403/05/27',
            time: '13:30',
            content:
                'مشترک گرامی، امکان واگذاری وکالتی حساب جهت خرید خودرو از طرح فروش ویژه ایران خودرو فراهم است.',
        },
        {
            id: 3,
            date: '1403/05/22',
            time: '12:30',
            content:
                'با سلام، مشترک گرامی ضمن عرض پوزش به اطلاع می‌رساند خدمات انتقال وجه بین بانکی پایا و ساتنا موقتاً در دسترس نمی‌باشد.',
        },
        {
            id: 4,
            date: '1403/05/18',
            time: '10:30',
            content:
                'مشترک گرامی، هرگونه تماس تلفنی مبنی بر دریافت جوایز در مسابقات، کلاهبرداری می‌باشد. لطفاً هوشیار باشید.',
        },
    ];

    return (
        <Box
            sx={{
                padding: 2,
                maxWidth: { xs: '100%', sm: 600 }, 
                margin: '0 auto',
                // direction: 'rtl', 
                maxHeight:{sm:'auto'},
                paddingBottom:15
            }}
        >
            {messages.map((message, index) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: index * 0.2 }} 
                >
                    <Card
                        sx={{
                            marginBottom: 2,
                            boxShadow: 3,
                            borderRadius: '8px',
                            direction: 'rtl', 
                            paddingX:2,
                            paddingY:0.5
                        }}
                    >
                        <CardContent>
                           
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign:'left'
                                }}
                            >
                                
                                <Typography variant="body1" color="textPrimary" sx={{margibLeft:20}}>
                                    {message.content}
                                </Typography>
                                <FcAbout sx={{ marginRight: 4, marginLeft:20}} size={50} />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 1,
                                }}
                            >
                                <Typography variant="body2" sx={{color:'#5d6d7e'}}>
                                    {toPersianNumbers(message.date)}
                                </Typography>
                                <Typography variant="body2" sx={{color:'#5d6d7e'}}>
                                    {toPersianNumbers(message.time)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </Box>
    );
};

export default MessageBox;
