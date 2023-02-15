import express from "express";
import cors from "cors";

import router from './src/Controllers/RtsController.js';

const port=3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/", router)



app.listen(process.env.PORT || port, () => {
  console.log(`Live at ${process.env.PORT || port}`);
})
