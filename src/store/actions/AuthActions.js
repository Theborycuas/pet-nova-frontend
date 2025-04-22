import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
    signUp,
} from '../../features/auth/services/AuthService.js';

import { userLogin } from '../../features/auth/api/authEndpoints.js';
import {getAllTenantsList} from "../../features/admin/services/AdminServices.js";
import {getAllTenants} from "../../features/admin/api/adminEndpoints.js";


export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';
export const NAVTOGGLE = 'NAVTOGGLE';

export const CLEAR_AUTH_ERROR_ACTION = 'CLEAR_AUTH_ERROR';

export function signupAction(email, password, navigate) {
	
    return (dispatch) => {
        signUp(email, password)
        .then((response) => {
            saveTokenInLocalStorage(response.data);
            runLogoutTimer(
                dispatch,
                response.data.expiresIn * 1000,            
            );
            dispatch(confirmedSignupAction(response.data));
            navigate('/dashboard');			
        })
        .catch((error) => {
            const errorMessage = formatError(error.response.data);
            dispatch(signupFailedAction(errorMessage));
        });
    };
}

export function Logout(navigate) {
	localStorage.removeItem('userDetails');
    navigate('/login');
    
	return {
        type: LOGOUT_ACTION,
    };
}

export function loginAction(credentials, navigate) {
    return (dispatch) => {
        dispatch(clearAuthErrorAction());
        userLogin(credentials.username, credentials.password)
            .then(async (response) => {
                saveTokenInLocalStorage(response.data);
                runLogoutTimer(
                    dispatch,
                    response.data.expiresIn * 1000,
                    navigate,
                );
                dispatch(loginConfirmedAction(response.data));

                try {
                    await dispatch(getAllTenants()).then((response) => {
                        sessionStorage.setItem('cachedTenants', JSON.stringify(response.data))
                    });
                } catch (tenantsError) {
                    console.error("Falló carga de tenants:", tenantsError);
                    dispatch({
                        type: 'TENANTS_ERROR',
                        payload: "No se pudo cargar la lista de offices"
                    });
                    // Mostrar toast/notificación
                }
                navigate('/home-admin');
            })
            .catch((error) => {
                // Manejar el error y detener el loading
                const errorMessage = error.message || "Error en el login"; // Usa el mensaje del backend o uno por defecto
                dispatch(loginFailedAction(errorMessage));
            })
            .finally(() => {
                // Siempre detener el loading, tanto en éxito como en error
                dispatch(loadingToggleAction(false)); // <-- Esto detiene el spinner en cualquier caso
            });
    };
}

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function confirmedSignupAction(payload) {
    return {
        type: SIGNUP_CONFIRMED_ACTION,
        payload,
    };
}

export function signupFailedAction(message) {
    return {
        type: SIGNUP_FAILED_ACTION,
        payload: message,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}

export const navtoggle = () => {
    return {        
      type: 'NAVTOGGLE',
    };
};

export const clearAuthErrorAction = () => ({
    type: CLEAR_AUTH_ERROR_ACTION
});
