const fs = require('fs');
const path = require('path');
// 
function DeleteExistingFile(folderName, FileName) {
    const FileAbsolutePath = path.join(__dirname, "..", `/Uploads/${folderName}`, FileName);
    try {
        fs.unlinkSync(FileAbsolutePath);
        return 'File was deleted Successfully!';
    } catch (error) {
        if (error) return 'Error: While deleting File!';
    }
}
//  
module.exports = { DeleteExistingFile }