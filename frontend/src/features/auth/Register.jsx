import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [mobile, setMobile] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [nationalIdError, setNationalIdError] = useState('');
    const [isActivation, setIsActivation] = useState(false); // State to toggle the ActivationCode component
    const navigate = useNavigate();
    const numberPattern = /^[0-9]*$/;
    const iranMobilePattern = /^(09)[0-9]{9}$/;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        if (!mobile) {
            setMobileError('شماره موبایل را وارد کنید');
            isValid = false;
        } else if (!numberPattern.test(mobile)) {
            setMobileError('شماره موبایل باید شامل اعداد باشد');
            isValid = false;
        } else if (!iranMobilePattern.test(mobile)) {
            setMobileError('شماره موبایل معتبر نیست.');
            isValid = false;
        } else if (mobile.length !== 11) {
            setMobileError('طول شماره موبایل صحیح نمی باشد');
            isValid = false;
        } else {
            setMobileError('');
        }

        if (!nationalId) {
            setNationalIdError('کد ملی را وارد کنید');
            isValid = false;
        } else if (!numberPattern.test(nationalId)) {
            setNationalIdError('کد ملی باید شامل اعداد باشد');
            isValid = false;
        } else if (nationalId.length !== 10) {
            setNationalIdError('کدملی باید 10 رقم باشد');
            isValid = false;  
        } else {
            setNationalIdError('');
        }

        if (isValid) {
            setIsActivation(true);
        }
    };

    useEffect(() => {
        if (isActivation) {
            navigate('/activation-code', { state: { fromRegister: true } });
        }
    }, [isActivation, navigate]);

    return (
        <div className='flex items-center justify-center bg-slate-100 py-[200px] sm:py-[400px] lg:py-[10px] p-0 min-h-screen'>
            <Helmet>
                <title>ثبت نام در موبایل بانک</title>
            </Helmet>
            <div className='max-w-xl w-full sm:w-[60%] md:w-[70%] rounded-xl shadow-md bg-white md:mt-[80px] lg:mt-[60px] md:p-10 p-6'>
                <div className='text-3xl font-semibold items-center text-center'>  
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-sm'>ثبت </span> 
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-sm'>نام</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='flex items-center justify-center'>
                        <input
                            className={`p-2 md:w-full mt-10 rounded-lg shadow-b-lg placeholder:text-sm w-[80%] lg:placeholder:text-md border placeholder:text-right text-right bg-slate-100 text-gray-600 focus:outline-none focus:border-pink-500 focus:placeholder:text-pink-500 ${
                                nationalIdError ? 'border-red-500' : 'border-gray-300'
                            }`}
                            type='password'
                            name='nationalId'
                            placeholder='کد ملی'
                            value={nationalId}
                            onChange={(e) => setNationalId(e.target.value)}
                        />
                    </div>
                    {nationalIdError && (
                        <div className='mb-4 mt-2 bg-red-100 py-2 rounded-lg px-4 flex justify-start items-right gap-1'>
                            <BiErrorCircle className='text-pink-500' />
                            <p className='text-pink-500 text-sm text-right'>{nationalIdError}</p>
                        </div>
                    )}

                    <div className='flex py-2 items-center justify-center'>
                        <input
                            className={`p-2 md:w-full rounded-lg shadow-b-lg border placeholder:text-sm lg:placeholder:text-md w-[80%] placeholder:text-right text-right bg-slate-100 text-gray-600 focus:outline-none focus:border-pink-500 focus:placeholder:text-pink-500 ${
                                mobileError ? 'border-red-500' : 'border-gray-300'
                            }`}
                            type='text'
                            name='mobile'
                            placeholder='شماره موبایل'
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>
                    {mobileError && (
                        <div className='mb-4 bg-red-100 py-2 rounded-lg px-4 flex justify-start items-right gap-1'>
                            <BiErrorCircle className='text-pink-500' />
                            <p className='text-pink-500 text-sm text-right'>{mobileError}</p>
                        </div>
                    )}
                    <div className='flex justify-center items-center gap-2 '>
                        <div className='flex items-center justify-center w-[45%] sm:w-[50%]'>
                            <button
                                type='submit'
                                className='group w-full flex justify-center items-center px-4 py-2 mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-md hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 transition-all ease-in-out duration-300 text-md'
                            >
                                <FaLongArrowAltRight className='ml-2 group-hover:text-opacity-60' />
                                ادامه
                            </button>
                        </div>

                        <div className='flex items-center justify-center w-[45%] sm:w-[50%]'>
                            <Link
                                to="/sign-in"
                                className='group w-full flex justify-center items-center px-4 py-2 mt-6 bg-slate-100 text-gray-700 rounded-full shadow-md hover:opacity-65 transition-all ease-in-out duration-300 text-md'
                            >
                                بازگشت
                                <FaLongArrowAltLeft className='mr-2 group-hover:text-opacity-60' />
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
