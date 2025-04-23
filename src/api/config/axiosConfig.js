import axios from "axios";
import {loadingToggleAction} from "../../store/actions/AuthActions.js";

export const baseConfig = {
    baseURL: "http://localhost:8080/apiPetNova",
    headers: {
        "Content-Type": "application/json",
    },
};

export const baseAPI = axios.create(baseConfig);


baseAPI.interceptors.request.use(config => {
    loadingToggleAction(true);
    return config;
});

baseAPI.interceptors.response.use(
    response => {
        loadingToggleAction(false);
        return response;
    },
    error => {
        loadingToggleAction(false);
        return Promise.reject(error)
    }
);