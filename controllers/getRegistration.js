const getRegistration = (req, res) => {
    res.render('register', {
        errors: req.flash('registrationErrors')
    });
}

module.exports = {
    getRegistration
}