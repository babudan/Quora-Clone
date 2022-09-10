const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
    {
        fname: { type: String, required: true, minlength: 2, maxlength: 50, trim: true },
        lname: { type: String, required: true, minlength: 2, maxlength: 50, trim: true },
        title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"] },
        email: { type: String, required: true, minlength: 5, maxlength: 40, trim: true },
        password: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
