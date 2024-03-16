const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const fruitschema = new mongoose.Schema({
    name: {  type: String},
    quantity: { type: Number  },
    price: { type: Number},
    status: { type: Number },
    image: {type: Array},
    description :{String },
    id_distributor :{type:Schema.Types.ObjectId,ref:"distributor"  },
},{
    timestamps:true
}
);

const fruits = new mongoose.model('user', fruitschema);

module.exports = fruits;