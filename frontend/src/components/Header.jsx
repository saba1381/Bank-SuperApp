// Header.tsx
import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import NotificationIcon from './icons/NotificationIcon';
import SettingsIcon from './icons/SettingsIcon';
import LogoutIcon from './icons/LogoutIcon';
import { useSelector } from 'react-redux';
import { UseAppDispatch } from '../store/configureStore';
import { fetchUserProfile, signOut } from '../features/account/accountSlice';


const Header = () => {
    const { user, isLoading } = useSelector((state) => state.account);
    const dispatch = UseAppDispatch();
    const isCPPage = typeof window !== 'undefined' && window.location.pathname === '/cp';
    const [openDialog, setOpenDialog] = React.useState(false);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, user]);

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
                        <Typography variant="body1" sx={{ marginRight: { xs: '0.3rem', md: '0.7rem' }, fontWeight: 'bold' }}>
                            {user.first_name} {user.last_name}
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
