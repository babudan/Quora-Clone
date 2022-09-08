const express = require('express')
const router = express.Router()
const { createAuthor } = require('../controllers/authorController')
const { createBlog, getBlog, updateBlog, deleteBlog, deleteBlogByQuery } = require('../controllers/blogController')
const { authentication, authorization, deleteAuth3 } = require('../middleware/auth')
const { authorLogin } = require('../controllers/loginController')

router.post('/authors', createAuthor)
router.post('/blogs', authentication, createBlog)
router.get('/blogs', authentication, getBlog)
router.put('/blogs/:blogId', authentication, authorization, updateBlog)
router.delete('/blogs/:blogId', authentication, authorization, deleteBlog)
router.delete('/blogs', authentication, deleteAuth3, deleteBlogByQuery)

router.post('/login', authorLogin)

module.exports = router;
