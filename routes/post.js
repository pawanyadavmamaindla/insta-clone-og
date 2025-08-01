const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
require('../models/post')  // Import post model to register it
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post");

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then((posts)=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
})
router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then((posts)=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post ('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        return res.status(422).json({error:'Please fill in all fields'})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
            console.log(err)
        })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.user._id } },
            { new: true }
        ).populate("comments.postedBy","_id name")
        .populate("postedBy","_id name")
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});

router.put('/unlike', requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("comments.postedBy","_id name")
        .populate("postedBy","_id name")
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});

router.put('/comment', requireLogin, async (req, res) => {
    try {
        const comment = {
            text:req.body.text,
            postedBy:req.user._id
        }
        const result = await 
        Post.findByIdAndUpdate(
            req.body.postId,
            { $addToSet: { comments:comment } },
            { new: true }
        )
        .populate("comments.postedBy","_id name")
        .populate("postedBy","_id name")
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});


router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.postId}).populate("postedBy", "_id");
        if (!post) {
            return res.status(422).json({error: "Post not found"});
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            const result = await Post.deleteOne({_id: post._id});
            return res.json(result);
        } else {
            return res.status(403).json({error: "Unauthorized"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server error"});
    }
});

module.exports = router