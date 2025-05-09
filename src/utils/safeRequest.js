import { handleAdminError } from "./errorHandler";

/**
 *
 * @param {Function} axiosCall - Función que retorna una Promise de Axios (NO la ejecutes antes de pasarla)
 * @param {Object} [options] - Configuraciones adicionales (por ejemplo, logging)
 * @returns {Promise<any>}
 */
export const safeRequest = async (axiosCall, options = {}) => {
    const { log = false } = options;

    try {
        const response = await axiosCall();

        if (log) {
            console.log("✅ API Response:", response);
        }

        return response.data;
    } catch (error) {
        if (log) {
            console.error("❌ API Error:", error);
        }

        handleAdminError(error); // Esto lanza un Error con mensaje limpio
    }
};