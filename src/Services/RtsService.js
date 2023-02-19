import 'dotenv/config'
import con from '../../db.js'

const connection = con

export class RtsService {
    getSistemas = async () => {
        let query = `SELECT sistema.id, sistema.nombre, sistema.idsistema, proyecto.nombre as proyecto FROM sistema INNER JOIN proyecto ON sistema.idproyecto = proyecto.idproyecto`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getSubSistemas = async () => {
        let query = `SELECT subsistema.id, subsistema.numsubsistema, subsistema.fechainicio, subsistema.fechafinal, subsistema.nombre, sistema.idsistema as numsistema, sistema.nombre as nombresistema FROM subsistema INNER JOIN sistema ON subsistema.idsistema = sistema.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTags = async () => {
        let query = `SELECT * FROM tag`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTareas = async () => {
        let query = `SELECT tarea.idtarea as id, tarea.nombre, tipo.nombre as tipo, tarea.codigo, especialidad.nombre as especialidad, tarea.ubicacion FROM tarea INNER JOIN tipo ON tarea.idtipo = tipo.idtipo INNER JOIN especialidad ON tarea.idespecialidad = especialidad.idespecialidad`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getRegistros = async () => {
        let query = `SELECT * FROM registroxtarea`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getRegistroById = async (id) => {
        let query = `SELECT * FROM registroxtarea WHERE idTag = ?`  
        const [result, fields] = await connection.execute(query, [id])
        return result
    }
}