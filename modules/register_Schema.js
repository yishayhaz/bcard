const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    user_key: String
}, { versionKey: false })

module.exports = new mongoose.model("register_Schema", registerSchema);