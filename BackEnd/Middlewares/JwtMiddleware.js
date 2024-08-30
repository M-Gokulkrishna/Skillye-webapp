const Jwt = require('jsonwebtoken');
require('dotenv').config();
// Verify Token
function VerifyToken(request, response, next) {
    const headerToken = request.headers?.authorization;
    const SignedToken = headerToken?.split(' ')[1];
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
        response.status(400).send('Invalid Token');
    }
    next();
}
// 
module.exports = { VerifyToken}; 