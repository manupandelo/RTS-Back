import { Router } from 'express';
import { Authenticate } from '../Common/jwt.strategy.js';
import { RtsService } from '../Services/RtsService.js';

const router = Router();
const rtsService = new RtsService();

router.get('', async (req, res) => {
  return res.status(200).json("Bienvenido al sistema de RTS Commisioning");
});

// GETS

router.get('/proyecto', Authenticate, async (req, res) => {
  console.log("Get Proyectos")
  const rows = await rtsService.getProyectos();
  return res.status(200).json(rows);
});

router.get('/sistema', Authenticate, async (req, res) => {
  console.log("Get Sistemas")
  const rows = await rtsService.getSistemas();
  return res.status(200).json(rows);
});

router.get('/subsistema', Authenticate, async (req, res) => {
  console.log("Get Subsistemas")
  const rows = await rtsService.getSubSistemas();
  return res.status(200).json(rows);
});

router.get('/tag', Authenticate, async (req, res) => {
  console.log("Get Tags")
  const rows = await rtsService.getTags();
  return res.status(200).json(rows);
});

router.get('/tarea', Authenticate, async (req, res) => {
  console.log("Get Tareas")
  const rows = await rtsService.getTareas();
  return res.status(200).json(rows);
});

router.get('/tipo', Authenticate, async (req, res) => {
  console.log("Get Tipos")
  const rows = await rtsService.getTipos();
  return res.status(200).json(rows);
});

router.get('/especialidad', Authenticate, async (req, res) => {
  console.log("Get Especialidades")
  const rows = await rtsService.getEspecialidades();
  return res.status(200).json(rows);
});

// POSTS

router.post('/proyecto', Authenticate, async (req, res) => {
  console.log("Post Proyecto")
  const rows = await rtsService.postProyecto(req.body.nombre);
  return res.status(200).json(rows);
});

router.post('/sistema', Authenticate, async (req, res) => {
  console.log("Post Sistema")
  const rows = await rtsService.postSistema(req.body);
  return res.status(200).json(rows);
});

router.post('/subsistema', Authenticate, async (req, res) => {
  console.log("Post Subsistema")
  const rows = await rtsService.postSubSistema(req.body);
  console.log(res.status)
  return res.status(200).json(rows);
});

router.post('/tag', Authenticate, async (req, res) => {
  console.log("Post Tag")
  const rows = await rtsService.postTag(req.body);
  return res.status(200).json(rows);
});

router.post('/tarea', Authenticate, async (req, res) => {
  console.log("Post Tarea")
  const rows = await rtsService.postTarea(req.body);
  return res.status(200).json(rows);
});

router.post('/tipo', Authenticate, async (req, res) => {
  console.log("Post Tipo")  
  const rows = await rtsService.postTipo(req.body.nombre);
  return res.status(200).json(rows);
});

router.post('/especialidad', Authenticate, async (req, res) => {
  console.log("Post Especialidad")
  const rows = await rtsService.postEspecialidad(req.body.nombre);
  return res.status(200).json(rows);
});

router.post('/registro', Authenticate, async (req, res) => {
  console.log("Post Registro Tareas")
  const rows = await rtsService.postRegistro(req.body);
  return res.status(200).json(rows);
});

router.post('/login', async (req, res) => {
  console.log("Post Login")
  const rows = await rtsService.login(req.body);
  return res.status(200).json(rows);
});

router.post('/register', async (req, res) => {
  console.log("Post Register")
  const rows = await rtsService.createUsuario(req.body);
  return res.status(200).json(rows);
});

// PUTS

router.put('/registro-tareas/:id', Authenticate, async (req, res) => {
  console.log("Put Registro Tareas")
  const rows = await rtsService.putRegistro(req.params.id);
  return res.status(200).json(rows);
});


export default router;
