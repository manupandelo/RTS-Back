import 'dotenv/config'
import con from '../../db.js'
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//Usuario --> id, user, password, idEmpresa y proximamente rol/permisos

// Proyecto --> id, nombre
// Sistema --> id, nombre, numSistema idproyecto
// Subsistema --> id, numsubsistema, fechainicio, fechafinal, nombre, idsistema
// Tag --> id, tag, nombre, idsubsistema, plano, idTipo
// Tarea --> id, nombre, idcodigo, idTag, done

//TareaXTipo --> id, idTarea, idTipo, codigo

// Especialidad --> id, nombre
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
        let query = `SELECT SubSistema.id, SubSistema.nombre, SubSistema.numSubSistema, SubSistema.fechainicio, subsistema.fechafinal, Xistema.numSistema as numSistema, Sistema.nombre as nombreSistema FROM SubSistema INNER JOIN Sistema ON SubSistema.idSistema = Sistema.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTags = async () => {
        let query = `SELECT Tag.id, Tag.tag, Tag.nombre, SubSistema.nombre as nombreSubSistema, Tag.plano, Tipo.nombre as tipo FROM tag INNER JOIN SubSistema ON Tag.idSubSistema = SubSistema.id INNER JOIN Tipo ON Tag.idTipo = Tipo.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTareas = async () => {
        let query = `SELECT Tarea.id, Tarea.nombre, TareaXTipo.codigo, Tarea.ubicacion, Tarea.done FROM tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id`
        const [result, fields] = await connection.execute(query)
        return result
    }

    getTareasByTag = async (idTag) => {
        let query = `SELECT Tarea.id, Tarea.nombre, TareaXTipo.codigo , Tarea.ubicacion, Tarea.done FROM tarea INNER JOIN TareaXTipo ON Tarea.idCodigo = TareaXTipo.id WHERE Tarea.idTag = ?`
        const [result, fields] = await connection.execute(query, [idTag])
        return result
    }

    getTagsBySubsistema = async (idSubsistema) => {
        let query = `SELECT Tag.id, Tag.tag, Tag.nombre, SubSistema.nombre as nombreSubSistema, Tag.plano, Especialidad.nombre as especialidad FROM tag INNER JOIN SubSistema ON Tag.idSubSistema = SubSistema.id INNER JOIN Especialidad ON Tag.idEspecialidad = Especialidad.id WHERE tag.idsubsistema = ?`
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
        let query = `SELECT * FROM Especialidad`
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
        //Busco si existe el proyecto
        let proyectoIdQuery = `SELECT id FROM Proyecto WHERE nombre = ?`
        const [resultProyecto, fields] = await connection.execute(proyectoIdQuery, [sistema.nombreProyecto])

        if(resultProyecto[0] == undefined) {
            return 0
        } else {
            let query = `INSERT INTO Sistema (nombre, idSistema, idProyecto) VALUES (?, ?, ?)`
            const [result, fields] = await connection.execute(query, [sistema.nombre, sistema.idSistema, resultProyecto[0].id])
            return result
        }
    }

    postSubSistema = async (subSistema) => {
        let SistemaIdQuery = `SELECT id FROM sistema WHERE nombre = ?`
        const [resultSistema, fields] = await connection.execute(SistemaIdQuery, [subSistema.sistema])

        if(resultSistema[0] == undefined) {
            return 0
        } else {
            let query = `INSERT INTO subsistema (numsubsistema, fechainicio, fechafinal, nombre, idsistema) VALUES (?, ?, ?, ?, ?)`
            const [result, fields] = await connection.execute(query, [subSistema.numsubsistema, subSistema.fechainicio, subSistema.fechafinal, subSistema.nombre, resultSistema[0].id])
            return result
        }
    }

    postTag = async (tag) => {
        let SubSistemaIdQuery = `SELECT id FROM SubSistema WHERE nombre = ?`
        const [resultSubSistema, fieldsSubSistema] = await connection.execute(SubSistemaIdQuery, [tag.subSistema])

        let tipoIdQuery = `SELECT id FROM Tipo WHERE nombre = ?`
        const [resultTipo, fieldsTipo] = await connection.execute(tipoIdQuery, [tag.Tipo])

        if(resultSubSistema[0] == undefined) {
            return 0
        } else if(resultTipo[0] == undefined) {
            return 1
        } else {
            let query = `INSERT INTO Tag (tag, nombre, idSubSistema, plano, idTipo) VALUES (?, ?, ?, ?, ?)`
            const [result, fields] = await connection.execute(query, [tag.tag, tag.nombre, resultSubSistema[0].id, tag.plano, resultTipo[0].id])
            if(result.affectedRows == 0) {
                return 2
            } else {
                return postTareasByEspecialidad(resultTipo[0].id, result[0].insertId)
            }
            
        }
    }

    postTareasByTipo = async (idTipo, idTag) => {
        let query = `SELECT * FROM TareaXTipo WHERE idTipo = ?`
        const [result, fields] = await connection.execute(query, [idTipo])

        if(result[0] == undefined) {
            return 3
        } else {
            let query2 = `INSERT INTO Tarea (nombre, idCodigo, idTag, done) VALUES (${result[0].nombre}, ${result[0].idCodigo}, ${idTag}, 0)`
    
            for(let i = 1; i < result.length; i++) {
                query2 += `, (${result[i].nombreTarea}, ${result[i].id}, ${idTag}, 0)`
            }
            const [result2, fields2] = await connection.execute(query2)
            return result2
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
        let query = `INSERT INTO Tipo (nombre, idEspecialidad) VALUES (?,)`
        const [result, fields] = await connection.execute(query, [tipo.nombre, tipo.idEspecialidad])
        return result
    }


    login = async (usuario) => {
        let query=`Select * from user where user=?`;
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
        let query = `INSERT INTO user (user, password, nombreapellido) VALUES (?, ?, ?)`
        const [result, fields] = await connection.execute(query, [usuario.user, bcrypt.hashSync(usuario.password, 10), usuario.nombreapellido])
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
        let query = `UPDATE tarea SET done = 1 WHERE id = ?`
        const [result, fields] = await connection.execute(query, [idTarea])
        if(result.affectedRows == 0) {
            return false
        } else {
            return true
        }
    }
    
    // DELETE HACER BIEN, NO SE PUEDE BORRAR SI TIENE DEPENDENCIAS
}


import "dotenv/config";
  