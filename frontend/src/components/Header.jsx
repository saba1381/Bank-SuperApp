import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Box, Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import NotificationIcon from './icons/NotificationIcon';
import SettingsIcon from './icons/SettingsIcon';
import LogoutIcon from './icons/LogoutIcon';
import { useDispatch } from 'react-redux';
import { signOut } from '../features/account/accountSlice';
import { UseAppSelector } from '../store/configureStore';

const Header = () => {
  const { user } = UseAppSelector((state) => state.account);
  const isCPPage = typeof window !== 'undefined' && window.location.pathname === '/cp';
  const [openDialog, setOpenDialog] = useState(false);
  const [profile, setProfile] = useState({ firstName: '', lastName: '' });
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      axios
        .get('http://localhost:8000/api/users/profile/update/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        .then((response) => {
          console.log('API Response:', response);
          const { first_name, last_name } = response;
          setProfile({ firstName: first_name, lastName: last_name }); // Save only the required data in local state
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
        });
    }
  }, [user]);

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

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(to right, #2560eb, #7c3aed)',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AssuredWorkloadIcon style={{ fontSize: '1.875rem', marginRight: '1rem', marginLeft: '0.5rem' }} />
          <Typography variant="h4" sx={{ display: { xs: 'none', sm: 'block' } }}>
            موبایل بانک
          </Typography>
        </Box>

        {user && isCPPage && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight:{xs :'0.3rem', md:'0.7rem'}, fontWeight: 'bold' }}>
              {profile.firstName} {profile.lastName}
            </Typography>
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
          sx: {
            borderRadius: '16px',
          },
        }}
      >
        <DialogContent>
          <Typography>آیا برای خروج از موبایل بانک مطمئن هستید؟</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'start' }}>
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
