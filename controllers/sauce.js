const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            // On aurait pu coupler la vérification de l'id de la sauce et de l'user (cf: Sauce.updateOne de la route modify) mais on sépare pour avoir des message d'erreur plus précis.
            // S'il n'y a pas de sauce avec l'id demandé :
            if (!sauce) {
                return res.status(404).json({error: new Error('Sauce non trouvée dans la base de données.')});
            }
            // Si l'utilisateur qui demande la suppression n'est pas celui l'a créée :
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({error: new Error('Requête non authorisée.')});
            }
            fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimée de la base de données avec succès.'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
};

exports.modifySauce = (req, res, next) => {
    // Dans le cas où la requête contient un fichier, on cherche l'imageUrl de la sauce existante et on supprime l'ancien fichier du dossier images
    if (req.file) {
        Sauce.findOne({_id: req.params.id}, (e,sauce) => {
            if (e) {
                console.error("La recherche de l'imageUrl d'origine a échoué...");
            }
            else {
                const fileToDelete = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${fileToDelete}`, (e) => {
                    if (e) {console.error('Echec de la suppression de l\'ancien fichier');}
                    else {console.log('Ancienne image supprimée avec succès.');}
                })
            }
        })
    }
    const sauceObject = req.file ?
    // S'il y a une image dans la requête en remplacement de celle existante dans le BDD :
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : 
    // S'il n'y a pas d'image dans la requête :
        {...req.body};
    
    Sauce.updateOne({_id: req.params.id, userId: req.auth.userId}, {...sauceObject, _id:req.params.id})
            .then(res.status(200).json({message: 'Sauce modifiée avec succès !'}))
            .catch(error => res.status(400).json({error}));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Sauce enregistrée dans la base avec succès !'}))
        .catch(error => res.status(400).json({error}));
};

exports.getSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};