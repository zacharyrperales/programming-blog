const Post = require('../database/models/Post');

const getHomePage = async (req, res) => {
    const posts = await Post.find({});

    res.render("pages/index.ejs", {
        posts : posts
    });
}

module.exports = {
    getHomePage
}