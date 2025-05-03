import Swal from 'sweetalert2';

export const Alerts = {
    showLoading: (title = "Procesando...", text = "Por favor espere") => {
        Swal.fire({
            title: title,
            text: text,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        return Swal; // Devolvemos la instancia para poder cerrarla
    },

    showSuccess: (title = "Éxito!", text = "Operación completada") => {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 2500
        });
    },

    showError: (title = "Error!", text = "Algo salió mal") => {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'Entendido'
        });
    },

    showConnectionError: () => {
        return Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            html: `
        <div style="text-align: left">
          <p>No se pudo establecer conexión con el servidor.</p>
          <ul style="list-style-type: none; padding-left: 0">
            <li>✓ Verifica tu conexión a internet</li>
            <li>✓ Intenta recargar la página</li>
            <li>✓ Si persiste el error, contacta al soporte</li>
          </ul>
        </div>
      `,
            confirmButtonText: 'Reintentar',
            confirmButtonColor: '#3085d6',
            showCancelButton: true,
            cancelButtonText: 'Cerrar'
        });
    },


    /**
     * Muestra una confirmación de borrado. Si el usuario confirma,
     * ejecuta el callback `onConfirm`.
     *
     * @param {string} entity  — nombre de la entidad (p.ej. 'tenant', 'office')
     * @param {Function} onConfirm — función a ejecutar si confirma
     */
    confirmDelete: (entity, onConfirm) => {
        Swal.fire({
            title: `¿Realmente desea eliminar el ${entity}?`,
            text: `Esta acción eliminará permanentemente el ${entity}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            focusCancel: true,
            customClass: {
                popup: 'rounded-2xl shadow-lg',    // ejemplo de styling Tailwind
                confirmButton: 'btn btn-danger',    // si usas clases CSS propias
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                onConfirm();
            } else {
                // opcional: podrías notificar que se canceló
                // Swal.fire('Operación cancelada', '', 'info');
            }
        });
    }

};