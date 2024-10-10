import React, { useRef, useState ,useEffect  } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux'; 
import { verifyOTP } from '../account/accountSlice'; 
import Register from './Register';
import { CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


const validationSchema = Yup.object({
    code: Yup.string()
        .length(5, 'کد فعالسازی باید ۵ رقم باشد')
        .matches(/^\d{5}$/, 'لطفا فقط عدد وارد کنید.')
        .required('کد فعالسازی را وارد کنید'),
});

export default function ActivationCode({ mobile }) {
    const [showRegister, setShowRegister] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(120); 
    const [otpExpired, setOtpExpired] = useState(false);
    useEffect(() => {
    
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    clearInterval(countdown);
                    setOtpExpired(true); 
                }
                return prev - 1;
            });
        }, 1000);

        
        return () => clearInterval(countdown);
    }, []); 

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    

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
                    localStorage.setItem('isNewUser', 'true')
                    localStorage.setItem('access_token', result.payload.access);
                    localStorage.setItem('refresh_token', result.payload.refresh);
                    localStorage.removeItem('phone_number');
                    localStorage.removeItem('national_code');
                    window.location.assign('/cp');
                } else {
                    
                    setFieldError('code', 'کد فعالسازی اشتباه است.');
                }
            } catch (error) {
                console.error('Error:', error);
                setFieldError('code', 'خطایی در ارتباط با سرور رخ داد.');
            }

            setSubmitting(false);
            setLoading(false);
        },
    });

    const handleCodeChange = (e, index) => {
        const value = e.target.value;
        

        if (/^\d{1}$/.test(value)) {
            const newCode = formik.values.code.split('');
            newCode[index] = value;
            formik.setFieldValue('code', newCode.join(''));

            if (index < 4) {
                inputRefs.current[index + 1].focus();
            }else if (newCode.join('').length === 5) {
                setLoading(true); 
                setTimeout(() => {
                    formik.handleSubmit();
                }, 1000); 
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh',paddingY:{xs:0},width:{xs:'100%' , sm:'60%' , md:'55%'} }}>
            <Helmet>
                <title>کد فعالسازی</title>
            </Helmet>
            <Box sx={{ maxWidth: '1000px',width:'100%' ,p: 3, bgcolor: 'white', borderRadius: '8px', boxShadow: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    <span style={{ background: 'linear-gradient(to right, #6B46C1, #6B46C1, #4299E1, #3182CE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>کد فعالسازی</span>
                </Typography>

                <form onSubmit={formik.handleSubmit} dir="ltr">
                    <Typography variant="body2" color="primary" align="center" mb={3}>
                            کد پیامک شده به {mobile} را وارد کنید
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                        {[0, 1, 2, 3,4].map((index) => (
                            <TextField
                                key={index}
                                inputRef={(el) => (inputRefs.current[index] = el)}
                                value={formik.values.code[index] || ''}
                                onChange={(e) => handleCodeChange(e, index)}
                                //onKeyDown={(e) => handleBackspace(e, index)}
                                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                variant="outlined"
                                sx={{ width: '50px' }}
                            />
                        ))}
                    </Box>

                    {formik.errors.code && formik.touched.code && (
                        <Typography variant="body2" color="error" align="center" mb={2}>
                            {formik.errors.code}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: otpExpired ? 'red' : 'navy', mb: 2 }}>
                    {!otpExpired && <AccessTimeIcon sx={{ ml: 1 }} />}
                        <Typography variant="body2" sx={{alignItems:'center'}}>
                            {otpExpired ? 'کد فعالسازی شما منقضی شد، دوباره تلاش کنید' : `${formatTime(timer)}`}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting || otpExpired} 
                            sx={{ width: '50%', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            {loading ? <CircularProgress size={24} sx={{color:'white'}} /> : 'تایید'}
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
