export function message(toEmail, name, password) {
    return `<p>Sr(a). <b>${name}</b>,</p>

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
}