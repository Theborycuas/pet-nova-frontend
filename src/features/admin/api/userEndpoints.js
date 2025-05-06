import {baseAPI} from "../../../api/config/axiosConfig.js";
import axios from "axios";

const adminAPI = axios.create({
    ...baseAPI.defaults,
    baseURL: `${baseAPI.defaults.baseURL}/users`
})

export const userEndpoints = {
    resgisterUser: "/createUser",
    listAllUsers: "/getAllUsers",
    /*getOfficeById: (officeId) => `/getOfficeById/${officeId}`,
    getOfficesByTenantId: (tenantId) => `/getOfficesByTenantId/${tenantId}`,
    deleteOfficeById: (officeId) => `/deleteOfficeById/${officeId}`*/
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

export const createUser = async (userData) => {
    try {
        const response = await adminAPI.post(userEndpoints.resgisterUser, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getAllUsers = async () =>{
    try {
        const response = await adminAPI.get(userEndpoints.listAllUsers, {
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

/*
export const updateSubscripPlan = async (planId, subscripPlanData) => {
    try {
        const response = await adminAPI.put(userEndpoints.updateSubscripPlanById(planId), subscripPlanData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getOfficesByTenantId = async (tenantId) => {
    try {
        const response = await adminAPI.get(userEndpoints.getOfficesByTenantId(tenantId), {
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
        const response = await adminAPI.get(userEndpoints.getOfficeById(officeId), {
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
        const response = await adminAPI.post(userEndpoints.deleteOfficeById(officeId), {
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
}*/

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