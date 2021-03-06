const bcrypt = require('bcrypt');
const utilisateur = require('../models/User');
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 14)
        .then(hash => {
            const user = new utilisateur({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé avec succès.'}))
                .catch((error) => {
                    // Si l'adresse e-mail n'est pas unique (le front-end attend un message et non une erreur)
                    res.status(400).json({message: error.message})
                });
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    utilisateur.findOne({email: req.body.email})
        .then(user => {
            if(!user) {return res.status(401).json({error: 'Utilisateur non présent dans la base de données.'})}
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect.'});
                    }
                    res.status(201).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId : user._id},
                            process.env.SECRET_WORD,
                            {expiresIn: '18h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};