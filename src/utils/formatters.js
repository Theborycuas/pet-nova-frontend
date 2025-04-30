export const formatDateTimeUtils = (dateString) => {
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

export const formatDateUtils = (dateString) => {
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

