import React , { useEffect } from 'react';
import { Box, Avatar, Grid, Container, Paper, Typography,Button } from '@mui/material';
import { motion } from 'framer-motion';
import { fetchUserProfile } from '../../features/account/accountSlice';
import { useSelector } from 'react-redux';
import { useNavigate ,useLocation  } from 'react-router-dom';
import { UseAppDispatch } from '../../store/configureStore';
import { toPersianNumbers } from "../../util/util";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const ProfileView = () => {

    const dispatch = UseAppDispatch();
    const navigate = useNavigate();
    const { user, isLoading } = useSelector((state) => state.account);
    const accountState = useSelector((state) => state.account);
    const location = useLocation();
const isAdminPage = location.pathname === '/admin/profile-view';



    useEffect(() => {
            dispatch(fetchUserProfile());
      }, [dispatch]);


  const profileImageURL = user?.profile_image && user.profile_image.startsWith('/media/')
    ? `http://127.0.0.1:8000${user.profile_image}`
    : user?.profile_image 
      ? `http://127.0.0.1:8000/media/${user.profile_image}`
      : '/default-profile.png';

  return (
    <Container maxWidth="md" sx={{ paddingTop: 3 , paddingBottom:12 }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/cp/")}
          endIcon={<KeyboardBackspaceIcon />}
          sx={{fontSize:'1rem'}}
        >
          بازگشت
        </Button>
      </Box>
        {isLoading ? (
              <Typography align="center">در حال بارگذاری...</Typography>
            ) : (
      <Paper elevation={4} sx={{display:'flex' , flexDirection:'column', textAlign: 'center', borderRadius: 5, width: { md: '60%', sx: '100%' }, mx: 'auto' , paddingX:{sm:10 , xs:4} , paddingY:4}}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Avatar
            src={profileImageURL}
            alt="Profile Image"
            sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, mx: 'auto', marginBottom: 2 }}
          />
          <Typography variant="h5" fontWeight="bold" color="primary" sx={{ marginBottom: 2 }}>
            پروفایل کاربری
          </Typography>
        </motion.div>
        <Grid container spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' },mt:2 }}>
          <Grid item xs={12} sm={12} sx={{mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,}}>
            <Typography variant="body1" fontWeight="bold" color="#616060" sx={{fontSize:'1.2rem' }}>نام کاربری:</Typography>
            <Typography variant="body1" sx={{fontSize:'0.98rem' , color:'#2367d5'}} >{user?.username || 'نامشخص'}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,}}>
            <Typography variant="body1" fontWeight="bold" color="#616060" sx={{fontSize:'1.2rem'}}>نام:</Typography>
            <Typography variant="body1" sx={{fontSize:'0.98rem' , color:'#2367d5'}}>{user?.first_name || 'نامشخص'}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,}}>
            <Typography variant="body1" fontWeight="bold" color="#616060" sx={{fontSize:'1.2rem'}}>نام خانوادگی:</Typography>
            <Typography variant="body1" sx={{fontSize:'0.98rem' , color:'#2367d5'}}>{user?.last_name || 'نامشخص'}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{mb: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed gray",
                paddingY: 1,
                color: "#56575b",
                paddingX: 1,}}>
            <Typography variant="body1" fontWeight="bold" color="#616060" sx={{fontSize:'1.2rem'}}>شماره موبایل:</Typography>
            <Typography variant="body1" sx={{fontSize:'0.99rem' , color:'#2367d5'}}>{user?.phone_number ? toPersianNumbers(user.phone_number) : 'نامشخص'}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingY: 1,
                color: "#56575b",
                borderBottom: "1px dashed gray",
                paddingX: 1,}}>
            <Typography variant="body1" fontWeight="bold" color="#616060" sx={{fontSize:'1.2rem'}}>جنسیت:</Typography>
            <Typography variant="body1" sx={{fontSize:'0.98rem' , color:'#2367d5'}}>
              {user?.gender === 'male' ? 'مرد' : user?.gender === 'female' ? 'زن' : 'نامشخص'}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
              <Button
                variant="contained"
                sx={{ bgcolor: '#FF1493', '&:hover': { bgcolor: '#ff61a6' } }}
                onClick={() => {
                  if (isAdminPage) {
                      navigate('/admin/edit-profile', { state: { from: '/admin/profile-view' } });
                  } else {
                      navigate('/cp/edit-profile', { state: { from: '/cp/profile-view' } });
                  }
              }}
              >
                ویرایش پروفایل
              </Button>
            </Box>
      </Paper>
            )}
    </Container>
  );
};

export default ProfileView;
