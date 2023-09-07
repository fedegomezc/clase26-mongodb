import 'dotenv/config'
import express, { json } from 'express';
import encuestasRouter from './routes/encuestas.js';
// import reportesRouter from './routes/reportes.js';

const app = express()
app.use(json());
app.use('/encuestas', encuestasRouter);
// app.use('/reportes', reportesRouter);

try {
  app.listen(process.env.PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${process.env.PORT}`);
  });
} catch (error) {
  console.error(`Error al iniciar el servidor: ${error.message}`);
}