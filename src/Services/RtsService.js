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
        let query = `SELECT tag.idtag as id, tag.tag, tag.nombre, tag.idtipo, subsistema.nombre as subsistema, subsistema.numsubsistema, tag.plano, especialidad.nombre as especialidad, tipo.nombre as tipo, tag.observaciones FROM tag INNER JOIN subsistema ON tag.idsubsistema = subsistema.id INNER JOIN especialidad ON tag.idespecialidad = especialidad.idespecialidad INNER JOIN tipo ON tag.idtipo = tipo.idtipo`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTareas = async () => {
        let query = `SELECT tarea.idtarea as id, tarea.nombre, tipo.nombre as tipo, tarea.codigo, especialidad.nombre as especialidad, tarea.ubicacion FROM tarea INNER JOIN tipo ON tarea.idtipo = tipo.idtipo INNER JOIN especialidad ON tarea.idespecialidad = especialidad.idespecialidad`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getRegistros = async () => {
        let query = `select tagXtarea.id, tag.tag, tag.nombre as nombretag, tarea.nombre as tarea, tagXtarea.realizado from tagXtarea INNER JOIN tag ON tagXtarea.idtag = tag.idtag INNER JOIN tarea ON tagXtarea.idtarea = tarea.idtarea order by tagXtarea.id asc`
        const [result, fields] = await connection.execute(query)

        return result
    }

    getRegistroById = async (id) => {
        let query = `SELECT tagXtarea.id, tag.nombre as nombretag, tag.tag, tarea.nombre as tarea, tagXtarea.realizado FROM tagXtarea inner join tag on tagXtarea.idtag = tag.idtag inner join tarea on tagXtarea.idtarea = tarea.idtarea WHERE idTag = ? order by tagXtarea.id asc`  
        const [result, fields] = await connection.execute(query, [id])
        return result
    }

}