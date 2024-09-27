import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddCard from './AddCard';  
import { UseAppDispatch, UseAppSelector } from '../../store/configureStore'; // برای استفاده از ریداکس
import { fetchCards } from '../account/accountSlice';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.1,
            duration: 0.5,
        },
    }),
};

const banks = {
    '603799': { name: 'ملی', icon: '/BankIcons/meli.png' },
    '589210': { name: 'سپه', icon: '/BankIcons/sepah.png' },
    '621986': { name: 'سامان', icon: '/BankIcons/saman.png' },
    '622106': { name: 'پارسیان', icon: '/BankIcons/parsian.png' },
    '589463': { name: 'رفاه کارگران', icon: '/BankIcons/refah.png' },
    '502229': { name: 'پاسارگاد', icon: '/BankIcons/pasargad.png' },
    '610433': { name: 'ملت', icon: '/BankIcons/melat.png' },
};

// رنگ‌های بانک‌ها
const bankColors = {
    '603799': '#004d99',
    '589210': '#eead32',
    '621986': '#8ae7f9',
    '622106': '#c83a08',
    '589463': '#9b14ee',
    '502229': '#080808',
    '610433': '#df117e',
};


const getTextColor = (backgroundColor) => {
    const color = backgroundColor.substring(1);
    const rgb = parseInt(color, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? 'black' : 'white';
};

const getBankInfo = (cardNumber) => {
    const firstSixDigits = cardNumber.substring(0, 6);
    const bank = banks[firstSixDigits];
    const color = bankColors[firstSixDigits] || 'gray'; 
    const textColor = getTextColor(color);
    return { bank, color, textColor };
};
const CardList = ({ onBack }) => {
    const [showAddCard, setShowAddCard] = useState(false);
    const dispatch = UseAppDispatch(); 
    const { cards, isLoading } = UseAppSelector((state) => state.account); 

    useEffect(() => {
        dispatch(fetchCards()); 
    }, [dispatch]);

    const handleAddCard = () => {
        setShowAddCard(true); 
    };

    const handleBackToList = () => {
        setShowAddCard(false); 
    };

    const refreshCardList = () => {
        dispatch(fetchCards()); 
    };

    function formatCardNumber(cardNumber) {
        return cardNumber.replace(/(\d{4})(?=\d)/g, '$1-');
    }

    return (
        <Box sx={{ paddingY: 2, paddingX: '0.2px' }}>
            {showAddCard ? (
                <AddCard onBack={handleBackToList} onCardAdded={refreshCardList}/>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddCard}
                            sx={{ px: 3 }}
                        >
                            کارت جدید
                        </Button>
                        <Button
                            variant="contained"
                            endIcon={<KeyboardBackspaceIcon />}
                            onClick={onBack}
                        >
                            بازگشت
                        </Button>
                    </Box>

                    {isLoading ? (
                        <Typography variant="h6" sx={{ textAlign: 'center' }}>
                            در حال بارگذاری...
                        </Typography>
                    ) : cards.length === 0 ? (
                        <Typography variant="h6" sx={{ textAlign: 'center' }}>
                            شما هیچ کارت بانکی را هنوز ثبت نکرده‌اید.
                        </Typography>
                    ) : (
                        cards.map((card, index ) => {
                            const { bank, color, textColor } = getBankInfo(card.card_number);
                            return(
                                <Link
                                to={`/card-details/${card.card_number}`}
                                key={index}
                                style={{ textDecoration: 'none' }}
                            >
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={cardVariants}
                                    custom={index}
                                >
                                    <Paper
                                        sx={{
                                            p: 2,
                                            mb: {xs:2 , md:4},
                                            backgroundColor: color,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            boxShadow: 3,
                                            borderRadius: 5,
                                            cursor: 'pointer',
                                            transition: '0.3s',
                                            width: '100%',
                                            color :textColor,
                                            '&:hover': { opacity:'50%' },
                                        }}
                                    >
                                        <Box >
                                            <Typography variant="h6" sx={{ fontWeight: '12px', color: textColor }}>
                                                بانک {card.bank_name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {card.full_name}
                                            </Typography>
                                            <Typography variant="caption">
                                                {formatCardNumber(card.card_number)}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log(`Delete card: ${card.cardNumber}`);
                                                }}
                                                sx={{
                                                    minWidth: 0,
                                                    color : textColor,
                                                    fontSize: '24px' ,
                                                    '&:hover': {
                                                        '& .MuiSvgIcon-root': {
                                                            color: 'pink',
                                                        },
                                                    },
                                                }}
                                            >
                                                <DeleteIcon  />
                                            </Button>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Link>
                            )
                            
})
                    )}
                </>
            )}
        </Box>
    );
};

export default CardList;
