// var admin = require("firebase-admin");
// var serviceAccount = require("../firebaseAdminCredentials.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// // Middleware de autenticação
// const AuthMiddleware = async (req, res, next) => {
//     const token = req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : null;
//     if (!token) {
//         return res.sendStatus(401);
//     }

//     try {
//         const authUser = await admin.auth().verifyIdToken(token);
//         req.authUser = authUser;
//         next();

//     } catch (e) {
//         return res.sendStatus(401);
        
//     }
// };

// module.exports = AuthMiddleware;

const admin = require('firebase-admin');
const express = require('express');
const app = express();

// Inicializar o Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware para verificar a autenticação e permissão do usuário
const authenticateUser = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Obter o usuário do banco de dados ou do Firebase Authentication
    const userRecord = await admin.auth().getUser(uid);
    const permission = userRecord.customClaims?.permission;

    // Determinar a rota com base na permissão
    switch (permission) {
      case '0':
        req.userType = 'sudo';
        next();
        break;
      case '1':
        req.userType = 'admin';
        next();
        break;
      case '2':
      case '3':
        req.userType = 'user';
        next();
        break;
      default:
        res.status(403).json({ error: 'Permissão inválida' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Não autenticado' });
  }
};

// Rota protegida para usuários
app.get('/user', authenticateUser, (req, res) => {
  if (req.userType === 'user') {
    res.json({ message: 'Acesso permitido para usuários' });
  } else {
    res.status(403).json({ error: 'Acesso negado' });
  }
});

// Rota protegida para administradores
app.get('/admin', authenticateUser, (req, res) => {
  if (req.userType === 'admin') {
    res.json({ message: 'Acesso permitido para administradores' });
  } else {
    res.status(403).json({ error: 'Acesso negado' });
  }
});

// Rota protegida para super administradores
app.get('/sudo', authenticateUser, (req, res) => {
  if (req.userType === 'sudo') {
    res.json({ message: 'Acesso permitido para super administradores' });
  } else {
    res.status(403).json({ error: 'Acesso negado' });
  }
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});