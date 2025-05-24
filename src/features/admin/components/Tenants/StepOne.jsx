import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import {cityOptions} from "../../../../utils/cityOptions.js";
import {createUser, getAllUsers, getAllUsersNoTenantManager} from "../../api/userEndpoints.js";
import {Modal} from "react-bootstrap";
import {Alerts} from "../../../../utils/alerts.js";

const StepOne = ({formData: formTenantData, setFormData: setFormTenantData, isEditMode}) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [postModal, setPostModal] = useState(false);
    const [formUserData, setFormUserData] = useState({
        name: '',
        idNumber: '',
        city: '',
        address: '',
        email: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormTenantData(prev => ({...prev, [name]: value}));
    };

    const handleUserChange = (e) => {
        const {name, value} = e.target;
        setFormUserData(prev => ({...prev, [name]: value}));
    };

    const handleCityChange = (selectedOption) => {
        setFormTenantData((prev) => ({
            ...prev,
            city: selectedOption ? selectedOption.label : null
        }));
    };

    const handleCityUserChange = (selectedOption) => {
        setFormUserData((prev) => ({
            ...prev,
            city: selectedOption ? selectedOption.label : null
        }));
    };

    const loadAllUser = async () => {
        setLoading(true);
        setError(null);
        try {

            const response = await getAllUsersNoTenantManager("TENANT"); // solo los disponibles
            const data = response.data;

            const formattedUsers = data.map(user => ({
                value: user.id,
                label: user.name,
            }));
            const sortedUsers = formattedUsers.sort((a, b) => a.label.localeCompare(b.label));
            setUsers(sortedUsers);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAllUser();
    }, []);

    const userOptions = [
        {value: "add-user", label: "➕ Agregar usuario"},
        ...users
    ];

    function handleCreateUser() {
        setPostModal(true);
    }

    const handleSubmitSaveUser = async (e) => {
        e.preventDefault();
        try {
            Alerts.showLoading('Registrando Usuario', 'Guardando Información');

            const response = await createUser(formUserData);

            Alerts.closeAlerts();
            await Alerts.showSuccess('Usuario creado!', 'El registro se completó exitosamente');

            const {data} = await getAllUsers();
            const formattedUsers = data.map(user => ({
                value: user.id,
                label: user.name,
            }));
            setUsers(formattedUsers);

            const newUserOption = formattedUsers.find(u => u.value === response.id);

            setFormTenantData(prev => ({
                ...prev,
                managerIds: [...(prev.managerIds || []), newUserOption.value]
            }));

            setPostModal(false);
        } catch (error) {
            Alerts.closeAlerts();
            if (!error.response) {
                // Error de conexión (no hay respuesta del backend)
                console.error('Error de red:', error.message);
                Alerts.showConnectionError();
            } else {
                // Error del servidor (4xx/5xx)
                const errorMessage = error.response.data?.message || 'Error desconocido';
                Alerts.showError('Error en el servidor', errorMessage);
            }
            console.error('Error creando Usuario: ', error)
        }
    }


    return (
        <section>
            <div className="row">
                <div className="col-lg-6 mb-2">
                    <div className="form-group mb-3">
                        <label className="text-label">Nombre del Tenant <span className="required">*</span></label>
                        <input
                            type="text"
                            name="tenantName"
                            className="form-control"
                            placeholder="Clinica del Gato"
                            value={formTenantData.tenantName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {loading && users && (
                    <div className="text-center my-5">
                        <div className="spinner-grow text-success" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando información del tenant...</p>
                    </div>
                )}
                {!loading && users && (
                    <div className="col-lg-6 mb-2">
                        <div className="form-group mb-3">
                            <label className="text-label">Administrador <span className="required">*</span></label>
                            <Select
                                name="managerIds"
                                options={userOptions}
                                value={
                                    Array.isArray(formTenantData.managerIds)
                                        ? users.filter(user => formTenantData.managerIds.includes(user.value))
                                        : []
                                }
                                onChange={(selectedOptions) => {
                                    const selected = selectedOptions || [];
                                    const isAddUser = selected.some(opt => opt.value === "add-user");

                                    if (isAddUser) {
                                        handleCreateUser();
                                        return;
                                    }

                                    setFormTenantData(prev => ({
                                        ...prev,
                                        managerIds: selected.map(opt => opt.value),
                                    }));
                                }}
                                isMulti
                                isClearable
                                placeholder="Selecciona uno o varios administradores"
                                styles={{
                                    control: base => ({
                                        ...base,
                                        lineHeight: '40px',
                                        color: '#7e7e7e',
                                        paddingLeft: '15px'
                                    })
                                }}
                            />

                        </div>
                    </div>
                )}
                {error && !users && (
                    <div className="alert alert-danger">{error}</div>
                )}
                <div className="col-lg-6 mb-2">
                    <div className="form-group mb-3">
                        <label className="text-label">Ciudad <span className="required">*</span></label>
                        <Select
                            name="city"
                            options={cityOptions}
                            value={cityOptions.find(opt => opt.label === formTenantData.city) || null}
                            onChange={handleCityChange}
                            isClearable
                            placeholder="Selecciona una ciudad"
                            styles={{
                                control: base => ({
                                    ...base,
                                    lineHeight: '40px',
                                    color: '#7e7e7e',
                                    paddingLeft: '15px'
                                })
                            }}
                        />
                    </div>
                </div>
                <div className="col-lg-6 mb-2">
                    <div className="form-group mb-3">
                        <label className="text-label">Dirección <span className="required">*</span></label>
                        <input
                            type="text"
                            name="address"
                            className="form-control"
                            placeholder="6 de Diciembre 125 y Patria"
                            value={formTenantData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-6 mb-2">
                    <div className="form-group mb-3">
                        <label className="text-label">Email <span className="required">*</span></label>
                        <input
                            type="email"
                            name="contactEmail"
                            className="form-control"
                            id="inputGroupPrepend2"
                            aria-describedby="inputGroupPrepend2"
                            placeholder="example@example.com"
                            value={formTenantData.contactEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-6 mb-2">
                    <div className="form-group mb-3">
                        <label className="text-label">Teléfono <span className="required">*</span></label>
                        <input
                            type="number"
                            name="contactPhone"
                            className="form-control"
                            placeholder="0996588446"
                            value={formTenantData.contactPhone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="mb-sm-5 mb-3 d-flex flex-wrap align-items-center text-head">
                {/* <!-- Modal --> */}
                <Modal className="modal fade" show={postModal} onHide={setPostModal} size={'lg'}>
                    <div className="">
                        <div className="">
                            <form>
                                <div className="modal-header">
                                    <h4 className="modal-title fs-20">Agregar Usuario</h4>
                                    <button type="button" className="btn close lineheight1"
                                            onClick={() => setPostModal(false)}>
                                        <span>×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmitSaveUser}>
                                        <div className="row">
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="text-label">Nombre del Usuario <span
                                                        className="required">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        className="form-control"
                                                        placeholder="José Armas"
                                                        value={formUserData.name}
                                                        onChange={handleUserChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="text-label">Cédula <span
                                                        className="required">*</span></label>
                                                    <input
                                                        type="number"
                                                        name="idNumber"
                                                        className="form-control"
                                                        placeholder="1711251482"
                                                        value={formUserData.idNumber}
                                                        onChange={handleUserChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="text-label">Teléfono <span
                                                        className="required">*</span></label>
                                                    <input
                                                        type="number"
                                                        name="phoneNumber"
                                                        className="form-control"
                                                        placeholder="0996588446"
                                                        value={formUserData.phoneNumber}
                                                        onChange={handleUserChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="text-label">Email <span
                                                        className="required">*</span></label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control"
                                                        id="inputGroupPrepend2"
                                                        aria-describedby="inputGroupPrepend2"
                                                        placeholder="example@example.com"
                                                        value={formUserData.email}
                                                        onChange={handleUserChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-2">
                                                <div className="form-group mb-3">
                                                    <label className="text-label">Ciudad <span
                                                        className="required">*</span></label>
                                                    <Select
                                                        name="city"
                                                        options={cityOptions}
                                                        value={cityOptions.find(opt => opt.label === formUserData.city) || null}
                                                        onChange={handleCityUserChange}
                                                        isClearable
                                                        placeholder="Selecciona una ciudad"
                                                        styles={{
                                                            control: base => ({
                                                                ...base,
                                                                lineHeight: '40px',
                                                                color: '#7e7e7e',
                                                                paddingLeft: '15px'
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-12">
                                                <div className="form-group">
                                                    <label className="text-label">Dirección <span
                                                        className="required">*</span></label>
                                                    <textarea className="form-control"
                                                              name="address"
                                                              placeholder="6 de Diciembre 125 y Patria"
                                                              value={formUserData.address}
                                                              onChange={handleUserChange}
                                                              required
                                                              rows="3">

                                           </textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary" onClick={handleSubmitSaveUser}>
                                        Crear Usuario
                                    </button>
                                    <button type="button" onClick={() => setPostModal(false)}
                                            className="btn btn-danger"><i
                                        className="flaticon-delete-1"></i> Cancelar
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </Modal>
            </div>
        </section>
    );
};

StepOne.propTypes = {
    formData: PropTypes.shape({
        tenantName: PropTypes.string.isRequired,
        managerIds: PropTypes.arrayOf(PropTypes.number),
        city: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        contactEmail: PropTypes.string.isRequired,
        contactPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired
};

export default StepOne;
