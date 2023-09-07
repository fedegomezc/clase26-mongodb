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

//middleware para crear respuestas cuando se crea una pregunta
preguntaSchema.pre('save', async function (next) {
    if (this.respuestas.length === 0) {
        return next();
    }

    const promises = this.respuestas.map(async (respuestaData) => {
        const respuesta = new Respuesta(respuestaData);
        await respuesta.save();
        return respuesta;
    });

    try {
        // Esperar a que se creen todas las respuestas antes de continuar
        this.respuestas = await Promise.all(promises);
        next();
    } catch (error) {
        next(error);
    }
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
        const document = await Respuesta.findById(id) || Pregunta.findById(id);
        return document;
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

export async function votar(respuesta, data) {
    try {
        respuesta.personas_que_respondieron.push(data);
        respuesta.save();
        return respuesta;
    } catch (error) {
        throw (`imposible actualizar: ${error}`);
    }
}