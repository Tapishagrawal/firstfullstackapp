const express = require('express');
const { NoteModel } = require("../models/note.model");
const {auth} = require("../middleware/auth.middleware")

const noteRouter = express.Router();
noteRouter.use(auth)

noteRouter.post("/create", async (req,res)=>{
    try {
        const note = new NoteModel(req.body);
        await note.save();
        res.status(200).send({"msg":"new note has been created"})
    } catch (error) {
        res.status(400).send({"error":error})
    }
    
})

noteRouter.get("/", async (req,res)=>{
    try {
        const notes = await NoteModel.find({username:req.body.username});
        res.status(200).send(notes);
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

noteRouter.patch("/update/:noteID", async(req,res)=>{
    const {noteID} = req.params;
    const note = await NoteModel.findOne({_id:noteID});
    try {
        if(req.body.userID === note.userID){
            await NoteModel.findByIdAndUpdate({_id:noteID}, req.body);
            res.status(400).send({"msg":`The note with ID ${noteID} has been updated`})
        }else{
            res.status(200).send({"msg":"You are not authorised."})
        }
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

noteRouter.delete("/delete/:noteID", async (req,res)=>{
    const {noteID} = req.params;
    const note = await NoteModel.findOne({_id:noteID});
    try {
        if(req.body.userID === note.userID){
            await NoteModel.findByIdAndDelete({_id:noteID});
            res.status(400).send({"msg":`The note with ID ${noteID} has been Deleted`})
        }else{
            res.status(200).send({"msg":"You are not authorised."})
        }
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

module.exports = {
    noteRouter
}