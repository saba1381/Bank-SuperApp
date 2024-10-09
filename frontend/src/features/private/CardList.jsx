import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Snackbar,
} from "@mui/material";
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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toPersianNumbers } from "./../../util/util";
import { BiTransfer } from "react-icons/bi";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardActions from "./CardActions";

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
    iconWidth: "38px",
    iconHeight: "38px",
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

const bankColors = {
  603799: "#faf6fc",
  589210: "#f8cf82",
  621986: "#8ae7f9 ",
  622106: "#f1b2a2",
  589463: "#9b14ee ",
  502229: "#080808",
  610433: "#f786b7",
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showIconsIndex, setShowIconsIndex] = useState(null);

  const handleMenuClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setShowIconsIndex(index === showIconsIndex ? null : index);
  };


  const iconVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3,
      },
    }),
  };

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

  const handleCopyCardNumber = (cardNumber) => {
    navigator.clipboard.writeText(cardNumber);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  {
    /** 
  function formatCardNumber(cardNumber) {
    return cardNumber.replace(/(\d{4})(?=\d)/g, "$1 "); 
 
*/
  }

  function formatCardNumber(cardNumber) {
    return cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
  }
  return (
    <Box
      sx={{
        paddingTop: { md: 7, xs: 3 },
        paddingBottom: 12,
        paddingX: { xs: 2, sm: 3, md: 7 },
        maxHeight: "auto",
        minHeight: "auto",
        overflowY: "auto",
      }}
    >
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
                      position: "relative",
                      paddingX: { xs: 2, sm: 2 },
                      paddingY: { xs: 1, sm: 2 },
                      mb: { xs: 2, md: 4 },
                      backgroundColor: color,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "left" },
                      alignItems: "center",
                      boxShadow: 3,
                      borderRadius: 3,
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
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "row",
                          }}
                        >
                          <IconButton
                            sx={{
                              display: "flex",
                              position: "absolute",
                              top: 8,
                              right: 10,
                              fontSize: "26px",
                              color: textColor,
                            }}
                            onClick={(e) => handleMenuClick(e, index)} 
                          >
                            <MoreVertIcon />
                          </IconButton>
                          {showIconsIndex === index && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 40, 
                                display: "flex",
                                flexDirection: "row", 
                                color: textColor,
                                gap: "5px",
                              }}
                            >
                              {/* Animated Edit Icon */}
                              <motion.div
                                custom={0}
                                initial="hidden"
                                animate="visible"
                                variants={iconVariants}
                              >
                                <Button
                                 onClick={(e) => {
                                  e.preventDefault(); 
                                  e.stopPropagation();
                                  handleEditCard(card);
                                }}
                              
                                  sx={{
                                    color: textColor,
                                    paddingY: 0,
                                    paddingX: 0,
                                    minWidth: 0,
                                    "&:hover": { color: "pink" },
                                    fontSize: { xs: "27px", sm: "30px" },
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <EditNoteIcon sx={{ margin: 0 }} />
                                </Button>
                              </motion.div>

                              {/* Animated Delete Icon */}
                              <motion.div
                                custom={1}
                                initial="hidden"
                                animate="visible"
                                variants={iconVariants}
                              >
                                <DeleteCardButton
                                  cardNumber={card.card_number}
                                  onDelete={refreshCardList}
                                />
                              </motion.div>

                              {/* Animated Transfer Icon */}
                              <motion.div
                                custom={2}
                                initial="hidden"
                                animate="visible"
                                variants={iconVariants}
                              >
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault(); 
                                    e.stopPropagation();
                                    navigate("/cp/transfer", { state: { from: "/cp/user-cards" } });
                                  }}
                                  sx={{
                                    color: textColor,
                                    paddingY: 0,
                                    paddingX: 0,
                                    "&:hover": { color: "pink" },
                                    fontSize: { xs: "23px", sm: "30px" },
                                    display: "flex",
                                    alignItems: "center",
                                    minWidth: 0,
                                  }}
                                >
                                  <BiTransfer size={24} />
                                </Button>
                              </motion.div>

                              <IconButton
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCopyCardNumber(card.card_number);
                                }}
                                sx={{
                                  color: textColor,
                                  "&:hover": { color: "pink" },
                                  marginRight: "3px",
                                  fontSize: "18px",
                                  minWidth: 0,
                                }}
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          {bank?.icon && (
                            <Box
                              component="div"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: bank?.iconWidth,
                                height: bank?.iconHeight,
                              }}
                            >
                              {bank.icon}
                            </Box>
                          )}

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "12px",
                              color: textColor,
                              mt: "9px",
                              marginLeft: "4px",
                            }}
                          >
                            بانک {card.bank_name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mt: 1,
                            width: "100%",
                            gap: 2,
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              alignContent: "center",
                              direction: "ltr",
                            }}
                          >
                            <Box
                              sx={{
                                whiteSpace: "nowrap",
                                wordSpacing: "1.8rem",
                                textAlign: "center",
                                direction: "ltr",
                                unicodeBidi: "plaintext",
                              }}
                            >
                              {" "}
                              {toPersianNumbers(
                                formatCardNumber(card.card_number)
                              )}
                            </Box>
                          </Typography>
                        </Box>

                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {card.full_name}
                        </Typography>
                      </Box>
                    </Link>
                  </Paper>
                </motion.div>
              );
            })
          )}
        </>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="شماره کارت کپی شد!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { backgroundColor: "green" },
        }}
        sx={{ borderRadius: "20px" }}
      />
    </Box>
  );
};

export default CardList;
