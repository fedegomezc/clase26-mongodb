import mongoose from '../config/mongo.js';
const ObjectId = mongoose.Types.ObjectId;

const preguntaSchema = new mongoose.Schema({
    pregunta: String,
    respuestas: [{
        respuesta_id: ObjectId,
        respuesta: String,
        personas_que_respondieron: [{ name: String }]
    }],
});

// modelo
const Pregunta = mongoose.model('Preguntas', preguntaSchema)

export async function create(data) {
    try {
        const newPregunta = new Pregunta(data);
        newPregunta.save();
    } catch (error) {
        throw (`imposible insertar: ${error}`);
    }
}

export async function crearRespuesta(idPregunta, data) {
    try {
        const pregunta = await Pregunta.findById(idPregunta);
        if (!pregunta) {
            throw new Error('Pregunta no encontrada');
        }
        pregunta.respuestas.push(data);
        pregunta.save();
        return data;
    } catch (error) {
        throw (`imposible crear: ${error}`);
    }
}

export async function votar(respuestaId, dataUser) {
    try {
        const pregunta = await Pregunta.findOne({ 'respuestas._id': respuestaId });
        if (!pregunta) {
            throw new Error('Pregunta no encontrada');
        }

        const respuesta = pregunta.respuestas.find(resp => resp._id.equals(respuestaId));
        if (!respuesta) {
            throw new Error('Respuesta no encontrada');
        }

        respuesta.personas_que_respondieron.push(dataUser);
        await pregunta.save();

        return pregunta;
    } catch (error) {
        throw (`imposible actualizar: ${error}`);
    }
}