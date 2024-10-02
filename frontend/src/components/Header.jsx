import React, { useEffect } from "react";
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

const Header = () => {
  const { user, isLoading } = useSelector((state) => state.account);
  const dispatch = UseAppDispatch();
  const isCPPage = window.location.pathname.startsWith("/cp");
  const [openDialog, setOpenDialog] = React.useState(false);

  useEffect(() => {
    if (!user && isCPPage) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, isCPPage]);

  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    dispatch(signOut());
    setOpenDialog(false);
  };

  useEffect(() => {
    //console.log('user:', user);
    //console.log('isLoading:', isLoading);
    //console.log('currentPath:', window.location.pathname);
  }, [user, isLoading]);

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(to right, #7c33ed, #2460eb)",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={`${process.env.PUBLIC_URL}/favicon.ico`}
            alt="App Icon"
            sx={{
              width: 30,
              height: 30,
              marginRight: "1rem",
              marginLeft: "0.5rem",
            }}
          />
          <Typography
            variant="h4"
            sx={{ display: "block", fontSize: { xs: "20px", md: "24px" } }}
          >
            موبایل بانک
          </Typography>
        </Box>

        {user && isCPPage && !isLoading && (
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
