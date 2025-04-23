import { getAllTenants } from "../api/adminEndpoints.js";

export function getAllTenantsList(){

    return async (dispatch) => {
        try {
            const response = await getAllTenants();
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
