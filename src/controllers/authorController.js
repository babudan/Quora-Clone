const authorModel = require("../models/authorModel")

const createAuthor = async (req, res) => {
    try {
        const author = req.body;

        if (Object.keys(author).length == 0)
            res.status(400).send({ status: false, msg: "Please fill mandatory data" });
        
        let { fname, lname, email, password } = req.body
        let check1 = /^[a-zA-Z ]+$/.test(fname)
        let check2 = /^[a-zA-Z ]+$/.test(lname)
        let check3 = /\S+@\S+\.\S+/.test(email);
        let check4 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password);

        if (check1 == false || check2 == false) {
            return res.status(400).send({ status: false, message: "Please enter letters only" })
        }
        if (check3 == false)
            return res.status(400).send({ status: false, message: "Please enter a valid email" })
        
        if (check4 == false)
            return res.status(400).send({ status: false, message: "Please enter a valid password" })

        const authorCreate = await authorModel.create(author);
        res.status(201).send({ data: authorCreate })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

module.exports = { createAuthor };
