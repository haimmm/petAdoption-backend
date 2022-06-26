const mongo = require("../modules/mongodb.module");



const add = async pet => {
    return await mongo.add("pets", pet);
}

//update pet properties
const update = async (pet, updates) => {
    return await mongo.update("pets", {_id:pet._id}, {$set: updates});
}

const getById = async _id => {
    const pets = await mongo.find("pets", {_id});
    return pets.length === 0 ? undefined : pets.length === 1 ? pets[0] : pets;
};

const getByIds = async arr =>{
    const formated = arr.map(id => ({_id:id})); 
    return await mongo.find("pets", formated);
}

const getByQueries = async queries => {
    if(queries.minHeight){ 
        queries.height = {
            ...queries.height,
             $gte: queries.minHeight
        };
        delete queries.minHeight;
    }
    if(queries.maxHeight){ 
        queries.height = {
            ...queries.height,
            $lte: queries.maxHeight
        };
        delete queries.maxHeight;
    }
    if(queries.minWeight){ 
        queries.weight = {
            ...queries.weight,
            $gte: queries.minWeight
        };
        delete queries.minWeight;
    }
    if(queries.maxWeight){ 
        queries.weight = {
            ...queries.weight,
            $lte: queries.maxWeight
        };
        delete queries.maxWeight;
    }
    return await mongo.find("pets", queries);
}






module.exports = {
    add,
    update,
    getById,
    getByIds,
    getByQueries
}