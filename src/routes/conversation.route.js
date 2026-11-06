const express = require("express");
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/sendRequest', authMiddleware.authUser, conversationController.sendRequest);





module.exports = router;

