const mongoose = require('mongoose')

const BusinessAssociatesSchema = new mongoose.Schema({
    name: {
        type: String,
        },
    }
    , {
    timestamps: true
  });

const BusinessAssociatesModel = mongoose.model('BusinessAssociates', BusinessAssociatesSchema);

module.exports = BusinessAssociatesModel;