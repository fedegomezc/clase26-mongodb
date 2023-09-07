import { create, crearRespuesta, votar } from '../models/encuestas.js'

export const createQuestion = async (req, res) => {
    try {
        const question = await create(req.body);
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la pregunta' });
    }
}

export const createAnswer = async (req, res) => {
    try {
        const respuesta = await crearRespuesta(req.params.preguntaId, req.body);
        res.status(201).json(respuesta);

    } catch (error) {
        res.status(500).json({ message: 'Error al intentar crear la respuesta' });
        console.error(error);
    }
}

export const voteAnswer = async (req, res) => {
    try {
        const respuestaActualizada = await votar(req.params.respuestaId, req.body);
        return res.status(200).json(respuestaActualizada);
    } catch (error) {
        res.status(500).json({ message: 'Error al intentar votar' });
        console.error(error);
    }
}