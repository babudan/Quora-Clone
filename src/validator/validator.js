const mongoose = require("mongoose");

const isValidBody = (value) => {
    if (typeof value == "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "Number" && value.trim().length === 0) return false
    return true
};

const isValidEmail = (email) => {
    const regx = /^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/
    return regx.test(email)
};

const isValidObjectId = (value) => { 
    return mongoose.Types.ObjectId.isValid(value)
};

const isValidPass = (password) => {
    const regx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,99}$/
    return regx.test(password)
};

const isValidName = (name) => {
    const regx = /^[A-Za-z]{2,}$/
    return regx.test(name)
};

const isValidTitle = (title) => {
    const regx = /^[A-Za-z0-9_ ]{2,}$/
    return regx.test(title)
};

module.exports = { isValidBody, isValidEmail, isValidObjectId, isValidPass, isValidName, isValidTitle }
