const { Schema, model } = require('mongoose');
// 
const UserDetailSchema = new Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Age: {
        type: Number,
        required: true,
    },
    Skills: {
        type: String,
        required: true
    },
    Experience: {
        type: Number,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    About: {
        type: String,
        required: true,
        trim: true
    },
    ViewProfile: {
        type: String,
        required: true,
        default: 'Public'
    },
    ImageFileName: {
        type: String,
        required: true
    },
    ResumeFileName: {
        type: String,
        required: true
    },
    SocialLinks: {
        LinkedIn: {
            type: String,
            required: true
        },
        GitHub: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            required: true
        },
        Website: {
            type: String,
            required: true
        },
        Instagram: {
            type: String,
            required: true
        }
    }
});
// 
const UserProfileModel = model('UserDetails', UserDetailSchema, 'UserProfileDetails');
// 
module.exports = UserProfileModel;