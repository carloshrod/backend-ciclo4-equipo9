const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { genSalt, hash } = require('bcryptjs');

const userSchema = new Schema({
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    tipo_doc: {
        type: String,
        required: true
    },
    nro_doc: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    rol: {
        type: Number,
        required: true
    },
    estado: {
        type: Number,
        required: true
    },
    imgUrl: {
        type: String,
    },
    created_predios: {
        type: Number,
    },
    edited_predios: {
        type: Number,
    },
    deleted_predios: {
        type: Number,
    },
    reset_token: {
        type: String,
    },
    expire_token: {
        type: Date
    },
});

userSchema.methods.setImgUrl = function setImgUrl(filename) {
    this.imgUrl = `${process.env.HOST}${process.env.PORT}/${filename}`
}

userSchema.pre("save", async function (next) {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
})

const userModel = mongoose.model("users", userSchema);
exports.userModel = userModel;