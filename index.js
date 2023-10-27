const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.route");
const { noteRouter } = require("./routes/note.route");
require("dotenv").config()
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cors())
app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.listen(process.env.port, async ()=>{
    try {
        await connection
        console.log("connection established...")
        console.log(`http://localhost:${process.env.port}`)
    } catch (error) {
        console.log("Error in connection dataBase");
        res.status(400).send({"error": error});
    }
})