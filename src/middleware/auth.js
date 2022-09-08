const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const mongoose = require('mongoose')

//-----------------------------authentication--------------------------------
const authentication = async (req, res, next) => {
    try {
        const token = req.headers["x-api-key"];

        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });

        const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodeToken) return res.status(403).send({ status: false, msg: "token is invalid" });
        next();
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

//-----------------------------authorization----------------------------------
const authorization = async (req, res, next) => {
    try {
        const blogId = req.params.blogId;
        const objectId = mongoose.Types.ObjectId

        if (!objectId.isValid(blogId))
            return res.status(400).send({ status: false, msg: "blogId is not valid" })

        const token = req.headers["x-api-key"];

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken)
            return res.status(403).send({ status: false, msg: "token is invalid" });

        const blog = await blogModel.findById(blogId)

        if (blog.authorId != decodedToken.authorId)
            return res.status(403).send({ status: false, msg: "Unauthorized person" });
        next()
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

//-----------------------------------deleteAuth3------------------------------------------
const deleteAuth3 = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length == 0)
            return res.status(400).send({ status: false, msg: "blogId is not present" })

        const token = req.headers["x-api-key"];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        if (!decodedToken)
            return res.status(403).send({ status: false, msg: "token is invalid" });
        let decodedAuthorId = decodedToken.authorId;

        let tags1 = req.query.tags;
        let blog = await blogModel.find({ tags: { $in: [tags1] } }).select({ authorId: 1, _id: 0 });
        let a = blog.map(x => x.authorId);
        for (i = 0; i < a.length; i++) {
            if (decodedAuthorId != a[i]) return res.status(400).send({ status: false, msg: "You are not authorized" });
        }

        let category1 = req.query.category;
        let category2 = await blogModel.find({ category: { $in: [category1] } }).select({ authorId: 1, _id: 0 });
        let b = category2.map(y => y.authorId);
        for (i = 0; i < b.length; i++) {
            if (decodedAuthorId != b[i]) return res.status(400).send({ status: false, msg: "You are not authorized" });
        }

        let subcategory1 = req.query.subcategory;
        let subcategory2 = await blogModel.find({ subcategory: { $in: [subcategory1] } }).select({ authorId: 1, _id: 0 });
        let c = subcategory2.map(y => y.authorId);
        for (i = 0; i < c.length; i++) {
            if (decodedAuthorId != c[i]) return res.status(400).send({ status: false, msg: "You are not authorized" });
        }

        let isPublished = req.query.isPublished;
        let isPublished2 = await blogModel.find({ isPublished }).select({ authorId: 1, _id: 0 });
        let d = isPublished2.map(z => z.authorId);
        for (i = 0; i < d.length; i++) {
            if (decodedAuthorId == d[i]) return res.status(400).send({ status: false, msg: "You are not authorized" });

        }
        let authorId = req.query.authorId;
        let authorId2 = await blogModel.findOne({ authorId });
        if (decodedAuthorId != authorId2.authorId) return res.status(400).send({ status: false, msg: "You are not authorized" });

        next()
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports = { authentication, authorization, deleteAuth3 }

