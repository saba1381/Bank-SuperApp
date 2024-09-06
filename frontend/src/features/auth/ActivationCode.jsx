import React, { useState, useRef } from 'react';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function ActivationCode() {
    const [code, setCode] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);


    const location = useLocation();
   const fromRegister = location.state?.fromRegister;

    if (!fromRegister) {
        return <Navigate to='/register' />;
    }

    const handleCodeChange = (e, index) => {
        const value = e.target.value;

      
        if (/^\d{1}$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

       
            if (index < 3) {
                inputRefs.current[index + 1].focus();
            }

            if (error) setError('');
        } else if (value === '') {
            const newCode = [...code];
            newCode[index] = '';
            setCode(newCode);
        } else {
            setError('لطفا فقط عدد وارد کنید.');
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace') {
            const newCode = [...code];
            
            // اگر مقدار فعلی خالی بود، به input قبلی برگردیم
            if (!newCode[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }

            // مقدار فعلی را پاک کنیم
            newCode[index] = '';
            setCode(newCode);
        }
    };

    const handleKeyDown = (e, index) => {
        handleBackspace(e, index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullCode = code.join('');
        if (fullCode.length !== 4 || !/^\d{4}$/.test(fullCode)) {
            setError('لطفا یک کد فعالسازی معتبر با ۴ رقم وارد کنید.');
        } else {
            setError('');
            // اینجا می‌توانید درخواست خود را ارسال کنید
        }
    };

    return (
        <div className='flex items-center justify-center bg-slate-100 py-[200px] sm:py-[200px] lg:py-[20px] sm:p-0 min-h-screen'>
            <Helmet>
                <title>کد فعالسازی</title>
            </Helmet>
            <div className='max-w-xl w-full sm:w-[60%] md:w-[70%] rounded-xl shadow-md max-h-screen bg-white md:mt-[80px] lg:mt-[60px] md:p-10 p-6'>
                <div className='text-3xl font-semibold items-center text-center'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-sm'>کد </span>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-800 drop-shadow-sm'>فعالسازی</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <p className='text-center text-gray-500 mt-5 mb-10'>لطفا کد ارسال شده را وارد نمایید</p>

                    <div className='flex justify-center gap-4 mb-6' dir="ltr">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className='text-center p-2 w-12 rounded-xl border border-b-gray-300 bg-slate-100 text-gray-600 focus:outline-none focus:border-purple-500'
                            />
                        ))}
                    </div>

                    {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

                    <div className='flex items-center justify-center '>
                        <button
                            type='submit'
                            className='group w-[50%] flex justify-center items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-md hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-600 transition duration-300 text-md'
                        >
                            تایید
                        </button>
                    </div>

                    <div className='flex items-center justify-center mt-4'>
                        <Link
                            to="/register"
                            className='group w-[50%] flex justify-center items-center px-4 py-2 bg-slate-100 text-gray-700 rounded-full shadow-md hover:opacity-65 transition duration-300 text-md'
                        >
                            بازگشت
                            <FaLongArrowAltLeft className='mr-2 group-hover:text-opacity-60' />
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
}
