const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user');
const saucesRouter = require('./routes/sauce');
const path = require('path');

const app = express();

// Avant toute chose on se connecte à MongoDB :
mongoose.connect('mongodb+srv://yo:Haggish879@cluster0.lkpd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('La connexion à MongoDB a bien été établie !'))
    .catch(() => console.log('La connexion à MongoDB a échoué...'));

app.use(express.json()); // = bodyParser = Donne accès au corps de la requête.

// CORS
/* app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
}); */

app.use(cors());

// Chemin statique pour les images :
app.use('/images', express.static(path.join(__dirname, 'images')));

// Vers le router du chemin utilisateur
app.use('/api/auth', userRouter);
// Vers le router des sauces :
app.use('/api/sauces', saucesRouter);

module.exports = app;