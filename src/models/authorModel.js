const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
    {
        fname: { type: String, trim: true },
        lname: { type: String },
        title: { type: String, enum: ["Mr", "Mrs", "Miss"] },
        email: { type: String },
        password: { type: String},
    },
    { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
