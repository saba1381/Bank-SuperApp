import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux'; // Import Redux hook
import { verifyOTP } from '../account/accountSlice'; // Import the action for OTP verification
import { FaLongArrowAltLeft } from 'react-icons/fa';
import Register from './Register';



const validationSchema = Yup.object({
    code: Yup.string()
        .length(4, 'کد فعالسازی باید ۴ رقم باشد')
        .matches(/^\d{4}$/, 'لطفا فقط عدد وارد کنید.')
        .required('کد فعالسازی را وارد کنید'),
});

export default function ActivationCode() {
    const [showRegister, setShowRegister] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    const formik = useFormik({
        initialValues: { code: '' },
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            const { code } = values;
            const phone_number = localStorage.getItem('phone_number');
            const national_code = localStorage.getItem('national_code');

            if (!phone_number || !national_code) {
                formik.setErrors({ code: 'اطلاعات ثبت‌نام یافت نشد. لطفا دوباره ثبت‌نام کنید.' });
                setSubmitting(false);
                return;
            }

            try {
                const result = await dispatch(verifyOTP({
                    phone_number,
                    otp: code,
                    national_code,
                }));

                if (result.meta.requestStatus === 'fulfilled') {
                    // On successful verification, store tokens and navigate to /cp
                    localStorage.setItem('access_token', result.payload.access);
                    localStorage.setItem('refresh_token', result.payload.refresh);
                    navigate('/cp');
                    window.location.reload();
                } else {
                    
                    setFieldError('code', 'کد فعالسازی اشتباه است.');
                }
            } catch (error) {
                console.error('Error:', error);
                setFieldError('code', 'خطایی در ارتباط با سرور رخ داد.');
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
    if (showRegister) {
        return <Register />; 
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',width:{xs:'100%' , sm:'60%' , md:'45%'}, bgcolor: 'grey.100' }}>
            <Helmet>
                <title>کد فعالسازی</title>
            </Helmet>
            <Box sx={{ maxWidth: '900px', width: '100%', p: 6, bgcolor: 'white', borderRadius: '8px', boxShadow: 3 }}>
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

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={()=>setShowRegister(true)}
                            sx={{
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
                                justifyContent: 'center',
                            }}
                        >
                            بازگشت 
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
