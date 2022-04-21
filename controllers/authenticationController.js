const bcrypt = require('bcrypt');
const User = require('../database/models/User');

const getLoginPage = (req, res) => {
    res.render('login');
}

const postLogin = (req, res) => {
    const {
        email,
        password
    } = req.body;
    // try to find the user
    User.findOne({
        email
    }, (error, user) => {
        if (user) {
            // compare passwords
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    // store user session
                    req.session.userId = user._id;
                    req.session.username = user.username;
                    res.redirect('/');
                } else {
                    res.redirect('auth/login');
                }
            });
        } else {
            return res.redirect('/auth/login');
        }
    });
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

const getRegistrationPage = (req, res) => {
    res.render('register', {
        errors: req.flash('registrationErrors')
    });
}

// @TODO Map possible error messages in a separate class and make them user-friendly.
const postRegistration = (req, res) => {
    User.create(req.body).then(() => {
        return res.redirect("/");
    }).catch((error) => {
        const registrationErrors = (error.errors != undefined) ? Object.keys(error.errors).map(key => error.errors[key].message) : error.message;
        req.flash("registrationErrors", registrationErrors);
        return res.redirect("/auth/register");
    })
};


module.exports = {
    getLoginPage,
    postLogin,
    logout,
    getRegistrationPage,
    postRegistration
}

