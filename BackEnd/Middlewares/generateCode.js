const userModel = require("../DB_Models/userModel");
// 
const generateCode = async (UserEmail) => {
    const VerificationCode = Math.floor(100000 + Math.random() * 900000);
    await userModel.findOneAndUpdate({ Email: UserEmail }, { verificationCode: VerificationCode });
    setTimeout(async () => {
        await userModel.findOneAndUpdate({ Email: UserEmail }, { verificationCode: 0 });
    }, 1000 * 60);   
    return VerificationCode;
}
// 
module.exports = { generateCode };