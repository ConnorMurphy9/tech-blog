const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const PORT = process.env.PORT || 3055;

const sess = {
    secret: 'Super tripledog secret',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    }),
}

app.use(session(sess))

//This creates the handlebars environment. Expect the output to be a handlebar
const hbs = exphbs.create({ helpers });
//Engine is what we use to deliver the data to a specific location
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));

sequelize.sync({ force: true }).then(async () => {
    await seedAll()
    await app.listen(PORT, () => {
        console.log(`App Listening on port ${PORT}`)
    });
}) 