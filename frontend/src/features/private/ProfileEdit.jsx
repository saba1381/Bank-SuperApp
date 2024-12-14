import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Avatar, Grid, Container, Paper, Typography, Select, MenuItem, Snackbar, Alert, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import * as yup from 'yup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { UseAppDispatch } from '../../store/configureStore';
import { fetchUserProfile , updateUserProfile} from '../../features/account/accountSlice';
import { useSelector } from 'react-redux';
import { useNavigate ,useLocation  } from 'react-router-dom';
import { CgOverflow } from 'react-icons/cg';

const validationSchema = yup.object({
  first_name: yup
    .string('نام خود را وارد کنید')
    .matches(/^[\u0600-\u06FF\s]+$/, 'نام باید به زبان فارسی باشد')
    .required('نام ضروری است'),
  last_name: yup
    .string('نام خانوادگی خود را وارد کنید')
    .matches(/^[\u0600-\u06FF\s]+$/, 'نام خانوادگی باید به زبان فارسی باشد')
    .required('نام خانوادگی ضروری است'),
  email: yup
    .string('ایمیل خود را وارد کنید')
    .email('ایمیل معتبر وارد کنید'),
   //.required('ایمیل ضروری است'),
  gender: yup
    .string('جنسیت خود را انتخاب کنید'),
    //.required('جنسیت ضروری است'),
  phone_number: yup
    .string('شماره موبایل خود را وارد کنید')
    .matches(/^[0-9]+$/, 'شماره موبایل باید فقط شامل اعداد باشد')
    .test('len', 'شماره موبایل باید 11 رقم باشد', val => val && val.length === 11)
    .test('start', 'شماره موبایل معتبر نیست', val => val && val.startsWith('09'))
    .required('شماره موبایل ضروری است'),
});

