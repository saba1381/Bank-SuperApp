import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ImProfile } from "react-icons/im";
import { MdHistory } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { RiServiceLine } from "react-icons/ri";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { IoMdNotifications } from "react-icons/io";

const BottomMenu = ({ onProfileClick, onHistoryClick, onServicesClick, onSettingsClick }) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));

    const getIconSize = () => (isXs ? 24 : 30);

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                display: { xs: "flex", sm: "none" },
                justifyContent: "space-around",
                backgroundColor: "white",
                boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
                py: 0,
                px: 1,
                paddingBottom:1
            }}
        >
            {[
                { label: "پروفایل", Icon: ImProfile, onClick: onProfileClick },
                { label: "رخدادها", Icon: IoMdNotifications, onClick: onHistoryClick },
                { label: "خدمات", Icon: RiServiceLine, onClick: onServicesClick },
                { label: "تنظیمات", Icon: FiSettings, onClick: onSettingsClick },
            ].map((item, index) => (
                <Box
                    key={index}
                    textAlign="center"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "gray", 
                        "&:hover": {
                            color: "navy", 
                        },
                        "&:active": {
                            color: "navy",
                        }
                    }}
                >
                    <IconButton
                        onClick={item.onClick}
                        color="primary"
                        sx={{
                            color: "inherit", 
                            "&:hover": {
                                color: "navy", 
                            },
                        }}
                    >
                        <item.Icon size={getIconSize()} />
                    </IconButton>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "inherit", 
                            "&:hover": {
                                color: "navy", 
                            },
                        }}
                    >
                        {item.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default BottomMenu;
