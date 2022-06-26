const userService = require("../services/users.service");
const bcrypt = require("../modules/bcrypt.module");

//get user by id
const getById = async (req, res, next) => {
    try{
        const id = req.params.id;
        const user = await userService.getById(id);
        console.log("found user: ",user);
        if(!user) next({message:"User not found", status:"404"});
        
        delete user.password;
        res.send(user);
    }catch(err){
        console.log(err);
        next({status: 500});
    }
}

//UPDATE user properties
const update = async (req, res, next) => {
    try{
        const id = req.params.id;
        const updatedProps = req.body;
        const user = await userService.getById(id);

        if(!user) return next({message:"User not found", status:"404"});

        updatedProps.email = updatedProps.email.toLowerCase();
        if(updatedProps.email !== user.email && await userService.getByEmail(updatedProps.email)){
                return next({message:"This Email is taken", status:"409"});
        }
        
        if(updatedProps.currentPassword){
            if(!bcrypt.compare(updatedProps.currentPassword, user.password)){
                return next({message:"Password is incorrect", status:"403"});
            }
            delete updatedProps.currentPassword;
            updatedProps.password = bcrypt.encrypt(updatedProps.newPassword);
            delete updatedProps.newPassword;
        }        
            
        await userService.update(user, updatedProps);

        console.log("updated user:", user);
    
        res.send({
            id: user._id
        });
    }catch(err){
        console.log(err);
        next({status: 500});
    }
}

const getAll = async (req, res, next) => {
    try{
        console.log("getting all users...")
        const users = await userService.getAll();
        const usersEmailsAndNames = users.map(user => {
            return {
                _id:user._id,
                email: user.email,
                name: user.name,
                permissions: user.permissions
            }
        });

        console.log("returned all users");
        res.send(usersEmailsAndNames);
    }catch(err){
        console.log(err);
        next({status: 500});
    }
}

module.exports = {
    getById,
    update,
    getAll
}