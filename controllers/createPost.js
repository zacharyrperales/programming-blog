module.exports = (req, res) => {

    const username = req.session.username;
    console.log(username);

    if (req.session.userId) {
        return res.render('create', {username});
    }

    res.redirect('/auth/login');
};