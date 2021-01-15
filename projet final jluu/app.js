const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authroutes')

const port = 3000;
const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());//Converti le Json en java pour qu'on puisse l'utiliser directement.

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
app.get('/', (req,res) => {
    res.render('accueil')
});
app.get('/admin', (req,res) => {
    res.render('admin')
});
app.use(authRoutes);


//Ecoute du port de connection localhost
app.listen(port, () => {
    console.log(`Vous êtes connecté au port ${port}, lancé à  ${new Date().toLocaleString()}`)
})

