require('dotenv').config()
require('express-async-errors');

const express = require('express');
const app = express()
const connectDb = require('./db/connect')
const authRoute = require('./routes/auth')
const communityRoute = require('./routes/community')
const updateUserRoute = require("./routes/userActions");
const postRoutes = require("./routes/post")
const topicRoutes = require("./routes/topic");
const commentRoutes = require("./routes/comment");
const userFollowRoute = require('./routes/user-following')
const notFound = require('./middleware/not-found')
const errorHandler = require("./middleware/error-handler");
const auth = require("./middleware/authentication");
//security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");


//middlewares
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());


app.use(express.json());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/communities", [auth, communityRoute]);
app.use("/api/v1/user", [auth, updateUserRoute]);
app.use("/api/v1/posts", [auth, postRoutes]);
app.use("/api/v1/user", [auth, userFollowRoute]);
app.use("/api/v1/topics", [auth, topicRoutes]);
app.use("/api/v1/comments", [auth, commentRoutes]);

app.use(notFound, errorHandler);



app.get('/', (req, res) => {
    res.send('Jobs api')
})






const port = process.env.PORT || 3000
const start = async() => {
    try {
        await connectDb(process.env.MONGO_URI)
        app.listen(port, ()=> console.log(`server listening on port: ${port}`))
    } catch (error) {
    
    }
}
start()
