const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../DB_Models/userModel.js');
const { VerifyToken } = require('../Middlewares/JwtMiddleware.js');
const router = express.Router();
// 
// Register New User
router.post('/Signup', async (request, response) => {
    const { UserName, UserEmail, UserPassword } = request.body;
    const HashedPassword = await bcrypt.hash(UserPassword, 10);
    if (!await userModel.findOne({ Email: UserEmail })) {
        await userModel.create({ Name: UserName, Email: UserEmail, Password: HashedPassword });
        response.status(201).send("Account Created!");
    }
    else {
        response.status(409).send("User Already Exist!");
    }
});
// Login Existing User
router.post('/Login', async (request, response) => {
    const { UserEmail, UserPassword } = request.body;
    const getUser = await userModel.findOne({ Email: UserEmail });
    if (!getUser) {
        return response.status(401).send("InValid User/Email!");
    }
    if (!await bcrypt.compare(UserPassword, getUser.Password)) {
        return response.status(401).send("InValid Password!");
    }
    const JwtSignedToken = jwt.sign({ Name: getUser.Name, Email: UserEmail, isProfileUpdated: getUser.isProfileUpdated }, process.env.JWT_SECRET_KEY);
    return response.status(200).json({
        SignedToken: JwtSignedToken,
        isProfileUpdated: getUser?.isProfileUpdated,
        Message: "Logged In!"
    });
});
// Verify Jwt Token Access (Protected Route)
router.get('/VerifyToken', VerifyToken, async (request, response) => {
    const RefreshJwtToken = jwt.sign({ Name: request.VerifiedUser.Name, Email: request.VerifiedUser.Email, isProfileUpdated: true }, process.env.JWT_SECRET_KEY);
    request.RefreshToken = RefreshJwtToken;
    response.status(200).json({ VerifiedUser: request.VerifiedUser, RefreshToken: request.RefreshToken });
});
// 
module.exports = router;