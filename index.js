const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongo = require("./modules/mongodb.module");

//db connection ====> not working with serverless deploy (vercel)
// const dbName = process.env.MONGODB_NAME;
// mongo.connect(dbName)
// .then(() => {
//     console.log(`[Mongo] Connected to '${dbName}' db`)
// }).catch(err => {
//     console.log("Couldn't connect to mongoDb with error: ", err);
// })

//express configuations
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}))

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

