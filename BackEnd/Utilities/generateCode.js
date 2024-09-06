const userModel = require("../DB_Models/userModel");
require('dotenv').config();
// 
const generateCode = async (UserEmail) => {
    const VerificationCode = Math.floor(100000 + Math.random() * 900000);
    await userModel.findOneAndUpdate({ Email: UserEmail }, { verificationCode: VerificationCode });
    setTimeout(async () => {
        await userModel.findOneAndUpdate({ Email: UserEmail }, { verificationCode: 0 });
    }, eval(process.env.VERIFICATION_CODE_EXPIRE_TIME));   
    return VerificationCode;
}
// 
module.exports = { generateCode };