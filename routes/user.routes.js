const express = require("express");
const router = express.Router();


const {  validateUser } = require('../validations/user.validator');
const UserController = require('../controllers/user.controller');
const  checkApiKey  = require('../middlewares/checkApiKey.middleware.js');

router.post("/register",validateUser,UserController.registerUser);

router.get("/all",checkApiKey,UserController.getAll );

router.get('/:username',UserController.getByUserName );

module.exports = router;
