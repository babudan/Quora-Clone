const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const validator = require("../validator/validator")

//-----------------------------authentication--------------------------------
const authentication = async (req, res, next) => {
    try {
        const token = req.headers["x-api-key"];

        if (!token)
            return res.status(400).send({ status: false, msg: "token must be present" });

        const decodeToken = jwt.verify(token, process.env.SECRET_KEY);

        if (!decodeToken)
            return res.status(403).send({ status: false, msg: "token is invalid" });

        req.user = decodeToken

        next();
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

// -----------------------------authorization----------------------------------
const authorization = async (req, res, next) => {
    try {
        const blogId = req.params.blogId;

        if (!validator.isValidObjectId(blogId))
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

// -----------------------------deletedByQuery----------------------------------



module.exports = { authentication, authorization }

