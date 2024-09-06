import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BiErrorCircle } from "react-icons/bi";

export default function SignIn() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [passwordError , setPasswordError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault();

        let isValid = true;
        
        if(!userName){
            setUserNameError('نام کاربری را وارد کنید');
            isValid = false;
        }else{
            setUserNameError('')
        }

        if(!password){
            setPasswordError('رمز عبور را وارد کنید');
            isValid = false;
        }else{
            setPasswordError('')
        }

        if(isValid){
            navigate('/cp')
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

                <form onSubmit={handleSubmit} >
                    <div className='flex py-2 mt-10 items-center justify-center'>
                        <input
                            className={`p-2 md:w-full rounded-lg shadow-b-lg border  placeholder:text-sm lg:placeholder:text-md w-[80%] placeholder:text-right text-right bg-slate-100  text-gray-600 focus:outline-none focus:border-pink-500 focus:placeholder:text-pink-500 ${userNameError ? 'border-red-400' : 'border-gray-300'}`}
                            type='text'
                            name='email'
                            placeholder='نام کاربری'
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    {userNameError && (
                        <div className='mb-4 bg-red-100 py-2 rounded-lg px-4 flex justify-start items-right gap-1'>
                        <BiErrorCircle className='text-pink-500' />
                          <p className='text-pink-500 text-sm text-right '>{userNameError}</p>
                    </div>
                    )}
                    <div className='flex items-center justify-center'>
                        <input
                            className={`p-2 md:w-full rounded-lg shadow-b-lg placeholder:text-sm w-[80%] lg:placeholder:text-md border placeholder:text-right text-right bg-slate-100 text-gray-600 focus:outline-none focus:border-pink-500 focus:placeholder:text-pink-500 ${passwordError ? 'border-red-400' : 'border-gray-300'}`}
                            type='password'
                            name='password'
                            placeholder=' رمز عبور '
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {passwordError && (
                        <div className='mb-4 mt-2 bg-red-100 py-2 rounded-lg px-4 flex justify-start items-right gap-1'>
                        <BiErrorCircle className='text-pink-500' />
                          <p className='text-pink-500 text-sm text-right '>{passwordError}</p>
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
                        <Link className='text-blue-500 w-full text-center hover:text-gray-600 shadow-lg border border-gray-100 p-3 rounded-full text-sm' to="/forgot-password">فراموشی رمز</Link>
                        <Link className='text-blue-500 w-full text-center hover:text-gray-600 shadow-lg border border-gray-100 p-3 rounded-full text-sm' to="/register">ثبت نام</Link>
                    </div>
                    <div className='flex mt-[40px] justify-between text-gray-600'>
                        
                        <div className='flex justify-center items-center '>
                            <label className='ml-2 text-sm lg:text-md' htmlFor='remember'>مرا به خاطر بسپار</label>
                            <input
                                type='checkbox'
                                className='rounded border-gray-200 text-purple-300 h-4 w-4  '
                                id='remember'
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
