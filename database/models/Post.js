const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    username: String,
    image: {
        type: String,
        default: '/img/background/default_post_background.jpg'
    },
    // Images that are uploaded to be included at the bottom of a blog post.
    postImages: [String],
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;