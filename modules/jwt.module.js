const jwt = require('jsonwebtoken');
const sceretJwt = process.env.JWT_SECRET_KEY;

const createNewToken = (data, maxAge) => 'bearer ' + jwt.sign({data, exp: Math.floor((Date.now() + maxAge)/1000)}, sceretJwt);

const verify = token => {
    return new Promise((res, rej) => {
        jwt.verify(token, sceretJwt, (err, decoded) => {
            return err ? rej(err) : res(decoded.data);
        });
    });
}

module.exports = {
    createNewToken,
    verify
}