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
        <div className='flex items-center justify-center mt-[80px] sm:mt-20'>
            <div className='max-w-xl w-full sm:w-[50%] rounded-xl shadow-md max-h-[800px] bg-slate-200  sm:p-10 p-6'>
                <div className='text-3xl font-semibold items-center text-center'>  
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-sm dark:bg-gradient-to-r dark:from-blue-800 dark:to-blue-600'> ورود</span>  
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-sm mr-1'>به </span>  
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-sm'>همراه </span> 
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-sm'> </span>   
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-sm'>بانک</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='block py-2 mt-10'>
                        <input
                            className='p-3 w-full rounded-lg shadow-b-lg border-none hover:border-none placeholder:text-right text-right dark:bg-slate-100 dark:text-gray-600'
                            type='text'
                            name='email'
                            placeholder='شماره موبایل '
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='block'>
                        <input
                            className='p-3 w-full rounded-lg shadow-b-lg placeholder:text-right text-right dark:bg-slate-100 dark:text-gray-600'
                            type='password'
                            name='password'
                            placeholder=' کد ملی'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='flex mt-10 justify-between text-gray-600'>
                        <div className='items-right'>
                            <Link to="#" className='text-right hover:text-gray-900'>فراموشی رمز</Link>
                        </div>
                        <div className='flex space-x-2 items-center'>
                            <label className='ml-2' htmlFor='remember'>مرا به خاطر بسپار</label>
                            <input
                                type='checkbox'
                                className='rounded border-gray-200 text-purple-300 h-4 w-4 dark:text-slate-100'
                                id='remember'
                            />
                        </div>
                    </div>

                    {error && <p className='text-red-500 font-bold text-right mt-4'>{error}</p>}

                    <button
                        type='submit'
                        className='w-full px-4 py-2 mt-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-md hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 transition-all ease-in-out duration-300'
                    >
                        ورود
                    </button>
                    <div className='mt-6 flex space-x-2 items-center justify-start px-3'>
                        <p className='text-right text-gray-800 ml-2'>تا حالا حساب کاربری نداشتی؟</p>  
                        <Link className='text-blue-800 hover:text-gray-600' to="/sign-up">ثبت نام</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
