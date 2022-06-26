const sessions = [];
const mongo = require("../modules/mongodb.module");

// const addSession = session => sessions.push(session);
const addSession = async session => {
    return await mongo.add("sessions", session);
}

//const findSession = token => sessions.find((i) => i.refresh_token === token);

const getSession = async refresh_token => {
    const sessions = await mongo.find("sessions", {refresh_token});
    return sessions.length === 0 ? undefined : sessions.length === 1 ? sessions[0] : sessions;
}

//const removeSession = session =>  sessions.filter(i => i !== session);
removeSession = async _id =>{  
    return await mongo.remove("sessions", {_id});
}


const createNewCookie = (res, name, data, maxAge) => {
    const options = {
        expires: maxAge,
        httpOnly: true
    };

    res.cookie(name, data, options);
};



module.exports = {
    addSession,
    getSession,
    removeSession,
    createNewCookie
}