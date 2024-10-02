import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AddCard from "./AddCard";
import { UseAppDispatch, UseAppSelector } from "../../store/configureStore";
import { fetchCards } from "../account/accountSlice";
import DeleteCardButton from "./DeleteCard";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditCard from "./EditCard";
import { useNavigate } from "react-router-dom";

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
  603799: { name: "ملی", icon: "/BankIcons/meli.png" },
  589210: { name: "سپه", icon: "/BankIcons/sepah.png" },
  621986: { name: "سامان", icon: "/BankIcons/saman.png" },
  622106: { name: "پارسیان", icon: "/BankIcons/parsian.png" },
  589463: { name: "رفاه کارگران", icon: "/BankIcons/refah.png" },
  502229: { name: "پاسارگاد", icon: "/BankIcons/pasargad.png" },
  610433: { name: "ملت", icon: "/BankIcons/melat.png" },
};

const bankColors = {
  603799: "#004d99",
  589210: "#eead32",
  621986: "#8ae7f9",
  622106: "#c83a08",
  589463: "#9b14ee",
  502229: "#080808",
  610433: "#df117e",
};

const getTextColor = (backgroundColor) => {
  const color = backgroundColor.substring(1);
  const rgb = parseInt(color, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "black" : "white";
};

const getBankInfo = (cardNumber) => {
  const firstSixDigits = cardNumber.substring(0, 6);
  const bank = banks[firstSixDigits];
  const color = bankColors[firstSixDigits] || "gray";
  const textColor = getTextColor(color);
  return { bank, color, textColor };
};
const CardList = ({ onBack }) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const dispatch = UseAppDispatch();
  const { cards, isLoading } = UseAppSelector((state) => state.account);
  const [isHoveringDeleteButton, setIsHoveringDeleteButton] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  const handleAddCard = () => {
    setShowAddCard(true);
  };

  const handleBackToList = () => {
    setShowAddCard(false);
    setEditingCard(null);
  };

  const refreshCardList = () => {
    dispatch(fetchCards());
  };

  const handleEditCard = (card) => {
    navigate("/cp/user-cards/edit-card", {
      state: { cardNumber: card.card_number },
    });
  };

  function formatCardNumber(cardNumber) {
    return cardNumber.replace(/(\d{4})(?=\d)/g, "$1-");
  }

  return (
    <Box sx={{ paddingY: 3, paddingX: { xs: 1, md: 4 } }}>
      {editingCard ? (
        <EditCard
          cardNumber={editingCard.card_number}
          onBack={handleBackToList}
          onCardAdded={refreshCardList}
        />
      ) : showAddCard ? (
        <AddCard onBack={handleBackToList} onCardAdded={refreshCardList} />
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/cp/user-cards/add-card")}
              sx={{ px: 3 }}
            >
              کارت جدید
            </Button>
            <Button
              variant="contained"
              endIcon={<KeyboardBackspaceIcon />}
              onClick={() => navigate("/cp")}
            >
              بازگشت
            </Button>
          </Box>

          {isLoading ? (
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              در حال بارگذاری...
            </Typography>
          ) : cards.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              شما هیچ کارت بانکی را هنوز ثبت نکرده‌اید.
            </Typography>
          ) : (
            cards.map((card, index) => {
              const { bank, color, textColor } = getBankInfo(card.card_number);
              return (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  custom={index}
                  key={index}
                >
                  <Paper
                    sx={{
                      paddingX: { xs: 2, sm: 4 },
                      paddingY: { xs: 2, sm: 2 },
                      mb: { xs: 2, md: 5 },
                      backgroundColor: color,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxShadow: 3,
                      borderRadius: 5,
                      cursor: "pointer",
                      transition: "0.3s",
                      width: "100%",
                      color: textColor,
                      transform:
                        hoveredCardIndex === index ? "scale(1.01)" : "scale(1)",
                    }}
                    onMouseEnter={() => setHoveredCardIndex(index)}
                    onMouseLeave={() => setHoveredCardIndex(null)}
                  >
                    <Link
                      to={`/card-details/${card.card_number}`}
                      style={{ textDecoration: "none" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "12px", color: textColor }}
                        >
                          بانک {card.bank_name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {card.full_name}
                        </Typography>
                        <Typography variant="caption">
                          {formatCardNumber(card.card_number)}
                        </Typography>
                      </Box>
                    </Link>

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Button
                        onClick={() => handleEditCard(card)}
                        sx={{
                          color: textColor,
                          paddingY: 0,
                          paddingX: 1,
                          "&:hover": {
                            color: "pink",
                          },
                          fontSize: { xs: "23px", sm: "30px" },
                          display: "flex",
                          alignItems: "center",
                          gap: 0,
                        }}
                      >
                        <EditNoteIcon sx={{ margin: 0 }} />
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{ fontSize: { xs: "11px", sm: "15px" } }}
                        >
                          ویرایش
                        </Typography>
                      </Button>
                      <DeleteCardButton
                        cardNumber={card.card_number}
                        onDelete={refreshCardList}
                        onMouseEnter={() => setIsHoveringDeleteButton(true)}
                        onMouseLeave={() => setIsHoveringDeleteButton(false)}
                      />
                    </Box>
                  </Paper>
                </motion.div>
              );
            })
          )}
        </>
      )}
    </Box>
  );
};

export default CardList;
