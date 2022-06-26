const uploader = require('../modules/multer.module');

const imageValidator = async (req, res, next) => {
    if (file in req){ 
        return (req, res, next) => {
                uploader.single('image');
        }
    }
}

module.exports = imageValidator;

