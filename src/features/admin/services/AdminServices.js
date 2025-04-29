import { getAllOffices } from "../api/officeEndpoints.js";

export function getAllTenantsList(){

    return async (dispatch) => {
        try {
            const response = await getAllOffices();
            const listTenant = response.data;

            dispatch({
                type: 'TENANTS_LOADED',
                payload: listTenant
            });

        } catch (error) {
            console.error("Error al cargar tenants:", error);
            throw error; // Esto permitirá que el .catch en loginAction lo atrape
        }
    };
}
