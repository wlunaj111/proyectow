import { pool } from '../db.js'

export const obtenerAnunciosPorUsuario = async (timestamp, palabras_clave) => {
    try {
        // Convertir el arreglo de palabras clave a una cadena separada por comas
        const palabrasClaveString = palabras_clave.map(palabra => `'${palabra}'`).join(', ');

        const query = `
        SELECT DISTINCT anuncio.titulo, anuncio.descripcion, anuncio.created_at, usuario.telefono  
        FROM usuario
        JOIN usuario_palabra ON usuario_palabra.usuario_id = usuario.id
        JOIN anuncio_palabra ON anuncio_palabra.palabra_clave_id = usuario_palabra.palabra_clave_id
        JOIN anuncio ON anuncio_palabra.anuncio_id = anuncio.id
        WHERE anuncio.created_at >= $1 
        AND usuario_palabra.palabra_clave_id IN (
            SELECT id FROM palabra_clave WHERE nombre IN (${palabrasClaveString})
        )
      `;
        const { rows } = await pool.query(query, [timestamp]);
        return rows;
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
};

export const obtenerTelefonosPorPalabrasClave = async (palabras_clave) => {
    try {
        // Convertir el arreglo de palabras clave a una cadena separada por comas
        const palabrasClaveString = palabras_clave.map(palabra => `'${palabra}'`).join(', ');

        const query = `
        SELECT DISTINCT usuario.telefono  
        FROM usuario
        JOIN usuario_palabra ON usuario_palabra.usuario_id = usuario.id
        JOIN palabra_clave ON usuario_palabra.palabra_clave_id = palabra_clave.id
        WHERE palabra_clave.nombre IN (${palabrasClaveString})
      `;
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
};

export const obtenerIdsPorPalabrasClave = async (palabras_clave) => {
    try {
        // Convertir el arreglo de palabras clave a una cadena separada por comas
        const palabrasClaveString = palabras_clave.map(palabra => `'${palabra}'`).join(', ');

        const query = `
        SELECT DISTINCT usuario.id  
        FROM usuario
        JOIN usuario_palabra ON usuario_palabra.usuario_id = usuario.id
        JOIN palabra_clave ON usuario_palabra.palabra_clave_id = palabra_clave.id
        WHERE palabra_clave.nombre IN (${palabrasClaveString})
      `;
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
};


export const AnunciosANotificar = async (timestamp) => {
    try {
        const query = `
        SELECT DISTINCT notificaciones.id as notificacion_id, anuncio.id, anuncio.titulo, anuncio.descripcion, usuario.telefono 
        FROM notificaciones
        JOIN anuncio ON notificaciones.anuncio_id = anuncio.id 
        JOIN usuario ON notificaciones.usuario_id = usuario.id
        WHERE notificaciones.enviado = false
        AND anuncio.created_at >= $1
        ORDER BY anuncio.id;
      `;
        const { rows } = await pool.query(query, [timestamp]);
        return rows;
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
};

export const marcarComoEnviada = async (notificacionId) => {
    try {
        const query = `
            UPDATE notificaciones
            SET enviado = true
            WHERE id = $1
            RETURNING *;  -- Devuelve la fila actualizada
        `;
        const { rows } = await pool.query(query, [notificacionId]);
        return rows[0];
    } catch (error) {
        console.error('Error al marcar la notificación como vista:', error);
        throw error;
    }
};
