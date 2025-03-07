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
  if(rows == 0) {
    return res.status(400).json("Error al crear sistema (no existe el proyecto)");
  }
  return res.status(200).json(rows);
});

router.post('/subsistema', Authenticate, async (req, res) => {
  console.log("Post Subsistema")
  const rows = await rtsService.postSubSistema(req.body);
  if(rows == 0) {
    return res.status(400).json("Error al crear subsistema (no existe el sistema)");
  }

  console.log(res.status)
  return res.status(200).json(rows);
});

router.post('/tag', Authenticate, async (req, res) => {
  console.log("Post Tag")
  const rows = await rtsService.postTag(req.body);
  
  if(rows == 0) {
    return res.status(400).json("Error al crear tag (no existe el tipo)");
  } else if(rows == 1) {
    return res.status(400).json("Error al crear tag (no existe la especialidad)");
  } else if(rows == 2) {
    return res.status(400).json("Error al crear tag (no existe la subsistema)");
  }

  return res.status(200).json(rows);
});

router.post('/tarea', Authenticate, async (req, res) => {
  console.log("Post Tarea")
  const rows = await rtsService.postTarea(req.body);

  if(rows == 0) {
    return res.status(400).json("Error al crear tarea (no existe el tipo)");
  } else if(rows == 1) {
    return res.status(400).json("Error al crear tarea (no existe la especialidad)");
  } else if(rows == 2) {
    return res.status(400).json("Error al crear tarea (no existe el tag)");
  }
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

router.put('/realizarTarea', Authenticate, async (req, res) => {
  console.log("Realizar Tarea")
  const rows = await rtsService.realizarTarea(req.body.idTarea);
  rows == 0 ? res.status(400).json("Error al realizar tarea") : res.status(200).json(rows);
});


export default router;
