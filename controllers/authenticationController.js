const bcrypt = require("bcrypt");
const User = require("../database/models/User");

const loginPage = (req, res) => {
    return res.render("login");
}

const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({"email" : email }).then((user) => {
        bcrypt.compare(password, user.password).then(( matched) => {
            if (matched) {
                req.session.userId = user._id;
                req.session.username = user.username;
                return res.redirect("/");
            } else {
                return res.redirect("/auth/login");
            }
        });
    }).catch((error) => {
        console.log(error);
        return res.redirect("/auth/login");
    });
}

const logout = (req, res) => {
    req.session.destroy(() => {
        return res.redirect("/");
    });
}

const registrationPage = (req, res) => {
    return res.render("register", {
        errors: req.flash("registrationErrors")
    });
}

const register = (req, res) => {
    User.create(req.body).then(() => {
        return res.redirect("/");
    }).catch((error) => {
        const registrationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
        req.flash("registrationErrors", registrationErrors);
        return res.redirect("/auth/register");
    })
};


module.exports = {
    loginPage,
    login,
    logout,
    registrationPage,
    register
}

