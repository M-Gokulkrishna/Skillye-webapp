const path = require('path');
const multer = require('multer');
// Storage Engine config for Resume file storage
const PdfStorage = multer.diskStorage({
    destination: './Uploads/Resumes/',
    filename: (req, file, callBack)=>{
        callBack(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
// Config Pdf Uploader with PdfStorage Storage engine
const PdfUpload = multer({
    storage: PdfStorage,
    limits: {
        fileSize: 3000000
    }
}).single('PdfField');
// 
module.exports = PdfUpload;