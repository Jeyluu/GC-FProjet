const User = require("../models/users")
const jwt = require('jsonwebtoken')


//Les messages d'erreurs
const messErreur = (err) => {
    console.log(err.message, err.code);
    let errors = {email:"",password:""}

//Email pas correct
if(err.message === "Votre Email n'est pas correct") {
    errors.email = "Cet Email n'existe pas dans notre base de donnée"
}

//Mot de passe pas correct
if(err.message === "Le mot de passe n'est pas correct") {
    errors.password = "Ce mot de passe n'est pas correct"
}

//code erreur en double
if (err.code === 11000) {
    errors.email = "Cet Email a déjà été enregistré";
    return errors;
}

//validation errors
if (err.message.includes('customer validation failed')){
    Object.values(err.errors).forEach(({properties}) => {
        errors[properties.path] = properties.message;
    })
}

return errors;
};

const maxAge = 3 * 24 * 60 * 60; // le secret pass expirera dans 3 jour 24h 60min et 60 secondes
const createToken = (id) => {
    return jwt.sign({ id }, 'Golf ninja secret', {
        expiresIn:maxAge  // ligne 28/29 est la formule qui nous retourne le token avec une signature header/payload+verify
    });
}


module.exports.signup_get = (req,res) => {
    res.render("signup")
}

module.exports.login_get = (req,res) => {
    res.render("login")
}

module.exports.signup_post = async (req,res) => {

    
    const {email,password} = req.body;
    try {
        const user = await User.create({email,password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly:true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    } catch(err) {
        const errors = messErreur(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req,res) => {
    const {email,password} = req.body;
    
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly:true, maxAge: maxAge * 1000});
        res.status(200).json({user:user._id});
    }
    catch (err) {
        const errors = messErreur(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req,res) => {
    res.cookie('jwt', '', {maxAge: 1}); // ce code permettra de remplacer le jwt par un jwt blanc qui expirera rapidement
    res.redirect('/');
}