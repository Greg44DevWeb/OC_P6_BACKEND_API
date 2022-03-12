// Import de validator npm pour Email
const validator = require ('validator');

module.exports = (req, res, next) => {
    const{email} = req.body;
    if(validator.isEmail(email)){
        console.log(`Nom d'utilisateur invalide ou dejà existant ${validator.isEmail(email)}`);
        next()
    }else {
        return res.status(401).json({error : `L'authentification n'est pas valide`})
    }
};