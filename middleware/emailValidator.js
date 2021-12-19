module.exports = (req, res, next) => {
    if (checkMail(req.body.email)) {
        return next();
    }
    else {
        return res.status(400).json({message: 'Veuillez saisir une adresse e-mail valide !'})
    }
};

function checkMail(email) {
    return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
}