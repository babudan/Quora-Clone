const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
    {
        fname: String ,
        lname: String ,
        title: { type: String, enum: ["Mr", "Mrs", "Miss"] },
        email: String ,
        password:String 
    },
    { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
