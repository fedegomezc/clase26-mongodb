import { Router } from "express";
import { createQuestion, createAnswer } from '../controllers/encuestas.js'

const encuestasRouter = Router();

encuestasRouter.post('/preguntas', createQuestion);
encuestasRouter.post('/respuestas/:preguntaId', createAnswer);
// encuestasRouter.post('/votar/:respuestaId', voteAnswer);

export default encuestasRouter;