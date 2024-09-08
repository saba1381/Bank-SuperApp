import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaLongArrowAltLeft } from 'react-icons/fa';

// Validation schema
const validationSchema = Yup.object({
    code: Yup.string()
        .length(4, 'کد فعالسازی باید ۴ رقم باشد')
        .matches(/^\d{4}$/, 'لطفا فقط عدد وارد کنید.')
        .required('کد فعالسازی را وارد کنید'),
});

export default function ActivationCode() {
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { code: '' },
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values, { setSubmitting }) => {
            const { code } = values;
            const phone_number = localStorage.getItem('phone_number');
            const national_code = localStorage.getItem('national_code');

            if (!phone_number || !national_code) {
                formik.setErrors({ code: 'اطلاعات ثبت‌نام یافت نشد. لطفا دوباره ثبت‌نام کنید.' });
                setSubmitting(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/users/verify-otp/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone_number, otp: code, national_code }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                    navigate('/cp');
                } else {
                    const errorData = await response.json();
                    formik.setErrors({ code: errorData.detail || 'خطا در تأیید کد.' });
                }
            } catch (error) {
                console.error('Error:', error);
                formik.setErrors({ code: 'خطایی در ارتباط با سرور رخ داد.' });
            }

            setSubmitting(false);
        },
    });

    const handleCodeChange = (e, index) => {
        const value = e.target.value;

        if (/^\d{1}$/.test(value)) {
            const newCode = formik.values.code.split('');
            newCode[index] = value;
            formik.setFieldValue('code', newCode.join(''));

            if (index < 3) {
                inputRefs.current[index + 1].focus();
            }
        } else if (value === '') {
            const newCode = formik.values.code.split('');
            newCode[index] = '';
            formik.setFieldValue('code', newCode.join(''));

            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace') {
            const newCode = formik.values.code.split('');
            newCode[index] = '';
            formik.setFieldValue('code', newCode.join(''));

            if (index > 0 && !newCode[index]) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.100' }}>
            <Helmet>
                <title>کد فعالسازی</title>
            </Helmet>
            <Box sx={{ maxWidth: '500px', width: '100%', p: 4, bgcolor: 'white', borderRadius: '8px', boxShadow: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    <span style={{ background: 'linear-gradient(to right, #6B46C1, #6B46C1, #4299E1, #3182CE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>کد فعالسازی</span>
                </Typography>

                <form onSubmit={formik.handleSubmit} dir="ltr">
                    <Typography variant="body2" color="primary" align="center" mb={3}>
                        لطفا کد ارسال شده را وارد نمایید
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                        {[0, 1, 2, 3].map((index) => (
                            <TextField
                                key={index}
                                inputRef={(el) => (inputRefs.current[index] = el)}
                                value={formik.values.code[index] || ''}
                                onChange={(e) => handleCodeChange(e, index)}
                                onKeyDown={(e) => handleBackspace(e, index)}
                                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                variant="outlined"
                                sx={{ width: '40px' }}
                            />
                        ))}
                    </Box>

                    {formik.errors.code && formik.touched.code && (
                        <Typography variant="body2" color="error" align="center" mb={2}>
                            {formik.errors.code}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                            sx={{ width: '50%', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            تایید
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                        <Link
                            to="/register"
                            style={{
                                textDecoration: 'none',
                                color: '#1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #1976d2',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                textAlign: 'center',
                                width: '50%',
                                justifyContent:'center'

                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#b0bec5'; // Light grey
                                e.currentTarget.style.color = '#b0bec5'; // Original color
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#1976d2'; // Original border color
                                e.currentTarget.style.color = '#1976d2'; // Original text color
                            }}
                        >
                            <FaLongArrowAltLeft style={{ marginRight: '8px' }} />
                            بازگشت
                        </Link>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
