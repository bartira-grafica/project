"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);

_dotenv2.default.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || "sua_chave_secreta";





 const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Pega o token removendo "Bearer "

  if (!token) {
    res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    return;
  }

  try {
    // Verifica e decodifica o token
    const decoded = _jsonwebtoken2.default.verify(token, SECRET_KEY) ;

    // Adiciona os dados do usuário ao request
    req.user = decoded;

    next();
  } catch (err) {
    res.status(403).json({ message: "Token inválido." });
    return;
  }
}; exports.authenticateToken = authenticateToken;

 const generateToken = (userId) => {
  return _jsonwebtoken2.default.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
}; exports.generateToken = generateToken;
