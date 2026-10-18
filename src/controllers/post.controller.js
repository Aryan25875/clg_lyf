const postModel = require('../models/post.model');
const {uploadFile} = require('../services/storage.service');
const commentModel = require('../models/comment.model');


async function createPost(req, res){
    let post = {};
    const file = req.file;
    
    const {title, description} = req.body;
    if (file){
        const result = await uploadFile(file.buffer.toString('base64'));
        post = await postModel.create({
            title,
            description,
            uri: result.url,
            author: req.user.id
        })
    }else{
        post = await postModel.create({
            title,
            description,
            author: req.user.id,
            uri: undefined
        })
    }

    res.status(201).json({
        msg : "Post Created Successfully",
        post
    })
}

async function getAllPosts(req, res){

    const allPosts = await postModel.find().limit(20)

    res.status(200).json({
        msg : "Success",
        allPosts
    })

}

async function getMyPosts(req, res){
    const posts = await postModel.find({
        author: req.user.id
    }).limit(20);

    res.status(200).json({
        msg: "Success",
        posts
    })
}

async function filterByLabel(req, res){
    const {label} = req.body;

    const posts = await postModel.find({
        labels:label
    }).limit(20);

    return res.status(200).json({
        msg: "Success",
        posts
    })

}

async function likePost(req, res){
    const {id} = req.params;
    const decoded = req.user;

    const post = await postModel.findById(id);
    if (!post){
        return res.status(404).json({
            msg: "Post not found"
        })
    }

    const userid = decoded.id;

    const alreadyLiked = post.like.some(
        uid => uid.toString() === userid
    );

    if (alreadyLiked){
        post.like.pull(userid);

        await post.save();

        return res.status(200).json({
            msg: "Removed like successfully",
            post
        })
    }


    post.dislike.pull(userid);
    post.like.addToSet(userid);

    await post.save();

    res.status(200).json({
        msg: "Successfully added like",
        post
    })

}

async function dislikePost(req, res){
    const {id} = req.params;
    const decoded = req.user;

    const post = await postModel.findById(id);
    if (!post){
        return res.status(404).json({
            msg: "Post not found"
        })
    }

    const userid = decoded.id;

    const alreadyDisliked = post.dislike.some(
        uid => uid.toString() === userid
    );

    if (alreadyDisliked){
        post.dislike.pull(userid);

        await post.save();

        return res.status(200).json({
            msg: "Removed dislike successfully",
            post
        })
    }


    post.like.pull(userid);
    post.dislike.addToSet(userid);

    await post.save();

    res.status(200).json({
        msg: "Successfully added dislike",
        post
    })

}

async function addComment(req, res){
    const {postid} = req.params;
    const post = await postModel.findById(postid);
    if (!post){
        return res.status(404).json({
            msg: "Post Not Found"
        })
    }

    const {content, parentComment} = req.body;

    const userid = req.user.id;
    
    const comment = await commentModel.create({
        content,
        author: userid,
        parentComment,
        post: postid
    })

    await postModel.updateOne(
        {_id: postid},
        {$push: {comments: comment}}
    )


    res.status(200).json({
        msg: "Successfully Comment added",
        comment,
        post
    })
}

async function getThisPost(req, res){
    const {postid} = req.params;

    const post = await postModel.findById(postid).populate("comments");
    if (!post){
        return res.status(404).json({
            msg: "Post Not Found"
        })
    }

    
    res.status(200).json({
        msg : "Success",
        post
    })
}



module.exports = {createPost, getAllPosts, getMyPosts, filterByLabel, likePost, dislikePost, addComment, getThisPost};