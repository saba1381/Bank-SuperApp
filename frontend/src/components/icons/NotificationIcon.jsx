import React, { useState } from 'react';
import { IconButton, Snackbar } from '@mui/material';
import { IoIosNotifications } from 'react-icons/io';

const NotificationIcon = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleNotificationClick = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleNotificationClick} >
        <IoIosNotifications style={{ fontSize: '1.2rem' }} />
      </IconButton>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="اعلان جدید"
      />
    </>
  );
};

export default NotificationIcon;
