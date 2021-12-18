const { verify } = require("jsonwebtoken");

const authMid = (req, res, next) => {
    //Captura el token desde la cabecera
    const authorization = req.headers.authorization;
    //Valida que hay un token
    if (!authorization) {
        return res.status(403).json({ estado: "error", msg: "NO AUTORIZADO" })
    };
    try {
        // Captura el token
        const token = authorization.split(' ')[1];
        //Obtiene la carga útil 
        const payload = verify(token, process.env.JWT_SECRET_KEY);
        console.log(payload)
        // Verifica el Rol de usuario
        if (payload.rol !== 1) {
            return res.status(403).json({ estado: "error", msg: "Solo los administradores pueden crear usuarios!!!" });
        }
    } catch (err) {
        console.log(err);
    }
    return next();
};

exports.authMid = authMid;