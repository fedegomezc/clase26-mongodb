import { getReports } from '../models/encuestas.js';

export const getReport = async (req, res) => {
    try {
        const reports = await getReports()
        return res.status(200).json({ msj: "todos los reportes", reports: reports });
    } catch (error) {
        return res.status(500).json({ msj: "error inesperado" })
    }

}