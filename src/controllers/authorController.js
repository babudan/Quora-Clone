const authorModel = require("../models/authorModel")
const bcrypt = require("bcrypt");
const validator = require("../validator/validator")


const createAuthor = async (req, res) => {
    try {
        const data = req.body;
        let { fname, lname, title, email, password } = req.body

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "Please fill the data" });

        if (!validator.isValidBody(fname) || !validator.isValidName(fname)) 
            return res.status(400).send({ status: false, message: "Enter valid name first" });
        
        if (!validator.isValidBody(lname) || !validator.isValidName(lname)) 
            return res.status(400).send({ status: false, message: "Enter valid last name" })
        
        if (!validator.isValidBody(title) || !validator.isValidName(title)) 
            return res.status(400).send({ status: false, message: "Enter valid last title" })
        
        if (!validator.isValidBody(email) || !validator.isValidEmail(email)) 
            return res.status(400).send({ status: false, message: "Enter valid email formate" })
        
        if (!validator.isValidBody(password) || !validator.isValidPass(password)) 
            return res.status(400).send({ status: false, message: "Enter password" });
        

        const hashPassword = await bcrypt.hash(password, 10);
        req.body.password = hashPassword

        const authorCreate = await authorModel.create(data);
        res.status(201).send({ data: authorCreate })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

module.exports = { createAuthor };
