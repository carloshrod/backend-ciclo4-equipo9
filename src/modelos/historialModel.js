const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historialSchema = new Schema({
    author:{
        type:"string",
    },
    id_author:{
        type:"number",
    },
    action:{
        type:"string"
    },
    fecha:{
        type:"date",
    },
    code:{
        type:"string"
    }
})

const historialModel = mongoose.model("historials",historialSchema);
exports.historialModel = historialModel;