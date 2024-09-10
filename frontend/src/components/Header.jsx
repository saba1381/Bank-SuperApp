import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import NotificationIcon from './icons/NotificationIcon';
import SettingsIcon from './icons/SettingsIcon';
import LogoutIcon from './icons/LogoutIcon';
import { UseAppSelector } from '../store/configureStore';
import { useDispatch } from 'react-redux';
import { signOut } from '../features/account/accountSlice';
const Header = () => {
  const { user } = UseAppSelector(state => state.account);
  const isCPPage = typeof window !== 'undefined' && window.location.pathname === '/cp';
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleLogoutClick = () => {
    setOpenDialog(true); // نمایش دیالوگ تایید
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // بستن دیالوگ تایید
  };

  const handleConfirmLogout = () => {
    dispatch(signOut());
    setOpenDialog(false); // بستن دیالوگ تایید
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(to right, #2560eb, #7c3aed)', 
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)' 
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AssuredWorkloadIcon style={{ fontSize: '1.875rem', marginRight: '1rem', marginLeft: '0.5rem' }} />
          <Typography 
            variant="h4" 
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            موبایل بانک
          </Typography>
        </Box>

        {/* بخش سمت چپ */}
        {user && isCPPage && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NotificationIcon />
            <SettingsIcon />
            <LogoutIcon onClick={handleLogoutClick} />
          </Box>
        )}
      </Toolbar>

    
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx:{
            borderRadius:'16px'
          }
        }}
        
      >
        <DialogTitle>تایید خروج</DialogTitle>
        <DialogContent>
          <Typography>     آیا برای خروج از موبایل بانک مطمعن هستید؟</Typography>
        </DialogContent>
        <DialogActions>
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
