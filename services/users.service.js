const users = [];
const mongo = require("../modules/mongodb.module");

const add = async user => {
    return await mongo.add("users", user);
}

const getByEmail = async email => {
    const users = await mongo.find("users", {email});
    return users.length === 0 ? undefined : users.length === 1 ? users[0] : users;
}

const getById = async _id => {
    const users = await mongo.find("users", {_id});
    return users.length === 0 ? undefined : users.length === 1 ? users[0] : users;
}

const getAll = async () => {
    return await mongo.find("users");
}

const addPet = async (userId, status, petId) => {
    return await mongo.update("users", {_id:userId}, {$push: {[`pets.${status}`]: petId}});
}

const removePet = async (userId, status, petId) => {
    console.log("trying to remove: ", userId, status, petId);
    return await mongo.update("users", {_id:userId}, {$pull: {[`pets.${status}`]: petId}});
}

//update user properties
const update = async (user, updates) => {
    return await mongo.update("users", {_id:user._id},{$set:updates});
}


module.exports = {
    add,
    getByEmail,
    getById,
    getAll,
    addPet,
    removePet,
    update
}
