const jwt = require('../modules/jwt.module');
const usersService = require("../services/users.service");

const tokenValidator = async (req, res, next) => {
        try{
            const token = req.headers?.authorization?.split(' ')[1];
            // console.log("MY TOKEN: ", token);
            const tokenData = await jwt.verify(token)
            user = await usersService.getById(tokenData.userId);
            if (!user) {
                return next({message:'Token is invalid', status:"401"});
            }
            req.user = user;
            return next();
        }catch(err){
            return next({message:"token is invalid or expired",status:"401"});
        }
}

module.exports = tokenValidator;
