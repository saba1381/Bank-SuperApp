    import React from 'react';
    import { Box, Typography, Paper, Button } from '@mui/material';
    import DeleteIcon from '@mui/icons-material/Delete';
    import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
    import AddIcon from '@mui/icons-material/Add';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';


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

    const CardList = ({ cards, onBack }) => {
        return (
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            console.log('Add new card');
                        }}
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

                {cards.map((card, index) => (
                    <Link
                        to={`/card-details/${card.cardNumber}`}
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
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    '&:hover': { backgroundColor: '#f1f1f1' },
                                }}
                            >
                                <Box>
                                    <Typography variant="h6">{card.bankName}</Typography>
                                    <Typography variant="body2">{card.ownerName}</Typography>
                                    <Typography variant="caption">{card.cardNumber}</Typography>
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
                ))}
            </Box>
        );
    };

    export default CardList;
