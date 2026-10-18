const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const pollController = require('../controllers/poll.controller');

router.post('/create_poll', authMiddleware.authUser, pollController.createPoll);

router.post('/vote/:pollid', authMiddleware.authUser, pollController.vote);

router.get('/', authMiddleware.authUser, pollController.getAllPolls);

router.get('/:pollId', authMiddleware.authUser, pollController.getMyPoll);


module.exports = router;