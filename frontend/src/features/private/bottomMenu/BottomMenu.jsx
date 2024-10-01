import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ImProfile } from "react-icons/im";
import { IoMdNotifications } from "react-icons/io";
import { RiServiceLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Settings from "./settings";
import { useNavigate } from "react-router-dom";





const BottomMenu = ({ showSettings, setShowSettings }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const getIconSize = () => (isMobile ? 24 : 30);

  const handleSettingsClick = () => {
    setShowSettings(true);
    setActiveMenu("settings");
  };

  const menuItems = [
    { label: "پروفایل", Icon: ImProfile, id: "profile" },
    { label: "رخدادها", Icon: IoMdNotifications, id: "notifications" },
    { label: "خدمات", Icon: RiServiceLine, id: "services" },
    { label: "تنظیمات", Icon: FiSettings, id: "settings", onClick: handleSettingsClick },
  ];

  if (!isMobile) return null;

  return (
    <>
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 2000 }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",

                zIndex: 1001, // بالاتر از تنظیمات
                overflow: "hidden",
              }}
            >
              <Settings onClose={() => { setShowSettings(false); setActiveMenu(null); }} />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "white",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          py: 0,
          px: 1,
          paddingBottom: 1,
          zIndex: 999,
        }}
      >
        {menuItems.map((item) => (
          <Box
            key={item.id}
            textAlign="center"
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              color: activeMenu === item.id ? "navy" : "gray",
              "&:hover": { color: "navy" },
              "&:active": { color: "navy" },
            }}
          >
            <IconButton
              onClick={item.onClick || (() => setActiveMenu(item.id))}
              color="primary"
              sx={{
                color: "inherit",
                "&:hover": { color: "navy" },
              }}
            >
              <item.Icon size={getIconSize()} />
            </IconButton>
            <Typography
              variant="caption"
              sx={{ color: "inherit", "&:hover": { color: "navy" } }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default BottomMenu;
