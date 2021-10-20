const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    user_key: String,
    views: {
        type: Number, 
        default: 0
    },
    lname: {
        required: true,
        type: String
    },
    bname: {
        required: true,
        type: String
    }, 
    description: {
        type: String,
        required: true,
    },
    btel: {
        required: true,
        type: String,
    },
    bcard_type: {
        required: true,
        type: String,
    },
    bemail: String,
    whatsapp: String,
    facebook_username: String,
    facebook_link: String, 
    instagram_username: String,
    instagram_link: String,
    twitter_username: String,
    twitter_link: String,
    tiktok_username: String, 
    tiktok_link: String,
    tlocation: String,
    llocation: String,
    logo_location: {
        required: true,
        type: String
    },
    colors: {
        type: Object,
        required: false,
        default: {
            color: '#000',
            bg: '#000',
            special_color: '#000',
            special_bg: '#000'
        }
    }

}, { versionKey: false })

module.exports = new mongoose.model("bcard_Schema", cardSchema);