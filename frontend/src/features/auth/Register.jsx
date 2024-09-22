import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TextField, Button, Box, Typography, Paper, Alert, Link as MuiLink } from '@mui/material';
import { styled } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ActivationCode from './ActivationCode';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { UseAppDispatch } from '../../store/configureStore';
import { registerUser } from '../account/accountSlice';

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
    firstName: Yup.string().required('نام را وارد کنید'),
    lastName: Yup.string().required('نام خانوادگی را وارد کنید'),
    password: Yup.string()
        .min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد')
        .required('رمز عبور را وارد کنید'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'رمز عبور و تکرار آن باید مطابقت داشته باشند')
        .required('تکرار رمز عبور را وارد کنید'),
    nationalId: Yup.string()
        .matches(/^[0-9]*$/, 'کدملی باید شامل اعداد باشد')
        .length(10, 'کدملی باید 10 رقم باشد')
        .required('کد ملی را وارد کنید'),
    mobile: Yup.string()
        .matches(/^[0-9]*$/, 'شماره موبایل باید شامل اعداد باشد')
        .matches(/^(09)[0-9]{9}$/, 'شماره موبایل معتبر نیست')
        .required('شماره موبایل را وارد کنید'),
});

export default function Register() {
    const [showActivationCode, setShowActivationCode] = useState(false);
    const dispatch = UseAppDispatch();
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            nationalId: '',
            mobile: '',
        },
        validationSchema: validationSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const response = await dispatch(registerUser(
                    {
                        phone_number: values.mobile,
                        national_code: values.nationalId,
                        first_name: values.firstName,
                        last_name: values.lastName,
                        password: values.password,
                    }
                ));
        
                if (response.meta.requestStatus === 'fulfilled') {
                    localStorage.setItem('phone_number', values.mobile);
                    localStorage.setItem('national_code', values.nationalId);
                    setShowActivationCode(true); 
                } else {
                    // دسترسی مستقیم به پیام خطا در response.payload
                    const errorData = response.payload;
        
                    // اگر پیام خطا به صورت آبجکت هست و فیلد detail داره، نمایش بده
                    if (errorData && typeof errorData === 'object' && errorData.error && errorData.error.detail) {
                        setStatus(errorData.error.detail);  // نمایش پیام خطا
                    } else {
                        setStatus('خطایی رخ داده است.'); // پیام عمومی در صورت نبود پیام خاص
                    }
                }
            } catch (error) {
                // اگر خطا از try خارج شد
                if (error && error.response && error.response.detail && error.response.detail) {
                    setStatus(error.response.detail);  // نمایش پیام خطا
                } else {
                    setStatus('خطایی رخ داده است.'); // پیام عمومی برای سایر خطاها
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: { xs: '100vh', md: '150vh' } }}>
            <Helmet>
                <title>ثبت نام در موبایل بانک</title>
            </Helmet>
            {!showActivationCode ? (
                <StyledPaper sx={{ p: { xs: 2, md: 7 } }}>
                    <Typography variant="h3" align="center" gutterBottom>
                        <GradientText>ثبت نام در موبایل بانک</GradientText>
                    </Typography>

                    {formik.status && (
                        <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                            {formik.status}
                        </Alert>
                    )}

                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="نام"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
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
                            label="نام خانوادگی"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
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
                            label="رمز عبور"
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
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
                            label="تکرار رمز عبور"
                            name="confirmPassword"
                            type="password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                            label="کد ملی"
                            name="nationalId"
                            value={formik.values.nationalId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nationalId && Boolean(formik.errors.nationalId)}
                            helperText={formik.touched.nationalId && formik.errors.nationalId}
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

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 3, mt: 4 }}>
                            <Box display="flex" justifyContent="center" mt={2} sx={{ width: '50%' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<ArrowRightAltIcon style={{ fontSize: '1.5rem' }} />}
                                    fullWidth
                                    disabled={formik.isSubmitting}
                                    sx={{
                                        width: '100%',
                                        bgcolor: 'primary.main',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                    }}
                                >
                                    ادامه
                                </Button>
                            </Box>

                            <Box display="flex" justifyContent="center" mt={2} sx={{ width: '50%' }}>
                                <MuiLink
                                    component={Link}
                                    to="/sign-in"
                                    underline="none"
                                    variant="body2"
                                    color="primary"
                                    sx={{
                                        textAlign: 'center',
                                        width: '100%',
                                        py: 1,
                                        borderRadius: 7,
                                        border: 1,
                                        borderColor: 'grey.300',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        ':hover': { color: 'grey.600' }
                                    }}
                                >
                                    <Typography>بازگشت</Typography>
                                    <FaLongArrowAltLeft />
                                </MuiLink>
                            </Box>
                        </Box>
                    </form>
                </StyledPaper>
            ) : (
                <ActivationCode />
            )}
        </Box>
    );
}
