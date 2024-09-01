import axios from 'axios';
import '../StyleSheets/LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../ReduxStates/ToastState.js';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { setLoaderState } from '../ReduxStates/loadingFlagState';
// 
const EmailRegex = /^[\w.%+-]{4,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PassWordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
// 
const LoginSignup = () => {
    const InitialLoginData = {
        UserEmail: '',
        UserPassword: '',
    }
    const InitialSignupData = {
        UserName: '',
        UserEmail: '',
        UserPassword: '',
    }
    // 
    const NavigateTo = useNavigate();
    const DispatchToastState = useDispatch();
    const DispatchLoadingState = useDispatch();
    const [ChangeForm, setChangeForm] = useState(false);
    const [ScreenWidth, setScreenWidth] = useState(window.innerWidth);
    const [loginUserDetails, setLoginUserDetails] = useState(InitialLoginData);
    const [signupUserDetails, setSignupUserDetails] = useState(InitialSignupData);
    const showErrorResponse = useSelector(state => state.ToastState.ToastValue.Field);
    // 
    const handleLoginFormInputs = (e) => {
        setLoginUserDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    // 
    const handleSignupFormInputs = (e) => {
        setSignupUserDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    // 
    useEffect(() => {
        window.addEventListener('resize', () => {
            setScreenWidth(window.innerWidth);
        });
    }, []);
    // 
    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (loginUserDetails.UserEmail !== '' &&
                loginUserDetails.UserPassword !== '' &&
                EmailRegex.test(loginUserDetails.UserEmail) &&
                PassWordRegex.test(loginUserDetails.UserPassword)) {
                const Response = await axios.post('http://localhost:8080/Login', loginUserDetails);
                if (Response.data.Message === 'Logged In!') {
                    localStorage.setItem("UserAccessToken", Response.data?.SignedToken);
                    DispatchLoadingState(setLoaderState(true));
                    DispatchToastState(setToast({ State: 'Success', Message: Response.data.Message, Field: '' }));
                    setTimeout(() => {
                        (Response.data.isProfileUpdated) ? NavigateTo('/DashBoard/ProfileCards') : NavigateTo('/DetailsForm');
                        DispatchLoadingState(setLoaderState(false));
                    }, 1000);
                }
                setLoginUserDetails(InitialLoginData);
            }
            else {
                if (loginUserDetails.UserEmail === '') {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Email Field is required!', Field: 'User/Email-Login' }));
                }
                else if (!EmailRegex.test(loginUserDetails.UserEmail)) {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Invalid Email Format!', Field: 'User/Email-Login' }));
                }
                else if (loginUserDetails.UserPassword === '') {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Password Field is required!', Field: 'Password-Login' }));
                }
                else if (!PassWordRegex.test(loginUserDetails.UserPassword)) {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Invalid Password Format!', Field: 'Password-Login' }));
                }
            }
        } catch (error) {
            if (error) {
                switch (error.response.data) {
                    case 'InValid User/Email!':
                        DispatchToastState(setToast({ State: 'Error', Message: error.response.data, Field: 'User/Email-Login' }));
                        break;
                    case 'InValid Password!':
                        DispatchToastState(setToast({ State: 'Error', Message: error.response.data, Field: 'Password-Login' }));
                        break;
                }
            }
        }
    }
    // 
    const handleSignupFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (signupUserDetails.UserName !== '' &&
                signupUserDetails.UserEmail !== '' &&
                signupUserDetails.UserPassword !== '' &&
                EmailRegex.test(signupUserDetails.UserEmail) &&
                PassWordRegex.test(signupUserDetails.UserPassword)) {
                const Response = await axios.post('http://localhost:8080/Signup', signupUserDetails);
                if (Response.data === "Account Created!") {
                    DispatchLoadingState(setLoaderState(true));
                    DispatchToastState(setToast({ State: 'Success', Message: Response.data, Field: '' }));
                    setTimeout(() => {
                        DispatchLoadingState(setLoaderState(false));
                        setChangeForm(false);
                    }, 800);
                }
                setSignupUserDetails(InitialSignupData);
            }
            else {
                if (signupUserDetails.UserName === '') {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Name Field is required!', Field: 'Name-Signup' }));
                }
                else if (signupUserDetails.UserEmail === '') {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Email Field is required!', Field: 'User/Email-Signup' }));
                }
                else if (!EmailRegex.test(signupUserDetails.UserEmail)) {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Invalid Email Format!', Field: 'User/Email-Signup' }));
                }
                else if (signupUserDetails.UserPassword === '') {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Password Field is required!', Field: 'Password-Signup' }));
                }
                else if (!PassWordRegex.test(signupUserDetails.UserPassword)) {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Invalid Password Format!', Field: 'Password-Signup' }));
                }
            }
        } catch (error) {
            if (error) {
                switch (error.response.data) {
                    case 'User Already Exist!':
                        DispatchToastState(setToast({ State: 'Error', Message: error.response.data, Field: 'User/Email-Signup' }));
                        break;
                }
            }
        }
    }
    // 
    return (
        <>
            {
                ScreenWidth > 480 &&
                <div className='Back-to-Home-Icon' onClick={() => NavigateTo('/')}>
                    <FaArrowLeft />
                </div>
            }
            <div className='LoginSignup-Container' data-aos='zoom-in'>
                {
                    ScreenWidth <= 480 &&
                    <div className='Back-to-Home-Icon' onClick={() => NavigateTo('/')}>
                        <FaArrowLeft />
                    </div>
                }
                {
                    ScreenWidth > 480
                    &&
                    <div className={`FormChange-Screen ${ChangeForm ? 'ScreenChange' : ''}`}>
                        {!ChangeForm && <p>I'm New Skillye!</p>}
                        {ChangeForm && <p>I'm already Register Skillye!</p>}
                        <div className='FormChange-Btn' style={(ChangeForm) ? { backgroundColor: '#ff3366' } : {}} onClick={() => setChangeForm(!ChangeForm)}>
                            {
                                ChangeForm &&
                                <div>
                                    <FaArrowLeft className='mt-1' />
                                    <span className='mx-2'>Login</span>
                                </div>
                            }
                            {
                                !ChangeForm &&
                                <div>
                                    <span className='me-2'>Signup</span>
                                    <FaArrowRight className='mt-1' />
                                </div>
                            }
                        </div>
                    </div>
                }
                {
                    ScreenWidth <= 480
                    &&
                    <div className='FormChange-Btn' style={(ChangeForm) ? {  } : {backgroundColor: '#ff3366'}} onClick={() => setChangeForm(!ChangeForm)}>
                        {
                            !ChangeForm &&
                            <div>
                                <span className='me-2'>Signup</span>
                                <FaArrowRight />
                            </div>
                        }
                        {
                            ChangeForm &&
                            <div>
                                <span className='me-2'>Login</span>
                                <FaArrowRight />
                            </div>
                        }
                    </div>
                }
                <div className={`Login-Container ${!ChangeForm ? 'FormActive' : ''}`}>
                    <form onSubmit={(e) => handleLoginFormSubmit(e)}>
                        <h3>Welcome again, Skillye</h3>
                        <input type="email" value={loginUserDetails.UserEmail} name="UserEmail" id="LoginUserEmail" placeholder='Enter Email' onChange={(e) => { handleLoginFormInputs(e) }} style={(showErrorResponse === 'User/Email-Login') ? { border: '2.2px solid #ff3366' } : null} />
                        <input type="password" value={loginUserDetails.UserPassword} name="UserPassword" id="LoginUserPassword" placeholder='Enter Password' onChange={(e) => { handleLoginFormInputs(e) }} style={(showErrorResponse === 'Password-Login') ? { border: '2.2px solid #ff3366' } : null} />
                        <input type="submit" value="Login" style={{ backgroundColor: 'deepskyblue' }} />
                    </form>
                </div>
                <div className={`Signup-Container ${ChangeForm ? 'FormActive' : ''}`}>
                    <form onSubmit={(e) => handleSignupFormSubmit(e)}>
                        <h3>Welcome, New Skillye</h3>
                        <input type="text" value={signupUserDetails.UserName} name="UserName" id="SignupUserName" placeholder='Enter UserName' onChange={(e) => { handleSignupFormInputs(e) }} style={(showErrorResponse === 'Name-Signup') ? { border: '2.2px solid #ff3366' } : null} />
                        <input type="email" value={signupUserDetails.UserEmail} name="UserEmail" id="SignupUserEmail" placeholder='Enter Email' onChange={(e) => { handleSignupFormInputs(e) }} style={(showErrorResponse === 'User/Email-Signup') ? { border: '2.2px solid #ff3366' } : null} />
                        <input type="password" value={signupUserDetails.UserPassword} name="UserPassword" id="SignupUserPassword" placeholder='Enter Password' onChange={(e) => { handleSignupFormInputs(e) }} style={(showErrorResponse === 'Password-Signup') ? { border: '2.2px solid #ff3366' } : null} />
                        <input type="submit" value="Signup" style={{ backgroundColor: '#ff3366' }} />
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginSignup