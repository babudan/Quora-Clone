const mongoose = require("mongoose");

//---------------------------------Body----------------------------------
const isValidBody = (value) => {
    if (typeof value == "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "Number" && value.trim().length === 0) return false
    return true
};

//--------------------------------email-------------------------------
const isValidEmail = (email) => {
    const regx = /^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/
    return regx.test(email)
};

//------------------------------mongoDbId-------------------------------
const isValidObjectId = (mongoDbId) => { 
    return mongoose.Types.ObjectId.isValid(mongoDbId)
};

//-------------------------------password---------------------------------
const isValidPass  = (password) => {
    const regx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,99}$/
    return regx.test(password)
};

//-------------------name--------------
const isValidName = (name) => {
    const regx = /^[A-Za-z]{2,}$/
    return regx.test(name)
};

//-------------------title---------------------
const isValidTitle = (title) => {
    const regx = /^[A-Za-z0-9_ ]{2,}$/
    return regx.test(title)
};

module.exports = { isValidBody, isValidEmail, isValidObjectId, isValidPass, isValidName, isValidTitle }
