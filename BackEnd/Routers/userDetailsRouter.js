const express = require('express');
const router = express.Router();
const path = require('path');
const userModel = require('../DB_Models/userModel.js');
const DetailsModel = require('../DB_Models/DetailsModel.js');
const { DeleteExistingFile } = require('../Utilities/deleteFiles.js');
// Update Details
router.post('/InsertAndUpdate', async (request, response) => {
    const { AllDetails } = request.body;
    const ExistingFileDetails = await DetailsModel.findOne({ Email: AllDetails.Email }, { ImageFileName: 1, ResumeFileName: 1 });
    // Delete the Existing File After New File Uploaded
    if (ExistingFileDetails && ExistingFileDetails.ImageFileName !== AllDetails.ImageFileName) {
        const FileDeleteResponse = DeleteExistingFile('Images', ExistingFileDetails.ImageFileName);
        if(FileDeleteResponse === 'Error: While deleting File!'){
            return response.status(400).send('Error: While deleting your old Image File!');
        }
    }
    // Delete the Existing File After New File Uploaded
    if (ExistingFileDetails && ExistingFileDetails.ResumeFileName !== AllDetails.ResumeFileName) {
        const FileDeleteResponse = DeleteExistingFile('Resumes', ExistingFileDetails.ResumeFileName);
        if(FileDeleteResponse === 'Error: While deleting File!'){
            return response.status(404).send('Error: While deleting your old resume File!');
        }
    }
    const SkillyeDetials = {
        Name: AllDetails.Name,
        Age: AllDetails.Age,
        Skills: AllDetails.Skills,
        Experience: AllDetails.Experience,
        Email: AllDetails.Email,
        About: AllDetails.About,
        ViewProfile: AllDetails.ViewProfile,
        ImageFileName: AllDetails.ImageFileName,
        ResumeFileName: AllDetails.ResumeFileName,
        LocationDetails: {
            State: AllDetails.State,
            Country: AllDetails.Country
        },
        SocialLinks: {
            LinkedIn: AllDetails.LinkedIn,
            GitHub: AllDetails.GitHub,
            Email: AllDetails.Email,
            Website: AllDetails.Website,
            Instagram: AllDetails.Instagram,
        }
    }
    if (!await DetailsModel.findOne({ Email: AllDetails.Email })) {
        await DetailsModel.create(SkillyeDetials);
        await userModel.findOneAndUpdate({ Email: AllDetails.Email }, { $set: { isProfileUpdated: true } });
        return response.status(201).send('DetailsInserted!');
    }
    else {
        await DetailsModel.findOneAndReplace({ Email: AllDetails.Email }, SkillyeDetials);
        await userModel.findOneAndUpdate({ Email: AllDetails.Email }, { $set: { isProfileUpdated: true } });
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
    const WhichUserDetail = await DetailsModel.findOne({ Email: WhichUserEmail });
    if (WhichUserDetail) {
        return response.status(200).send(WhichUserDetail);
    }
    return response.status(404).send('UserDetail Not Found!');
});
// Resume File Download
router.post('/userResumeDownload', async (request, response) => {
    const { userFileURL } = request.body;
    const FileDownloadURL = path.join(__dirname, '..', 'Uploads/Resumes', userFileURL);
    response.download(FileDownloadURL);
});
module.exports = router;