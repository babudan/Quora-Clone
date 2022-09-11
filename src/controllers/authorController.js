const authorModel = require("../models/authorModel")
const bcrypt = require("bcrypt");
const validator = require("../validator/validator")

//-------------------------------------createAuthor-------------------------------------------
const createAuthor = async (req, res) => {
    try {
        const data = req.body;
        let { fname, lname, title, email, password } = data

        // ------------------ data present or not in the body--------------------
        const objKey = Object.keys(data).length

        if (objKey == 0)
            return res.status(400).send({ status: false, msg: "Please fill data" });

        if (objKey > 5)
            return res.status(400).send({ status: false, msg: "You can't input extra field" });
        
        //----------------data present or not in the body-----------------
        if (!fname)
            return res.status(400).send({ msg: 'Please fill fname' })

        if (!lname)
            return res.status(400).send({ msg: 'Please fill lname' })

        if (!title)
            return res.status(400).send({ msg: 'Please fill title' })
        
        if (!email)
            return res.status(400).send({ msg: 'Please fill email' })

        if (!password)
            return res.status(400).send({ msg: 'Please fill password' })
        
         // ------------------------ data validations-----------------------------
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
        
        //-------------------password hashing-------------------
        const hashPassword = await bcrypt.hash(password, 10);
        req.body.password = hashPassword

        //-------------------author creation--------------------
        const newAuthor = await authorModel.create(data);

        res.status(201).send({ data: newAuthor })
        
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

module.exports = { createAuthor };
