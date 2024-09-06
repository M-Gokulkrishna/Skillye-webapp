const express = require('express');
const router = express.Router();
const multer = require('multer');
const PdfUpload = require('../Middlewares/PdfUpload.js');
const ImageUpload = require('../Middlewares/ImageUpload.js');
// Pdf Upload
router.post('/pdfUpload', (request, response) => {
    PdfUpload(request, response, err => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return response.status(400).json({ Pdf_upload_message: 'Pdf File size must be less than 3mb!' });
        }
        else if (request.file === undefined) {
            return response.status(400).json({ Pdf_upload_message: 'No Pdf File Selected!' });
        }
        else {
            return response.status(201).json({
                File_upload_message: 'Pdf Uploaded Successfully!',
                filePath: `/Uploads/Resumes/${request.file.filename}`,
                fileName: request.file.filename
            });
        }
    });
});
// Image Upload
router.post('/ImageUpload', (request, response) => {
    ImageUpload(request, response, err => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return response.status(400).json({ Pdf_upload_message: 'Image File size must be less than 3mb!' });
        }
        else if (request.file === undefined) {
            return response.status(400).json({ Pdf_upload_message: 'No Image File Selected!' });
        }
        else {
            return response.status(201).json({
                File_upload_message: 'Image Uploaded Successfully!',
                filePath: `/Uploads/Images/${request.file.filename}`,
                fileName: request.file.filename
            });
        }
    });
});
// 
module.exports = router;