import {baseAPI} from "../../../api/config/axiosConfig.js";
import axios from "axios";
import {handleAdminError} from "../../../utils/errorHandler.js";

const adminAPI = axios.create({
    ...baseAPI.defaults,
    baseURL: `${baseAPI.defaults.baseURL}/offices`
})

export const officeEndpoints = {
    resgisterOffice: "/resgisterOffice",
    listAllOffices: "/listAllOffice",
    getOfficeById: (officeId) => `/getOfficeById/${officeId}`,
    getOfficesByTenantId: (tenantId) => `/getOfficesByTenantId/${tenantId}`,
    deleteOfficeById: (officeId) => `/deleteOfficeById/${officeId}`
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

export const createOffice = async (officeData) => {
    try {
        const response = await adminAPI.post(officeEndpoints.resgisterOffice, officeData);
        return response.data;
    } catch (error) {
        if (!error.response) {
            // Error de red (no llegó al backend)
            throw new Error('Error de conexión con el servidor');
        }
        handleAdminError(error);
        throw error;
    }
}

export const getAllOffices = async () =>{
    try {
        const response = await adminAPI.get(officeEndpoints.listAllOffices, {
            headers: {
                'Content-Type': 'application/json',
            },
            transformResponse: [(data) => {
                const parsedData = JSON.parse(data); // Parsea la respuesta manualmente
                return Array.isArray(parsedData) ? parsedData : []; // Fuerza un array
            }],
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

export const getOfficesByTenantId = async (tenantId) => {
    try {
        const response = await adminAPI.get(officeEndpoints.getOfficesByTenantId(tenantId), {
            headers:{
                'Content-Type': 'application/json',
            }
            });
        return response.data;
    } catch (error){
        if(!error.response){
            throw new Error('Error de conexión con el servidor');
        }
        handleAdminError(error);
        throw error;
    }
}

export const getOfficeById = async (officeId) =>{
    try {
        const response = await adminAPI.get(officeEndpoints.getOfficeById(officeId), {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error){
        if (!error.response) {
            // Error de red (no llegó al backend)
            throw new Error('Error de conexión con el servidor');
        }
        handleAdminError(error);
        throw error;
    }
}

export const deleteOfficeById = async (officeId) => {
    try {
        const response = await adminAPI.post(officeEndpoints.deleteOfficeById(officeId), {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error){
        if (!error.response) {
            // Error de red (no llegó al backend)
            throw new Error('Error de conexión con el servidor');
        }
        handleAdminError(error);
        throw error;
    }
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