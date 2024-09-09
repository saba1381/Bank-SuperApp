import React from 'react';
import { IconButton, Link } from '@mui/material';
import { RiLogoutCircleLine } from 'react-icons/ri';

const LogoutIcon = () => {
  return (
    <IconButton color="inherit">
      <Link href="/logout" color="inherit" underline="none">
        <RiLogoutCircleLine />
      </Link>
    </IconButton>
  );
};

export default LogoutIcon;
