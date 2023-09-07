import { Router } from "express";
import { createQuestion, createAnswer, voteAnswer } from '../controllers/encuestas.js'

const encuestasRouter = Router();

encuestasRouter.post('/preguntas', createQuestion);
encuestasRouter.post('/respuestas/:preguntaId', createAnswer);
encuestasRouter.put('/votar/:respuestaId', voteAnswer);

export default encuestasRouter;