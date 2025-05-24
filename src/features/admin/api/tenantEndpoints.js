import {baseAPI} from "../../../api/config/axiosConfig.js";
import axios from "axios";
import {handleAdminError} from "../../../utils/errorHandler.js";

const adminAPI = axios.create({
    ...baseAPI.defaults,
    baseURL: `${baseAPI.defaults.baseURL}/tenants`
})

export const tenantEndpoints = {
    createTenant: "/createTenant",
    getAllTenants: "/getAllTenants",
    getTenantDetailById: (tenantId) => `/getTenantDetailById/${tenantId}`,
    getBasicTenantById: (tenantId) => `/getBasicTenantById/${tenantId}`,
    updateTenantById: (tenantId) => `/updateTenantById/${tenantId}`,
    deleteTenantById: (tenantId) => `/deleteTenantById/${tenantId}`
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

export const createTenant = async (tenantData) => {
    try {
        const response = await adminAPI.post(tenantEndpoints.createTenant, tenantData);
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

export const getAllTenants = async () => {
    try {
        const response = await adminAPI.get(tenantEndpoints.getAllTenants, {
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
export const getTenantDetailById = async (tenantId) => {
    try {
        const response = await adminAPI.get(tenantEndpoints.getTenantDetailById(tenantId), {
            headers: {
                'Content-Type': 'application/json',
            }
        });

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

export const getBasicTenantById = async (tenantId) => {
    try {
        const response = await adminAPI.get(tenantEndpoints.getBasicTenantById(tenantId), {
            headers: {
                'Content-Type': 'application/json',
            }
        });

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

export const updateTenantById = async (tenantId, tenantData) => {
    try {
        const response = await adminAPI.put(tenantEndpoints.updateTenantById(tenantId), tenantData);

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


export const deleteTenantById = async (tenantId) => {
    try {
        const response = await adminAPI.post(tenantEndpoints.deleteTenantById(tenantId), {
            headers: {
                'Content-Type': 'application/json',
            }
        });
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