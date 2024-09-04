import { Box, Container, Grid, Paper, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Link from "@mui/material/Link";
import { BsCreditCard } from "react-icons/bs";
import { MdHistory } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { TbCreditCardPay } from "react-icons/tb";
import { RiSimCard2Line } from "react-icons/ri";
import { useTheme } from '@mui/material/styles';
import React from 'react';

const systems = [
    { title: 'لیست کارت', icon: BsCreditCard, color: '#1976d2' },
    { title: 'سوابق تراکنش', icon: MdHistory, color: '#388e3c' },
    { title: 'ویرایش پروفایل', icon: ImProfile, color: '#f57c00' },
    { title: 'حساب کاربری', icon: CgProfile, color: '#7b1fa2' },
    { title: 'کارت به کارت', icon: TbCreditCardPay, color: '#d32f2f' },
    { title: 'خرید شارژ', icon: RiSimCard2Line, color: '#0288d1' },
];

const PrivatePage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.up('md'));
    const isLg = useMediaQuery(theme.breakpoints.up('lg'));

    useEffect(() => {
        const loadDataAsync = async () => {
            
        };
        loadDataAsync();
    }, [dispatch]);

    const getIconSize = () => {
        if (isXs) return 27;
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

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: 25,
                px: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Grid container spacing={3} justifyContent="center">
                {systems.map((system, index) => (
                    <Grid item key={index} xs={4} sm={4} md={3} lg={2} sx={{display:'flex' , justifyContent :"center" }}>
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
                                justifyContent:'center',
                                alignItems:'center',
                                flexDirection: 'column',
                                
                                '&:hover': { transform: 'scale(0.96)' }
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
        </Container>
    );
};

export default PrivatePage;
