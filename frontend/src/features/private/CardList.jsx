import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddCard from './AddCard';  
import axios from 'axios';

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
    const [userCards, setUserCards] = useState([]);
    const [showAddCard, setShowAddCard] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');  // فرض بر اینکه توکن در localStorage ذخیره شده است
        axios.get('http://127.0.0.1:8000/api/card/my-cards/', {
            headers: {
                'Authorization': `Bearer ${token}`  // ارسال توکن در هدر
            }
        })
        .then((response) => {
            if (Array.isArray(response)) {
                setUserCards(response); 
            } else {
                setUserCards([]);  
            }
        })
        .catch((error) => {
            console.error('Error fetching cards:', error);
            setUserCards([]);  
        });
    }, []);
    

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
        <Box sx={{ paddingY: 2 , paddingX:'0.2px' }}>
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

                    {userCards.length === 0 ? (
                        <Typography variant='h6' sx={{textAlign:'center'}}>شما هیچ کارت بانکی را هنوز ثبت نکرده اید.</Typography>  
                    ) : (
                        userCards.map((card, index) => (
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
                                            width:'100%',
                                            '&:hover': { backgroundColor: '#f1f1f1' },
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="h6" sx={{fontWeight:'12px' , color:'black'}}> بانک {card.bank_name} </Typography>
                                            <Typography variant="body2" sx={{mb:1}}>{card.full_name}</Typography> 
                                            <Typography variant="caption">{formatCardNumber(card.card_number)}</Typography>

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
