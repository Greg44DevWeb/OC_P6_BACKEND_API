//******* CONTROLLER POUR LE LIKE ET DISLIKE */

// import du modèle de Sauce à liker
const Sauce = require('../models/Sauce');

// export de la fonction like
exports.likeSauce = (req, res, next) => {
    console.log('je suis dans le controleur like !');
    // récupère le champs likes
    const likeStatus = req.body.like;
    // récupère l'id de l'URL
    const sauceId = req.params.id;  
    // récupère le userId
    const userId = req.body.userId;
    //***  METHODE SWITCH POUR ENUMERER LES CAS A GERER POUR LIKE ET DISLIKE ***/
    switch(likeStatus) {
        // ajout d'un like
        case 1:
            //***  vérifier qu'il n'y a pas déjà un like avec findOne  ***/
            Sauce.updateOne({ _id: sauceId}, { 
                $inc: { likes: +1 }, // operateur qui permet l'incrément de 1 avec la fonction updateOne (doc MongoDb)
                $push: { usersLiked: req.body.userId } // opérateur mgdb qui inclus la valeur dans le tableau UsersLiked
            })
            .then(() => res.status(201).json({ message: 'Ajout du like !'}))
            .then(console.log('test --- > Like ajouté')) 
            
            .catch((error) => res.status(400).json({ error }));
            break;
            
        //**** Ajout d'un Dislike *******/   
        case -1:
            Sauce.updateOne({ _id: sauceId}, {
                $inc: { dislikes: +1 },
                $push: { usersDisliked: req.body.userId }
            })
            .then(() => res.status(201).json({ message: "Ajout d'un dislike ! "}))
            .then(console.log('test --- > Dislike ajouté')) 
            .catch((error) => res.status(400).json({ error }));
            break;

        //***  suppression like et dislike ***/   
        case 0:
            Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                //Supprimer son like de UsersLiked
                if(sauce.usersLiked.includes(userId)){
                    Sauce.updateOne({ _id: sauceId},
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: userId} // Remove la valeur du tableau usersLiked
                        })
                      
                    .then(() => res.status(201).json({ message: "like supprimé !"}))
                    .then(console.log('test --- > Like supprimé')) 
                    .catch((error) => res.status(400).json({ error }));
                    
                } else if(sauce.usersDisliked.includes(userId)) {
                    // Supprimer son dislike de usersDisliked
                    Sauce.updateOne({_id: sauceId},
                        {
                            $inc: { dislikes: -1}, // Incrémente de -1 la valeur du like
                            $pull: { usersDisliked: userId} // Remove la valeur du tableau usersDisLiked
                        })
                    .then(console.log('test --- > disLike supprimé')) 
                    .then(() => res.status(201).json({ message: "dislike supprimé ! "}))
                    .catch((error) => res.status(400).json({ error }));
                } else {
                    res.status(403).json({ message: "requête impossible !"})
                }
            })
            .catch(() => res.status(404).json({ message: "Sauce introuvable !"}));
            break;
    }
};