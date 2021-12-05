const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/user');

// Avant toute chose on se connecte à MongoDB :
mongoose.connect('mongodb+srv://yo:Haggish879@cluster0.lkpd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('La connexion à MongoDB a bien été établie !'))
    .catch(() => console.log('La connexion à MongoDB a échoué...'));

app.use(express.json()); // = bodyParser = Donne accès au corps de la requête.

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Vers le router du chemin utilisateur
app.use('/api/auth', userRouter);

module.exports = app;