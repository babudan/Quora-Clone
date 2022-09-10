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
        req.user = decodeToken
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
        req.user = decodedToken
        next()
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}
//-----------------------------authorization2----------------------------------
const authorization2 = async (req, res, next) => {
    try {
        const token = req.headers["x-api-key"];

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken)
            return res.status(403).send({ status: false, msg: "token is invalid" });
        
        req.user = decodedToken
        next()
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports = { authentication, authorization, authorization2 }
