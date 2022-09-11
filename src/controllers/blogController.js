const blogModel = require("../models/blogModel");
const validator = require("../validator/validator")
// const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


//----------------------------createBlog-------------------------------
const createBlog = async (req, res) => {
    try {
        const body1 = req.body
        const { title, body, authorId, category, tags, subcategory, isPublished } = body1

        const data = {
            authorId: req.user.authorId,
            title: title,
            body: body,
            category: category,
            tags: tags,
            subcategory: subcategory,
            isPublished: isPublished
        }

        if (Object.keys(body1).length == 0)
            return res.status(400).send({ status: false, msg: "Please fill data" });

        if (!validator.isValidBody(title) || !validator.isValidTitle(title))
            return res.status(400).send({ status: false, message: "Enter valid title" });

        if (!validator.isValidBody(body) || !validator.isValidTitle(body))
            return res.status(400).send({ status: false, message: "Enter valid body" });

        if (!validator.isValidBody(authorId) || !validator.isValidObjectId(authorId))
            return res.status(400).send({ status: false, message: "Enter valid authorId" });

        const newBlog = await blogModel.create(data);
        return res.status(201).send({ status: true, data: newBlog });
    } catch (err) {
        res.status(400).send({ status: false, msg: err.message });
    }
};
//--------------------------------getBlog-----------------------------------
const getBlog = async (req, res) => {
    try {
        const data = req.query;

        if (Object.keys(data) == '')
            return res.status(400).send({ status: false, msg: "Please fill at least one key" })

        if (Object.values(data) == '')
            return res.status(400).send({ status: false, msg: "Please fill value" })

        const blog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, data] });

        if (blog.length == 0)
            return res.status(404).send({ status: false, msg: "Blog not found" });

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
        const { title, body, tags, subcategory } = data;

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "Please fill the mandatory data on the body" })

        if (Object.values(data) == "")
            return res.status(400).send({ status: false, msg: "Please fill value" })

        if (Object.keys(data) == "")
            return res.status(400).send({ status: false, msg: "Please fill at least one key" })

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

//--------------------------deletedByQuery------------------------------
const deletedByQuery = async (req, res) => {
    try {
        const data = req.query;

        const decodedToken = req.user

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: 'no query params' });

        let findBlog = await blogModel.find({
            $and: [{ authorId: decodedToken.authorId }, data],
        });
        if (findBlog.length == 0)
            return res.send({ status: false, msg: "NO CRITERIA MATCHES" });

        let findAuthor = findBlog[0].authorId;

        if (decodedToken.authorId == findAuthor) {
            let allBlog = await blogModel.updateMany(
                { $and: [data, { authorId: decodedToken.authorId }, { isDeleted: false },], },
                { $set: { isDeleted: true, isPublished: true, deletedAt: Date.now() } }
            );

            if (allBlog.modifiedCount == 0) {
                return res.status(400).send({ status: false, msg: "No blog to be deleted" });
            } else res.status(200).send({ status: true, data: `${allBlog.modifiedCount} BLOG DELETED` });
        } else {
            res.send({ status: false, msg: "author is not valid" });
        }
    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
};

module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deletedByQuery, };