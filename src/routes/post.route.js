const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');


const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/create_post/', upload.single('file'), postController.createPost);

router.get('/', authMiddleware.authUser ,postController.getAllPosts);

router.get('/my_posts/',authMiddleware.authUser ,postController.getMyPosts);

router.get('/labels/', authMiddleware.authUser, postController.filterByLabel);

router.post('/like/:id', authMiddleware.authUser, postController.likePost);

router.post('/dislike/:id', authMiddleware.authUser, postController.dislikePost);

router.post('/comment/:postid', authMiddleware.authUser, postController.addComment);

router.get('/:postid', authMiddleware.authUser, postController.getThisPost);


module.exports = router;
