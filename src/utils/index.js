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


export const notificar = () => {

}
