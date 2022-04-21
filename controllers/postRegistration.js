const User = require('../database/models/User');

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
    postRegistration
}