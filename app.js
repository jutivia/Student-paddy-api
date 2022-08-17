require('dotenv').config()
require('express-async-errors');

const express = require('express');
const app = express()
const connectDb = require('./db/connect')
const authRoute = require('./routes/auth')
const publicationRoute = require('./routes/publication')
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
app.use("/api/v1/publications", [auth, publicationRoute])

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