const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //cb(null, `../storage/petsProfilePictures/`)
        cb(null, `storage/petsProfilePictures`);;
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

module.exports =  multer({ storage: storage });