const LocalStrategy = require('passport-local');
const User = require('../../api/models/user');
const config = require('../../api/config/database');

module.exports = function (passport) {
    passport.use(new LocalStrategy({usernameField:'username', passwordField:'password'},
        function (username, password, done) {
            User.findOne({
                username: username
            }, function (err, user) {
                console.log(username);
                if (err) {
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>err");
                    return done(err);
                }
                if (!user) {
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>!admin");
                    return done(null, false, {});
                }
                if (user.password !== password) {
                    //return done(null, false, {});
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>pass");
                    return done(null, false);
                }
                console.log("+++++++++++++++++++++++pass");
                return done(null, user);
            });
        }
    ));


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}