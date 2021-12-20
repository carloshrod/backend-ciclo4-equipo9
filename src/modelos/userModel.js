const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { genSalt, hash} = require('bcryptjs');

const userSchema = new Schema({
    nombres:{
        type: "string",
        required: true
    },
    apellidos:{
        type: "string",
        required: true
    },
    tipo_doc:{
        type: "string",
        required: true
    },
    nro_doc:{
        type: "number",
        required: true,
        unique: true,
    },
    email:{
        type:"string",
        required: true,
        unique: true
    },
    password:{
        type:"string",
        required: true
    },
    telefono:{
        type:"number",
        required: true
    },
    direccion:{
        type:"string",
        required: true
    },
    rol:{
        type:"number",
    },
    estado:{
        type:"number",
    }
});

userSchema.pre("save", async function(next){
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
})

const userModel = mongoose.model("users",userSchema);
exports.userModel = userModel;