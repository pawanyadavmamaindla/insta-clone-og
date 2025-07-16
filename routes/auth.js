const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');


router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!email || !password || !name){
        return res.status(422).json({error:'Please fill in all fields'});
        }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:'Email is already in use'});
        }
        bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user = new User({
                email,
                password:hashedPassword,
                name,
                pic
            })
            user.save()
            .then(user=>{
                res.json({message:"saved successfully"})
                
            })
            .catch(err=>{
                console.log(err);
            })
        })
        
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:'Please fill in all fields'});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(domatch=>{
            if(domatch){
            //    return res.json({message:"successfully signin"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })

})

module.exports = router

