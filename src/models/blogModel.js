const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const BlogsSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    authorId: { required: true, type: ObjectId, ref: "Author" },
    tags:  [String],
    category: [String],
    subcategory: [String],
    deletedAt: Date,
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now()},
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogsSchema);
