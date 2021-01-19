const jwt = require('jsonwebtoken');

const requireAuth = (req,res,next) => {

    const token = req.cookies.jwt //pour recuperer le JWT quand on se connecte ou s'enregistre. il est stocker dans l'onglet application.

    //verification si le JsonWebToken existe et est vérifié
    if(token) {
        jwt.verify(token, "Golf ninja secret", (err, decodedToken) => {//si la signature du JWT correspond au token JWT utiliser pour se conencter alors on dit que oui c'est un token valide
            if(err) {
                console.log(err.message);
                res.redirect('/login')
            }
            else {
                console.log(decodedToken)
                next();// si tout est bon alors il va executer la prochain fonction qui est celle de nous afficher la page /shop sur app.js
            }
        } )
    }
    else {
        res.redirect('/login') // si l'utilisateur n'est pas connecté alors ce code renvoi à la page connection (si il n'y a pas de token)
    }
}

module.exports = {requireAuth};