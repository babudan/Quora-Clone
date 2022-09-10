const blogModel = require("../models/blogModel");
const validator = require("../validator/validator")

const mongoose = require('mongoose')

//----------------------------createBlog-------------------------------
const createBlog = async (req, res) => {
    try {
        const body1 = req.body
        const data = {
            authorId: req.user.authorId,
            title: body1.title,
            body: body1.body,
            category: body1.category,
            tags: body1.tags,
            subcategory: body1.subcategory,
            isPublished: body1.isPublished
        }

        const { title, body, tags, category, subcategory } = body1
        
        if (Object.keys(body1).length == 0)
            return res.status(400).send({ status: false, msg: "Please fill the data" });

        if (!validator.isValidBody(title) || !validator.isValidTitle(title)) 
            return res.status(400).send({ status: false, message: "Enter valid title" });
        
        if (!validator.isValidBody(body) || !validator.isValidTitle(body))
            return res.status(400).send({ status: false, message: "Enter valid body" });
        
        // if (!validator.isValidBody(tags) || !validator.isValidTitle(tags))
        //     return res.status(400).send({ status: false, message: "Enter valid tags" });
        
        // if (!validator.isValidBody(category) || !validator.isValidTitle(category))
        //     return res.status(400).send({ status: false, message: "Enter valid category" });
        
        // if (!validator.isValidBody(subcategory) || !validator.isValidTitle(subcategory))
        //     return res.status(400).send({ status: false, message: "Enter valid subcategory" });

        const newBlog = await blogModel.create(data);
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
            return res.status(400).send({ status: false, msg: "Please fill the mandatory data on the body" })

        const { title, body, tags, subcategory } = data;

        const blog = await blogModel.findById(blogId);

        if (blog.length == 0 || blog.isDeleted == true)
            return res.status(404).send({ status: false, msg: "Blog not found" });

        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $addToSet: { tags, subcategory }, $set: { title, body, publishedAt: Date.now(), isPublished: true } }, { new: true });

        return res.status(200).send({ status: true, msg: updatedBlog });
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
        const uId = req.user.authorId

        if (Object.keys(queryParams).length == 0)
            return res.status(400).send({ status: false, msg: "Please use query param" });

        const blog = await blogModel.find({ $and: [{ queryParams }, { authorId: uId }, { isDeleted: false }] });

        if (blog.length == 0)
            return res.status(404).send({ status: false, msg: "blog not found" })

        if (blog.isPublished == true || blog.length == 0)
            return res.status(404).send({ status: false, msg: "blog not found" })


        const updatedBlog = await blogModel.updateMany(blog, { $set: { isDeleted: true, isPublished: false } }, { new: true });
        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}
module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deleteBlogByQuery };

