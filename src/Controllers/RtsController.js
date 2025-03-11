import { Router } from 'express';
import { /*Authenticate*/ } from '../Common/jwt.strategy.js';
import { RtsService } from '../Services/RtsService.js';

const router = Router();
const rtsService = new RtsService();

router.get('', async (req, res) => {
  return res.status(200).json("Bienvenido al sistema de RTS Commisioning");
});

// GETS

router.get('/proyecto', /*Authenticate,*/ async (req, res) => {
  console.log("Get Proyectos")
  const rows = await rtsService.getProyectos();
  return res.status(200).json(rows);
});

router.get('/sistema', /*Authenticate,*/ async (req, res) => {
  console.log("Get Sistemas")
  const rows = await rtsService.getSistemas();
  return res.status(200).json(rows);
});

router.get('/subsistema', /*Authenticate,*/ async (req, res) => {
  console.log("Get Subsistemas")
  const rows = await rtsService.getSubSistemas();
  return res.status(200).json(rows);
});

router.get('/tag', /*Authenticate,*/ async (req, res) => {
  console.log("Get Tags")
  const rows = await rtsService.getTags();
  return res.status(200).json(rows);
});

router.get('/tarea', /*Authenticate,*/ async (req, res) => {
  console.log("Get Tareas")
  const rows = await rtsService.getTareas();
  return res.status(200).json(rows);
});

router.get('/tareas', /*Authenticate,*/ async (req, res) => {
  console.log("Get Tareas")
  const rows = await rtsService.getTareasXTipo();
  return res.status(200).json(rows);
});

router.get('/tareastag', /*Authenticate,*/ async (req, res) => {
  console.log("Get Tareas por Tag")
  const rows = await rtsService.getTareasTag();
  return res.status(200).json(rows);
});

router.get('/tipo', /*Authenticate,*/ async (req, res) => {
  console.log("Get Tipos")
  const rows = await rtsService.getTipos();
  return res.status(200).json(rows);
});

router.get('/especialidad', /*Authenticate,*/ async (req, res) => {
  console.log("Get Especialidades")
  const rows = await rtsService.getEspecialidades();
  return res.status(200).json(rows);
});

// POSTS

router.post('/proyecto', /*Authenticate,*/ async (req, res) => {
  console.log("Post Proyecto")
  const rows = await rtsService.postProyecto(req.body.nombre);
  return res.status(200).json(rows);
});

router.post('/sistema', /*Authenticate,*/ async (req, res) => {
  console.log("Post Sistema")
  const rows = await rtsService.postSistema(req.body);
  if(rows == 0) {
    return res.status(400).json("Error al crear sistema (no existe el proyecto)");
  }
  return res.status(200).json(rows);
});

router.post('/subsistema', /*Authenticate,*/ async (req, res) => {
  console.log("Post Subsistema")
  const rows = await rtsService.postSubSistema(req.body);
  if(rows == 0) {
    return res.status(400).json("Error al crear subsistema (no existe el sistema)");
  }

  console.log(res.status)
  return res.status(200).json(rows);
});

router.post('/tag', /*Authenticate,*/ async (req, res) => {
  console.log("Post Tag")
  console.log(req.body)
  const rows = await rtsService.postTag(req.body);
  if(rows == 0) {
    return res.status(200).json("Tag agregado correctamente pero sin tareas puesto que el tipo elegido no cuenta con tareas");
  }
  return res.status(200).json("Tag agregado correctamente con sus respectivas tareas");
});

router.post('/tarea', /*Authenticate,*/ async (req, res) => {
  console.log("Post Tarea")
  const rows = await rtsService.postTarea(req.body);
  return res.status(200).json(rows);
});



router.post('/tipo', /*Authenticate,*/ async (req, res) => {
  console.log("Post Tipo")  
  const rows = await rtsService.postTipo(req.body);
  return res.status(200).json(rows);
});

router.post('/especialidad', /*Authenticate,*/ async (req, res) => {
  console.log("Post Especialidad")
  const rows = await rtsService.postEspecialidad(req.body.nombre);
  return res.status(200).json(rows);
});

router.post('/registro', /*Authenticate,*/ async (req, res) => {
  console.log(req.body)
  console.log("Post Registro Tareas")
  const rows = await rtsService.postRegistro(req.body);
  return res.status(200).json(rows);
});

router.post('/login', async (req, res) => {
  console.log("Post Login")
  const rows = await rtsService.login(req.body);
  console.log(rows.token)
  return res.status(200).json(rows);
});

router.post('/register', async (req, res) => {
  console.log("Post Register")

  console.log(req.body)
  if (!req.body.pass){
    throw new Error('Contraseña no proporcionada');
  }
  const rows = await rtsService.createUsuario(req.body);
  return res.status(200).json(rows);
});

// PUTS

router.put('/realizarTarea', /*Authenticate,*/ async (req, res) => {
  console.log("Realizar Tarea")
  const rows = await rtsService.realizarTarea(req.body.id);
  rows == 0 ? res.status(400).json("Error al realizar tarea") : res.status(200).json(rows);
});

router.put('/desmarcarTarea', /*Authenticate,*/ async (req, res) => {
  console.log("Desmarcar Tarea")
  const rows = await rtsService.desmarcarTarea(req.body.id);
  rows == 0 ? res.status(400).json("Error al desmarcar tarea") : res.status(200).json(rows);
});

// PARA PASAR IDS CUANDO AGREGAMOS

router.get('/idproyectos', /*Authenticate,*/ async (req, res) => {
  console.log("Get Id Proyectos")
  const rows = await rtsService.getIdProyectos();
  return res.status(200).json(rows);
});

router.get('/idsistemas', /*Authenticate,*/ async (req, res) => {
  console.log("Get Id Sistemas")
  const rows = await rtsService.getIdSistemas();
  return res.status(200).json(rows);
});

router.get('/idsubsistemas', /*Authenticate,*/ async (req, res) => {
  console.log("Get Id Subsistemas")
  const rows = await rtsService.getIdSubsistemas();
  return res.status(200).json(rows);
});

router.get('/idtags', /*Authenticate,*/ async (req, res) => {
  console.log("Get Id Tags")
  const rows = await rtsService.getIdTags();
  return res.status(200).json(rows);
});

router.get('/idtipo', /*Authenticate,*/ async (req, res) => {
  console.log("Get Id Tipos")
  const rows = await rtsService.getIdTipos();
  return res.status(200).json(rows);
});

router.get('/idespecialidad', /*Authenticate,*/ async (req, res) => {
  console.log("Get Id Especialidades")
  const rows = await rtsService.getIdEspecialidades();
  return res.status(200).json(rows);
});

router.get('/tareaspendientes', /*Authenticate,*/ async (req, res) => {
  console.log("Get Tareas Pendientes")
  const rows = await rtsService.getTareasPendientes();
  return res.status(200).json(rows);
});

router.get('/tagspendientes', /*Authenticate,*/ async (req, res) => {
  console.log("Get Tags Pendientes")
  const rows = await rtsService.getTagsPendientes();
  return res.status(200).json(rows);
});

export default router;
