import mongoose from '../config/mongo.js';
const ObjectId = mongoose.Types.ObjectId;

const preguntaSchema = new mongoose.Schema({
    pregunta: String,
    respuestas: [{
        respuesta_id: ObjectId,
        respuesta: String,
        personas_que_respondieron: [{ name: String }]
    }],
}, {
    timestamps: true
});

// modelo
export const Pregunta = mongoose.model('Preguntas', preguntaSchema)

export async function create(data) {
    try {
        const newPregunta = new Pregunta(data);
        newPregunta.save();
        return newPregunta;
    } catch (error) {
        throw (`imposible insertar: ${error}`);
    }
}

export async function crearRespuesta(pregunta, data) {
    try {
        pregunta.respuestas.push(data);
        pregunta.save();
        let respuestaCreada = pregunta.respuestas[pregunta.respuestas.length - 1];
        return respuestaCreada
    } catch (error) {
        throw (`imposible crear: ${error}`);
    }
}

export async function votar(pregunta, respuesta, dataUser) {
    try {
        respuesta.personas_que_respondieron.push(dataUser);
        await pregunta.save();
        return pregunta;
    } catch (error) {
        throw (`imposible actualizar: ${error}`);
    }
}

export async function getReports() {
    try {
        let data = [];

        data.push("--- cantidad de votos por pregunta ---");
        data.push(await Pregunta.aggregate([
            {
                $unwind: "$respuestas"
            },
            {
                $group: {
                    _id: {
                        pregunta: "$pregunta",
                        respuesta: "$respuestas.respuesta"
                    },
                    cantidadVotos: {
                        $sum: {
                            $size: "$respuestas.personas_que_respondieron"
                        }
                    }
                }
            },
            {
                $sort: {
                    "cantidadVotos": -1
                }
            },
            {
                $group: {
                    _id: "$_id.pregunta",
                    respuestas: {
                        $push: {
                            respuesta: "$_id.respuesta",
                            cantidadVotos: "$cantidadVotos"
                        }
                    }
                }
            }
        ]))

        return data;
    } catch (error) {
        throw (`imposible retornar ${error}`)
    }
}

// playground para mostrar cada stage del aggregate
// https://mongoplayground.net/p/FXQVtn6Il0C