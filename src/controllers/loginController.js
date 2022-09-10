const authorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

const authorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(404).send({ msg: 'Please fill details' })
        
        const existUser = await authorModel.findOne({email});
        if (!existUser) {
            return res.status(401).send({ status: false, message: "Unauthorized register first" }) 
        }
        // -----------------decoding for hashing password--------------------------
        const matchPass = await bcrypt.compare(password, existUser.password);
        if (!matchPass) {
            return res.status(400).send({ status: false, message: "You Entered Wrong password" })
        }
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
