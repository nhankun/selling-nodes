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
    email: { type: String, maxLength: 225 },
    email_verified_at: { type: Date, default: Date.now },
    password: { type: String, maxLength: 225 },
    phone: { type: String, maxLength: 225 },
    avatar: { type: String, maxLength: 225 },
    address: { type: String, maxLength: 225 },
    country: { type: String, maxLength: 225 },
    city: { type: String, maxLength: 225 },
    role: { type: String, maxLength: 225 },
    district: { type: String, maxLength: 225 },
    remember_token: { type: String },
    status: { type: Number },
    expires_at: { type: Date, default: Date.now },
},{
    timestamps: true,
});

module.exports = mongoose.model('User', User);