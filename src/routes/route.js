const express = require('express')
const router = express.Router()
const { createAuthor } = require('../controllers/authorController')
const { createBlog, getBlog, updateBlog, deleteBlog, deletedByQuery } = require('../controllers/blogController')
const { authentication, authorization, } = require('../middleware/auth')
const { authorLogin } = require('../controllers/loginController')

router.post('/authors', createAuthor)
router.post('/blogs', authentication, createBlog)
router.get('/blogs', authentication, getBlog)
router.put('/blogs/:blogId', authentication, authorization, updateBlog)
router.delete('/blogs/:blogId', authentication, authorization, deleteBlog)
router.delete('/blogs', authentication, deletedByQuery)
router.post('/login', authorLogin)

router.all("/**",  (req, res) => {
    res.status(404).send({ status: false, msg: "The api you request is not available" })
});

module.exports = router;
