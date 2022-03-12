const jwt = require('jsonwebtoken'); // Package pour générer un token
require('dotenv').config(); // import de dotenv

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = { userId };
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User Id non valable !';
        }else {
            next();
        }
    }catch (error) {
        res.status(401).json({error: error | 'requête non authentifiée !'});
    }
};
