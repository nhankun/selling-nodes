const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/** 
 * status 
 * 0 admin
 * 1 manage
 * 2 provider
 * 3 user 
*/
const User = new Schema({
    name: { type: String, maxLength: 225 },
    email: { type:String },
    password: { type: String },
    icon: { type: String },
    banner: { type: String },
    status: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', User);