import {
    LOADING_TOGGLE_ACTION,
    LOGIN_CONFIRMED_ACTION,
    LOGIN_FAILED_ACTION,
    LOGOUT_ACTION,
    SIGNUP_CONFIRMED_ACTION,
    SIGNUP_FAILED_ACTION,
    CLEAR_AUTH_ERROR_ACTION

} from '../actions/AuthActions';

const initialState = {
    auth: {
        email: '',
        idToken: '',
        localId: '',
        expiresIn: '',
        refreshToken: '',
        role: '',
        officeId: '',
    },
    errorMessage: '',
    successMessage: '',
    showLoading: false,
};

export function AuthReducer(state = initialState, action) {
    switch (action.type) {
        case SIGNUP_CONFIRMED_ACTION:
            return {
                ...state,
                auth: action.payload,
                errorMessage: '',
                successMessage: 'Signup Successfully Completed',
                showLoading: false,
            };

        case LOGIN_CONFIRMED_ACTION:
            return {
                ...state,
                auth: action.payload,
                errorMessage: '',
                successMessage: 'Login Successfully Completed',
                showLoading: false,
            };

        case LOGOUT_ACTION:
            return {
                ...state,
                errorMessage: '',
                successMessage: '',
                auth: {
                    email: '',
                    idToken: '',
                    localId: '',
                    expiresIn: '',
                    refreshToken: '',
                    role: '',
                    officeId: '',
                },
            };

        case SIGNUP_FAILED_ACTION:
        case LOGIN_FAILED_ACTION:
            return {
                ...state,
                errorMessage: action.payload,
                successMessage: '',
                showLoading: false,
            };

        case CLEAR_AUTH_ERROR_ACTION:
            return {
                ...state,
                errorMessage: '',
            };

        case LOADING_TOGGLE_ACTION:
            return {
                ...state,
                showLoading: action.payload,
            };

        default:
            return state;
    }
}

    
