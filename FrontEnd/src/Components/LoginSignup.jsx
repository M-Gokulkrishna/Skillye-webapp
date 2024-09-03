import axios from 'axios';
import '../StyleSheets/LoginSignup.css';
import { Form, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../ReduxStates/ToastState.js';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
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
    const [VerifieduserEmail, setVerifieduserEmail] = useState('');
    const [ScreenWidth, setScreenWidth] = useState(window.innerWidth);
    const [SkillyeVerifiedEmail, setSkillyeVerifiedEmail] = useState('');
    const [ForgotPasswordFlag, setForgotPasswordFlag] = useState('Login');
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
                if (Response?.data?.Message === 'Logged In!') {
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
                else if (loginUserDetails.UserPassword.length < 8) {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Password must contain Minimum 8 Characters', Field: 'Password-Login' }));
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
                else if (signupUserDetails.UserPassword.length < 8) {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Password must contain Minimum 8 Characters', Field: 'Password-Signup' }));
                }
                else if (!PassWordRegex.test(signupUserDetails.UserPassword)) {
                    return DispatchToastState(setToast({ State: 'Error', Message: 'Invalid Password Format!', Field: 'Password-Signup' }));
                }
            }
        } catch (error) {
            if (error?.response?.data) {
                DispatchToastState(setToast({ State: 'Error', Message: error.response.data, Field: 'User/Email-Signup' }));
            }
        }
    }
    // 
    async function handleForgotPassword(e) {
        e.preventDefault();
        const SkillyeEmail = e.target.children[2].value;
        if (SkillyeEmail === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Email Field is required!', Field: 'ForgotUserEmail' }));
            return;
        }
        DispatchLoadingState(setLoaderState(true));
        try {
            const mailSentResponse = await axios.post('http://localhost:8080/sendVerificationCode', { SkillyeEmail });
            if (mailSentResponse?.data === 'Email sent successfully!') {
                DispatchLoadingState(setLoaderState(false));
                DispatchToastState(setToast({ State: 'Success', Message: mailSentResponse?.data, Field: '' }));
                setForgotPasswordFlag('CodeVerification');
                setSkillyeVerifiedEmail(SkillyeEmail);
                e.target.children[2].value = '';
            }
        } catch (error) {
            if (error?.response?.data) {
                DispatchLoadingState(setLoaderState(false));
                DispatchToastState(setToast({ State: 'Error', Message: error?.response?.data, Field: '' }));
            }
        }
    }
    // 
    async function handleResendCode() {
        DispatchLoadingState(setLoaderState(true));
        setTimeout(() => {
            DispatchLoadingState(setLoaderState(false));
        }, 200);
        const SkillyeEmail = SkillyeVerifiedEmail;
        try {
            const mailSentResponse = await axios.post('http://localhost:8080/sendVerificationCode', { SkillyeEmail });
            if (mailSentResponse?.data === 'Email sent successfully!') {
                DispatchToastState(setToast({ State: 'Success', Message: mailSentResponse?.data, Field: '' }));
            }
        } catch (error) {
            if (error?.response?.data) {
                DispatchToastState(setToast({ State: 'Error', Message: error?.response?.data, Field: '' }));
            }
        }
    }
    // 
    async function handleCodeVerification(e) {
        e.preventDefault();
        const FormCode = e.target.children[2].value;
        if (FormCode === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Verification Code is required!', Field: 'VerificationCode' }));
            return;
        }
        DispatchLoadingState(setLoaderState(true));
        try {
            const CodeResponse = await axios.post('http://localhost:8080/VerifyCode', { FormCode });
            if (CodeResponse?.data?.Message === 'Code Verified!') {
                DispatchLoadingState(setLoaderState(false));
                setForgotPasswordFlag('ResetPassword');
                setVerifieduserEmail(CodeResponse?.data.VerifiedEmail);
                DispatchToastState(setToast({ State: 'Success', Message: CodeResponse?.data?.Message, Field: '' }))
                e.target.children[2].value = '';
            }
        } catch (error) {
            if (error?.response?.data) {
                DispatchLoadingState(setLoaderState(false));
                DispatchToastState(setToast({ State: 'Error', Message: error?.response?.data, Field: '' }));
            }
        }
    }
    // 
    async function handleResetPassword(e) {
        e.preventDefault();
        const ResetPasswordValue = e.target.children[2].value;
        const ConfirmPasswordValue = e.target.children[3].value;
        if (ResetPasswordValue === '' || ConfirmPasswordValue === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Password Fields are Required!', Field: 'ResetPassword' }));
            return;
        }
        else if (ResetPasswordValue.length < 8 || ConfirmPasswordValue.length < 8) {
            DispatchToastState(setToast({ State: 'Error', Message: 'Password must contain Minimum 8 Characters!', Field: 'ResetPassword' }));
            return;
        }
        else if (!PassWordRegex.test(ResetPasswordValue) || !PassWordRegex.test(ConfirmPasswordValue)) {
            DispatchToastState(setToast({ State: 'Error', Message: 'Invalid Password Format!', Field: 'ResetPassowrd' }));
            return;
        }
        else if (ResetPasswordValue !== ConfirmPasswordValue) {
            DispatchToastState(setToast({ State: 'Error', Message: "Password doesn't match!", Field: 'ResetPassword' }));
            return;
        }
        DispatchLoadingState(setLoaderState(true));
        try {
            const PasswordResetResponse = await axios.post('http://localhost:8080/PasswordReset', { ConfirmPasswordValue, VerifieduserEmail });
            if (PasswordResetResponse?.data) {
                setVerifieduserEmail('');
                setForgotPasswordFlag('Login');
                e.target.children[2].value = '';
                e.target.children[3].value = '';
                DispatchLoadingState(setLoaderState(false));
                DispatchToastState(setToast({ State: 'Success', Message: PasswordResetResponse?.data?.Message, Field: '' }));
            }
        } catch (error) {
            if (error?.response?.data) {
                DispatchLoadingState(setLoaderState(false));
                DispatchToastState(setToast({ State: 'Error', Message: error?.response?.data, Field: '' }));
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
                    ScreenWidth <= 480 && ForgotPasswordFlag === 'Login' &&
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
                    ScreenWidth <= 480 && ForgotPasswordFlag === 'Login'
                    &&
                    <div className='FormChange-Btn' style={(!ChangeForm) ? {} : { backgroundColor: '#ff3366' }} onClick={() => setChangeForm(!ChangeForm)}>
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
                    {
                        ForgotPasswordFlag === 'Login' &&
                        <form onSubmit={(e) => handleLoginFormSubmit(e)}>
                            <h3>Welcome again, Skillye</h3>
                            <input type="email" value={loginUserDetails.UserEmail} name="UserEmail" id="LoginUserEmail" placeholder='Enter Email' onChange={(e) => { handleLoginFormInputs(e) }} style={(showErrorResponse === 'User/Email-Login') ? { border: '2.2px solid #ff3366' } : null} />
                            <input type="password" value={loginUserDetails.UserPassword} name="UserPassword" id="LoginUserPassword" placeholder='Enter Password' onChange={(e) => { handleLoginFormInputs(e) }} style={(showErrorResponse === 'Password-Login') ? { border: '2.2px solid #ff3366' } : null} />
                            <input type="submit" value="Login" />
                            <span className='Forgot-Password-btn' onClick={() => setForgotPasswordFlag('ForgotPassword')}>Forgot Password</span>
                        </form>
                    }
                    {
                        ForgotPasswordFlag === 'ForgotPassword' &&
                        <form onSubmit={(e) => handleForgotPassword(e)} style={{ gap: '20px' }}>
                            <div className='Cancel-ForgotPass-Window' onClick={() => setForgotPasswordFlag('Login')}>
                                <FaTimes />
                            </div>
                            <div className='d-flex flex-column align-items-center fw-bold'>
                                <span className='fs-5'>Welcome Skillye,</span>
                                <br />
                                <span className='ps-3' style={{ color: 'aliceblue', fontSize: '14px' }}>Enter Skillye Verified Email Address below here.</span>
                            </div>
                            <input type="email" name='ForgotUserEmail' id='ForgotUserEmail' placeholder='Enter Your Email' style={(showErrorResponse === 'ForgotUserEmail') ? { border: '2.2px solid #ff3366' } : {}} />
                            <button type='submit' className='btn btn-primary mt-3'>Continue</button>
                        </form>
                    }
                    {
                        ForgotPasswordFlag === 'CodeVerification' &&
                        <form onSubmit={(e) => handleCodeVerification(e)}>
                            <div className='Cancel-ForgotPass-Window' onClick={() => setForgotPasswordFlag('Login')}>
                                <FaTimes />
                            </div>
                            <div className='d-flex flex-column align-items-center fw-bold'>
                                <span className='fs-5 mb-2'>Verify your Email</span>
                                <span className='px-3' style={{ color: 'aliceblue', fontSize: '14px' }}>Enter Verification code which is sent in your skillye verified Email account.</span>
                            </div>
                            <input type="number" name='VerificationCode' id='VerificationCode' placeholder='Enter Verification Code' style={(showErrorResponse === 'VerificationCode') ? { border: '2.2px solid #ff3366' } : {}} />
                            <div className='w-100 px-3 d-flex align-items-center justify-content-between'>
                                <span className='align-self-end text-decoration-underline fw-bold' style={{ color: 'var(--Color3)' }} onClick={handleResendCode}>Resend</span>
                                <button type='submit' className='btn btn-default px-3 text-light fw-bold' style={{ backgroundColor: 'var(--Color1)' }}>Verify</button>
                            </div>
                        </form>
                    }
                    {
                        ForgotPasswordFlag === 'ResetPassword' &&
                        <form onSubmit={(e) => handleResetPassword(e)}>
                            <div className='Cancel-ForgotPass-Window' onClick={() => setForgotPasswordFlag('Login')}>
                                <FaTimes />
                            </div>
                            <div className='d-flex flex-column align-items-center fw-bold'>
                                <span className='fs-5 mb-3'>Reset your Password</span>
                                <span className='align-self-start' style={{ color: 'aliceblue', fontSize: '14px' }}>* minimum 8 characters</span>
                                <span className='align-self-start' style={{ color: 'aliceblue', fontSize: '14px' }}>* atleast one special character</span>
                                <span className='align-self-start' style={{ color: 'aliceblue', fontSize: '14px' }}>* atleast one capital / small alphabet</span>
                            </div>
                            <input type="password" name='ResetPassword' id='ResetPassword' placeholder='Enter new Password' style={(showErrorResponse === 'ResetPassword') ? { border: '2.2px solid #ff3366' } : {}} />
                            <input type="password" name='ConfirmResetPassword' id='ConfirmResetPassword' placeholder='Confirm new Password' style={(showErrorResponse === 'ResetPassword') ? { border: '2.2px solid #ff3366' } : {}} />
                            <button type='submit' className='btn btn-default px-3 text-light fw-bold' style={{ backgroundColor: 'var(--Color1)' }}>Verify</button>
                        </form>
                    }
                </div>
                <div className={`Signup-Container ${ChangeForm ? 'FormActive' : ''}`}>
                    <form onSubmit={(e) => handleSignupFormSubmit(e)}>
                        <h3>Welcome, New Skillye</h3>
                        <input type="text" value={signupUserDetails.UserName} name="UserName" id="SignupUserName" placeholder='Enter UserName' onChange={(e) => { handleSignupFormInputs(e) }} style={(showErrorResponse === 'Name-Signup') ? { border: '2.2px solid #ff3366' } : null} />
                        <input type="email" value={signupUserDetails.UserEmail} name="UserEmail" id="SignupUserEmail" placeholder='Enter Email' onChange={(e) => { handleSignupFormInputs(e) }} style={(showErrorResponse === 'User/Email-Signup') ? { border: '2.2px solid #ff3366' } : null} />
                        <input type="password" value={signupUserDetails.UserPassword} name="UserPassword" id="SignupUserPassword" placeholder='Enter Password' onChange={(e) => { handleSignupFormInputs(e) }} style={(showErrorResponse === 'Password-Signup') ? { border: '2.2px solid #ff3366' } : null} />
                        <input type="submit" value="Signup" />
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginSignup