const authorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')

const authorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(404).send({ msg: 'Please fill details' })

        const author = await authorModel.findOne({ email, password })
        if (!author)
            return res.status(400).send({ status: false, msg: "Incurrent details" })

        //----------------------token generation-----------------------
        const token = jwt.sign({ authorId: author._id.toString(), group: "69" }, process.env.SECRET_KEY);
        res.setHeader("x-api-key", token)
        return res.status(200).send({ status: true, token: token })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports = { authorLogin }
