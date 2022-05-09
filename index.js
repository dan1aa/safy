const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const exhbs = require("express-handlebars");
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");
const path = require("path");
const express_session = require("express-session");
const MongoStore = require("connect-mongodb-session")(express_session);
require('dotenv').config();

let app = express();

const mainRoute = require('./routes/main')
const authRoute = require('./routes/authenticate')
const profileRoute = require('./routes/profile')


const PORT = process.env.PORT || 3000;


const hbs = exhbs.create({
    defaultLayout: "mainLayout",
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

const store = new MongoStore({
    collection: "sessions",
    uri: process.env.MONGODB_URI,
});

app.use(
    express_session({
        secret: process.env.SECRET_SESSION_VALUE,
        resave: false,
        saveUninitialized: true,
        store,
    })
);

app.use(mainRoute)
app.use(authRoute)
app.use(profileRoute)



async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        app.listen(PORT,
            () => console.log(`server is running on ${PORT}`)
        )
    }

    catch (e) {
        throw new Error(e)
    }

}

start()
