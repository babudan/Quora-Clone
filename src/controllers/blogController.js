const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const mongoose = require('mongoose')

//----------------------------createBlog-------------------------------
const createBlog = async (req, res) => {
    try {
        const body = req.body
        const authorId = body.authorId;

        if (Object.keys(body).length == 0)
            return res.status(400).send({ status: false, msg: "Please enter some data" });

        const objectId = mongoose.Types.ObjectId
        if (!objectId.isValid(authorId))
            return res.status(400).send({ status: false, msg: "blogId is not valid" })

        const author = authorModel.findById(authorId).select({ _id: 1 });

        if (!author)
            return res.status(401).send({ status: false, msg: "AuthorId is not valid" });

        const newBlog = await blogModel.create(body);
        return res.status(201).send({ status: true, data: newBlog });
    } catch (err) {
        res.status(400).send({ status: false, msg: err.message });
    }
};
//--------------------------------getBlog-----------------------------------
const getBlog = async (req, res) => {
    try {
        const queryParams = req.query;
        const blog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, queryParams] });
        if (blog.length == 0) return res.status(404).send({ status: false, msg: "Blog not found" });
        return res.status(200).send({ status: true, data: blog });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
//--------------------------------updateBlog-----------------------------------
const updateBlog = async (req, res) => {
    try {
        const data = req.body;
        const blogId = req.params.blogId

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "Please fill the mandatory data" })

        const { title, body, tags, subcategory } = data;

        const blog = await blogModel.findById(blogId);

        if (!blog || blog.isDeleted == true)
            return res.status(404).send({ status: false, msg: "Blog not found" });

        await blogModel.findByIdAndUpdate({ _id: blogId }, { $addToSet: { tags, subcategory }, $set: { title, body, publishedAt: Date.now(), isPublished: true } }, { new: true });

        return res.status(200).send({ status: true, msg: "Update successful" });
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}
//--------------------------------deleteBlog-----------------------------------
const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const blog = await blogModel.findById(blogId)
        if (!blog || blog.isDeleted === true)
            return res.status(404).send({ status: false, msg: "No blog exits" })
        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() } }, { new: true });
        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}
//--------------------------------deleteBlog by query param-----------------------------------
const deleteBlogByQuery = async (req, res) => {
    try {
        const queryParams = req.query;
        if (Object.keys(queryParams).length == 0)
            return res.status(400).send({ status: false, msg: "Please enter some data in the body" });

        const blog = await blogModel.find({ $and: [queryParams, { isDeleted: false }] });


        if (blog.isDeleted == true || blog.length == 0)
            return res.status(404).send({ status: false, msg: "blog not foun" })

        const updatedBlog = await blogModel.updateMany(queryParams, { $set: { isDeleted: true, isPublished: false } }, { new: true });
        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}
module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deleteBlogByQuery };

