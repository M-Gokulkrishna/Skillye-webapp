const path = require('path');
const multer = require('multer');
// Storage Engine config for Image file Storage
const ImageStorage = multer.diskStorage({
    destination: './Uploads/Images/',
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname));
    }
});
// Config Image Uploader with ImageStorage Storage engine
const ImageUpload = multer({
    storage: ImageStorage,
    limits: {
        fileSize: 3000000
    }
}).single('ImageField');
// 
module.exports = ImageUpload