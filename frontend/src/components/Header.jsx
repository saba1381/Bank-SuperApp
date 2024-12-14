import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import NotificationIcon from "./icons/NotificationIcon";
import SettingsIcon from "./icons/SettingsIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { useSelector } from "react-redux";
import { UseAppDispatch } from "../store/configureStore";
import {
  fetchUserProfile,
  signOut,
  fetchCurrentUser,
} from "../features/account/accountSlice";
import { useHeader } from "../components/contexts/HeaderContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaCreditCard, FaUserCircle, FaCog } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa"; 



const Header = () => {
  const { user, isLoading } = useSelector((state) => state.account);
  const dispatch = UseAppDispatch();
  const isCPPage = window.location.pathname === "/cp";
  const isSettingPage = window.location.pathname.startsWith("/cp/setting");
  const [openDialog, setOpenDialog] = React.useState(false);
  const { headerTitle, setHeaderTitle } = useHeader();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdsPage = location.pathname === "/cp/ads";



  const showLogoutIcon =
    (user &&
      !isLoading &&
      location.pathname.startsWith("/cp") &&
      !location.pathname.includes("/cp/setting")) ||
    location.pathname.startsWith("/admin");

  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    dispatch(signOut());
    setOpenDialog(false);
    localStorage.removeItem("isNewUser");
  };
  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const path = location.pathname;

    if (path === "/cp/setting") {
      setHeaderTitle("تنظیمات");
    } else if (path.startsWith("/cp/setting/edit-password")) {
      setHeaderTitle("تغییر رمز عبور");
    } else if (path === "/cp/transfer") {
      setHeaderTitle("انتقال وجه");
    } else if (path === "/cp/charge") {
      setHeaderTitle("خرید شارژ");
    } else if (path === "/cp/profile-view") {
      setHeaderTitle("پروفایل");
    } else if (path === "/admin") {
      setHeaderTitle("پنل مدیر سیستم");
    }
    else if (path === "/cp/ads") {
      setHeaderTitle("اعلانات");
    } else {
      setHeaderTitle(" ");
    }
  }, [setHeaderTitle, location.pathname]);

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(to right, #7c33ed, #2460eb)",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        paddingY: 0.2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAdsPage ? ( 
            <FaArrowRight
              style={{
                fontSize: "19px",
                color: "white",
                cursor: "pointer",
                marginLeft:3,
                marginRight:4
              }}
              onClick={() => navigate('/cp/')} 
            />
          ) : (
            <Avatar
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="App Icon"
              variant="square"
              sx={{
                width: { xs: 60, md: 70 },
                height: { xs: 60, md: 70 },
                marginLeft: "0.1rem",
              }}
            />
          )}
          <Typography
            variant="h4"
            sx={{
              display: "block",
              fontSize: { xs: "20px", md: "24px" },
              ml: 1,
            }}
          >
            {headerTitle}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
          {isAdminPage && (
  <>

    <Box
      sx={{
        color: "white",
        cursor: "pointer",
        "&:hover": { color: "#a2a7ad" },
        transition: "color 0.3s ease",
        display:"flex",
        alignItems:"center"
      }}
      onClick={() => handleNavigate("/admin/profile-view")}
    >
       <Typography 
          variant="body3" 
          sx={{ 
            fontSize: '0.9rem', 
            display: { xs: 'none', sm: 'block'},
            mr:'6px' 
          }}
        >
          پروفایل
        </Typography>
      <FaUserCircle style={{ fontSize: "20px" , marginLeft:9}} />
    </Box>
    <Box
      sx={{
        color: "white",
        cursor: "pointer",
        "&:hover": { color: "#a2a7ad" },
        transition: "color 0.3s ease",
         display:"flex",
        alignItems:"center"
      }}
      onClick={() => handleNavigate("/admin/setting")}
    >
      <Typography 
          variant="body3" 
          sx={{ 
            fontSize: '0.9rem', 
            display: { xs: 'none', sm: 'block'},
            mr:'6px' ,
            ml:'5px'
          }}
        >
          تنظیمات
        </Typography>
      <FaCog style={{ fontSize: "20px" , marginRight:{xs:10 , sm:0}}} />
    </Box>

  </>
  
)}


        {user && showLogoutIcon && !isLoading && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LogoutIcon onClick={handleLogoutClick} />
          </Box>
        )}
        </Box>
      </Toolbar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            zIndex: 1000,
          },
        }}
      >
        <DialogContent>
          <Typography>آیا برای خروج از موبایل بانک مطمئن هستید؟</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "start" }}>
          <Button onClick={handleConfirmLogout} color="secondary">
            بله
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            انصراف
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

const menuItemStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  "&:hover svg": { color: "#6b7280" },
};

const iconStyles = {
  color: "#333",
  fontSize: "24px",
  transition: "color 0.3s",
};

export default Header;
