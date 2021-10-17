const mongoose = require("mongoose");

const contactMe = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String, 
        required: true
    },
}, { versionKey: false })

module.exports = new mongoose.model("contactMe_Schema", contactMe);