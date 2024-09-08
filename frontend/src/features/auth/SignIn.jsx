import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BiErrorCircle } from "react-icons/bi";
import { Container, TextField, Button, Box, Typography, Checkbox, FormControlLabel, Paper, Link as MuiLink } from '@mui/material';
import { styled } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UseAppDispatch } from '../../store/configureStore';
import { signInUser } from '../account/accountSlice';

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

                if (result.meta.requestStatus === 'fulfilled') {
                    navigate("/cp");
                } else {
                    setFieldError('general', 'کدملی یا شماره موبایل اشتباه است.');
                }
            } catch (error) {
                setFieldError('general', 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
            }

            setSubmitting(false);
        },
    });

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.100' }}>
            <Helmet>
                <title>ورود به موبایل بانک</title>
            </Helmet>
            <StyledPaper>
                <Typography variant="h4" align="center" gutterBottom>
                    <GradientText>همراه بانک</GradientText>
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    {formik.errors.general && (
                        <Box display="flex" alignItems="center" justifyContent="flex-start" gap={1} bgcolor="lightpink"  p={1} borderRadius={4} mt={2} pr={2} mb={2}>
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
                                        borderColor: 'lightgrey', // رنگ اولیه border
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'pink', // رنگ border هنگام hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'pink', // رنگ border هنگام فوکوس
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: 'red', // رنگ border هنگام خطا
                                    },
                                },
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                color: 'lightgrey', // رنگ اولیه label
                                '&.Mui-focused': {
                                    color: 'lightgrey', // رنگ label هنگام فوکوس
                                },
                                '&.Mui-error': {
                                    color: 'red', // رنگ label هنگام خطا
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
                                        borderColor: 'lightgrey', // رنگ اولیه border
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'pink', // رنگ border هنگام hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'pink', // رنگ border هنگام فوکوس
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: 'red', // رنگ border هنگام خطا
                                    },
                                },
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                color: 'lightgrey', // رنگ اولیه label
                                '&.Mui-focused': {
                                    color: 'lightgrey', // رنگ label هنگام فوکوس
                                },
                                '&.Mui-error': {
                                    color: 'red', // رنگ label هنگام خطا
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
                                width: '80%',
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
        </Box>
    );
}
