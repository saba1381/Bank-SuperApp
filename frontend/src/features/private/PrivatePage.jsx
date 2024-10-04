import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Link,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { BsCreditCard } from "react-icons/bs";
import { MdHistory } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { TbCreditCardPay } from "react-icons/tb";
import { RiSimCard2Line } from "react-icons/ri";
import CardList from "./CardList";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import ProfileEdit from "../private/ProfileEdit";
import { useNavigate } from "react-router-dom";

const systems = [
  { title: "لیست کارت ها", icon: BsCreditCard, color: "#1976d2" },
  { title: "سوابق تراکنش", icon: MdHistory, color: "#388e3c" },
  { title: "ویرایش پروفایل", icon: ImProfile, color: "#f57c00" },
  { title: "حساب کاربری", icon: CgProfile, color: "#7b1fa2" },
  { title: "کارت به کارت", icon: TbCreditCardPay, color: "#d32f2f" },
  { title: "خرید شارژ", icon: RiSimCard2Line, color: "#0288d1" },
];

const PrivatePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showCardList, setShowCardList] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));

  const navigate = useNavigate();

  useEffect(() => {
    const loadDataAsync = async () => {
      // Fetch data from API if needed
    };
    loadDataAsync();
  }, [dispatch]);

  const getIconSize = () => {
    if (isXs) return 30;
    if (isSm) return 28;
    if (isMd) return 40;
    return 45;
  };

  const getPaperSize = () => {
    if (isXs) return 140;
    if (isSm) return 190;
    if (isMd) return 190;
    return 230;
  };

  const getTitleFontSize = () => {
    if (isXs) return "0.9rem";
    if (isSm) return "1.2rem";
    if (isMd) return "3rem";
    return "1.2rem";
  };

  const cards = [
    {
      bankName: "بانک سامان",
      ownerName: "اسماعیل خدادادی",
      cardNumber: "6219-8619-1430-3713",
      icon: <DeleteIcon />,
    },
    {
      bankName: "بانک سینا",
      ownerName: "فاطمه جعفری",
      cardNumber: "6393-4610-5598-9531",
      icon: <DeleteIcon />,
    },
    {
      bankName: "بانک ملت",
      ownerName: "محمد حسینی",
      cardNumber: "6104-3371-1356-1498",
      icon: <DeleteIcon />,
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleProfileEditClick = () => {
    navigate("/cp/edit-profile");
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 0,
        px: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "100px",
        overflowY: "auto",
      }}
    >
      <Box sx={{ width: "100%", px: 3 }}>
        {showCardList ? (
          <CardList cards={cards} onBack={() => setShowCardList(false)} />
        ) : showProfileEdit ? (
          <ProfileEdit onClose={() => setShowProfileEdit(false)} />
        ) : (
          <Grid
            container
            spacing={isXs ? 2 : 3}
            justifyContent="center"
            sx={{ mt: 5 }}
          >
            {systems.map((system, index) => (
              <Grid
                item
                key={index}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Paper
                    elevation={3}
                    sx={{
                      width: getPaperSize(),
                      height: getPaperSize(),
                      p: 3,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "0.3s",
                      borderRadius: 5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      "&:hover": { transform: "scale(0.96)" },
                    }}
                    onClick={() => {
                      if (system.title === "لیست کارت ها") {
                        navigate("/cp/user-cards");
                      } else if (system.title === "ویرایش پروفایل") {
                        handleProfileEditClick();
                      }
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        sx={{
                          width: 50, // Adjust size as needed
                          height: 50, // Adjust size as needed
                          backgroundColor: system.color,
                          borderRadius: "50%", // Make it circular
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Link
                          href="#"
                          underline="none"
                          color="inherit"
                          sx={{ color: "white" }} // Change color to white for better contrast
                        >
                          {React.createElement(system.icon, {
                            size: getIconSize(),
                          })}
                        </Link>
                      </Box>
                      <Box
                        mt={2}
                        color="text.primary"
                        sx={{
                          fontSize: getTitleFontSize(),
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {system.title}
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default PrivatePage;
