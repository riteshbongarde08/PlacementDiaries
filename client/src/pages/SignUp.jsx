import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure } from '../redux/user/userSlice';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function SignUp() {
    const [formData, setFormData] = useState({
        step: '',
        email: '',
        otp: '',
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [steps, setSteps] = useState(1);
    const [responseMessage, setResponseMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        if (e.target.id === 'email') {
            const email = e.target.value.trim().toLowerCase();
            if (!validEmail(email)) {
                setErrorMessage('Please enter a valid email.');
            } else {
                setErrorMessage(null);
            }
            setFormData({ ...formData, [e.target.id]: email });
            return;
        }
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const validEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    // STEP 1: SEND OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!formData.email || !validEmail(formData.email)) {
            return setErrorMessage('Please enter a valid email.');
        }
        try {
            setLoading(true);
            setErrorMessage(null);
            const updatedFormData = { ...formData, step: 'sendOTP' };
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFormData),
            });
            const data = await res.json();

            if (data.success === false) {
                return setErrorMessage(data.message);
            }
            if (res.ok) {
                setResponseMessage(data.message);
            }
            setLoading(false);
            if (res.ok) {
                setSteps(2);
            }
            setSteps(2);
        } catch (error) {

            setErrorMessage(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    // STEP 2: VERIFY OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!formData.otp) {
            return setErrorMessage('Please enter the OTP.');
        }
        try {
            setLoading(true);
            setErrorMessage(null);
            const updatedFormData = { ...formData, step: 'verifyOTP' };
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFormData),
            });
            const data = await res.json();

            if (data.success === false) {
                return setErrorMessage(data.message);
            }
            setLoading(false);
            if (res.ok) {
                setResponseMessage(data.message);
                setSteps(3);
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage(error.message);
        }
    };

    // STEP 3: SET PASSWORD
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            return dispatch(signInFailure('Please fill out all fields.'));
        }
        try {
            setLoading(true);
            setErrorMessage(null);
            setResponseMessage(null);
            const updatedFormData = { ...formData, step: 'setPassword' };
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFormData),
            });
            const data = await res.json();

            if (data.success === false) {
                return setErrorMessage(data.message);
            }
            setLoading(false);
            if (res.ok) {
                return navigate('/sign-in');
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage(error.message);
        }
    }

    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
                {/* Left */}
                <div className='flex-1'>
                    <Link to='/' className='  font-bold dark:text-white text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                            Campus
                        </span>
                        Diaries
                    </Link>
                    <p className='text-sm mt-5'>
                        This is a demo project. You can sign up with your email and password or with google.
                    </p>
                </div>
                {/* Right */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={steps === 1 ? handleSendOTP : steps === 2 ? handleVerifyOTP : handleSubmit}>
                        {/* STEP 1: SEND OTP */}
                        {steps === 1 && (
                            <>
                                <div>
                                    <Label value='Your email' />
                                    <TextInput
                                        type='email'
                                        placeholder='Email'
                                        id='email'
                                        onChange={handleChange}
                                    />
                                </div>
                                <Button
                                    gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
                                    {
                                        loading ? (
                                            <>
                                                <Spinner size='sm' />
                                                <span className='pl-3'>Sending ... </span>
                                            </>
                                        ) : 'Send OTP'
                                    }
                                </Button>
                                <div className="flex items-center justify-center space-x-2 mt-4">
                                    <hr className="flex-1 border-gray-300 dark:border-gray-700" />
                                    <span className="px-4 text-gray-600 dark:text-gray-400">Or</span>
                                    <hr className="flex-1 border-gray-300 dark:border-gray-700" />
                                </div>
                                <OAuth />
                            </>
                        )}
                        {/* STEP 2: VERIFY OTP */}
                        {steps === 2 && (
                            <>
                                <div>
                                    <Label value='OTP' />
                                    <div className='flex space-x-2'>
                                        {[...Array(6)].map((_, index) => (
                                            <TextInput
                                                key={index}
                                                type='text'
                                                maxLength='1'
                                                className='w-12 text-center'
                                                id={`otp-${index}`}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    const otp = [...formData.otp];
                                                    otp[index] = value;
                                                    setFormData({ ...formData, otp: otp.join('') });

                                                    if (value.length === 1) {
                                                        const nextSibling = document.getElementById(`otp-${index + 1}`);
                                                        if (nextSibling) {
                                                            nextSibling.focus();
                                                        }
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !e.target.value) {
                                                        const prevSibling = document.getElementById(`otp-${index - 1}`);
                                                        if (prevSibling) {
                                                            prevSibling.focus();
                                                        }
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <Button
                                    gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
                                    {
                                        loading ? (
                                            <>
                                                <Spinner size='sm' />
                                                <span className='pl-3'>Verifying ... </span>
                                            </>
                                        ) : 'Verify OTP'
                                    }
                                </Button>
                            </>
                        )}
                        {/* STEP 3: SET PASSWORD */}
                        {steps === 3 && (
                            <>
                                <div>
                                    <Label value='Your email' />
                                    <TextInput
                                        type='email'
                                        placeholder='Email'
                                        id='email'
                                        onChange={handleChange}
                                        value={formData.email}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <Label value='Your username' />
                                    <TextInput
                                        type='text'
                                        placeholder='Username'
                                        id='username'
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="max-w-md">
                                    <div className="mb-2 block">
                                        <Label htmlFor="password" value="Your password" />
                                    </div>
                                    <div className="relative">
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="********"
                                            required
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500   focus:outline-none z-10"
                                        >
                                            {showPassword ? (
                                                <HiEye className="h-5 w-5" />
                                            ) : (
                                                <HiEyeOff className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
                                    {
                                        loading ? (
                                            <>
                                                <Spinner size='sm' />
                                                <span className='pl-3'>Loading...</span>
                                            </>
                                        ) : 'Sign Up'
                                    }
                                </Button>
                            </>
                        )}

                    </form>
                    <div className='flex items-center justify-center text-sm mt-5 '>
                        <span>
                            Have an account ?
                        </span>
                        <Link to='/sign-in' className='text-blue-500 ml-2'>
                            Sign-In</Link>
                    </div>
                    {
                        errorMessage && (
                            <Alert className='mt-5' color='failure'>
                                {errorMessage}
                            </Alert>
                        )
                    }
                    {
                        responseMessage && (
                            <Alert className='mt-5' color='success'>
                                {responseMessage}
                            </Alert>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
