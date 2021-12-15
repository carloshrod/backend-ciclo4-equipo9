const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pagoSchema = new Schema({
    fecha:{
        type: "date",
        required: true,
        default: new Date
    },
    predio:{
        type: Schema.ObjectId,
        ref: "predios"
    },
    estado:{
        type: "number",
        required: true,
        default: 1
    }
});

const pagoModel = mongoose.model("pagos",userSchema);
exports.pagoModel = pagoModel;