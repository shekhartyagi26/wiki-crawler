const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lists = new Schema({
    name: String,
    data: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Lists = mongoose.model('lists', lists);

module.exports = Lists;