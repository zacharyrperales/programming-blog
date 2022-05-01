const Post = require('../database/models/Post');
const uploadFile = require("../middleware/upload");

const getNewPost = (req, res) => {
    const username = req.session.username;

    if (req.session.userId) {
        return res.render('create', {username});
    }

    res.redirect('/auth/login');
}

const getPost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("pages/post", {
        post
    });
}

const postStoredPost = async (req, res) => {
    const backgroundImage = (req.files) ? req.files.backgroundImage : undefined;
    const postImages = (req.files && req.files.postImages) ? [] : undefined;

    if (postImages) {
        if (req.files.postImages.length > 1) {
            for (const postImage of req.files.postImages) {
                postImages.push(postImage);
                await uploadFile.streamFileUpload(postImage, "zachary-portfolio-blog-photos");
            }
        } else {
            postImages.push(req.files.postImages);
            await uploadFile.streamFileUpload(req.files.postImages, "zachary-portfolio-blog-photos");
        }
    }

    // Check if any images were uploaded to the backgroundImage input field in the create.ejs file.
    if (backgroundImage) {
        await uploadFile.streamFileUpload(backgroundImage, "zachary-portfolio-blog-photos");
    }

    Post.create({
        ...req.body,
        image: (backgroundImage) ? `https://storage.googleapis.com/zachary-portfolio-blog-photos/${backgroundImage.name}` : this.image,
        postImages: (postImages) ? postImages.map(a => `https://storage.googleapis.com/zachary-portfolio-blog-photos/${a.name}`) : this.postImages
    }, (error, post) => {
        (error) && console.log(error);
        res.redirect("/");
    });
};

module.exports = {
    getNewPost,
    getPost,
    postStoredPost
}