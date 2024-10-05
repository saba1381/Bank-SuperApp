import React from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import { RiLogoutCircleLine } from 'react-icons/ri';

const LogoutIcon = ({ onClick }) => {
  return (
    <IconButton color="inherit" onClick={onClick}>
      <Box display="flex" alignItems="center">
        <Typography 
          variant="body3" 
          sx={{ 
            fontSize: '0.9rem', 
            display: { xs: 'none', md: 'block'},
            mr:'3px' 
          }}
        >
          خروج
        </Typography>
        <RiLogoutCircleLine style={{ fontSize: '1.2rem', marginRight: { md: '1.3rem', xs: '0' } }} />
      </Box>
    </IconButton>
  );
};

export default LogoutIcon;
