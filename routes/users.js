const express = require('express');
const router = express.Router();

// Appel des fonctions signup et login dans la constante
const {signup, login} = require('../controllers/users');

// Controle dForce du mot de passe (npm password-validator )
const password = require('../middleware/password');

// Contrôle validité format d'email (npm validator)
const controlEmail = require('../middleware/controlEmail');

router.post('/signup', password, controlEmail, signup);
router.post('/login', password, controlEmail, login);

module.exports = router;