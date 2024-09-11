import React, { useState } from 'react';
import { Box, Button, TextField, Avatar, Grid, Container, Paper, Typography, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import * as yup from 'yup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const validationSchema = yup.object({
  firstName: yup.string('نام خود را وارد کنید').required('نام ضروری است'),
  lastName: yup.string('نام خانوادگی خود را وارد کنید').required('نام خانوادگی ضروری است'),
  email: yup.string('ایمیل خود را وارد کنید').email('ایمیل معتبر وارد کنید').required('ایمیل ضروری است'),
  gender: yup.string('جنسیت خود را انتخاب کنید').required('جنسیت ضروری است'),
});

const ProfileEdit = ({ onClose }) => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Profile Updated:', values);
      alert(JSON.stringify(values, null, 2));
      onClose();
    },
    validateOnBlur: false,
    validateOnChange: false
  });

  const handleSubmit = () => {
    formik.setTouched({
      firstName: true,
      lastName: true,
      email: true,
      gender: true,
    });
    formik.handleSubmit();
  };

  return (
    <Container maxWidth="full" >
        <Box sx={{ mt: 1,mb:2 ,display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={onClose} endIcon={<KeyboardBackspaceIcon />}>
          بازگشت
        </Button>
      </Box>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 5 ,width:{md:'70%' , sx:'100%'},mx: 'auto' }} >
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Typography variant="h5" align="center" gutterBottom>
            ویرایش پروفایل
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} textAlign="center">
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={profileImage || '/default-profile.png'}
                    alt="Profile Image"
                    sx={{ width: 80, height: 80, margin: 'auto' }}
                  />
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: 'none' }}
                      id="upload-photo"
                      name="upload-photo"
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
                  id="firstName"
                  name="firstName"
                  label="نام"
                  variant="outlined"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  InputLabelProps={{ sx: { color: 'gray' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#FF1493',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF1493',
                      },
                    },
                    '& label.Mui-focused': {
                      color: '#FF1493',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="نام خانوادگی"
                  variant="outlined"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  InputLabelProps={{ sx: { color: 'gray' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#FF1493',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF1493',
                      },
                    },
                    '& label.Mui-focused': {
                      color: '#FF1493',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="ایمیل"
                  variant="outlined"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputLabelProps={{ sx: { color: 'gray' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#FF1493',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF1493',
                      },
                    },
                    '& label.Mui-focused': {
                      color: '#FF1493',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
  <Select
    fullWidth
    id="gender"
    name="gender"
    value={formik.values.gender}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    displayEmpty
    error={formik.touched.gender && Boolean(formik.errors.gender)}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'gray', // default border color
        },
        '&:hover fieldset': {
          borderColor: '#FF1493', // color when hovered
        },
        '&.Mui-focused fieldset': {
          borderColor: '#FF1493', // color when focused
        },
      },
      '& .MuiSelect-select': {
        '&:focus': {
          borderColor: '#FF1493', // color when focused
        },
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#FF1493', // color of the label when focused
      },
    }}
  >
    <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>
      جنسیت
    </MenuItem>
    <MenuItem value="male">مرد</MenuItem>
    <MenuItem value="female">زن</MenuItem>
  </Select>
  <Typography color="error" variant="caption">
    {formik.touched.gender && formik.errors.gender}
  </Typography>
</Grid>


              <Grid item xs={12} textAlign="center">
                <Button variant="contained" color="primary" onClick={handleSubmit} type="submit" sx={{ mt: 2 }}>
                  ذخیره
                </Button>
              </Grid>
            </Grid>
          </form>
        </motion.div>
      </Paper>

      {/* Back button */}
      
    </Container>
  );
};

export default ProfileEdit;
