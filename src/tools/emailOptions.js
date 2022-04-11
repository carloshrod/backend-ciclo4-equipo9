require("dotenv").config();

const USER_MAIL_SERVER = process.env.USER_MAIL_SERVER

export function newUserOptions(toEmail, name, password) {
    return {
        from: `NO-REPLY <${USER_MAIL_SERVER}>`, // sender address
        to: toEmail, // list of receivers
        subject: "CUENTA CREADA ✔", // Subject line
        html: `<p>Sr(a). <b>${name}</b>,</p>

        <p>Su cuenta ha sido creada. A continuación le enviamos las credenciales para el ingreso:</p>
        
        <ul>
            <li>
                Usuario: <b>${toEmail}</b>
            </li>
            <li>
                Contraseña: <b>${password}</b>
            </li>
        </ul>
        
        <h3>Por favor, no olvide cambiar su contraseña!!!</h3>
        `
    };
}

export function newPredioOptions(toEmail, name, codigo, documento) {
    return {
        from: `NO-REPLY <${USER_MAIL_SERVER}>`, // sender address
        to: toEmail, // list of receivers
        subject: "PREDIO CREADO ✔", // Subject line
        html: `<p>Sr(a). <b>${name}</b>,</p>

        <p>Se ha creado un predio con código <b>${codigo}</b> asociado a su número de documento <b>${documento}</b>, por lo tanto
        ya puede ingresar a la <b>Plataforma de Gestión Catastral</b> para asociar dicho predio a su cuenta y así poder
        realizar el pago del <b>Impuesto Predial</b>.</p>               
        `
    };
}

export function resetPasswordOptions(toEmail, name, resetToken) {
    return {
        from: `NO-REPLY <${USER_MAIL_SERVER}>`, // sender address
        to: toEmail, // list of receivers
        subject: "RESTABLECER CONTRASEÑA ✔", // Subject line
        html: `<p>Sr(a). <b>${name}</b>,</p>

        <p>Usted solicitó restablecer su contraseña.
        Por favor, ingrese en este <a href="http://192.168.1.65:3000/reset-password/${resetToken}">Link</a> y siga las instrucciones.</p>

        <h3>El link tendrá validez durante 1 hora a partir de este momento!!!</h3>
        `
    };
}