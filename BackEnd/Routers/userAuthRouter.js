const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../DB_Models/userModel.js');
const { mailTransporter } = require('../Utilities/sendMail.js');
const { VerifyToken } = require('../Middlewares/JwtMiddleware.js');
const { generateCode } = require('../Middlewares/generateCode.js');
// 
// Register New User
router.post('/Signup', async (request, response) => {
    const { UserName, UserEmail, UserPassword } = request.body;
    if (UserEmail !== '' && UserName !== '' && UserPassword !== '') {
        const HashedPassword = await bcrypt.hash(UserPassword, 10);
        if (!await userModel.findOne({ Email: UserEmail })) {
            await userModel.create({ Name: UserName, Email: UserEmail, Password: HashedPassword });
            return response.status(201).send("Account Created!");
        }
        else {
            return response.status(409).send("User Already Exist!");
        }
    }
});
// Login Existing User
router.post('/Login', async (request, response) => {
    const { UserEmail, UserPassword } = request.body;
    if (UserEmail !== '' && UserPassword !== '') {
        const getUser = await userModel.findOne({ Email: UserEmail });
        if (!getUser) {
            return response.status(401).send("InValid User/Email!");
        }
        else if (!await bcrypt.compare(UserPassword, getUser.Password)) {
            return response.status(401).send("InValid Password!");
        }
        const JwtSignedToken = jwt.sign({ Name: getUser.Name, Email: UserEmail, isProfileUpdated: getUser.isProfileUpdated }, process.env.JWT_SECRET_KEY);
        response.cookie('_UAID', JwtSignedToken, {
            signed: true,
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        })
        return response.status(200).json({
            isProfileUpdated: getUser?.isProfileUpdated,
            Message: "Logged In!"
        });
    }
});
// Logout 
router.get('/Logout', async(request, response)=>{
    if(request.signedCookies._UAID){
        response.clearCookie('_UAID', {
            httpOnly: true,
            signed: true,
            secure: false
        });
        return response.status(200).send('Logout Successfully!');
    }
    return response.status(400).send('UnAuthorized user Token!');
});
// Verify Jwt Token Access (Protected Route)
router.get('/VerifyToken', VerifyToken, async (request, response) => {
    if(request.signedCookies._UAID){
        return response.status(200).json({ VerifiedUser: request.VerifiedUser});
    }
}); 
// 
router.post('/sendVerificationCode', async (request, response) => {
    const { SkillyeEmail } = request.body;
    if (!await userModel.findOne({ Email: SkillyeEmail })) {
        return response.status(404).send('This Email not Verified at skillye!')
    }
    const VerificationCode = await generateCode(SkillyeEmail);
    const mailMessageConfig = {
        from: process.env.NODEMAILER_SERVICE_MAIL,
        to: SkillyeEmail,
        subject: 'Verification code for Reset password',
        text: `Your Verification code for resetting password Verification code expires after 1 minute.\n\nCode: ${VerificationCode}`
    }
    mailTransporter.sendMail(mailMessageConfig, (err, _) => {
        if (err) return response.status(500).send('Error while sending Email');
        response.status(200).send('Email sent successfully!');
    });
});
// 
router.post('/VerifyCode', async (request, response) => {
    const { FormCode } = request.body;
    if (FormCode && FormCode != '0') {
        const userExist = await userModel.findOne({ verificationCode: FormCode });
        if (userExist) {
            return response.status(200).send({
                Message: 'Code Verified!',
                VerifiedEmail: userExist.Email
            });
        }
        return response.status(404).send('Error: User/Email is not Verified at Skillye');
    }
});
// 
router.post('/PasswordReset', async (request, response) => {
    const { ConfirmPasswordValue, VerifieduserEmail } = request.body;
    if (VerifieduserEmail && ConfirmPasswordValue) {
        if (await userModel.findOne({ Email: VerifieduserEmail })) {
            const newHashedPassword = await bcrypt.hash(ConfirmPasswordValue, 10);
            await userModel.findOneAndUpdate({ Email: VerifieduserEmail }, { Password: newHashedPassword });
            return response.status(200).send('Password Changed successfully!');
        }
        return response.status(500).send('Something went wrong when Resetting passsword!')
    }
});
// 
module.exports = router;