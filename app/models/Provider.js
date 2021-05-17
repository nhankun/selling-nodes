const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Provider = new Schema({
    user_id: { type: String },
    // subCategories: { type: Array, default: undefined },
    name: { type: String, maxLength: 225 },
    banner: { type: String },
    icon: { type: String },
    images: { type: Array, default: undefined },
    address: { type: String },
    country: { type: String },
    city: { type: String },
    longitude: { type: String },
    latitude: { type: String },
    postcode: { type: String },
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    status: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', Provider);