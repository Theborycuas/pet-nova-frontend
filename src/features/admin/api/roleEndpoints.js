import {baseAPI} from "../../../api/config/axiosConfig.js";
import axios from "axios";
import {handleAdminError} from "../../../utils/errorHandler.js";

const adminAPI = axios.create({
    ...baseAPI.defaults,
    baseURL: `${baseAPI.defaults.baseURL}/roles`
})

export const roleEndpoints = {
    listAllRoles: "/getAllRoles",
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

export const getAllRoles = async () =>{
    try {
        const response = await adminAPI.get(roleEndpoints.listAllRoles, {
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