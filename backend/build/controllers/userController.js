"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _userRepository = require('../repositories/userRepository'); var userRepository = _interopRequireWildcard(_userRepository);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);

var _jwtMiddleware = require('../middlewares/jwtMiddleware');

_dotenv2.default.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || "";

 const registerUser = async (
    req,
    res
) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: "Todos os campos são obrigatórios." });
        return;
    }

    try {
        const pwdEncrypted = await _bcrypt2.default.hash(password, 10);
        const newUser = await userRepository.createUser({
            name,
            email,
            password: pwdEncrypted,
            role,
        });

        if (newUser.error) {
            res.status(400).json({
                message: "Erro ao cadastrar usuário.",
                error: newUser.error,
            });
            return;
        }

        res.status(201).json({
            message: "Usuário cadastrado com sucesso.",
            user: newUser.data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro interno no servidor.",
            error: error.message,
        });
    }
}; exports.registerUser = registerUser;


 const listUsers = async (req, res) => {
    try {
        const users = await userRepository.listUsers();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({
            message: "Erro interno no servidor.",
            error: error.message,
        });
    }
}; exports.listUsers = listUsers;


 const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Todos os campos são obrigatórios." });
        return;
    }

    try {
        // Busca o usuário pelo e-mail
        const { data: user, error } = await userRepository.getUserByEmail(
            email
        );

        if (error || !user) {
            res.status(401).json({ message: "E-mail ou senha inválidos." });
            return;
        }

        // Verifica se a senha está correta
        const isPasswordValid = await _bcrypt2.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "E-mail ou senha inválidos." });
            return;
        }
        // Gera o token JWT
        const token = _jwtMiddleware.generateToken.call(void 0, user.id);

        res.status(200).json({
            message: "Login realizado com sucesso!",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro interno no servidor.",
            error: error.message,
        });
    }
}; exports.loginUser = loginUser;
