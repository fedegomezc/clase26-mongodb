import { create, crearRespuesta, votar, Pregunta } from '../models/encuestas.js'


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
        const idPregunta = req.params.preguntaId;
        const respuestaData = req.body;

        const pregunta = await Pregunta.findById(idPregunta);
        if (!pregunta) {
            return res.status(404).json({ message: 'Pregunta no encontrada' });
        }

        const respuesta = await crearRespuesta(pregunta, respuestaData);
        res.status(201).json(respuesta);
    } catch (error) {
        res.status(500).json({ message: 'Error al intentar crear la respuesta' });
        console.error(error);
    }
}

export const voteAnswer = async (req, res) => {
    try {
        const respuestaId = req.params.respuestaId;
        const dataUser = req.body;

        const pregunta = await Pregunta.findOne({ 'respuestas._id': respuestaId });
        if (!pregunta) {
            return res.status(404).json({ message: 'Pregunta no encontrada' });
        }

        const respuesta = pregunta.respuestas.find(resp => resp._id.equals(respuestaId));
        if (!respuesta) {
            return res.status(404).json({ message: 'Respuesta no encontrada' });
        }

        const usuarioYaVotoResp = (resp) => {
            return resp.personas_que_respondieron.some(persona => persona.name === dataUser.name);
        }

        const usuarioYaVoto = pregunta.respuestas.some(resp => usuarioYaVotoResp(resp));
        if (!usuarioYaVoto) {
            const respuestaActualizada = await votar(pregunta, respuesta, dataUser);
            return res.status(200).json(respuestaActualizada);
        } else {
            res.status(400).json({ message: 'El usuario ya votó en esta pregunta' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al intentar votar' });
        console.error(error);
    }
}