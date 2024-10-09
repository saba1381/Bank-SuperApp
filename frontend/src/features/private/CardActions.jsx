
import React from 'react';
import { Button } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteCardButton from "./DeleteCard";
import { BiTransfer } from "react-icons/bi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CardActions = ({ card, textColor, refreshCardList, handleEditCard }) => {
    const navigate = useNavigate();
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


  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {/* Animated Edit Icon */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={iconVariants}>
        <Button
          onClick={() => handleEditCard(card)}
          sx={{
            color: textColor,
            paddingY: 0,
            paddingX: 1,
            "&:hover": { color: "pink" },
            fontSize: { xs: "23px", sm: "30px" },
            display: "flex",
            alignItems: "center",
          }}
        >
          <EditNoteIcon sx={{ margin: 0 }} />
        </Button>
      </motion.div>

      {/* Animated Delete Icon */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={iconVariants}>
        <DeleteCardButton
          cardNumber={card.card_number}
          onDelete={refreshCardList}
        />
      </motion.div>

      {/* Animated Transfer Icon */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={iconVariants}>
        <Button
          onClick={() => navigate("/cp/transfer", { state: { from: "/cp/user-cards" } })} 
          sx={{
            color: textColor,
            paddingY: 0,
            paddingX: 1,
            "&:hover": { color: "pink" },
            fontSize: { xs: "23px", sm: "30px" },
            display: "flex",
            alignItems: "center",
          }}
        >
          <BiTransfer size={24} />
        </Button>
      </motion.div>
    </div>
  );
};

export default CardActions;
