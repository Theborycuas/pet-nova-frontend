import axios from "axios";

const authAPI = axios.create({
    baseURL: 'http://localhost:8080/apiPetNova/auth',
    headers: {"Content-Type": 'application/json'}
});

export const registerUser = (userData) => {
    return authAPI.post('/userRegister', userData);
}