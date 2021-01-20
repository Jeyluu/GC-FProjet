const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authroutes')
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const port = 3000;
const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());//Converti le Json en java pour qu'on puisse l'utiliser directement.
app.use(cookieParser());

//view engine
app.set("view engine","ejs");


//connection mongoDB
mongoose.connect("mongodb://localhost:27017/Le-Golf-Corner", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

//routes
app.get('*', checkUser);
app.get('/', (req,res) => {
    res.render('accueil')
});
app.get('/shop', requireAuth, (req,res) => {
    res.render('shop')
});
app.use(authRoutes);

app.get('/parametres', (req,res) => {
    res.render("parametres")
})

app.get('/compte', (req,res) => {
    res.render("compte")
})

//cookies
app.get('/set-cookies', (req,res) => {
    
    //res.setHeader('Set-cookie', 'nouvelUtilisateur=true');//Si nous créons un cookie comme précédemment, il va cherche si dans le moteur de recherche si le cookie existe déjà qui va le remplacer et le mettre à jour. S'il n'existe pas il va créer le cookie
    res.cookie('nouvelUtilisateur',false);
    res.cookie('EstEmploye',true, {maxAge:1000 * 60 * 60 * 24, httpOnly: true});
    // max age = 1000ms* 60s = 1min * 60min pour 1H * 24h pour 1 journée. Ce qui signifie que les cookies vont disparaitre au bout d'une journée. 
    // secure:true signifie que les cookies seront envoyés uniquement quand la page sera en connection HTTPS
    
    res.send('Vous avez les cookies')
})

app.get('/read-cookies', (req,res) => {
    const cookies = req.cookies;
    console.log(cookies.nouvelUtilisateur);
    res.json(cookies)
})


//Ecoute du port de connection localhost
app.listen(port, () => {
    console.log(`Vous êtes connecté au port ${port}, lancé à  ${new Date().toLocaleString()}`)
})

