const { Schema, model } = require('mongoose');
// userSchema for User details
const userSchema = new Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true
    },
    isProfileUpdated: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: Number,
        default: 0
    }
});
// UserModel based on userSchema 
const userModel = model("userDetail", userSchema, "userCredentials");
// Export UserModel
module.exports = userModel;