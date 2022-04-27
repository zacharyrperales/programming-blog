const expressEdge = require('express-edge');
const express = require('express');
const edge = require('edge.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require('connect-flash');
const indexController = require('./controllers/indexController');
const authenticationController = require('./controllers/authenticationController');
const postController = require('./controllers/postController');
const { MONGO_DB_PASSWORD, PORT } = require('./config/build/config.js');
const app = express();
app.use(fileUpload());
app.use(expressEdge.engine);
app.use(connectFlash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');

mongoose.connect(`mongodb+srv://zack:${MONGO_DB_PASSWORD}@cluster0.u8yqr.mongodb.net/posts?retryWrites=true&w=majority`).catch((error) => {
    console.log(error);
})

const mongoStore = connectMongo(expressSession);

app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use('*', (req, res, next) => {
    app.locals.auth = req.session.userId
    next();
});

const storePost = require('./middleware/storePost');
const auth = require('./middleware/auth');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');

app.use('/', express.static(__dirname + '/views/resources'));
app.use('/posts', express.static(__dirname + '/views/resources'));
app.use('/post', express.static(__dirname + '/views/resources'));
app.use('/auth', express.static(__dirname + '/views/resources'));

app.get('/', indexController.getHomePage);
app.get('/post/:id', postController.getPost);
app.get('/posts/new', auth, postController.getNewPost);
app.post('/posts/store', auth, storePost, postController.postStoredPost);
app.get('/auth/login', redirectIfAuthenticated, authenticationController.loginPage);
app.post('/users/login', redirectIfAuthenticated, authenticationController.login);
app.get('/auth/register', redirectIfAuthenticated, authenticationController.registrationPage);
app.post('/users/register', redirectIfAuthenticated, authenticationController.register);
app.get('/auth/logout', authenticationController.logout);


// Start the server.
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});