const authorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

const authorLogin = async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "Please fill data" });
        
        if (!email)
            return res.status(401).send({ msg: 'Please fill email' })
        
        if (!password)
            return res.status(401).send({ msg: 'Please fill password' })
        
        const existUser = await authorModel.findOne({email});
        if (!existUser) 
            return res.status(401).send({ status: false, message: "Register first" }) 
        
        // -----------------decoding for hashing password--------------------------
        const matchPass = await bcrypt.compare(password, existUser.password);
        
        if (!matchPass) 
            return res.status(400).send({ status: false, message: "You Entered Wrong password" })
        
        //----------------------token generation-----------------------
        const token = jwt.sign({ authorId: existUser._id, group: "69" }, process.env.SECRET_KEY);
        res.setHeader("x-api-key", token)
        return res.status(200).send({ status: true, token: token })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports = { authorLogin }
