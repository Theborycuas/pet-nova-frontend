import {baseAPI} from "../../../api/config/axiosConfig.js";
import axios from "axios";

const adminAPI = axios.create({
    ...baseAPI.defaults,
    baseURL: `${baseAPI.defaults.baseURL}/offices`
})

export const adminEndpoints = {
    resgisterTenants: "/resgisterOffice",
    listAllTenants: "/listAllOffice",
    getTenantsById: "/getOfficeById"
}


adminAPI.interceptors.request.use((config) => {

    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getAllTenants = async () =>{
    try {
        const response = await adminAPI.get(adminEndpoints.listAllTenants, {
            headers: {
                'Content-Type': 'application/json',
            },
            transformResponse: [data => data], // Evita transformación automática
        });
        return response;
    } catch (error) {
        if (!error.response) {
            // Error de red (no llegó al backend)
            throw new Error('Error de conexión con el servidor');
        }
        handleAdminError(error);
        throw error;
    }
};

const handleAdminError = (error) =>{
    const errorMessages = {
        403: "Usuario o contraseña incorrectos",
        500: "Error en el servidor de autenticación"
    };
    throw new Error(errorMessages[error.response?.status] || "Error de Autenticación");
}

function getToken() {
    try {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        return userDetails?.idToken || null; // Devuelve null si no existe
    } catch (error) {
        console.error('Error al leer el token:', error);
        return null;
    }
}

export default adminAPI;