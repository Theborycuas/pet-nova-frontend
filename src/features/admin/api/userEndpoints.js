import {baseAPI} from "../../../api/config/axiosConfig.js";
import axios from "axios";
import {handleAdminError} from "../../../utils/errorHandler.js";

const adminAPI = axios.create({
    ...baseAPI.defaults,
    baseURL: `${baseAPI.defaults.baseURL}/users`
})

export const userEndpoints = {
    resgisterUser: "/createUser",
    listAllUsers: "/getAllUsers",
    listAllUsersNoTenantManager: "/getAllUsersNoTenantManager",
    getUserById: (userId) => `/getUserDetailById/${userId}`,
    getUserByTenantId: (tenantId) => `/getUserByTenantId/${tenantId}`,
    updateUserDetailById: (userId) => `/updateUserDetailById/${userId}`,
    deleteUserById: (userId) => `/deleteUserById/${userId}`
    /*getUserById: (officeId) => `/getUserById/${officeId}`,
    getUsersByTenantId: (tenantId) => `/getUsersByTenantId/${tenantId}`,
    getUsersByOfficeId: (officeId) => `/getUsersByOfficeId/${officeId}`,
    getUsersByRoleId: (roleId) => `/getUsersByRoleId/${roleId}`,
    deleteUsersById: (officeId) => `/deleteUsersById/${officeId}`*/
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
        if (!error.response) {
            // Error de red (no llegó al backend)
            throw new Error('Error de conexión con el servidor');
        }
        handleAdminError(error);
        throw error;
    }
}

export const getAllUsers = async () => {
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

export const getAllUsersNoTenantManager = async () => {
    try {
        const response = await adminAPI.get(userEndpoints.listAllUsersNoTenantManager, {
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

export const getUserById = async (userId) => {
    try {
        const response = await adminAPI.get(userEndpoints.getUserById(userId), {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.data;
    } catch (error) {
        if (!error.response) {
            throw new Error('Error de conexión con el servidor');
        }
        handleAdminError(error);
        throw error;
    }
}

export const getUserByTenantId = async (tenantId) => {
    try {
        const response = await adminAPI.get(userEndpoints.getUserByTenantId(tenantId), {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.data;
    } catch (error) {
        if (!error.response) {
            throw new Error('Error de conexión con el servidor');
        }
        handleAdminError(error);
        throw error;
    }
}

export const updateUserDetailById = async (userId, userData) => {
    try {
        const response = await adminAPI.put(userEndpoints.updateUserDetailById(userId), userData);
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

export const deleteUserById = async (userId) => {
    try {
        const response = await adminAPI.put(userEndpoints.deleteUserById(userId), {
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

/*
export const updateSubscripPlan = async (planId, subscripPlanData) => {
    try {
        const response = await adminAPI.put(roleEndpoints.updateSubscripPlanById(planId), subscripPlanData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getOfficesByTenantId = async (tenantId) => {
    try {
        const response = await adminAPI.get(roleEndpoints.getOfficesByTenantId(tenantId), {
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
        const response = await adminAPI.get(roleEndpoints.getOfficeById(officeId), {
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
        const response = await adminAPI.post(roleEndpoints.deleteOfficeById(officeId), {
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