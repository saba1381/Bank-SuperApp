import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { HiBanknotes } from "react-icons/hi2";

const Header = () => {
  return (
    <AppBar position="sticky" className='bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm'>
      <Toolbar>
      <HiBanknotes className='text-3xl ml-4' />
        <Typography variant="h6" className='sm:flex hidden'>
          موبایل بانک
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
