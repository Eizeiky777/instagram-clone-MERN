const express = require('express');
const router = express.Router();

// database
const mongoose = require('mongoose');
const User = mongoose.model("User");

// encrypting - tokening - redeeming
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');

router.post('/signup', (req, res)=>{
    const { name, email, password, pic } = req.body
    if(!email || !password || !name){
        return res.status(422).json({error: "please fill all the fields"})
    }
    
    // check user firstly before inputting new user
    User.findOne({email: email})
        .then((savedUser) => {
            if(savedUser){
                return res.status(422).json({error: "user already taken btw : )"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password:hashedPassword,
                        name,
                        pic
                    })
                    
                    user.save()
                        .then(user => {
                            res.json({message: "saved successfully"})
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})
router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if(!email || !password){
        return res.status(422).json({error: "please provide email or password"})
    }
    User.findOne({email:email})
        .then(savedUser => {
            if(!savedUser){
                return res.status(422).json({error: "invalide email or password"})
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        // res.json({message: "successfully signed in"})
                        const token = jwt.sign({ _id: savedUser._id}, JWT_SECRET)
                        const { _id,name,email,pic,followers,following } = savedUser
                        res.json({ token, user:{_id, name, email, pic, followers, following} })
                    }else{
                        return res.status(422).json({error: "invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

module.exports = router