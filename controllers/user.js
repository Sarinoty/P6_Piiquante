// On importe bcrypt
const bcrypt = require('bcrypt');
// On importe jsonwebtoken
const jwt = require('jsonwebtoken');
// On importe le modèle User
const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 14)
    .then(hash => { // On récupère le hash du mot de passe (hash)
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save() // On sauvegarde le user dans la bdd
        .then(() => res.status(201).json({message: "Utilisateur créé !"}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // On cherche le user dans la bdd correspondant à l'adresse mail récupérée dans la requete (il ne peut pas y avoir 2 users avec le meme mail car on a utilisé unique dans le modele)
    .then(user => {
      if (!user) { // S'il n'y a pas de user retourné
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // on compare le mot de passe de la requete avec celui de la bdd. 
        .then(valid => {
          if (!valid) { // Si la comparaison est false
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign( // On crée le token
              {userId: user._id}, // Données que l'on veut encoder (si on veut en encoder) ("payload")
              'RANDOM_TOKEN_SECRET', // Clé secrète pour l'encodage (en production on utilisera une chaine de caractères bcp plus longue et très aléatoire)
              {expiresIn: '24h'} // Argument de configuration. On ajoute une expiration au bout de 24h.
            )
          });
        })
        .catch(error => res.status(500).json({ error })); // S'il y a une erreur au niveau du serveur
    })
    .catch(error => res.status(500).json({ error })); // S'il y a un pb de connexion à la base (si y'a pas de user avec ce mail ce sera envoyé par mongodb dans le then)
};