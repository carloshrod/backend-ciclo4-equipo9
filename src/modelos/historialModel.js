const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historialSchema = new Schema({
    author: {
        type: String
    },
    id_author: {
        type: Number
    },
    action: {
        type: String
    },
    fecha: {
        type: Date
    },
    code: {
        type: String
    }
})

const historialModel = mongoose.model("historials", historialSchema);
exports.historialModel = historialModel;