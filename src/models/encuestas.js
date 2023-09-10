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

        const usuarioYaVoto = respuesta.personas_que_respondieron.some(persona => persona.name === dataUser.name);

        if (!usuarioYaVoto) {
            respuesta.personas_que_respondieron.push(dataUser);
            await pregunta.save();
        } else {
            throw new Error('El usuario ya votó en esta respuesta');
        }

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