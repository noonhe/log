//requirements
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./api/config/database');
mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function () {
    console.log('connected to mongodb...');
});
db.on('error', function (error) {
    console.log(error);
});

let User = require('./api/models/user');
let Articles = require('./api/models/articles');


const app = express();

//Articles.remove({} , function(){});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd/api+json'
}));
app.use(express.static(path.join(__dirname, 'public')));

require('./api/config/passport')(passport);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); //هیچ ریسپانسی نده و از این روت برو بیرون و بده به بعدی
    } else {
        return res.redirect('login');
    }
}
app.use(cookieParser());
app.use(session({
    secret: 'my test',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.get('/', function (req, res) {

    Articles.find({}, function (err, article) {
        if (err)
            res.send(err);

        res.render('home', {
            articles: article.reverse()
        });
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failuredirect: '/login'
}), function (req, res, next) {
    res.redirect('/');
})

app.post('/signup', function (req, res) {
    let date = Date(Date.now());
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        registerDate: date
    });
    newUser.save(function (err, user) {
        if (err)
            res.send(err);

        res.redirect('/');
    });
});


// app.get('/user/:id', function (req,res) {
//     User.findById(req.params.id,function(err,user){
//         if(err)
//             res.send(err);

//         Articles.find({} , function(err , article){
//             console.log(user.loggedIn);
//             if(err)
//                 res.send(err);
//             if(user.loggedIn === false){
//                 res.redirect('/');
//             }
//             else{
//                 //console.log(user.loggedIn);
//                 res.render('user',{
//                     user:user,
//                     articles: article.sort('-time')
//                 });
//             }
//         });
//     }); 
// });


app.post('/article/add', function (req, res) {
    let date = Date(Date.now());
    let t = new Date();
    console.log(req.body);
    let article = new Articles({
        title: req.body.title,
        author: req.user.firstName + " " +req.user.lastName,
        articleBody: req.body.articleBody,
        publishDate: date,
        time: t.getTime()
    });
    article.save(function (err, user) {
        if (err)
            res.send(err);
        res.redirect('/');
    });


});

app.get("/user/logout", function (req, res) {
    req.logout();
    res.redirect('/');
});


app.get('/article/:id', function (req, res) {
    Articles.findById(req.params.id, function (err, article) {
        res.render('article', {
            article: article
        });
    });
});


app.listen(3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("the app is running on port 3000");
    }
})