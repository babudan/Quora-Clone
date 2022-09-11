const blogModel = require("../models/blogModel");
const validator = require("../validator/validator")

//---------------------------------------createBlog-------------------------------------
const createBlog = async (req, res) => {
    try {
        const body1 = req.body
        const { title, body, authorId, category, tags, subcategory, isPublished } = body1

        //----------creating object-----------
        const data = {
            authorId: req.user.authorId,
            title: title,
            body: body,
            category: category,
            tags: tags,
            subcategory: subcategory,
            isPublished: isPublished
        }

        // -----------------data present or not or extra in the body-------------------
        const objKey = Object.keys(body1).length

        if (objKey == 0)
            return res.status(400).send({ status: false, msg: "Please fill data" });

        if (objKey > 7)
            return res.status(400).send({ status: false, msg: "You can't input extra data" });

        //----------------------data present or not in the body------------------------
        if (!title)
            return res.status(400).send({ msg: 'Please fill title' })

        if (!body)
            return res.status(400).send({ msg: 'Please fill body' })

        if (!authorId)
            return res.status(400).send({ msg: 'Please fill authorId' })

        // --------------------- title, body, authorId validations--------------------
        if (!validator.isValidBody(title) || !validator.isValidTitle(title))
            return res.status(400).send({ status: false, msg: "Enter valid title" });

        if (!validator.isValidBody(body) || !validator.isValidTitle(body))
            return res.status(400).send({ status: false, msg: "Enter valid body" });

        if (!validator.isValidBody(authorId) || !validator.isValidObjectId(authorId))
            return res.status(400).send({ status: false, msg: "Enter valid authorId" });

        //----------------------------checking Authorization--------------------------
        if (data.authorId != authorId)
            return res.status(403).send({ status: false, msg: "AuthorId is wrong" });

        //------------------------------blog creation------------------------
        const newBlog = await blogModel.create(data);
        return res.status(201).send({ status: true, data: newBlog });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

//--------------------------------------------getBlog-----------------------------------------------
const getBlog = async (req, res) => {
    try {
        const data = req.query;
        
        const blog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, data] });

        if (blog.length == 0)
            return res.status(404).send({ status: false, msg: "Blog not found" });

        return res.status(200).send({ status: true, data: blog });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

//-------------------------------------------------updateBlog----------------------------------------------
const updateBlog = async (req, res) => {
    try {
        const data = req.body;
        const blogId = req.params.blogId
        const { title, body, tags, subcategory } = data;

        // ------------------------data present or not or extra in the body-------------------------
        const objKey = Object.keys(data).length
        if (objKey == 0)
            return res.status(400).send({ status: false, msg: "Please fill the mandatory data on the body" })

        if (objKey > 8)
            return res.status(400).send({ status: false, msg: "You can't update extra field" });

        if (Object.values(data) == "")
            return res.status(400).send({ status: false, msg: "Please fill value" })

        if (Object.keys(data) == "")
            return res.status(400).send({ status: false, msg: "Please fill at least one key" })

        //----------------------finding blog by id through params------------------------
        const blog = await blogModel.findById(blogId);

        if (Object.values(blog) == 0 || blog.isDeleted == true)
            return res.status(404).send({ status: false, msg: "Blog not found" });

        //----------------------------------------updating blog--------------------------------------
        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $addToSet: { tags, subcategory }, $set: { title, body, publishedAt: Date.now(), isPublished: true } }, { new: true });

        return res.status(200).send({ status: true, msg: updatedBlog });
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

//----------------------------------------deleteBlog--------------------------------------------
const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;

        //-------------------finding blog by id through params-------------------
        const blog = await blogModel.findById(blogId)

        if (!blog || blog.isDeleted === true)
            return res.status(404).send({ status: false, msg: "No blog exits" })

        //--------------------------------deleting blog by id-------------------------------------
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

        // ------------------------data present or not or extra in the body-------------------------
        const objKey = Object.keys(data).length
        if (objKey == 0)
            return res.status(400).send({ status: false, msg: "no data on query params" })

        if (objKey > 5)
            return res.status(400).send({ status: false, msg: "You can't put extra field" });

        //------------------------------finding blog by id through query-------------------------
        const findBlog = await blogModel.find({ $and: [{ authorId: decodedToken.authorId }, data] });

        if (findBlog.length == 0)
            return res.send({ status: false, msg: "blog not found" });

        const findAuthor = findBlog[0].authorId;

        //--------------------------------deleting blog by query-------------------------
        if (decodedToken.authorId == findAuthor) {
            const allBlog = await blogModel.updateMany(
                { $and: [data, { authorId: decodedToken.authorId }, { isDeleted: false }]},
                { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() }}
            );

            //-----------------------------sending response-------------------------------
            if (allBlog.modifiedCount == 0) {
                return res.status(400).send({ status: false, msg: "No blog to be deleted" });
            } else {
                return res.status(200).send({ status: true, data: `${allBlog.modifiedCount} blog deleted` });
            }  
        } else {
            res.send({ status: false, msg: "author is not valid" });
        }
    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
};

module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deletedByQuery, };