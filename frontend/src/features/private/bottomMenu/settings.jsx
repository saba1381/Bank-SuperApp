import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Button,
  Container,
  Avatar,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { TiMessages } from "react-icons/ti";
import { MdLock, MdTextFields } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { signOut } from "../../account/accountSlice";
import ChangePassword from "./ChangePassword";
import { useSelector } from "react-redux";
import { UseAppDispatch } from "../../../store/configureStore";
import { fetchUserProfile, fetchCurrentUser } from "../../account/accountSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { MdEdit } from "react-icons/md";
import Notification from "../Notification";
import ThemeSwitcher from "../../../themeSwitch";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { RiErrorWarningLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";


const Settings = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { user, isLoading } = useSelector((state) => state.account);
  const dispatch = UseAppDispatch();
  const isCPPage = window.location.pathname === "/cp/setting";
  const isSettingPage = window.location.pathname === "/admin/setting";
  const navigate = useNavigate();
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const mode = useSelector((state) => state.theme.mode);
  const theme = useTheme();

  useEffect(() => {
    if (user && !isLoading && !hasFetchedOnce) {
      dispatch(fetchUserProfile());
      setHasFetchedOnce(true);
    }
  }, [dispatch, user, isLoading, hasFetchedOnce]);

  useEffect(() => {
    const newUser = localStorage.getItem("isNewUser") === "true";
    setIsNewUser(newUser);
  }, []);

  const profileImageURL =
    user?.profile_image && user.profile_image.startsWith("/media/")
      ? `http://127.0.0.1:8000${user.profile_image}`
      : user?.profile_image
      ? `http://127.0.0.1:8000/media/${user.profile_image}`
      : "/default-profile.png";

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

  const handleChangePasswordClick = () => {
    if (isNewUser) {
      setNotificationOpen(true);
    } else {
      navigate(
        isCPPage ? "/cp/setting/edit-password" : "/admin/setting/edit-password"
      );
    }
  };

  const handleBackToSettings = () => {
    setShowChangePassword(false);
  };

  const handleEditProfileClick = () => {
    if (isNewUser) {
      setNotificationOpen(true);
    } else {
      if (isCPPage) {
        navigate("/cp/edit-profile", { state: { from: "/cp/setting" } });
      } else if (isSettingPage) {
        navigate("/admin/edit-profile", { state: { from: "/admin/setting" } });
      }
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const location = useLocation(); 

  const isAdminPath = location.pathname.startsWith("/admin");
  const bottomValue = isAdminPath ? 0 : 72;

  return (
    <>
      {showChangePassword ? (
        <ChangePassword onBack={handleBackToSettings} />
      ) : (
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ type: "tween", duration: 0.5 }}
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            // backgroundColor: "#F5F5F9",
            zIndex: 1,
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: bottomValue,
              backgroundColor: theme.palette.background.paper,
              zIndex: 1,
              boxShadow: "0 -2px 2px rgba(0,0,0,0.1)",
              overflowY: "auto",
              width: "100%",
              paddingY: 11,
              paddingX: { sm: 6, md: 35, xl: 40 },
            }}
          >
            <Container>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/cp")}
                  endIcon={<KeyboardBackspaceIcon />}
                >
                  بازگشت
                </Button>
              </Box>

              {user && !isLoading && (isCPPage || isSettingPage) && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    backgroundColor: theme.palette.background.paper,
                    justifyContent: "space-between",
                    borderRadius: "10px",
                    border: "0.6px solid #d5d5d5",
                    boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <Notification
                    open={notificationOpen}
                    onClose={handleNotificationClose}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={profileImageURL || ""}
                      sx={{
                        width: { xs: 55, md: 45 },
                        height: { xs: 55, md: 45 },
                        ml: "6px",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        marginLeft: { xs: "0.4rem", md: "0.7rem" },
                        fontWeight: "bold",
                        alignItems: "start",
                        marginLeft: 2,
                      }}
                    >
                      {user.first_name} {user.last_name}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={handleEditProfileClick}
                    
                    sx={{ ml: 1, "&:hover": { color: "pink" } , color: theme.palette.text.secondary }}
                  >
                    <MdEdit size={20} />
                  </IconButton>
                </Box>
              )}

              <Box
                sx={{
                  borderRadius: "12px",
                  marginTop: "35px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  //border: "0.6px solid #d5d5d5",
                }}
              >
                {[
                  {
                    icon: <MdLock size={20} />,
                    label: "تغییر رمز",
                    action: handleChangePasswordClick,
                  },
                  // ...(isSettingPage
                  //   ? [
                  //       {
                  //         icon: <TiMessages size={20} />,
                  //         label: "مدیریت اعلانات",
                  //         action: () => navigate("/admin/announcements"),
                  //       },
                  //     ]
                  //   : []),
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      display: "flex",
                      alignItems: "center",
                      padding: 2,
                      marginBottom: "5px",
                      borderRadius:'12px 12px 0 0',
                      cursor: "pointer",
                      border: "0.6px solid #d5d5d5",
                      "&:hover": { "& *": { color: "#6b7280" } },
                    }}
                    onClick={item.action}
                  >
                    <IconButton sx={{ color: "#9711df " }}>
                      {item.icon}
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {item.label}
                    </Typography>
                    <IconButton sx={{color: theme.palette.text.primary}}>
                      <FaChevronLeft  size={17} />
                    </IconButton>
                  </Box>
                ))}
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                    paddingLeft: 2,
                    paddingRight: 0,
                    
                    paddingY: 0.8,
                    cursor: "pointer",
                    border: "0.6px solid #d5d5d5",
                    "&:hover": { "& *": { color: "#6b7280" } },
                  }}
                >
                  <IconButton sx={{ color: "#9711df " }}>
                    <Brightness4Icon style={{ fontSize: "20px", color: "#9711df"}} />
                  </IconButton>

                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {mode === "dark" ? "حالت روشن" : "حالت تاریک"}
                  </Typography>
                  <IconButton >
                    <ThemeSwitcher size={20} />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    cursor: "pointer",
                    border: "0.6px solid #d5d5d5",
                    borderRadius:'0 0 12px 12px',
                    "&:hover": { "& *": { color: "#6b7280" } },
                  }}
                  onClick={handleLogoutClick}
                >
                  <IconButton sx={{ color: "#9711df " }}>
                    <RiLogoutCircleRLine size={20} sx={{ color: "#9711df " }} />
                  </IconButton>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    خروج
                  </Typography>
                  <IconButton sx={{color: theme.palette.text.primary}}>
                    <FaChevronLeft size={17} />
                  </IconButton>
                </Box>
              </Box>
            </Container>

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
                   <DialogContent sx={{display:'flex' , textAlign:'left' , justifyContent:'center' , alignItems:'center' , gap:1}}>
                     <RiErrorWarningLine size={18}/>
                     <Typography>آیا برای خروج از موبایل بانک مطمئن هستید؟</Typography>
                   </DialogContent>
                   <DialogActions sx={{ justifyContent: "start" }}>
                     <Button onClick={handleConfirmLogout} variant="h5" sx={{
                     color: "white",
                     height:'35px',
                     borderRadius:'10px',
                     backgroundColor: "#7c33ed",
                     "&:hover": {
                       backgroundColor: "#5a23b5",
                     },
                     transition: "background-color 0.3s ease",
                   }}>
                       بله
                     </Button>
                     <Button onClick={handleCloseDialog} variant="h5" sx={{
                     color: "white",
                     height:'35px',
                     borderRadius:'10px',
                     backgroundColor: "#7c33ed",
                     "&:hover": {
                       backgroundColor: "#5a23b5",
                     },
                     transition: "background-color 0.3s ease",
                   }}>
                       انصراف
                     </Button>
                   </DialogActions>
                 </Dialog>
          </Box>
        </motion.div>
      )}
    </>
  );
};

export default Settings;
