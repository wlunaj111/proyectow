import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode';
import { AnunciosANotificar, marcarComoEnviada } from "../../utils/index.js";
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let qrCode = null; // Variable para almacenar el código QR

const client = new Client({
    authStrategy: new LocalAuth()
})

//const timestampFicticio = '2025-01-01 12:00:00';
const timestampFicticio = '2024-03-19 19:43:59';
let anuncios = []
let isNotifying = false;
client.on('ready', () => {
    console.log('Cliente de WhatsApp está listo');
    setInterval(notificar, 15000);
});

const notificar = async () => {
    if (isNotifying) {
        console.log('se estan enviando notificaciones todavia', anuncios);
        return;
    }
    isNotifying = true; // Marcar como en ejecución

    if (anuncios.length === 0) {
        anuncios = await AnunciosANotificar(timestampFicticio);
        if (anuncios.length === 0) {
            console.log('No hay anuncios para enviar.');
            isNotifying = false; // Asegúrate de marcar como no en ejecución
            return; // Salir de la función si no hay anuncios
        }
    }

    for (let i = 0; i < anuncios.length; i++) {
        const anuncio = anuncios[i];
        const mensaje = `${anuncio.titulo} ${anuncio.descripcion}`;

        // Esperar el tiempo acumulativo antes de enviar el mensaje
        await new Promise(resolve => setTimeout(resolve, 1000 * i));

        try {
            const response = await client.sendMessage(`${anuncio.telefono}@c.us`, mensaje);
            console.log('Mensaje enviado:', response);
            marcarComoEnviada(anuncio.notificacion_id); // Marcar como enviada solo si se envía correctamente
        } catch (err) {
            console.error('Error al enviar el mensaje:', err);
        }
    }

    isNotifying = false; // Marcar como no en ejecución al final
    anuncios = []; // Limpiar anuncios
};

client.on('qr', async (qr) => {
    try {
        // Convertir el código QR a una URL de imagen
        qrCode = await qrcode.toDataURL(qr);
        console.log('qrCodeeee', qrCode)
        console.log('Nuevo código QR generado');
    } catch (err) {
        console.error('Error al generar QR:', err);
    }
});

// Endpoint para obtener el código QR
app.get('/api/qr', (req, res) => {
    if (qrCode) {
        res.json({ qr: qrCode });
    } else {
        res.status(404).json({ error: 'QR no disponible' });
    }
});

client.initialize();

// Llamar a la función notificar para iniciar la ejecución
// notificar(); // Eliminar esta línea

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

export default notificar