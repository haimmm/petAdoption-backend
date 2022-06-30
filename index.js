const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongo = require("./modules/mongodb.module");

//express configuations
const app = express();
const PORT = process.env.PORT || 4000;

//db connection ===> wrapped by middleware because deploy is serverless(vercel).
app.use((req,res,next) => {
    if(!mongo.isConnected()){
        const dbName = process.env.MONGODB_NAME;
        console.log("Connecting to mongo...");
        mongo.connect(dbName)
        .then(() => {
            console.log(`[Mongo] Connected to '${dbName}' db`);
            next()
        }).catch(err => {
            console.log("Couldn't connect to mongoDb with error: ", err);
            next(err)
        })
    }else{
        next();
    }
})

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}))

app.options('*', cors())
app.use('/auth', require('./routes/auth.route'));
app.use('/pet', require('./routes/pet.route'));
app.use('/user', require('./routes/user.route'));


//error handling
app.use((err, req, res, next) => {
    const {message, status} = err;
    console.log('ERROR:', err);
    res.status(status || 400).send({message: message || err});
})


app.listen(PORT, () => {
    console.log(`Pet server is running on port: ${PORT}`);
})

//on server close cleanup
process.on('SIGINT', () => {
    mongo.close()
    .then(() => {
        console.log("[Mongo] Disconnected");
        process.exit(0);
    });

});

module.exports = app;

