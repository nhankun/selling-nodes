const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    category_id : { type: String },
    provider_id : { type: String },
    manufacturer_id  : { type: String },
    sub_category_id: { type: Array, default: undefined },
    name: { type: String },
    images: { type: Array, default: undefined },
    quantity: { type: Number },
    price: { type: String },
    description: { type: String },
    properties: { type: String },
    status: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', Product);