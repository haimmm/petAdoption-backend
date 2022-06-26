//express
const express = require('express');
const router = express.Router();

//schema
const DTOvalidator = require('../middlewares/DTOvalidator');
const addSchema = require('../DTO/pets/add-schema');
const updateSchema = require('../DTO/pets/update-schema');
const adoptSchema = require('../DTO/pets/adopt-schema');

//permissions
const permissions = require("../modules/permissions.module");
const permissionsValidator = require("../middlewares/permissionsValidator");

const tokenValidator = require('../middlewares/tokenValidator');
const petController = require("../controllers/pet.controller");
const imageValidator = require('../middlewares/imageValidator');
const uploader = require('../modules/multer.module');
const dataFormTypeConvert = require('../middlewares/dataFormTypeConvert');


//Add new pet
router.post('/', tokenValidator, permissionsValidator([permissions.ADMIN]), uploader.single('file'), dataFormTypeConvert, DTOvalidator(addSchema), petController.add);
//Get pet by id
router.get('/:id', petController.getById);
//Get pets by queries
router.get('/', dataFormTypeConvert, petController.getByQueries);
//Get pets by user
router.get('/user/:id', petController.getByUser);
//Update pet by id
router.put('/:id', tokenValidator, permissionsValidator([permissions.ADMIN]), uploader.single('file'), dataFormTypeConvert, DTOvalidator(updateSchema), petController.update); 
//adopt or foster
router.post('/:id/adopt', tokenValidator, DTOvalidator(adoptSchema), petController.adopt);
//return pet
router.post('/:id/return', tokenValidator, petController.returnPet);
//save
router.post('/:id/save', tokenValidator, petController.save);
//unsave
router.delete('/:id/save', tokenValidator, petController.unsave);

//get pet profile picture
router.get('/image/:name', petController.getProfilePicture);

module.exports = router;
