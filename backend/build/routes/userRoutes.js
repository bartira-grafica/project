"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');
var _userController = require('../controllers/userController');
var _jwtMiddleware = require('../middlewares/jwtMiddleware');

const router = _express.Router.call(void 0, );

// Rota de cadastro de usuário
router.post("/register", _userController.registerUser);
router.get("/login", _userController.loginUser);
router.get("/list", _jwtMiddleware.authenticateToken, _userController.listUsers);

exports. default = router;
