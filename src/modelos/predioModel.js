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
        type:"string",
        required:true
    },
    area_t:{
        type:"string",
        required:true
    },
    direccion_predio:{
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
    },
    fecha_pago2:{
        type:"string",
    },
    fecha_pago3:{
        type:"string",
    },
    valor_predio:{
        type:"string",
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