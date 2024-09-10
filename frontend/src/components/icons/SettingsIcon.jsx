import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { IoMdSettings } from 'react-icons/io';

const SettingsIcon = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleSettingsClick} style={{ fontSize: '1.1rem' }}>
        <IoMdSettings />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>پروفایل</MenuItem>
        <MenuItem onClick={handleMenuClose}>تنظیمات</MenuItem>
      </Menu>
    </>
  );
};

export default SettingsIcon;
