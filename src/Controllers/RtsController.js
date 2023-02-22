import { Router } from 'express';

import { RtsService } from '../Services/RtsService.js';

const router = Router();
const rtsService = new RtsService();

router.get('', async (req, res) => {
  return res.status(200).json("Bienvenido al sistema de RTS Commisioning");
});

router.get('/sistema', async (req, res) => {
  console.log("Get Sistemas")
  const rows = await rtsService.getSistemas();
  return res.status(200).json(rows);
});

router.get('/subsistema', async (req, res) => {
  console.log("Get Subsistemas")
  const rows = await rtsService.getSubSistemas();
  return res.status(200).json(rows);
});

router.get('/tag', async (req, res) => {
  console.log("Get Tags")
  const rows = await rtsService.getTags();
  return res.status(200).json(rows);
});

router.get('/tarea', async (req, res) => {
  console.log("Get Tareas")
  const rows = await rtsService.getTareas();
  return res.status(200).json(rows);
});

router.get('/registro-tareas', async (req, res) => {
  console.log("Get Registro Tareas")
  const rows = await rtsService.getRegistros();
  console.log(rows.length)
  return res.status(200).json(rows);
});

router.get('/registro-tareas/:id', async (req, res) => {
  console.log("Get Registro Tareas by its Tag ID")
  const rows = await rtsService.getRegistroById(req.params.id);
  return res.status(200).json(rows);
});

export default router;
