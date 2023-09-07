import { create, findById, crearRespuesta, votar } from '../models/encuestas.js'

export const createQuestion = async (req, res) => {
    try {
        const question = await create(req.body);
        console.log(question);
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la pregunta' });
    }
}

export const createAnswer = async (req, res) => {
    try {
        const pregunta = await findById(req.params.preguntaId);
        if (!pregunta) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }
        const respuesta = await crearRespuesta(pregunta, req.body);
        res.status(201).json(respuesta);

    } catch (error) {
        res.status(500).json({ message: 'Error al intentar crear la respuesta' });
        console.error(error);
    }
}

export const voteAnswer = async (req, res) => {
    try {
        const respuesta = await findById(req.params.respuestaId);
        if (!respuesta) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }
        const respuestaActualizada = await votar(respuesta, req.body);
        return res.status(200).json(respuestaActualizada);
    } catch (error) {
        res.status(500).json({ message: 'Error al intentar votar' });
        console.error(error);
    }
}