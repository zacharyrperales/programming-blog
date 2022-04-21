const Post = require('../database/models/Post');

const getPost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("post", {
        post
    });
}

module.exports = {
    getPost
}