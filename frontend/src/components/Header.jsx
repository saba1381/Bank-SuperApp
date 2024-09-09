import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import NotificationIcon from './icons/NotificationIcon';
import SettingsIcon from './icons/SettingsIcon';
import LogoutIcon from './icons/LogoutIcon';
import { UseAppSelector } from '../store/configureStore';

const Header = () => {
  const { user } = UseAppSelector(state => state.account);
  const isCPPage = typeof window !== 'undefined' && window.location.pathname === '/cp';
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log(user);
    
    setIsClient(true);
  }, []);

 
  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(to right, #2560eb, #7c3aed)', 
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)' 
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* بخش سمت راست */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AssuredWorkloadIcon style={{ fontSize: '1.875rem', marginRight: '1rem' }} />
          <Typography 
            variant="h6" 
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
            <LogoutIcon />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
