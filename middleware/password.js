//***** GESTION DE LA FORCE DU PASSWORD USER ******/
//importation de password validator
const passwordValidator = require('password-validator');


// création du schéma
const passwordSchema = new passwordValidator();

// Le schéma doit respecter le mot de passe
passwordSchema
.is().min(5) // Min Lenght 5
.is().max(10) // Max lenght 10
.has().digits(2) // have at least 2 digits
.has().not().spaces() // should not have spaces

console.log("contenu du test" + passwordSchema);

// verification du mot de passe par rarpport au schéma

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) 
        {
            console.log('password validé');
            next()
        } else {
            return res.status(400).json({error : "Le mot de passe n'est pas suffisament sécurisé : "+passwordSchema.validate('req.body.password', { list : true })})
        }
};