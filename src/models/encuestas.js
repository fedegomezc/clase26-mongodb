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

// export async function votar(respuesta, data) {
//     try {
//         respuesta.personas_que_respondieron.push(data);
//         respuesta.save();
//         return respuesta;
//     } catch (error) {
//         throw (`imposible actualizar: ${error}`);
//     }
// }