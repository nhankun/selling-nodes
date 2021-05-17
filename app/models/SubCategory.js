const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubCategory = new Schema({
    category_id: { type: String },
    name: { type: String, maxLength: 225 },
    icon: { type: String },
    parent_id: {type: String},
    status: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubCategory', SubCategory);