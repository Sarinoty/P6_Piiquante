const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schema type d'un utilisateur dans la BDD
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Plugin pour s'assurer que l'on a bien un utilisateur unique par adresse mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);