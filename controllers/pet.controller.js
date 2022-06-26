const petService = require("../services/pet.service");
const userService = require("../services/users.service");

//add new pet
const add = async (req, res) => {
    try{
        const pet = await petService.add({
            ...req.body
        });
        console.log("new pet registered:", pet);
      
        res.status(201).send({
            id: pet.id
        });
    }catch(err) {
        console.log(err);
        next({status: 500});
    }
}

//get pet by it's id
const getById = async (req, res, next) => {
    try{
        const id = req.params.id;
        console.log("PET ID: ", id);
        const pet = await petService.getById(id);
        console.log("found pet by id: ", pet);
        return pet ? res.send(pet) : next({message:"Pet not found", status:"404"});
    }catch(err) {
        console.log(err);
        next({status: 500});
    }
}

//GET pets by param queries
const getByQueries = async (req, res) => {
    try{
        const pets = await petService.getByQueries(req.query);
        res.send(pets);
    }catch(err) {
        console.log(err);
        next({status: 500});
    }
}


//GET pets by user id
const getByUser = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await userService.getById(userId);
        if(!user) return next({message:"user not found", status:"404"});
        const saved = await petService.getByIds(user.pets.saved);
        const adopted = await petService.getByIds(user.pets.adopted);
        const fostered = await petService.getByIds(user.pets.fostered);
        console.log(`return pets by user`, saved, adopted, fostered);
        res.send({ saved, adopted, fostered });
    }catch(err) {
        console.log(err);
        next({status: 500});
    }
}

//UPDATE pet properties
const update = (req, res, next) => {
    try{
        const id = req.params.id;
        const updatedPet = req.body;
        const pet = petService.getById(id);
        if(!pet) return next({message:"Pet not found", status:"404"});
        

        petService.update(pet, updatedPet);

        console.log("updated pet:", pet);
    
        res.send({
            id: pet.id
        });
    }catch(err) {
        console.log(err);
        next({status: 500});
    }
}

//adopt or foster a pet
const adopt = async (req, res, next) => {
    try{
        const id = req.params.id;
        const {status} = req.body;

        const pet = await petService.getById(id);

        if(!pet) return next({message:"Pet not found", status:"404"});

        if(pet.status === 'adopted'){
            return next({message:"pet is already adopted", status:"400"});
        }else if(pet.status === 'fostered'){
            const isUserFoster = req.user.pets.fostered.find(id => id === pet._id.toString());
            if(!isUserFoster) return next({message:"pet is fostered by other user", status:"400"});
            else await userService.removePet(req.user._id, "fostered", id);
        }
        
        console.log("updating pet status...");
        await petService.update(pet, {status});
        console.log("updating user pets list...");
        await userService.addPet(req.user._id, status, id);

        console.log("pet adopted/fostered:", pet);
    
        res.send({
            id: pet._id
        });
    }catch(err) {
        console.log(err);
        next({status: 500});
    }
}

const returnPet = async (req, res, next) => {
    try{
        const id = req.params.id;
        const pet = await petService.getById(id);
        if(!pet) return next({message:"Pet not found", status:"404"});

        if(pet.status === 'available'){
            return next({message:"Can't return pet that isn't adopted", status:"400"});
        }

        const isUserFoster = req.user.pets.fostered.find(id => id === pet._id.toString());
        const isUserAdopter = req.user.pets.adopted.find(id => id === pet._id.toString());
        if(!isUserFoster && !isUserAdopter){
            return next({message:"Can't return pet that is not yours", status:"400"});
        }

        console.log("updating pet status...");
        await petService.update(pet, {status:'available'});
        console.log("updating user pets list...");
        const status = isUserFoster ? 'fostered' : 'adopted';
        await userService.removePet(req.user._id, status, id);

        console.log("pet returned:", pet);
    
        res.send({
            id: pet.id
        });
    }catch(err) {
        console.log(err);
        next({status: 500});
    }
}

const save = async (req, res, next) => {
    try{
        const id = req.params.id;
        const pet = await petService.getById(id);
        if(!pet) return next({message:"Pet not found", status:"404"});

        const isPetSaved = req.user.pets.saved.find(id => id === pet._id.toString());
        if(!isPetSaved) await userService.addPet(req.user._id, "saved", id);
        
        console.log("pet saved by user:", pet);
        res.send({
            id: pet._id
        });
    }catch(err) {
        console.log(err);
        next({status: 500});
    }
}

const unsave = async (req, res, next) => {
    try{
        const id = req.params.id;
        const pet = await petService.getById(id);
        if(!pet) return next({message:"Pet not found", status:"404"});

        const isPetSaved = req.user.pets.saved.find(id => id === pet._id.toString());
        if(isPetSaved) await userService.removePet(req.user._id, "saved", id);
        
        console.log("pet unsaved by user:", pet);
        res.send({
            id: pet._id
        });
    }catch(err) {
        console.log(err);
        next({status: 500});
    }
}

const getProfilePicture = (req, res, next) => {
    const fileName = req.params.name;
    var options = {
        root: "storage/petsProfilePictures/"
    };
    res.sendFile(fileName, options, function (err) {
        if (err) next({message: "image not found", status: 404});
    });
}


module.exports = {
    add,
    getById,
    getByQueries,
    getByUser,
    update,
    adopt,
    returnPet,
    save,
    unsave,
    getProfilePicture
}