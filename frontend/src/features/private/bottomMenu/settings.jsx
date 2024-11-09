import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Button,
  Container,
  Avatar,
} from "@mui/material";
import { FiSettings } from "react-icons/fi";
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
    }else{navigate( isCPPage ? "/cp/setting/edit-password" : "/admin/setting/edit-password")}
    
  };

  const handleBackToSettings = () => {
    setShowChangePassword(false);
  };

  const handleEditProfileClick = () => {
    if (isNewUser) {
      setNotificationOpen(true);
    } else {
      if(isCPPage){
        navigate('/cp/edit-profile' , {state:{from : '/cp/setting'}});
      }else if(isSettingPage){
        navigate('/admin/edit-profile' , {state:{from : '/admin/setting'}});
      }
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };


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
            backgroundColor: "#F5F5F9",
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
              bottom: 72,
              backgroundColor: "#F5F5F9",
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
                    backgroundColor: "white",
                    justifyContent: "space-between",
                    borderRadius: "10px",
                    boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <Notification open={notificationOpen} onClose={handleNotificationClose} />
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
                        color: "black",
                        alignItems: "start",
                        marginLeft:2
                      }}
                    >
                      {user.first_name} {user.last_name} 
                    </Typography>
                  </Box>
                  <IconButton onClick={handleEditProfileClick} sx={{ ml: 1 , '&:hover' : {color:'pink'} }}>
                    <MdEdit size={20}  />
                  </IconButton>
                </Box>
              )}

              <Box
                sx={{
                  borderRadius: "12px",
                  marginTop: "35px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                {[
                  {
                    icon: <MdLock size={20} />,
                    label: "تغییر رمز",
                    action: handleChangePasswordClick,
                  },
                  {
                    icon: <FiSettings size={20} />,
                    label: "تنظیمات شیوه ورود",
                  },
                  { icon: <MdTextFields size={20} />, label: "تغییر سایز متن" },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      padding: 2,
                      marginBottom: "5px",
                      cursor: "pointer",
                      "&:hover": { "& *": { color: "#6b7280" } },
                    }}
                    onClick={item.action}
                  >
                    <IconButton sx={{ color:'#9711df ' }}>{item.icon}</IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {item.label}
                    </Typography>
                    <IconButton>
                      <FaChevronLeft size={20} />
                    </IconButton>
                  </Box>
                ))}

                <Box
                  sx={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    cursor: "pointer",
                    "&:hover": { "& *": { color: "#6b7280" } },
                  }}
                  onClick={handleLogoutClick}
                >
                  <IconButton sx={{color:'#9711df ' }}>
                    <RiLogoutCircleRLine size={20} />
                  </IconButton>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    خروج
                  </Typography>
                  <IconButton>
                    <FaChevronLeft size={20} />
                  </IconButton>
                </Box>
              </Box>
            </Container>

            <Modal
              open={openDialog}
              onClose={handleCloseDialog}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 4000,
              }}
            >
              <Box
                sx={{
                  borderRadius: "16px",
                  backgroundColor: "white",
                  padding: 2,
                  width: "300px",
                  boxShadow: 24,
                  outline: "none",
                }}
              >
                <Typography>
                  آیا برای خروج از موبایل بانک مطمئن هستید؟
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    marginTop: 2,
                  }}
                >
                  <Button onClick={handleConfirmLogout} color="secondary">
                    بله
                  </Button>
                  <Button onClick={handleCloseDialog} color="primary">
                    انصراف
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        </motion.div>
      )}
    </>
  );
};

export default Settings;
