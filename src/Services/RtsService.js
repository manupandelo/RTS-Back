import 'dotenv/config'
import con from '../../db.js'

const connection = con

const sistemacolumns = [
    {field: 'id', hide: true},
    {field: 'nombre', headerName: 'Nombre', width: 200},
    {field: 'proyecto', headerName: 'Proyecto', width: 200},
    {field: 'idsistema', headerName: 'Sistema', width: 200}
]

const subsistemacolumns = [
    {field: 'id', hide: true},
    {field: 'numsubsistema', headerName: 'Subsistema', width: 200},
    {field: 'nombre', headerName: 'Nombre', width: 200},
    {field: 'fechainicio', headerName: 'Fecha Inicio', type: 'date', width: 200},
    {field: 'fechafinal', headerName: 'Fecha Final', type: 'date', width: 200},
    {field: 'nombresistema', headerName: 'Nombre Sistema', width: 200},
    {field: 'numsistema', headerName: 'Sistema', width: 200}
]

const tagcolumns = [
]

const tareacolumns = [
    {field: 'idtarea', hide: true},
    {field: 'nombre', headerName: 'Nombre', width: 200},
    {field: 'tipo', headerName: 'Tipo', width: 200},
    {field: 'especialidad', headerName: 'Especialidad', width: 200},
    {field:'codigo', headerName: 'Código', width: 200},
    {field: 'ubicacion', headerName: 'Ubicación', width: 200}
]

export class RtsService {
    getSistema = async () => {
        let sistema
        let query = `SELECT sistema.id, sistema.nombre, sistema.idsistema, proyecto.nombre as proyecto FROM sistema INNER JOIN proyecto ON sistema.idproyecto = proyecto.idproyecto`
        const [result, fields] = await connection.execute(query)
        sistema.rows = result
        sistema.columns = sistemacolumns
        return sistema
    }

    getSubSistema = async () => {
        let subsistema
        let query = `SELECT subsistema.id, subsistema.numsubsistema, subsistema.fechainicio, subsistema.fechafinal, subsistema.nombre, sistema.idsistema as numsistema, sistema.nombre as nombresistema FROM subsistema INNER JOIN sistema ON subsistema.idsistema = sistema.id`
        const [result, fields] = await connection.execute(query)
        subsistema.rows = result
        subsistema.columns = subsistemacolumns
        return subsistema
    }

    getTag = async () => {
        let query = `SELECT * FROM tag`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTarea = async () => {
        let tarea
        let query = `SELECT tarea.idtarea, tarea.nombre, tipo.nombre as tipo, tarea.codigo, especialidad.nombre as especilidad, tarea.ubicacion FROM tarea INNER JOIN tipo ON tarea.idtipo = tipo.id INNER JOIN especialidad ON tarea.idespecialidad = especialidad.idespecialidad`
        const [result, fields] = await connection.execute(query)
        tarea.rows = result
        tarea.columns = tareacolumns
        return tarea
    }

    getRegistro = async () => {
        let query = `SELECT * FROM registroxtarea`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getRegistroById = async (id) => {
        let query = `SELECT * FROM registroxtarea WHERE idTag = ?`  
        const [result, fields] = await connection.execute(query, [id])
        return result
    }

    getSistemaById = async (id) => {
        let query = `SELECT * FROM sistema WHERE idSistema = ?`
        const [result, fields] = await connection.execute(query, [id])
        return result
    }



}