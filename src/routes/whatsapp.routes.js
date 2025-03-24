import { Router } from 'express';
import getQRCode from '../controllers/boot/index.js';

const router = Router();

// Ruta para obtener el código QR
router.get('/api/qr', (req, res) => {
    const qrCode = getQRCode();
    if (qrCode) {
        res.json({ qr: qrCode });
    } else {
        res.status(404).json({ error: 'QR no disponible' });
    }
});

export default router;