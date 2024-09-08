import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container, TextField, Button, Box, Typography, Paper, Alert, Link as MuiLink } from '@mui/material';
import { styled } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

export default function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            nationalId: '',
            mobile: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const response = await fetch('http://localhost:8000/api/users/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phone_number: values.mobile,
                        national_code: values.nationalId,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    localStorage.setItem('phone_number', values.mobile);
                    localStorage.setItem('national_code', values.nationalId);
                    navigate('/activation-code');
                } else {
                    const errorData = await response.json();
                    setStatus(errorData.detail || 'خطایی رخ داده است.');
                }
            } catch (error) {
                console.error('Error:', error);
                setStatus('خطایی در ارتباط با سرور رخ داد.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.100' }}>
            <Helmet>
                <title>ثبت نام در موبایل بانک</title>
            </Helmet>
            <StyledPaper>
                <Typography variant="h4" align="center" gutterBottom>
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
                            ثبت نام
                        </Button>
                    </Box>

                    <Box display="flex" justifyContent="center" mt={2}>
                        <MuiLink component={Link} to="/sign-in" underline="none" variant="body2" color="primary" sx={{ textAlign: 'center', width: '80%', py: 1, borderRadius: 7, border: 1, borderColor: 'grey.300', ':hover': { color: 'grey.600' } }}>
                            بازگشت  
                        </MuiLink>
                    </Box>
                </form>
            </StyledPaper>
        </Box>
    );
}
