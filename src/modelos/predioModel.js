const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const predioSchema = new Schema({
    codigo:{
        type:"string",
        required:true,
        unique:true
    },
    nom_prop:{
        type:"string",
        required:true
    },
    doc_prop:{
        type:"number",
        required:true,
    },
    area_c:{
        type:"number",
        required:true
    },
    area_t:{
        type:"number",
        required:true
    },
    direccion:{
        type:"string",
        required:true,
        unique:true
    },
    barrio:{
        type:"string",
        required:true
    },
    fecha_pago:{
        type:"string",
        required:true
    },
    fecha_pago2:{
        type:"string",
        required:true
    },
    fecha_pago3:{
        type:"string",
        required:true
    },
    valor_predio:{
        type:"number",
        required:true
    },
    valor_predial:{
        type:"number",
    },
    // asociado:{
    //     type:"number",
    //     default: 1
    // },
    estado:{
        type:"number",
    }
})

const predioModel = mongoose.model("predios",predioSchema);
exports.predioModel = predioModel;