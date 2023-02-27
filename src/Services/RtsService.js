import 'dotenv/config'
import con from '../../db.js'

const connection = con

export class RtsService {

    // GETS

    getProyectos = async () => {
        let query = `SELECT * FROM proyecto`
        const [result, fields] = await connection.execute(query)
        return result
    }

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
        let query2 = `SELECT tagXtarea.id, tagXtarea.idtag, tag.tag, tag.nombre as nombretag, tarea.nombre as tarea, tagXtarea.realizado from tagXtarea INNER JOIN tag ON tagXtarea.idtag = tag.idtag INNER JOIN tarea ON tagXtarea.idtarea = tarea.idtarea order by tagXtarea.id asc`
        const [Tags, fields] = await connection.execute(query)
        const [registro, fields2] = await connection.execute(query2) 
        for(let i = 0; i < Tags.length; i++) {
            Tags[i].tareas = []
            let suma = 0
            for(let j = 0; j < registro.length; j++) {
                if(Tags[i].id == registro[j].idtag) {
                    Tags[i].tareas.push(registro[j])
                }
            }
            for(let k = 0; k < Tags[i].tareas.length; k++) {
                suma += Tags[i].tareas[k].realizado
            }
            Tags[i].filledQuantity = suma / Tags[i].tareas.length * 100
        }
        return Tags
    }

    getTareas = async () => {
        let query = `SELECT tarea.idtarea as id, tarea.nombre, tipo.nombre as tipo, tarea.idtipo, tarea.codigo, especialidad.nombre as especialidad, tarea.ubicacion FROM tarea INNER JOIN tipo ON tarea.idtipo = tipo.idtipo INNER JOIN especialidad ON tarea.idespecialidad = especialidad.idespecialidad`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getRegistros = async () => {
        let query = `select tagXtarea.id, tag.tag, tag.nombre as nombretag, tarea.nombre as tarea, tagXtarea.realizado from tagXtarea INNER JOIN tag ON tagXtarea.idtag = tag.idtag INNER JOIN tarea ON tagXtarea.idtarea = tarea.idtarea order by tagXtarea.id asc`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getEspecialidades = async () => {
        let query = `SELECT * FROM especialidad`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTipos = async () => {
        let query = `SELECT * FROM tipo`
        const [result, fields] = await connection.execute(query)
        return result
    }


    // POSTS

    postProyecto = async (nombre) => {
        let query = `INSERT INTO proyecto (nombre) VALUES (?)`
        const [result, fields] = await connection.execute(query, [nombre])
        return result
    }

    postSistema = async (sistema) => {
        let query = `INSERT INTO sistema (nombre, idsistema, idproyecto) VALUES (?, ?, ?)`
        const [result, fields] = await connection.execute(query, [sistema.nombre, sistema.idsistema, sistema.idproyecto])
        return result
    }

    postSubSistema = async (subSistema) => {
        let fechainicio = "";
        let fechafinal = "";
        
        for(let i = 0; i < 10; i++) {
            fechainicio += subSistema.fechainicio[i]
            fechafinal += subSistema.fechafinal[i]
        }

        let query = `INSERT INTO subsistema (numsubsistema, fechainicio, fechafinal, nombre, idsistema) VALUES (?, ?, ?, ?, ?)`
        const [result, fields] = await connection.execute(query, [subSistema.numsubsistema, fechainicio, fechafinal, subSistema.nombre, subSistema.idsistema])
        return result
    }

    postTag = async (tag) => {
        let query = `INSERT INTO tag (tag, nombre, idtipo, idsubsistema, plano, idespecialidad, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)`
        const [result, fields] = await connection.execute(query, [tag.tag, tag.nombre, tag.idtipo, tag.idsubsistema, tag.plano, tag.idespecialidad, tag.observaciones])
        return result
    }

    postTarea = async (tarea) => {
        let query = `INSERT INTO tarea (nombre, idtipo, codigo, idespecialidad, ubicacion) VALUES (?, ?, ?, ?, ?)`
        const [result, fields] = await connection.execute(query, [tarea.nombre, tarea.idtipo, tarea.codigo, tarea.idespecialidad, tarea.ubicacion])
        return result
    }

    postTipo = async (nombre) => {
        let query = `INSERT INTO tipo (nombre) VALUES (?)`
        const [result, fields] = await connection.execute(query, [nombre])
        return result
    }

    postEspecialidad = async (nombre) => {
        let query = `INSERT INTO especialidad (nombre) VALUES (?)`
        const [result, fields] = await connection.execute(query, [nombre])
        return result
    }

    postRegistro = async (registro) => {
        console.log(registro)
        let query = `INSERT INTO tagXtarea (idtag, idtarea, realizado) VALUES (?, ?, ?)`
        const [result, fields] = await connection.execute(query, [registro.idtag, registro.idtarea, 0])
        return result
    }

    // PUTS

    putRegistro = async (id, registro) => {
        let query = `UPDATE tagXtarea SET realizado = ? WHERE id = ?`
        const [result, fields] = await connection.execute(query, [registro.realizado, id])
        return result
    }


}