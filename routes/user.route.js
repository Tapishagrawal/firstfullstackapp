const express = require('express');
const bcrypt = require('bcrypt');
const {UserModel} = require("../models/user.model");
const jwt = require("jsonwebtoken");    

const userRouter = express.Router();

userRouter.post("/register",async (req,res)=>{
    const {username, email,pass} = req.body;
    try {
        bcrypt.hash(pass, 5, async (err, hash)=>{
            if(err){
                res.status(200).send({"error":err.message})
            }else{
                const user = new UserModel({username, email, pass:hash});
                await user.save()
                res.status(200).send({"msg":"new user added.", "new user" :  user});
            }
        })
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

userRouter.post("/login", async (req,res)=>{
    const {email, pass} = req.body;
    try {
        const user = await UserModel.findOne({email})
        bcrypt.compare(pass, user.pass, (err, result)=>{
            if(result){
                const token = jwt.sign({username:user.username, userID:user._id}, "masai");
                res.status(200).send({"msg":"Login successfull!","token":token});
            }else{
                res.status(200).send({"msg":"Wrong credentials!"});
            }
        })
    } catch (error) {
        res.status(400).send({"error":error});
    }
})

module.exports = {
    userRouter
}