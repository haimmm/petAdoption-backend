//express
const express = require('express');
const router = express.Router();

//permissions
const permissions = require("../modules/permissions.module");
const permissionsValidator = require("../middlewares/permissionsValidator");

const tokenValidator = require('../middlewares/tokenValidator');
const userController = require("../controllers/user.controller");

//schema
const DTOvalidator = require('../middlewares/DTOvalidator');
const updateProps = require('../DTO/user/updateUserProps-schema');

//GET all users -> only email, name, permissions
router.get('/', tokenValidator, permissionsValidator([permissions.ADMIN]), userController.getAll);

//GET user by id
router.get('/:id', userController.getById);

//UPDATE user
router.put('/:id', tokenValidator, DTOvalidator(updateProps), userController.update);

module.exports = router;