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
                        national_code: values.nationalId
                    }
                ));
                console.log(response);

                if (response.meta.requestStatus === 'fulfilled') {
                    localStorage.setItem('phone_number', values.mobile);
                    localStorage.setItem('national_code', values.nationalId);
                    setShowActivationCode(true); 
                } else {
                    const errorData = await response.json();
                    setStatus(errorData.detail || 'خطایی رخ داده است.');
                }
            } catch (error) {
                
                setStatus('خطایی در ارتباط با سرور رخ داد.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: {xs:'80vh' , md:'fullscreen'}}}>
            <Helmet>
                <title>ثبت نام در موبایل بانک</title>
            </Helmet>
            {!showActivationCode ? (
                <StyledPaper sx={{p:{xs:2 , md:7}}}>
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
                       <Box sx={{display:"flex", justifyContent:'space-between',alignItems:'center' , width:'100%' , gap:3 , mt:4}}>
                        <Box display="flex" justifyContent="center" mt={2} sx={{width:'50%'}}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<ArrowRightAltIcon style={{fontSize:'1.5rem'}}/>}
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
                    justifyContent:'center',
                    display: 'flex',
                    alignItems: 'center', // Vertical alignment of items
                    gap: 1, // Space between icon and text
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
