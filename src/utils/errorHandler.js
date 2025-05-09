export const handleAdminError = (error) => {
    let message = "Error desconocido";

    if (error.response) {
        // El servidor respondió con un código de error
        const status = error.response.status;
        const errorMessages = {
            400: "Solicitud inválida. Verifica los datos.",
            401: "No autorizado. Verifica tus credenciales.",
            403: "Acceso denegado. No tienes permisos.",
            404: "Recurso no encontrado.",
            500: "Error interno del servidor.",
            502: "Bad Gateway. Servicio intermedio falló.",
            503: "Servicio no disponible. Intenta más tarde.",
        };
        message = errorMessages[status] || `Error ${status}: ${error.response.statusText}`;

        // Si hay mensaje detallado del backend (por ejemplo, error de validación)
        if (error.response.data?.message) {
            message = error.response.data.message;
        }

    } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        message = "No hay conexión con el servidor. Verifica tu red o intenta más tarde.";
    } else {
        // Otro tipo de error (setup, código JS, etc.)
        message = error.message;
    }

    throw new Error(message);
};