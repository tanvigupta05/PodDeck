const mongoose=require('mongoose');

const user = new mongoose.Schema({
    
    username:{
        type:String,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        unique:true,
        required:true,
    },
    /* one user will create multiple podcasts */
    podcasts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"podcasts",
        },
    ],
     favourites:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"podcasts",
        },
    ],  
    isAdmin: {
        type: Boolean,
        default: false, // Regular users will have `isAdmin` as false by default
      },
},
{timestamps:true}
);

module.exports= mongoose.model('user',user);