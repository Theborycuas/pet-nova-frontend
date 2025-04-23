import {baseAPI} from "../../../api/config/axiosConfig.js";
import axios from "axios";

const authAPI = axios.create({
    ...baseAPI.defaults,
    baseURL: `${baseAPI.defaults.baseURL}/auth`,
})

export const authEndpoints = {
    login: "/userLogin",
    register: "/userRegister",
    refreshToken: "/refreshToken"
}

export const registerUser = (userData) => {
    return authAPI.post(authEndpoints.register, userData);
}

export const userLogin = async (username, password) => {
    try {
        const postData = {
            username,
            password,
        };
        const response = await authAPI.post(authEndpoints.login, postData);
        return processAuthResponce(response);
    } catch (error) {
        handleAuthError(error)
    }
};

const processAuthResponce = (response) => ({
    success: true,
    data: response.data,
    token: response.headers.authorization?.split(" ")[1],
    refreshToken: response.headers["refresh-token"],
    status: response.status,
    expiresIn: response.data.expiresIn
});

const handleAuthError = (error) => {
    const errorMessages = {
        403: "Usuario o contraseña incorrectos",
        500: "Error en el servidor de autenticación"
    };
    throw new Error(errorMessages[error.response?.status] || "Error de Autenticación");
};