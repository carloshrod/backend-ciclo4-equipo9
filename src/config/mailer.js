const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const USER_MAIL_SERVER = process.env.USER_MAIL_SERVER

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const accessToken = oAuth2Client.getAccessToken();


export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: USER_MAIL_SERVER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
    },
    tls: {
        rejectUnauthorized: false
    }
});

// **************************************

// export async function sendMail(toEmail, name, password) {
//     try {
//         const accessToken = await oAuth2Client.getAccessToken();

//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 type: "OAuth2",
//                 user: USER,
//                 clientId: CLIENT_ID,
//                 clientSecret: CLIENT_SECRET,
//                 refreshToken: REFRESH_TOKEN,
//                 accessToken: accessToken
//             },
//             tls: {
//                 rejectUnauthorized: false
//             }
//         });

//         const result = await transporter.sendMail(NewUserOptions(toEmail, name, password));
//         return result;
//     } catch (error) {
//         console.log(error);
//     }
// };

// **************************************

// export const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     post: 465,
//     secure: true,
//     auth: {
//         user: 'test.chrod@gmail.com',
//         pass: 'rfxtnzobxmobkcrh'
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// transporter.sendMail({
//     from: '"CUENTA CREADA ✔" <test.chrod@gmail.com>', // sender address
//     to: data.email, // list of receivers
//     subject: "CUENTA CREADA ✔", // Subject line
//     html: `
//     <p>Sr. ${data.nombres},</p>

//     <p>Su cuenta ha sido creada. A continuación le enviamos las credenciales para el ingreso:</p>

//     <ul>
//         <li>
//         Usuario: ${data.email}
//         </li>
//         <li>
//         Contraseña: ${data.password}
//         </li>
//     </ul>

//     <b>Por favor, no olvide cambiar su contraseña!!!</b>
//     `
// })

