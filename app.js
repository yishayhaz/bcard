const express = require('express');
const mongoose = require('mongoose')
var path = require('path');
const session = require('express-session')
var cookieParser = require('cookie-parser')

const app = express();
require('dotenv').config()

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static('public'))
app.use('/b', express.static('public'))
app.use('/deleteCard', express.static('public'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser())
app.use(require('./route'))

mongoose.connect(
    process.env.DATABASE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (data) => console.log(data || 'DB connected!')
)

app.listen(process.env.PORT || 3000, () => console.log("App Is Up!"))