const ProfileEdit = () => {
  const dispatch = UseAppDispatch();
  const { user, isLoading } = useSelector((state) => state.account);
  const accountState = useSelector((state) => state.account);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); 
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);  
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();



  useEffect(() => {
  
    if (user && !isLoading && !hasFetchedOnce) {
      dispatch(fetchUserProfile());
      setHasFetchedOnce(true); 
    }
  }, [dispatch, user, isLoading, hasFetchedOnce]);

  const formik = useFormik({
    initialValues: {
      username: user?.username || '', 
      first_name: user?.first_name || '', 
      last_name: user?.last_name || '',
      email: user?.email || '',
      gender: user?.gender || '',
      phone_number: user?.phone_number || '',
      avatar : user?.profile_image || ''
    },
    enableReinitialize: true,
    validationSchema, 
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('email', values.email);
      formData.append('gender', values.gender);
      formData.append('phone_number', values.phone_number);

      
      if (selectedImageFile) {
        formData.append('profile_image', selectedImageFile);
      }

     
    try {
      const response = await dispatch(updateUserProfile(formData));

      if (response.error) {
        const errorMessage = typeof response.payload.error === "string"
                ? response.payload.error
                : Object.values(response.payload.error).flat()[0];
                setSnackbarMessage(errorMessage || 'خطا در به‌روزرسانی پروفایل');
                setSnackbarSeverity('error');
      } else { 
          setSnackbarMessage('پروفایل با موفقیت به‌روزرسانی شد');
          setSnackbarSeverity('success');
          setTimeout(() => {
              navigate('/cp');
          }, 4000);
      }

      setOpenSnackbar(true);
      
    }catch (error) {
        
        setSnackbarMessage('خطا در به‌روزرسانی پروفایل');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  const profileImageURL = user?.profile_image && user.profile_image.startsWith('/media/')
  ? `http://127.0.0.1:8000${user.profile_image}`
  : user?.profile_image 
    ? `http://127.0.0.1:8000/media/${user.profile_image}`
    : '/default-profile.png';




  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      setSelectedImageFile(e.target.files[0]); 
    }
  };
  const handleSubmit = () => {
    formik.setTouched({
      first_name: true,
      last_name: true,
      email: true,
      gender: true,
      phone_number: true, 
    });
    formik.handleSubmit();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleBackClick = () => {
    const previousPage = location.state?.from || "/cp"; 
    navigate(previousPage);
  };



  return (
    <Container maxWidth="full" sx={{ height:{sm:'120vh' , xs:'90vh'} ,maxHeight:'auto' , paddingTop:1  , paddingBottom:9, overflowY:'auto'} } >
      <Box sx={{display:{xs:'flex',sm:'none' ,md:'none'},  mb: 1 , justifyContent: 'flex-end'}}>
        <Button variant="contained" color="primary" onClick={handleBackClick} endIcon={<KeyboardBackspaceIcon />} sx={{fontSize:'0.9rem'}}>
          بازگشت
        </Button>
      </Box>
      <Paper elevation={4} sx={{ paddingY:4, borderRadius: 5, width: { md: '60%', sm: '80%' }, mx: 'auto' , paddingX:{sm:7 , xs:4}  }}>
      <Box sx={{display:{xs:'none',sm:'flex' , md:'flex'},  mb: 3 , justifyContent: 'flex-end'}}>
        <Button variant="contained" color="primary" onClick={handleBackClick} endIcon={<KeyboardBackspaceIcon />}>
          بازگشت
        </Button>
      </Box>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Typography variant="h5" align="center" gutterBottom>
            ویرایش پروفایل
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} textAlign="center">
                <Box sx={{ position: 'relative', display: 'inline-block' , mb:2 }}>
                  <Avatar
                    src={profileImage ||profileImageURL || '/default-profile.png'}
                    alt="Profile Image"
                    sx={{ width: 80, height: 80, margin: 'auto' }}
                  />
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: 'none' }}
                      id="upload-photo"
                      name="upload-photo"
                      value={formik.values.profileImage}
                      type="file"
                      onChange={handleImageChange}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: -10,
                        right: 0,
                        left: -15,
                        height: '40px',
                        width: '40px',
                        minWidth: 0,
                        padding: 0,
                        borderRadius: 'full',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PhotoCamera />
                    </Button>
                  </label>
                </Box>
              </Grid>
            


              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="first_name"
                  name="first_name"
                  label={
                    <span>
                      نام <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  variant="outlined"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                  helperText={formik.touched.first_name && formik.errors.first_name}
                  InputLabelProps={{ sx: { color: 'gray' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#FF1493' },
                      '&.Mui-focused fieldset': { borderColor: '#FF1493' },
                    },
                    '& label.Mui-focused': { color: '#FF1493' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="last_name"
                  name="last_name"
                  label={
                    <span>
                      نام خانوادگی <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  variant="outlined"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                  helperText={formik.touched.last_name && formik.errors.last_name}
                  InputLabelProps={{ sx: { color: theme.palette.grey } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#FF1493' },
                      '&.Mui-focused fieldset': { borderColor: '#FF1493' },
                    },
                    '& label.Mui-focused': { color: '#FF1493' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label={
                    <span>
                       نام کاربری <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  variant="outlined"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  InputLabelProps={{ sx: { color: 'gray' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#FF1493' },
                      '&.Mui-focused fieldset': { borderColor: '#FF1493' },
                    },
                    '& label.Mui-focused': { color: '#FF1493' },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="ایمیل(اختیاری)"
                  variant="outlined"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputLabelProps={{ sx: { color: 'gray' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#FF1493' },
                      '&.Mui-focused fieldset': { borderColor: '#FF1493' },
                    },
                    '& label.Mui-focused': { color: '#FF1493' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone_number"
                  name="phone_number"
                  label={
                    <span>
                      شماره موبایل <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  variant="outlined"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                  helperText={formik.touched.phone_number && formik.errors.phone_number}
                  InputLabelProps={{ sx: { color: 'gray' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#FF1493' },
                      '&.Mui-focused fieldset': { borderColor: '#FF1493' },
                    },
                    '& label.Mui-focused': { color: '#FF1493' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'انتخاب جنسیت' }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#FF1493' },
                      '&.Mui-focused fieldset': { borderColor: '#FF1493' },
                    },
                    '& label.Mui-focused': { color: '#FF1493' },
                  }}
                >
                  <MenuItem value="">
                    جنسیت  (اختیاری)
                  </MenuItem>
                  <MenuItem value="male">مرد</MenuItem>
                  <MenuItem value="female">زن</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Box mt={4} textAlign="center">
              <Button
                variant="contained"
                sx={{ bgcolor: '#FF1493', '&:hover': { bgcolor: '#ff61a6' } }}
                onClick={handleSubmit}
              >
                به‌روزرسانی پروفایل
              </Button>
            </Box>
          </form>
        </motion.div>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileEdit;
