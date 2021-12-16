const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const userRouter = require('./routes/user');
const saucesRouter = require('./routes/sauce');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Avant toute chose on se connecte à MongoDB :
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('La connexion à MongoDB a bien été établie !'))
    .catch(() => console.log('La connexion à MongoDB a échoué...'));

app.use(express.json()); // = bodyParser = Donne accès au corps de la requête.

// CORS
app.use(cors());
app.use(helmet());

// Chemin statique pour les images :
app.use('/images', express.static(path.join(__dirname, 'images')));

// Vers le router du chemin utilisateur
app.use('/api/auth', userRouter);
// Vers le router des sauces :
app.use('/api/sauces', saucesRouter);

module.exports = app;