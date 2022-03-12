const bcrypt = require('bcrypt'); // Package de cryptage
const jwt = require('jsonwebtoken'); // Création, vérification de Tokens
const User = require('../models/User'); // import modèle User
require('dotenv').config(); // Import de dotenv

// Middleware avec fonction de connexion nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // 10 tours d'algorythme
        .then(hash => {
            const user = new User({
                email: req.body.email, 
                password: hash  
            });
            user.save()
            .then(() => res.status(201).json({message: 'Utilisateur créé'}))
            .catch(error => res.status(401).json({error}))
        })
        .catch(error => res.status(500).json({error}));
};

// Middleware avec fonction de connexion Utilisateur existant
exports.login = (req, res) => {
    User.findOne({email: req.body.email})
        .then( user => {
        if(!user) {
            return res.status(401).json({message: 'Utilisateur non trouvé'})
        }
        bcrypt.compare(req.body.password, user.password) // comparaison du Mdp Bcrypt/User
            .then((valid) => {
                if (!valid) {
                    return res.status(401).json({error: 'Requête non autorisée'});
                }
                res.status(200).json({
                    userId: user._id, 
                    token: jwt.sign(
                        {userId: user._id},
                        process.env.RANDOM_TOKEN_SECRET,
                        {expiresIn: '12h'}
                    )
                });
            })
            .catch(error => res.status(500).json({error : 'internal problem server'}))
            
        })
        .catch(error => res.status(500).json({error : 'internal problem server'}))
};