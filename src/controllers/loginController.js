const authorModel = require('../models/authorModel')
const validator = require("../validator/validator")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

//-------------------------------------------login--------------------------------------------
const authorLogin = async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data

        // -----------------data present or not or extra in the body-------------------
        const objKey = Object.keys(data).length

        if (objKey == 0)
            return res.status(400).send({ status: false, msg: "Please fill data" });

        if (objKey > 2)
            return res.status(400).send({ status: false, msg: "You can't input extra field" });
        
        //----------------email & password present or not in the body----------------
        if (!email)
            return res.status(400).send({ msg: 'Please fill email' })
        
        if (!password)
            return res.status(400).send({ msg: 'Please fill password' })
        
         // --------------------- email, password validations------------------------
        if (!validator.isValidBody(email) || !validator.isValidEmail(email))
            return res.status(400).send({ status: false, message: "Wrong email" })

        if (!validator.isValidBody(password) || !validator.isValidPass(password))
            return res.status(400).send({ status: false, message: "Wrong password" });
    
         // ---------------------------verifying author------------------------------
        const existUser = await authorModel.findOne({email});
        if (!existUser) 
            return res.status(401).send({ status: false, message: "Register yourself" }) 
        
        // ---------------------------decoding hash password---------------------------
        const matchPass = bcrypt.compare(password, existUser.password);
        
        if (!matchPass) 
            return res.status(400).send({ status: false, message: "You Entered Wrong password" })
        
        //-------------------------------token generation-------------------------------
        const token = jwt.sign({ authorId: existUser._id, group: "69" }, process.env.SECRET_KEY);
        res.setHeader("x-api-key", token)
        return res.status(200).send({ status: true, token: token })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports = { authorLogin }
