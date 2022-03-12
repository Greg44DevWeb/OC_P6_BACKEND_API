//**** Mise en place des Controllers */

const Sauce = require('../models/Sauce');
const fs = require('fs');


// ajouter une sauce : POST
exports.createSauce = (req, res, next) => {
  // récupérer les champs dans le corps de la requête
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // nouvelle instance de Sauce
  const sauce = new Sauce({
    ...sauceObject,
    // résolution de l'URL de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  console.log(sauce);
  // enregistrer l'objet dans la BDD avec une promesse
  sauce.save()
  .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
  .catch(error => res.status(401).json({ message: `Requête non aboutie` }));
};
// MODIFICATION D'UNE SAUCE - PUT + méthode upDateOne
exports.modifySauce =  (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(401).json({ message: `Requête non aboutie` }));
};
// supprimer une sauce DELETE seulement si sauce.userId == auteur de la requête
exports.deleteSauce = (req, res, next) => {
  // trouver la sauce 
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {  
      if (!sauce) {
        res.status(404).json({ error: new Error("Cette sauce n'existe pas !")});
      }
      // identifiant mis dans objet requête utilsé pour comparer le userId de la sauce
      if (sauce.userId !== req.auth.userId) {
        res.status(400).json({ error: new Error('Requête non autorisée !')});
      }
      return sauce;
    })
    .then(sauce => {
      // récupère le nom de fichier
      const filename = sauce.imageUrl.split('/images/')[1];
      // supprime le fichier puis effectue le callback qui supprime de la BDD
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch((error) => res.status(401).json({ message: `Requête non aboutie` }));
      });
    })
    .catch((error) => res.status(500).json({ message :`Internal Server Error`}));
}; 
// récupérer une seule sauce avec méthode findOnecd b
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// récupérer toutes les sauces avec methode find
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};