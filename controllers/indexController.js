const Post = require('../database/models/Post');

const getHomePage = async (req, res) => {
    const posts = await Post.find({});

    res.render("index", {
        posts: posts
    });
}

module.exports = {
    getHomePage
}