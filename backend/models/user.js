// User schema

const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        unique: true,
        required: true,
    },
    podcasts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "podcasts"  // variable name given to podcast schema
        },
    ],
},
{timestamps:true});

module.exports = mongoose.model("user",user);