import 'dotenv/config'
import con from '../../db.js'
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//Usuario --> id, user, password, idEmpresa y proximamente rol/permisos

// Proyecto --> id, nombre

// Sistema --> id, nombre, numSistema idproyecto, idEspecialidad
// Subsistema --> id, numsubsistema, fechainicio, fechafinal, nombre, idsistema
// Tag --> id, tag, nombre, idsubsistema, plano, idTipo
// Tarea --> id, nombre, idcodigo, idTag, done

//TareaXTipo --> id, idTarea, idTipo, codigo

// Especialidad --> id, nombre, idProyecto
// Tipo --> id, nombre, idEspecialidad




const connection = con

export class RtsService {

    // GETS

    getProyectos = async () => {
        let query = `SELECT * FROM Proyecto`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getSistemas = async () => {
        let query = `SELECT Sistema.id, Sistema.nombre, Sistema.numSistema, Proyecto.nombre as proyecto FROM Sistema INNER JOIN Proyecto ON Sistema.idProyecto = Proyecto.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getSubSistemas = async () => {
        let query = `SELECT SubSistema.id, SubSistema.nombre, SubSistema.numSubSistema, SubSistema.fechainicio, SubSistema.fechafinal, Sistema.numSistema as numSistema, Sistema.nombre as nombreSistema FROM SubSistema INNER JOIN Sistema ON SubSistema.idSistema = Sistema.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTags = async () => {
        let queryTags = `SELECT Tag.id, Tag.tag, Tag.nombre, Tag.plano, Tipo.nombre as tipo, SubSistema.nombre as subsistema FROM Tag INNER JOIN SubSistema ON Tag.idSubSistema = SubSistema.id INNER JOIN Tipo ON Tag.idTipo = Tipo.id`
        const [tags, fields] = await connection.execute(queryTags)

        let queryTasks = `SELECT Tarea.id, Tarea.idTag, Tarea.done, TareaXTipo.nombreTarea as nombreTarea FROM Tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id`
        const [tasks, fieldsTasks] = await connection.execute(queryTasks)


        const stats = {};

        tags.forEach((tag) => {
            const tagTasks = tasks.filter((task) => task.idTag === tag.id);
            const completedTasks = tagTasks.filter((task) => task.done === 1);

            const filledQuantity = ((completedTasks.length / tagTasks.length) * 100).toFixed(2);

            stats[tag.id] = {
            ...tag,
            filledQuantity,
            tareas: tagTasks,
            };
        });

        return Object.values(stats);
    }

    getTareas = async () => {
        let query = `SELECT Tarea.id, TareaXTipo.nombreTarea as tarea, TareaXTipo.codigo as codigo, Tipo.nombre as tipo, Tarea.done, Tarea.idTag FROM Tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTareasByTag = async (idTag) => {
        let query = `SELECT Tarea.id, TareaXTipo.nombreTarea, TareaXTipo.codigo, Tipo.nombre as tipo, Tarea.done FROM tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id WHERE Tarea.idTag = ?`
        const [result, fields] = await connection.execute(query, [idTag])
        return result
    }

    getTareasTag = async () => {
        let query = `SELECT Tarea.id, Tarea.idTag, Tarea.done, TareaXTipo.nombreTarea as nombreTarea FROM Tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTagsBySubsistema = async (idSubsistema) => {
        let query = `SELECT Tag.id, Tag.tag, Tag.nombre, SubSistema.nombre as nombreSubSistema, Tag.plano, Tipo.nombre as tipo FROM tag INNER JOIN SubSistema ON Tag.idSubSistema = SubSistema.id INNER JOIN  ON Tag.idTipo = Tipo.id WHERE tag.idsubsistema = ?`
        const [result, fields] = await connection.execute(query, [idSubsistema])
        return result
    }

    getSubSistemasBySistema = async (idSistema) => {
        let query = `SELECT SubSistema.id, SubSistema.nombre, SubSistema.numSubSistema, SubSistema.fechainicio, subsistema.fechafinal, Xistema.numSistema as numSistema, Sistema.nombre as nombreSistema FROM SubSistema INNER JOIN Sistema ON SubSistema.idSistema = Sistema.id WHERE sistema.id = ?`
        const [result, fields] = await connection.execute(query, [idSistema])
        return result
    }

    getSistemasByProyecto = async (idProyecto) => {
        let query = `SELECT sistema.id, sistema.nombre, sistema.idsistema, proyecto.nombre as proyecto FROM sistema INNER JOIN proyecto ON sistema.idproyecto = proyecto.idproyecto WHERE proyecto.idproyecto = ?`
        const [result, fields] = await connection.execute(query, [idProyecto])
        return result
    }


    getTipos = async () => {
        let query = `SELECT Tipo.id, Tipo.nombre, Especialidad.nombre as especialidad FROM Tipo INNER JOIN Tipo ON Tipo.idEspecialidad = Especialidad.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getEspecialidades = async () => {
        let query = `SELECT Especialidad.id, Especialidad.nombre FROM Especialidad`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTareasXTipo = async () => {
        let query = `SELECT TareaXTipo.id, TareaXTipo.nombreTarea, TareaXTipo.codigo, Tipo.nombre as tipo FROM TareaXTipo INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    //Para despues
    getPermisos = async (id) => {
        let query = `SELECT * FROM permisos WHERE iduser = ?`
        const [result, fields] = await connection.execute(query, [id])
        return result
    }

    // POSTS

    //Falta agregar que no se pueda agregar un proy, sist, subsist, tag con mismo nombre
    
    postProyecto = async (nombre) => {
        let query = `INSERT INTO Proyecto (nombre) VALUES (?)`
        const [result, fields] = await connection.execute(query, [nombre])
        return result
    }


    postSistema = async (sistema) => {
        let query = `INSERT INTO Sistema (nombre, numSistema, idProyecto) VALUES (?, ?, ?)`
        const [result, fields] = await connection.execute(query, [sistema.nombre, sistema.numSistema, sistema.idProyecto])
        return result
    }

    postSubSistema = async (subSistema) => {
        let query = `INSERT INTO SubSistema (numSubSistema, fechainicio, fechafinal, nombre, idsistema) VALUES (?, ?, ?, ?, ?)`
        const [result, fields] = await connection.execute(query, [subSistema.numsubsistema, subSistema.fechainicio, subSistema.fechafinal, subSistema.nombre, subSistema.idSistema])
        return result
    }

    postTag = async (tag) => {
        let query = `INSERT INTO Tag (tag, nombre, idSubSistema, plano, idTipo) VALUES (?, ?, ?, ?, ?)`
        const [result, fields] = await connection.execute(query, [tag.tag, tag.nombre, tag.idSubSistema, tag.plano, tag.idTipo])
        
        let query2 = `Select id FROM TareaXTipo WHERE idTipo = ?`
        const [result2, fields2] = await connection.execute(query2, [tag.idTipo])

        console.log(result2)
        if(result2.length == 0) {
            return 0
        } else {
            let values = result2.map(r => `(${r.id}, ${result.insertId}, 0)`).join(', ')
            let query3 = `INSERT INTO Tarea (idCodigo, idTag, done) VALUES ${values}`
            const [result3, fields3] = await connection.execute(query3)
            return result3
        }
        
    }


    /*Revisar esto
    postTarea = async (tarea) => {
        let TagIdQuery = `SELECT * FROM tag WHERE nombre = ?`
        const [resultTag, fields] = await connection.execute(TagIdQuery, [tarea.nombreTag])

        let especialidadIdQuery = `SELECT id FROM especialidad WHERE nombre = ?`
        const [resultEspecialidad, fieldsEspecialidad] = await connection.execute(especialidadIdQuery, [tag.especialidad])

        let tipoIdQuery = `SELECT idtipo FROM tipo WHERE nombre = ?`
        const [resultTipo, fieldsTipo] = await connection.execute(tipoIdQuery, [tag.tipo])

        if(resultTipo[0] == undefined) {
            return 0
        } else if(resultEspecialidad[0] == undefined) {
            return 1
        } else if(resultTag[0] == undefined) {
            return 2
        } else {
            let query = `INSERT INTO tarea (nombre, idtipo, codigo, idespecialidad, ubicacion, idtag, done) VALUES (?, ?, ?, ?, ?, ?, 0)` // 0 = false
            const [result, fields] = await connection.execute(query, [tarea.nombre, tarea.idtipo, tarea.codigo, tarea.idespecialidad, tarea.ubicacion, resultTag[0].idtag])
            return result
        }
    }
    */

    postEspecialidad = async (nombre) => {
        let query = `INSERT INTO Especialidad (nombre) VALUES (?)`
        const [result, fields] = await connection.execute(query, [nombre])
        return result
    }

    postTipo = async (tipo) => {
        let query = `INSERT INTO Tipo (nombre, idEspecialidad) VALUES (?,?)`
        const [result, fields] = await connection.execute(query, [tipo.nombre, tipo.idEspecialidad])
        return result
    }

    postRegistro = async (registro) => {
        let query = `INSERT INTO TareaXTipo (nombreTarea, idTipo, codigo) VALUES (?, ?, ?)`
        const [result, fields] = await connection.execute(query, [registro.nombreTarea, registro.idTipo, registro.codigo])
        return result
    }


    login = async (usuario) => {
        let query=`Select * from Usuario where user=?`;
        const [result,fields] = await connection.execute(query,[usuario.user]);
        if(result[0]==undefined){
            return false
        }
        if(bcrypt.compareSync(usuario.password, result[0].password)){
            result[0].token= await this.getToken(result[0]);
            console.log(result)
            /*if(result[0].tipousuario == 1){
                result[0].admin = true
            }else{
                result[0].admin = false
                result[0].permisos = await this.getPermisos(result[0].id)
                
            }*/
            return result[0];
        }else{
            return false;
        }
    }

    createUsuario = async (usuario) => {
        let query = `INSERT INTO Usuario (user, password) VALUES (?, ?)`
        const [result, fields] = await connection.execute(query, [usuario.user, bcrypt.hashSync(usuario.pass, 10)])
        return result
    }

    getToken = async (user) => {
        const userId = `${user.id}`;
        const username = `${user.user}`;
        const token = jwt.sign(
            {
            payload: "login",
            nombreusuario: username,
            },
            process.env.AUTH_HS256_KEY, 
            {
            issuer: "http://rts.com/",
            subject: userId,
            audience: ["http://localhost/"],
            expiresIn: 60 * 24 * 24,
        });
        return token;
    } 

    // PUTS
    realizarTarea = async (idTarea) => {
        let query = `UPDATE Tarea SET done = 1 WHERE id = ?`
        const [result, fields] = await connection.execute(query, [idTarea])
        return result.affectedRows
    }

    desmarcarTarea = async (idTarea) => {
        let query = `UPDATE Tarea SET done = 0 WHERE id = ?`
        const [result, fields] = await connection.execute(query, [idTarea])
        return result.affectedRows
    }
    
    // DELETE HACER BIEN, NO SE PUEDE BORRAR SI TIENE DEPENDENCIAS



    //GET pendientes

    getTareasPendientes = async () => {
        let query = `SELECT Tarea.id, TareaXTipo.nombreTarea, TareaXTipo.codigo, Tipo.nombre as tipo, Tag.tag as tag FROM Tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id INNER JOIN Tag ON Tarea.idTag = Tag.id WHERE Tarea.done = 0`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTagsPendientes = async () => {
        const tags = await this.getTags()
        const tagsPendientes = tags.filter((tag) => tag.filledQuantity < 100);
        return tagsPendientes;
    }

    getTareasPendientesByTag = async (idTag) => {
        let query = `SELECT Tarea.id, TareaXTipo.nombre, TareaXTipo.codigo, Tipo.nombre as tipo, Tarea.done FROM tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id WHERE Tarea.idTag = ? AND Tarea.done = 0`
        const [result, fields] = await connection.execute(query, [idTag])
        return result
    }

    getTareasPendientesByTipo = async (idTipo) => {
        let query = `SELECT Tarea.id, TareaXTipo.nombre, TareaXTipo.codigo, Tipo.nombre as tipo, Tarea.done FROM tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id WHERE Tipo.id = ? AND Tarea.done = 0`
        const [result, fields] = await connection.execute(query, [idTipo])
        return result
    }

    getTareasPendientesByEspecialidad = async (idEspecialidad) => {
        let query = `SELECT Tarea.id, TareaXTipo.nombre, TareaXTipo.codigo, Tipo.nombre as tipo, Tarea.done FROM tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id WHERE Tipo.idEspecialidad = ? AND Tarea.done = 0`
        const [result, fields] = await connection.execute(query, [idEspecialidad])
        return result
    }

    getTareasPendientesBySistema = async (idSistema) => {
        let query = `SELECT Tarea.id, TareaXTipo.nombre, TareaXTipo.codigo, Tipo.nombre as tipo, Tarea.done FROM tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id WHERE Tipo.idSistema = ? AND Tarea.done = 0`
        const [result, fields] = await connection.execute(query, [idSistema])
        return result
    }

    getTareasPendientesByProyecto = async (idProyecto) => {
        let query = `SELECT Tarea.id, TareaXTipo.nombre, TareaXTipo.codigo, Tipo.nombre as tipo, Tarea.done FROM tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id WHERE Tipo.idProyecto = ? AND Tarea.done = 0`
        const [result, fields] = await connection.execute(query, [idProyecto])
        return result
    }

    getTareasPendientesBySubsistema = async (idSubsistema) => {
        let query = `SELECT Tarea.id, TareaXTipo.nombre, TareaXTipo.codigo, Tipo.nombre as tipo, Tarea.done FROM tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id INNER JOIN Tipo ON TareaXTipo.idTipo = Tipo.id WHERE Tipo.idSubsistema = ? AND Tarea.done = 0`
        const [result, fields] = await connection.execute(query, [idSubsistema])
        return result
    }

    //get porcentaje realizado

    getPorcentaTag = async (idTag) => {
        let query = `SELECT COUNT(*) FROM tarea WHERE idTag = ?`
        const [result, fields] = await connection.execute(query, [idTag])
        let query2 = `SELECT COUNT(*) FROM tarea WHERE idTag = ? AND done = 1`
        const [result2, fields2] = await connection.execute(query2, [idTag])
        return result2[0] / result[0] * 100
    }

    getIdProyectos = async () => {
        let query = `SELECT id, nombre FROM Proyecto`
        const [result, fields] = await connection.execute(query)
        return result
    }
    
    getIdSistemas = async () => {
        let query = `SELECT id, nombre FROM Sistema`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getIdSubsistemas = async () => {
        let query = `SELECT id, nombre FROM SubSistema`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getIdTags = async () => {
        let query = `SELECT id, nombre FROM Tag`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getIdTipos = async () => {
        let query = `SELECT id, nombre FROM Tipo`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getIdEspecialidades = async () => {
        let query = `SELECT id, nombre FROM Especialidad`
        const [result, fields] = await connection.execute(query)
        return result
    }

}


import "dotenv/config";
  