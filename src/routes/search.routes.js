import { Router } from 'express';
import client from '../middlewares/whatsapp/index.js'
import { obtenerAnunciosPorUsuario } from '../utils/index.js'
import { pool } from '../db.js'

//console.log(pool)

const router = Router();
router.get("/users", (req, res) => {
  res.send("obteniendo usuarios");
});
// Endpoint para enviar mensajes
router.post("/anuncio", async (req, res) => {
  const data = req.body;
  const dbClient = await pool.connect(); // Conectar a la base de datos

  try {
      await dbClient.query('BEGIN'); // Iniciar una transacción

      // Insertar el anuncio y obtener el ID
      const { rows: anuncioRows } = await dbClient.query(
          "INSERT INTO anuncio (titulo, descripcion) VALUES ($1, $2) RETURNING id",
          [data.titulo, data.descripcion]
      );

      const anuncioId = anuncioRows[0].id; // Obtener el ID del anuncio insertado

      // Insertar palabras clave
      for (const nombre of data.palabra_clave) {
          // Insertar o obtener el ID de la palabra clave
          const { rows: palabraRows } = await dbClient.query(`
              INSERT INTO palabra_clave (nombre) 
              VALUES ($1) 
              ON CONFLICT (nombre) 
              DO UPDATE SET nombre = EXCLUDED.nombre 
              RETURNING id
          `, [nombre]);

          const palabraId = palabraRows[0].id; // Obtener el ID de la palabra clave

          // Asociar la palabra clave con el anuncio
          await dbClient.query(
              "INSERT INTO anuncio_palabra (anuncio_id, palabra_clave_id) VALUES ($1, $2)",
              [anuncioId, palabraId]
          );
      }

      await dbClient.query('COMMIT'); // Confirmar la transacción
      return res.json({ message: 'Anuncio creado con éxito', anuncioId });
  } catch (error) {
      await dbClient.query('ROLLBACK'); // Revertir la transacción en caso de error
      console.error('Error al insertar el anuncio:', error);
      return res.status(500).json({ error: 'Error al insertar el anuncio' });
  } finally {
      dbClient.release(); // Liberar el cliente de la base de datos
  }
});

export default router;