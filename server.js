const expressEdge = require('express-edge');
const express = require('express');
const edge = require('edge.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require('connect-flash');
const getNewPost = require('./controllers/createPost').getNewPost;
const getHomePage = require('./controllers/homePage').getHomePage;
const postStoredPost = require('./controllers/storePost').postStoredPost;
const getPost = require('./controllers/getPost').getPost;
const authenticationController = require('./controllers/authenticationController');
const { MONGO_DB_PASSWORD, PORT } = require('./config/build/config.js');
const app = express();

app.use(fileUpload());
app.use(expressEdge.engine);
app.use(connectFlash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');

mongoose.connect(`mongodb+srv://${MONGO_DB_PASSWORD}:portfolio-blog@cluster0.u8yqr.mongodb.net/posts?retryWrites=true&w=majority`, {
    useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err));

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

app.get('/', getHomePage);
app.get('/post/:id', getPost);
app.get('/posts/new', auth, getNewPost);
app.post('/posts/store', auth, storePost, postStoredPost);
app.get('/auth/login', redirectIfAuthenticated, authenticationController.getLoginPage);
app.post('/users/login', redirectIfAuthenticated, authenticationController.postLogin);
app.get('/auth/register', redirectIfAuthenticated, authenticationController.getRegistrationPage);
app.post('/users/register', redirectIfAuthenticated, authenticationController.postRegistration);
app.get('/auth/logout', authenticationController.logout);


// Start the server.
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});