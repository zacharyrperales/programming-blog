const path = require('path');
const Post = require('../database/models/Post');

module.exports = (req, res) => {
    const backgroundImage = (req.files) ? req.files.backgroundImage : undefined;
    const postImages = (req.files && req.files.postImages) ? [] : undefined;

    if (postImages) {
        if (req.files.postImages.length > 1) {
            for (const postImage of req.files.postImages) {
                postImages.push(postImage);
                postImage.mv(path.resolve(__dirname, '..', 'public/posts', postImage.name), (error) => {
                    (error) && console.log(error);
                });
            }
        } else {
            postImages.push(req.files.postImages);
            postImages[0].mv(path.resolve(__dirname, '..', 'public/posts', postImages[0].name), (error) => {
                (error) && console.log(error);
            });
        }
    }
    // Check if any images were uploaded to the backgroundImage input field in the create.edge file.
    if (backgroundImage) {
        // Move the image in the backgroundImage field from the request to /public/posts/{backgroundImage.name}.
        backgroundImage.mv(path.resolve(__dirname, '..', 'public/posts', backgroundImage.name), (error) => {
            (error) && console.log(error);
        });
    }

    Post.create({...req.body, image : (backgroundImage) ? `/posts/${backgroundImage.name}` : this.image,
        postImages: (postImages) ? postImages.map(a => `/posts/${a.name}`) : this.postImages}, (error, post) => {
            (error) && console.log(error);
            res.redirect("/");
    });



    /*
    const lastPostID = Post.find().sort({"_id" : -1 }).limit(1);

    Post.updateOne({_id: lastPostID}, {$set:{postImages: postImages}}, (error, post) => {
        (error) && console.log(error);
    });
     */


    /*
    Post.insertMany({postImages}), (error, post) => {
        (error) && console.log(error);
        res.redirect("/");
    };
     */
};