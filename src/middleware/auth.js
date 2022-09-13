const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const validator = require("../validator/validator")

//-----------------------------authentication-----------------------------------
const authentication = async (req, res, next) => {
    try {
        //-------------------token is present or not---------------------
        const token = req.headers["x-api-key"];
        
        if (!token)
            return res.status(400).send({ status: false, msg: "Token must be present" });
        
        //---------------------token verification---------------------
        const decodeToken = jwt.verify(token, process.env.SECRET_KEY);

        if (!decodeToken)
            return res.status(403).send({ status: false, msg: "Provide your own token" });
            
        //---------------decodeToken set on request----------------
        req.user = decodeToken

        next();
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

// -----------------------------authorization-----------------------------------
const authorization = async (req, res, next) => {
    try {
        const blogId = req.params.blogId;
        //----------------------checking blogId-------------------------
        if (!validator.isValidObjectId(blogId))
            return res.status(400).send({ status: false, msg: "BlogId is not valid" })
        
        //----------------------token verification-----------------------
        const token = req.headers["x-api-key"];

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken)
            return res.status(403).send({ status: false, msg: "Provide your own token" });
        
        //-------------------------finding blog-------------------------
        const blog = await blogModel.findById(blogId)

        //---------------------checking Authorization-------------------
        if (blog.authorId != decodedToken.authorId)
            return res.status(403).send({ status: false, msg: "Unauthorized person" });

        next()
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { authentication, authorization }
