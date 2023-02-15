import { Router } from 'express';

import { RtsService } from '../Services/RtsService.js';

const router = Router();
const rtsService = new RtsService();

router.get('', async (req, res) => {
  return res.status(200).json("Bienvenido al sistema de RTS Commisioning");
});

router.get('/sistema', async (req, res) => {
  console.log("Get Sistemas")
  const sistemacolumns = await rtsService.getSistemas();
  return res.status(200).json(sistema);
});

router.get('/subsistema', async (req, res) => {
  console.log("Get Subsistemas")
  const subsistema = await rtsService.getSubSistemas();
  return res.status(200).json(subsistema);
});

router.get('/tag', async (req, res) => {
  console.log("Get Tags")
  const tags = await rtsService.getTags();
  return res.status(200).json(tags);
});

router.get('/tareas', async (req, res) => {
  console.log("Get Tareas")
  const tareas = await rtsService.getTareas();
  return res.status(200).json(tareas);
});

router.get('/registro-tareas', async (req, res) => {
  console.log("Get Registro Tareas")
  const registro = await rtsService.getRegistro();
  return res.status(200).json(registro);
});

router.get('/registro-tareas/:id', async (req, res) => {
  console.log("Get Registro Tareas by its Tag ID")
  const registro = await rtsService.getRegistroById(req.params.id);
  return res.status(200).json(registro);
});

router.get('/sistema/:id', async (req, res) => {
  console.log("Get Entire Sistema by its ID")
  const sistema = await rtsService.getSistemaById(req.params.id);
  return res.status(200).json(sistema);
});

export default router;
