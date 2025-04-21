import axios from "axios";
import {loadingToggleAction} from "../../store/actions/AuthActions.js";

const authAPI = axios.create({
    baseURL: 'http://localhost:8080/apiPetNova/auth',
    headers: {"Content-Type": 'application/json'}
});

export const registerUser = (userData) => {
    return authAPI.post('/userRegister', userData);
}

export const userLogin = async (username, password) => {
    try {
        const postData = {
            username,
            password,
        };
        const response = await authAPI.post('/userLogin', postData);

        // Obtener el token del header (Axios usa headers en minúsculas)
        const token = response.headers['authorization']?.split(' ')[1]; // Extrae el token sin "Bearer "


        return {
            success: true,
            data: response.data,
            token: token,
            status: response.status,
            expiresIn: response.data.expiresIn
        };

    } catch (error) {
        if (error.response) {
            if (error.response.status === 403) {
                const errorMessage = error.response.data.message || 'Usuario o contraseña incorrectos';
                throw new Error(errorMessage);  // Mensaje personalizado del backend
            }
            throw new Error(error.response.data.message || 'Error en el servidor');
        } else if (error.request) {
            throw new Error('No hay conexión con el servidor');
        } else {
            throw new Error('Error en la configuración de la solicitud');
        }
    }
};