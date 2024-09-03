import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (email && password) {
            navigate('/profile');
        } else {
            setError('نام کاربری یا رمز عبور وارد نشده است!');
        }
    };

    return (
        <div className='flex items-center justify-center bg-slate-100 py-[200px] sm:p-0'>
            <div className='max-w-xl w-full sm:w-[60%] md:w-[70%] rounded-xl shadow-md max-h-screen bg-white  md:mt-[80px] lg:mt-[60px] md:p-10 p-6'>
                <div className='text-3xl font-semibold items-center text-center'>  
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-sm'>همراه </span> 
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-sm'> </span>   
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-sm'>بانک</span>
                </div>

                <form onSubmit={handleSubmit} >
                    <div className='flex py-2 mt-10 items-center justify-center'>
                        <input
                            className='p-2 md:w-full rounded-lg shadow-b-lg border border-gray-300 placeholder:text-sm lg:placeholder:text-md w-[80%] placeholder:text-right text-right bg-slate-100  text-gray-600 focus:outline-none focus:border-pink-500 focus:placeholder:text-pink-500'
                            type='text'
                            name='email'
                            placeholder='شماره موبایل '
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='flex items-center justify-center'>
                        <input
                            className='p-2 md:w-full rounded-lg shadow-b-lg placeholder:text-sm w-[80%] lg:placeholder:text-md border border-gray-300 placeholder:text-right text-right bg-slate-100 text-gray-600 focus:outline-none focus:border-pink-500 focus:placeholder:text-pink-500'
                            type='password'
                            name='password'
                            placeholder=' کد ملی'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {error && <p className='text-red-500 font-bold text-right mt-4 flex justify-center items-right'>{error}</p>}
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
                        <Link className='text-blue-500 w-full text-center hover:text-gray-600 shadow-lg border border-gray-100 p-3 rounded-full text-sm' to="/sign-up">ثبت نام</Link>
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
