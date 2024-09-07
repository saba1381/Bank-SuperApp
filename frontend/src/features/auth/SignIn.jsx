import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BiErrorCircle } from "react-icons/bi";

export default function SignIn() {
    const [nationalId, setNationalId] = useState('');
    const [mobile, setMobile] = useState('');
    const [rememberMe, setRememberMe] = useState(false); 
    const [nationalIdError, setNationalIdError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [generalError, setGeneralError] = useState(''); 
    const navigate = useNavigate(); 

    const numberPattern = /^[0-9]*$/;
    const iranMobilePattern = /^(09)[0-9]{9}$/;

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
     
            setNationalId('');
            setMobile('');
        } else {
            
            const savedNationalId = localStorage.getItem('nationalId');
            const savedMobile = localStorage.getItem('mobile');
            if (savedNationalId) setNationalId(savedNationalId);
            if (savedMobile) setMobile(savedMobile);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        localStorage.removeItem('access_token');

        setGeneralError('');
        setNationalIdError('');
        setMobileError('');

        let isValid = true;

        if (!nationalId) {
            setNationalIdError('کد ملی را وارد کنید');
            isValid = false;
        } else if (!numberPattern.test(nationalId)) {
            setNationalIdError('کدملی باید شامل اعداد باشد');
            isValid = false;
        } else if (nationalId.length !== 10) {
            setNationalIdError('کدملی باید 10 رقم باشد');
            isValid = false;
        }

        if (!mobile) {
            setMobileError('شماره موبایل را وارد کنید');
            isValid = false;
        } else if (!numberPattern.test(mobile)) {
            setMobileError('شماره موبایل باید شامل اعداد باشد');
            isValid = false;
        } else if (!iranMobilePattern.test(mobile)) {
            setMobileError('شماره موبایل معتبر نیست');
            isValid = false;
        } else if (mobile.length !== 11) {
            setMobileError('طول شماره موبایل صحیح نیست');
            isValid = false;
        }

        if (isValid) {
            // If "Remember me" is checked, save the data
            if (rememberMe) {
                localStorage.setItem('nationalId', nationalId);
                localStorage.setItem('mobile', mobile);
            } else {
                // Otherwise, clear stored data
                localStorage.removeItem('nationalId');
                localStorage.removeItem('mobile');
            }

            fetch('http://127.0.0.1:8000/api/users/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone_number: mobile,
                    national_code: nationalId
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.access) {
                    localStorage.setItem('access_token', data.access);
                    navigate('/cp');
                } else {
                    setGeneralError(data.detail || 'کد ملی یا شماره موبایل اشتباه است');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };

    return (
        <div className='flex items-center justify-center bg-slate-100 py-[200px] sm:py-[200px] lg:py-[10px] sm:p-0'>
            <Helmet>
                <title>ورود به موبایل بانک</title>
            </Helmet>
            <div className='max-w-xl w-full sm:w-[60%] md:w-[70%] rounded-xl shadow-md max-h-screen bg-white  md:mt-[80px] lg:mt-[60px] md:p-10 p-6'>
                <div className='text-3xl font-semibold items-center text-center'>  
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-sm'>همراه </span> 
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-sm'> </span>   
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-sm'>بانک</span>
                </div>

                <form onSubmit={handleSubmit}>
                    {generalError && (
                        <div className='mt-10 bg-red-100 py-2 rounded-lg px-4 flex justify-start items-right gap-1'>
                            <BiErrorCircle className='text-pink-500' />
                            <p className='text-pink-500 text-sm text-right '>{generalError}</p>
                        </div>
                    )}
                    
                    <div className='flex py-2 mt-5 items-center justify-center'>
                        <input
                            className={`p-2 md:w-full rounded-lg shadow-b-lg border  placeholder:text-sm lg:placeholder:text-md w-[80%] placeholder:text-right text-right bg-slate-100  text-gray-600 focus:outline-none focus:border-pink-500 focus:placeholder:text-pink-500 ${nationalIdError ? 'border-red-400' : 'border-gray-300'}`}
                            type='text'
                            placeholder='کد ملی'
                            value={nationalId}
                            onChange={(e) => setNationalId(e.target.value)}
                        />
                    </div>
                    {nationalIdError && (
                        <div className='mb-4 bg-red-100 py-2 rounded-lg px-4 flex justify-start items-right gap-1'>
                            <BiErrorCircle className='text-pink-500' />
                            <p className='text-pink-500 text-sm text-right '>{nationalIdError}</p>
                        </div>
                    )}

                    <div className='flex items-center justify-center'>
                        <input
                            className={`p-2 md:w-full rounded-lg shadow-b-lg placeholder:text-sm w-[80%] lg:placeholder:text-md border placeholder:text-right text-right bg-slate-100 text-gray-600 focus:outline-none focus:border-pink-500 focus:placeholder:text-pink-500 ${mobileError ? 'border-red-400' : 'border-gray-300'}`}
                            type='text'
                            placeholder=' شماره موبایل  '
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>
                    {mobileError && (
                        <div className='mb-4 mt-2 bg-red-100 py-2 rounded-lg px-4 flex justify-start items-right gap-1'>
                            <BiErrorCircle className='text-pink-500' />
                            <p className='text-pink-500 text-sm text-right '>{mobileError}</p>
                        </div>
                    )}
                    
                    <div className='flex items-center justify-center'>
                        <button
                            type='submit'
                            className='sm:w-full w-[80%] px-4 py-2 mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-md hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 transition-all ease-in-out duration-300 text-md'
                        >
                            ورود به موبایل بانک
                        </button>
                    </div>
                    <div className='mt-6 flex justify-between gap-3 items-center'> 
                        <Link className='text-blue-500 w-full text-center hover:text-gray-600 shadow-md border border-gray-100 p-3 rounded-full text-sm' to="/forgot-password">فراموشی رمز</Link>
                         <Link className='text-blue-500 w-full text-center hover:text-gray-600 shadow-md border border-gray-100 p-3 rounded-full text-sm' to="/register">ثبت نام</Link> 
                         </div>

                    <div className='flex mt-[40px] justify-between text-gray-600'>
                        <div className='flex justify-center items-center'>
                        <label className='ml-2 text-sm lg:text-md' htmlFor='remember'>مرا به خاطر بسپار</label>
                            <input
                                type='checkbox'
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className='rounded border-gray-200 text-purple-300 h-4 w-4'
                                id='remember'
                            />
                        
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );


}


