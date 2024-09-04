const Jwt = require('jsonwebtoken');
require('dotenv').config();
// Verify Token
function VerifyToken(request, response, next) {
    const SignedToken = request.signedCookies._UAID;
    if (SignedToken) {
        try {
            Jwt.verify(SignedToken, process.env.JWT_SECRET_KEY, async (err, Data) => {
                if (err) throw new Error(err);
                request.VerifiedUser = Data;
            })
        } catch (error) {
            response.status(401).send('Invalid SecretKey or Token');
        }
    }
    else {
        response.status(401).send('Invalid/UnAuthorized Token');
    }
    next();
}
// 
module.exports = { VerifyToken}; 