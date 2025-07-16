const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post");
const User = mongoose.model('User')

router.get('/user/:id', requireLogin, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password");
        if (!user) {
            return res.status(422).json({ error: "User not found" });
        }
        const posts = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name").exec();
        res.json({ user, posts });
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});

router.put('/follow', requireLogin, async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, {
            new: true
        });
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true }).select("-password");;
        res.json(updatedUser);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});

router.put('/unfollow', requireLogin, async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.body.unfollowId, {
            $pull: { followers: req.user._id }
        }, {
            new: true
        });
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, { new: true }).select("-password");
        res.json(updatedUser);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});

router.put('/updatepic', requireLogin, async (req, res) => {
    console.log("Update pic request received");
    console.log("User ID:", req.user ? req.user._id : "No user in request");
    console.log("Pic URL:", req.body.pic);
    try {
        const result = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { pic: req.body.pic } },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result);
    } catch (err) {
        console.error("Error updating pic:", err);
        return res.status(500).json({ error: err.message || "Internal Server Error" });
    }
});

router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})


module.exports = router