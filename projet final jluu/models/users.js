const mongoose = require("mongoose");
const { isEmail }  = require("validator") //pk isEmail est entre crochet?


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Merci de rentrer un Email."],
        unique: true,
        lowercase: true,
        validate:[isEmail,"Merci de rentrer un Email valide"] //val = valeur de l'email
    },
    password:{
        type:String,
        required: [true,"Merci de rentrer un mot de passe valide."],
        minlength: [6,"Votre mot de passe doit faire plus de 6 charactères"]
    },
});

const User = mongoose.model("customer", userSchema)

module.exports = User;