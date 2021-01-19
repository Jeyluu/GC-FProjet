const mongoose = require("mongoose");
const { isEmail }  = require("validator") //pk isEmail est entre crochet?
const bcrypt = require('bcrypt');

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

//Dire a mongoose de faire une fonction après qu'un nouvel utilisateur ai été créé
/*userSchema.post('save', function (doc,next) { //La methode post utilisé sur cette ligne est la méthode "après" et non poster
    console.log('Un nouvel utilisateur a été créé et sauvegardé', doc);
    next();
})*/

//Dire a mongoose de faire une fonction avant qu'un nouvel utilisateur ai été créé
userSchema.pre('save', async function (next) { //La methode post utilisé sur cette ligne est la méthode "avant" et non poster
    const salt = await bcrypt.genSalt()  // asynchrone donc on met await mais pourquoi?
    this.password = await bcrypt.hash(this.password, salt)                                //this = refere à la creation de compte
    next();
})

//Methode static pour  connecter l'utilisateur, la methode ci-dessous va servir a comparer l'Email entré par l'utilisateur et celui de la base de donnée
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email}) //this refere au user model
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error("Le mot de passe n'est pas correcte")
    }
    throw Error("Votre Email n'est pas correct")
}

const User = mongoose.model("customer", userSchema)

module.exports = User;