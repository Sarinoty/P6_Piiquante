const express = require('express');
const app = express();
const mongoose = require('mongoose');

// On importe les routeurs :
const userRouter = require('./routes/user');

mongoose.connect('mongodb+srv://yo:Haggish879@cluster0.lkpd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Permet d'accéder au corps de la requête (si le content-type est application/json) sur l'objet req avec req.body (équivalent de bodyparser qui est désormais intégré à express)
app.use(express.json());

// Pas d'URI donc s'applique à toutes les routes
// CORS
app.use((req, res, next) => {
  // Autorise toutes les origines ("*")
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Autorise différents types de headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Autorise différentes méthodes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  console.log(res);
  // Envoie vers le middleware suivant
  next();
});

// On envoie toutes les routes vers le router correspondant
app.use('/api/auth', userRouter);

module.exports = app;