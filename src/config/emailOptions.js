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

export function resetPasswordOptions(toEmail, name, resetToken) {
    return {
        from: `NO-REPLY <${USER_MAIL_SERVER}>`, // sender address
        to: toEmail, // list of receivers
        subject: "CUENTA CREADA ✔", // Subject line
        html: `<p>Sr(a). <b>${name}</b>,</p>

        <p>Usted solicitó restablecer su contraseña.
        Por favor, ingrese en este <a href="http://localhost:3000/reset-password/${resetToken}">Link</a> y siga las instrucciones.</p>

        <h3>El link tendrá validez durante 1 hora a partir de este momento!!!</h3>
        `
    };
}