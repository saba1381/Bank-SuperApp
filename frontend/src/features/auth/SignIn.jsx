import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BiErrorCircle } from "react-icons/bi";
import { Container, TextField, Button, Box, Typography, Checkbox, FormControlLabel, Paper, Link as MuiLink, IconButton, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UseAppDispatch } from '../../store/configureStore';
import { signInUser } from '../account/accountSlice';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; 



const StyledPaper = styled(Paper)(({ theme }) => ({
    maxWidth: '600px',
    width: '100%',
    padding: theme.spacing(4),
    margin: theme.spacing(5, 0),
    borderRadius: '16px',
    boxShadow: theme.shadows[3],
}));

const GradientText = styled('span')({
    background: 'linear-gradient(to right, #6B46C1, #6B46C1, #4299E1, #3182CE)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
});

const Overlay = styled('div')(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const validationSchema = Yup.object({
    nationalId: Yup.string()
        .matches(/^[0-9]*$/, 'کدملی باید شامل اعداد باشد')
        .length(10, 'کدملی باید 10 رقم باشد')
        .required('کد ملی را وارد کنید'),
    mobile: Yup.string()
        .matches(/^[0-9]*$/, 'شماره موبایل باید شامل اعداد باشد')
        .matches(/^(09)[0-9]{9}$/, 'شماره موبایل معتبر نیست')
        .required('شماره موبایل را وارد کنید'),
});

export default function SignIn() {
    const navigate = useNavigate(); 
    const dispatch = UseAppDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false); // وضعیت برای کنترل نمایش Snackbar
    const [overlayOpen, setOverlayOpen] = useState(false); // وضعیت برای کنترل نمایش Overlay

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            formik.resetForm();
        } else {
            formik.setFieldValue('nationalId', localStorage.getItem('nationalId') || '');
            formik.setFieldValue('mobile', localStorage.getItem('mobile') || '');
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            nationalId: '',
            mobile: '',
            rememberMe: false,
        },
        validationSchema: validationSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            localStorage.removeItem('access_token');

            if (values.rememberMe) {
                localStorage.setItem('nationalId', values.nationalId);
                localStorage.setItem('mobile', values.mobile);
            } else {
                localStorage.removeItem('nationalId');
                localStorage.removeItem('mobile');
            }

            try {
                const result = await dispatch(signInUser({
                    phone_number: values.mobile,
                    national_code: values.nationalId
                }));
                console.log(result);

                if (result.meta.requestStatus === 'fulfilled') {
                    localStorage.setItem('access_token', result.payload.access);
                    localStorage.setItem('refresh_token', result.payload.refresh);
                    console.log("ورود");

                    window.location.assign('/cp');
                } else {
                    setFieldError('general', 'کدملی یا شماره موبایل اشتباه است.');
                }
            } catch (error) {
                setFieldError('general', 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
            }

            setSubmitting(false);
        },
    });

    
    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
        setOverlayOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setOverlayOpen(false); 
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: { xs: '80vh', md: '100%' }, bgcolor: 'grey.100' }}>
            <Helmet>
                <title>ورود به موبایل بانک</title>
            </Helmet>

            <StyledPaper sx={{ p: { xs: 2, md: 6 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3" align="start" gutterBottom>
                        <GradientText>ورود به حساب</GradientText>
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<HelpOutlineIcon style={{fontSize:'13px'}} />}
                        onClick={handleSnackbarOpen}
                        sx={{ ml: 2 , fontSize:'13px' , padding:(0,0,0,2) , display:'flex' , height:'5px'}}
                    >
                        راهنما
                    </Button>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                    {formik.errors.general && (
                        <Box display="flex" alignItems="center" justifyContent="flex-start" gap={1} bgcolor="lightpink" p={1} borderRadius={4} mt={2} pr={2} mb={2}>
                            <BiErrorCircle className='text-pink-500' />
                            <Typography variant="body2" color="error">{formik.errors.general}</Typography>
                        </Box>
                    )}

                    <TextField
                        fullWidth
                        margin="normal"
                        label="کد ملی"
                        name="nationalId"
                        value={formik.values.nationalId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nationalId && Boolean(formik.errors.nationalId)}
                        helperText={formik.touched.nationalId && formik.errors.nationalId}
                        variant="outlined"
                        InputProps={{
                            style: { textAlign: 'right' },
                            sx: {
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'lightgrey',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'pink',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'pink',
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: 'red',
                                    },
                                },
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                color: 'lightgrey',
                                '&.Mui-focused': {
                                    color: 'lightgrey',
                                },
                                '&.Mui-error': {
                                    color: 'red',
                                },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="شماره موبایل"
                        name="mobile"
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                        helperText={formik.touched.mobile && formik.errors.mobile}
                        variant="outlined"
                        InputProps={{
                            style: { textAlign: 'right' },
                            sx: {
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'lightgrey',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'pink',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'pink',
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: 'red',
                                    },
                                },
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                color: 'lightgrey',
                                '&.Mui-focused': {
                                    color: 'lightgrey',
                                },
                                '&.Mui-error': {
                                    color: 'red',
                                },
                            },
                        }}
                    />

                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={formik.isSubmitting}
                            sx={{
                                width: '100%',
                                bgcolor: 'primary.main',
                                '&:hover': { bgcolor: 'primary.dark' },
                            }}
                        >
                            ورود به موبایل بانک
                        </Button>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mt={2} gap={1}>
                        <MuiLink component={Link} to="/forgot-password" underline="none" variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%', py: 1, borderRadius: 4, border: 1, borderColor: 'grey.300', ':hover': { color: 'grey.600' } }}>
                            فراموشی رمز
                        </MuiLink>
                        <MuiLink component={Link} to="/register" underline="none" variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%', py: 1, borderRadius: 4, border: 1, borderColor: 'grey.300', ':hover': { color: 'grey.600' } }}>
                            ثبت نام
                        </MuiLink>
                    </Box>

                    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="rememberMe"
                                    checked={formik.values.rememberMe}
                                    onChange={formik.handleChange}
                                    color="primary"
                                />
                            }
                            label="مرا به خاطر بسپار"
                        />
                    </Box>
                </form>
            </StyledPaper>

            {overlayOpen && <Overlay />} 

            <Snackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        onClick={handleSnackbarClose}
                    >
                        ×
                    </IconButton>
                }
            >
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' , borderRadius:'20px'}}>
                    <Typography variant='h5'>صفحه ورود:</Typography>
                    <Typography>   برای ورود به موبایل بانک نام کاربری و رمز عبور خود را وارد کنید. اگر حساب کاربری ندارید ، ابتدا ثبت نام کنید.</Typography>
                  
                </Alert>
            </Snackbar>
        </Box>
    );
}
