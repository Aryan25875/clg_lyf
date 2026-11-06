const express = require('express');
const authRoute = require('./routes/auth.route');
const postRoute = require('./routes/post.route');
const pollRoute = require('./routes/poll.route');
const conversationRouter = require('./routes/conversation.route');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth/', authRoute);
app.use('/api/post/', postRoute);
app.use('/api/poll/', pollRoute);
app.use('/api/conversation/', conversationRouter);


module.exports = app;



