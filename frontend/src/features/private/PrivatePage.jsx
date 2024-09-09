import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Paper, Link, useMediaQuery, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { BsCreditCard } from "react-icons/bs";
import { MdHistory } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { TbCreditCardPay } from "react-icons/tb";
import { RiSimCard2Line } from "react-icons/ri";
import CardList from './CardList';
import DeleteIcon from '@mui/icons-material/Delete';

const systems = [
    { title: 'لیست کارت ها', icon: BsCreditCard, color: '#1976d2' }, // مطمئن شوید عنوان صحیح است
    { title: 'سوابق تراکنش', icon: MdHistory, color: '#388e3c' },
    { title: 'ویرایش پروفایل', icon: ImProfile, color: '#f57c00' },
    { title: 'حساب کاربری', icon: CgProfile, color: '#7b1fa2' },
    { title: 'کارت به کارت', icon: TbCreditCardPay, color: '#d32f2f' },
    { title: 'خرید شارژ', icon: RiSimCard2Line, color: '#0288d1' },
];

const PrivatePage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [showCardList, setShowCardList] = useState(false);
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        const loadDataAsync = async () => {
            // داده‌ها از API بارگذاری شود (در این مثال داده‌ای وجود ندارد)
        };
        loadDataAsync();
    }, [dispatch]);

    const getIconSize = () => {
        if (isXs) return 30;
        if (isMd) return 40;
        return 45;
    };

    const getPaperSize = () => {
        if (isXs) return 120;
        if (isMd) return 180;
        return 230;
    };

    const getTitleFontSize = () => {
        if (isXs) return '0.8rem';
        if (isMd) return '1rem';
        return '1.2rem';
    };

    const cards = [
        { bankName: 'بانک سامان', ownerName: 'اسماعیل خدادادی', cardNumber: '6219-8619-1430-3713', icon: <DeleteIcon /> },
        { bankName: 'بانک سینا', ownerName: 'فاطمه جعفری', cardNumber: '6393-4610-5598-9531', icon: <DeleteIcon /> },
        { bankName: 'بانک ملت', ownerName: 'محمد حسینی', cardNumber: '6104-3371-1356-1498', icon: <DeleteIcon /> },
    ];

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: 5,
                px: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box sx={{ width: '100%' }}>
                {/* شرط نمایش لیست کارت‌ها */}
                {showCardList ? (
                    <CardList cards={cards} onBack={() => setShowCardList(false)} />
                ) : (
                    <Grid container spacing={3} justifyContent="center" sx={{ mt: 5 }}>
                        {systems.map((system, index) => (
                            <Grid
                                item
                                key={index}
                                xs={4} sm={4} md={3} lg={2}
                                sx={{ display: 'flex', justifyContent: "center" }}
                            >
                                <Paper
                                    elevation={3}
                                    sx={{
                                        width: getPaperSize(),
                                        height: getPaperSize(),
                                        p: 3,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: '0.3s',
                                        borderRadius: 5,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        '&:hover': { transform: 'scale(0.96)' }
                                    }}
                                    onClick={() => {
                                        if (system.title === 'لیست کارت ها') { // عنوان صحیح را بررسی کنید
                                            setShowCardList(true);
                                        }
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Link href="#" underline="none" color="inherit" sx={{ color: system.color }}>
                                            {React.createElement(system.icon, { size: getIconSize() })}
                                        </Link>
                                        <Box
                                            mt={2}
                                            color="text.primary"
                                            sx={{
                                                fontSize: getTitleFontSize(),
                                                '&:hover': { color: 'primary.main' }
                                            }}
                                        >
                                            {system.title}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default PrivatePage;
