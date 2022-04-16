const expressEdge = require('express-edge');
const express = require('express');
const edge = require('edge.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require('connect-flash');
const fs = require('fs');
const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require('./controllers/createUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');
const { MONGO_DB_PASSWORD } = require('./config.js');

const app = new express();

app.use(connectFlash());
console.log(MONGO_DB_PASSWORD);
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

app.use(fileUpload());
app.use(express.static('/views/resources'));
app.use('/posts', express.static(__dirname + '/views/resources'));
app.use('/post', express.static(__dirname + '/views/resources'));
app.use('/auth', express.static(__dirname + '/views/resources'));
app.use('/', express.static(__dirname + '/views/resources'));
app.use(expressEdge.engine);
app.set('views', __dirname + '/views');


app.use('*', (req, res, next) => {
   edge.global('auth', req.session.userId);
   next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storePost = require('./middleware/storePost');
const auth = require('./middleware/auth');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');

app.use('/posts/store', storePost);

app.get('/', homePageController);
app.get('/post/:id', getPostController);
app.get('/posts/new', auth, createPostController);


app.post('/posts/store', auth, storePost, storePostController);
app.get('/auth/login', redirectIfAuthenticated, loginController);
app.post('/users/login', redirectIfAuthenticated, loginUserController);
app.get('/auth/register', redirectIfAuthenticated, createUserController);
app.post('/users/register', redirectIfAuthenticated, storeUserController);
app.get('/auth/logout', logoutController);



app.listen(8080, () => {
    console.log('App listening on port 8080');
});