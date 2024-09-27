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

const CardList = ({ onBack }) => {
    const [showAddCard, setShowAddCard] = useState(false);
    const dispatch = UseAppDispatch(); // استفاده از dispatch
    const { cards, isLoading } = UseAppSelector((state) => state.account); // استفاده از useSelector

    useEffect(() => {
        dispatch(fetchCards()); // فراخوانی fetchCards برای دریافت کارت‌ها
    }, [dispatch]);

    const handleAddCard = () => {
        setShowAddCard(true); 
    };

    const handleBackToList = () => {
        setShowAddCard(false); 
    };

    function formatCardNumber(cardNumber) {
        return cardNumber.replace(/(\d{4})(?=\d)/g, '$1-');
    }

    return (
        <Box sx={{ paddingY: 2, paddingX: '0.2px' }}>
            {showAddCard ? (
                <AddCard onBack={handleBackToList} />
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
                        cards.map((card, index) => (
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
                                            mb: 2,
                                            backgroundColor: 'white',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            boxShadow: 3,
                                            borderRadius: 5,
                                            cursor: 'pointer',
                                            transition: '0.3s',
                                            width: '100%',
                                            '&:hover': { backgroundColor: '#f1f1f1' },
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: '12px', color: 'black' }}>
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
                                                    '&:hover': {
                                                        '& .MuiSvgIcon-root': {
                                                            color: 'pink',
                                                        },
                                                    },
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </>
            )}
        </Box>
    );
};

export default CardList;
