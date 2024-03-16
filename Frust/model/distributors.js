const mongoose = require('mongoose');

const distributorschema = new mongoose.Schema({
    name: {  type: String}
},{
    timestamps:true
}
);

const distributors = new mongoose.model('distributors', distributorschema);

module.exports = distributors;