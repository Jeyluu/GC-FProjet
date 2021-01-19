const express = require('express');
const authControllers = require("../controllers/authControllers")

const app = express();
//création de compte
app.get("/signup", authControllers.signup_get);
app.post("/signup", authControllers.signup_post);

//connection
app.get("/login", authControllers.login_get);
app.post("/login", authControllers.login_post);


//logout
app.get("/logout", authControllers.logout_get)

module.exports = app;