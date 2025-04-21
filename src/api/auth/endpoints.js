import axios from "axios";

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

    } catch (error){
        if(error.response){
            throw new Error(error.response.data.message || 'Error en el Login')
        } else {
            throw new Error('Error de conexión')
        }
    }
};