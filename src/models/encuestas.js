import mongoose from '../config/mongo.js';
const ObjectId = mongoose.Types.ObjectId;

const respuestaSchema = new mongoose.Schema({
    respuesta: String,
    personas_que_respondieron: [{ name: String }]
});

const Respuesta = mongoose.model('Respuestas', respuestaSchema);

const preguntaSchema = new mongoose.Schema({
    pregunta: String,
    respuestas: [respuestaSchema],
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

export async function findById(id) {
    try {
        const pregunta = await Pregunta.findById(id);
        return pregunta;
    } catch (error) {
        throw (`imposible retornar ${error}`)
    }
}

export async function crearRespuesta(pregunta, data) {
    try {
        const respuesta = new Respuesta(data);
        pregunta.respuestas.push(respuesta);
        pregunta.save();
        return respuesta;
    } catch (error) {
        throw (`imposible crear: ${error}`);
    }
}