// admin model

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'admin', // Fixed role for admin
    },
    isAdmin: {
     type: Boolean, 
     default: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('admin', adminSchema);

