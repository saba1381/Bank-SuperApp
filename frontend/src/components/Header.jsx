// Header.tsx
import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box,Avatar ,Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import NotificationIcon from './icons/NotificationIcon';
import SettingsIcon from './icons/SettingsIcon';
import LogoutIcon from './icons/LogoutIcon';
import { useSelector } from 'react-redux';
import { UseAppDispatch } from '../store/configureStore';
import { fetchUserProfile, signOut , fetchCurrentUser } from '../features/account/accountSlice';


const Header = () => {
    const { user, isLoading } = useSelector((state) => state.account);
    const dispatch = UseAppDispatch();
    const isCPPage =window.location.pathname === '/cp';
    const [openDialog, setOpenDialog] = React.useState(false);

    useEffect(() => {
        if (!user && localStorage.getItem('user')) {
            dispatch(fetchCurrentUser()); // واکشی کاربر از localStorage
        }
    }, [dispatch, user]);

    // واکشی اطلاعات پروفایل فقط زمانی که کاربر لاگین کرده و در صفحه cp هست
    useEffect(() => {
        if (!user && isCPPage) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, user, isCPPage]);
    
    const profileImageURL = user?.profile_image && user.profile_image.startsWith('/media/')
    ? `http://127.0.0.1:8000${user.profile_image}`
    : user?.profile_image 
      ? `http://127.0.0.1:8000/media/${user.profile_image}`
      : '/default-profile.png';
  

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

    useEffect(() => {
        console.log('user:', user);
        console.log('isLoading:', isLoading);
        console.log('currentPath:', window.location.pathname);
    }, [user, isLoading]);

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

                {user && isCPPage && !isLoading &&(
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                       
                        <Typography variant="body1" sx={{ marginRight: { xs: '0.3rem', md: '0.7rem' }, fontWeight: 'bold' }}>
                            {user.first_name} {user.last_name}
                        </Typography>
                        
                        <LogoutIcon onClick={handleLogoutClick} />
                        <Avatar
                    src={profileImageURL ||''}
                    
                    sx={{ width: {xs:35 , md:45}, height: {xs:35 , md:45} ,ml:'6px' }}
                  />
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
