const express = require('express');
const router = express.Router();
const path = require('path');
const userModel = require('../DB_Models/userModel.js');
const DetailsModel = require('../DB_Models/DetailsModel.js');
// Update Details
router.post('/InsertAndUpdate', async (request, response) => {
    const { DetailsFormData, FileNames } = request.body;
    const SkillyeDetials = {
        Name: DetailsFormData.NameField,
        Age: DetailsFormData.AgeField,
        Skills: DetailsFormData.SkillField,
        Experience: DetailsFormData.ExperienceField,
        Email: DetailsFormData.EmailField,
        About: DetailsFormData.AboutField,
        ImageFileName: FileNames.ImageFileName,
        PdfFileName: FileNames.ResumeFileName,
        SocialLinks: {
            LinkedIn: DetailsFormData.LinkedInField,
            GitHub: DetailsFormData.GithubField,
            Email: DetailsFormData.EmailField,
            Website: DetailsFormData.WebsiteField,
            Instagram: DetailsFormData.InstagramField,
        }
    }
    if (!await DetailsModel.findOne({ Email: DetailsFormData.EmailField })) {
        await DetailsModel.create(SkillyeDetials);
        await userModel.findOneAndUpdate({ Email: DetailsFormData.EmailField }, { $set: { isProfileUpdated: true } });
        return response.status(201).send('DetailsInserted!');
    }
    else {
        await DetailsModel.findOneAndReplace({ Email: DetailsFormData.EmailField }, SkillyeDetials);
        await userModel.findOneAndUpdate({ Email: DetailsFormData.EmailField }, { $set: { isProfileUpdated: true } });
        return response.status(202).send('DetailsUpdated!');
    }
});
// View Profile
router.post('/ViewProfile', async (request, response) => {
    const { UserEmail } = request.body;
    const getUser = await DetailsModel.findOne({ Email: UserEmail });
    if (getUser) {
        return response.status(200).send(getUser);
    }
    return response.status(400).send('User not Found!');
});
// Get All Users
router.get('/ViewAllUser', async (_, response) => {
    const allUser = await DetailsModel.find({});
    response.status(200).send(allUser);
});
// Get Specific User Details
router.post('/UsersDetailView', async (request, response) => {
    const { WhichUserEmail } = request.body;
    const WhichUserDetail = await DetailsModel.findOne({Email: WhichUserEmail});
    if(WhichUserDetail){
        return response.status(200).send(WhichUserDetail);
    }
    return response.status(404).send('UserDetail Not Found!');
});
// Resume File Download
router.post('/userResumeDownload', async (request, response) => {
    const { userFileURL } = request.body;
    const FileDownloadURL = path.join(__dirname, '..', 'Uploads/Resumes', userFileURL);
    // response.status(200).send(FileDownloadURL);
    response.download(FileDownloadURL);
});
module.exports = router;