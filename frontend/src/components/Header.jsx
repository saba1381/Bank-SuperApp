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
import { useLocation } from "react-router-dom";


const Header = () => {
  const { user, isLoading } = useSelector((state) => state.account);
  const dispatch = UseAppDispatch();
  const isCPPage = window.location.pathname==="/cp";
  const isSettingPage = window.location.pathname.startsWith("/cp/setting");
  const [openDialog, setOpenDialog] = React.useState(false);
  const { headerTitle, setHeaderTitle } = useHeader();
  const location = useLocation();
  const showLogoutIcon =
    user &&
    !isLoading &&
    (location.pathname.startsWith("/cp") && !location.pathname.includes("/cp/setting")) ||
    (location.pathname.startsWith("/admin"));



  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    dispatch(signOut());
    setOpenDialog(false);
    localStorage.removeItem('isNewUser');
  };

  useEffect(() => {
    const path = location.pathname;

    if (path==="/cp/setting") {
      setHeaderTitle("تنظیمات");
    } else if (path.startsWith("/cp/setting/edit-password")) {
      setHeaderTitle("تغییر رمز عبور");
    }else if (path === "/cp/transfer"){
        setHeaderTitle('انتقال وجه')
    }
    else if (path === "/cp/charge"){
      setHeaderTitle('خرید شارژ')
  }
  else if (path === "/cp/profile-view"){
    setHeaderTitle('پروفایل')
}
     else {
      setHeaderTitle(" ");
    }
  }, [setHeaderTitle, location.pathname]); 

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(to right, #7c33ed, #2460eb)",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        paddingY:0.2, 

      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="App Icon"
            variant="square"
            sx={{
              width: {xs:60 , md:70},
              height: {xs:60 , md:70},
              marginLeft: "0.1rem",
            }}
          />
          <Typography
            variant="h4"
            sx={{ display: "block", fontSize: { xs: "20px", md: "24px" } , ml:1}}
          >
             {headerTitle}
          </Typography>
        </Box>

        {user && showLogoutIcon  && !isLoading &&(
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LogoutIcon onClick={handleLogoutClick} />
          </Box>
        )}
      </Toolbar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            zIndex:1000
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

export default Header;
