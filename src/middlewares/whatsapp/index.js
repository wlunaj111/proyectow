// import pkg from 'whatsapp-web.js';
// const { Client, LocalAuth } = pkg;
// import qrcode from 'qrcode-terminal';
// import { pool } from '../../db.js'


// const client = new Client({
//     authStrategy: new LocalAuth()
// })

// const consulta = async (ci) => {
//     const { rows } = await pool.query(`SELECT * FROM resultados WHERE ci = $1`, [ci]);
//     return rows
// }


// const testNumbers = ['51633170@c.us', '59806194@c.us']

// client.on('ready', () => {
//     console.log('Client is ready!');

//     testNumbers.forEach(number => {
//         client.emit('message_create', {
//             from: number,
//             body: '*4211446', // Simulando un mensaje que comienza con '*'
//             isGroupMsg: false
//         });
//     })

//     // Número de teléfono y mensaje
//     const numero = '5359806194'; // Reemplaza con el número de destino
//     const mensaje = 'Hola, este es un mensaje de prueba!';

//     // Enviar el mensaje
//     client.sendMessage(`${numero}@c.us`, mensaje).then(response => {
//         console.log('Mensaje enviado:', response);
//     }).catch(err => {
//         console.error('Error al enviar el mensaje:', err);
//     });
// });

// Listening to all incoming messages
// client.on('message_create', async (message) => {
//     console.log('Mensaje recibido:', message); // Inspeccionar el objeto completo
//     if (typeof message.body === 'string' && message.body.startsWith('*')) {
//         const ci = message.body.slice(1).trim();
//         const mensajito = await consulta(ci);
//         console.log('mensajito', mensajito);
//         client.sendMessage(message.from, `🔹**Nombre:** ${mensajito[0].nombre} 😊\n🔹**Edad:** ${mensajito[0].edad} 🎂\n🔹**FM:** ${mensajito[0].muestra} 📊\n🔹**FS:** ${mensajito[0].fs} 📈\n🔹**CI:** ${mensajito[0].ci} 🆔\n🔹**Resultado:** ${mensajito[0].resultado} ✅\n`);
//     } else {
//         console.log('El mensaje no comienza con * o no es una cadena válida.');
//     }
// });

// client.on('qr', qr => {
//     qrcode.generate(qr, { small: true });
// });

// client.initialize();

// export default client;
