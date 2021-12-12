const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'pTro13*Cd@1%17pD/wTf.w2DB7abY');
        const userId = decodedToken.userId;
        req.auth = {userId};
        if (req.body.userId && req.body.userId !== userId) {
            throw res.status(403).json({message: 'User ID incorrect.'});
        }
        else {
            next();
        }
    } catch (error) {res.status(401).json({error: error | 'Requête non authentifiée.'})}
};