import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import {createUser, getAllUsers, getAllUsersNoTenantManager} from "../../api/userEndpoints.js";
import {Alerts} from "../../../../utils/alerts.js";
import {Modal} from "react-bootstrap";
import {cityOptions} from "../../../../utils/cityOptions.js";
import user from "../../../../assets/images/task/user.jpg";
import {getAllTenants} from "../../api/tenantEndpoints.js";

const StepOne = ({formData: formOfficeData, setFormData: setFormOfficeData}) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [users, setUsers] = useState([]);
    const [tenants, setTenants] = useState([]);
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
        setFormOfficeData(prev => ({...prev, [name]: value}));
    };

    const handleUserChange = (e) => {
        const {name, value} = e.target;
        setFormUserData(prev => ({...prev, [name]: value}));
    };

    const handleCityChange = (selectedOption) => {
        setFormOfficeData((prev) => ({
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
            const {data} = await getAllUsersNoTenantManager("OFFICE");
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

    const loadAllTenants = async () => {
        setLoading(true);
        setError(null);
        try {
            const {data} = await getAllTenants();
            const formattedTenants = data.map(tenant => ({
                value: tenant.id,
                label: tenant.tenantName,
            }));

            const sortedTenants = formattedTenants.sort((a, b) => a.label.localeCompare(b.label));
            setTenants(sortedTenants);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAllUser();
        loadAllTenants();
    }, []);


    const userOptions = [
        {value: "add-user", label: "➕ Agregar usuario"},
        ...users
    ];

    const tenantOptions = [
        {value: "add-tenant", label: "➕ Agregar tenant"},
        ...tenants
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

            setFormOfficeData(prev => ({
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


    //For Image upload in ListBlog
    const [file, setFile] = React.useState(null)
    const fileHandler = (e) => {
        setFile(e.target.files[0]);
        setTimeout(function () {
            var src = document.getElementById("saveImageFile").getAttribute("src");
        }, 200);
    }

    return (
        <section>
            <div className="row">
                <div className="row">
                    <div className="image-placeholder">
                        <div className="avatar-edit">
                            <input type="file" onChange={fileHandler} id="imageUpload"
                                   onClick={(event) => setFile(event.target.value)}
                            />
                            <label htmlFor="imageUpload" name=''></label>
                        </div>
                        <div className="avatar-preview">
                            <div id="imagePreview">
                                <img id="saveImageFile" src={file ? URL.createObjectURL(file) : user}
                                     alt={file ? file.name : null}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 mb-2">
                    <div className="form-group mb-3">
                        <label className="text-label">Nombre del Consultorio <span className="required">*</span></label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Veterinaria Pet Lovers"
                            value={formOfficeData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {!loading && users && (
                    <div className="col-lg-6 mb-2">
                        <div className="form-group mb-3">
                            <label className="text-label">Administrador <span className="required">*</span></label>
                            <Select
                                name="managerIds"
                                options={userOptions}
                                value={
                                    Array.isArray(formOfficeData.managerIds)
                                        ? users.filter(user => formOfficeData.managerIds.includes(user.value))
                                        : []
                                }
                                onChange={(selectedOptions) => {
                                    const selected = selectedOptions || [];
                                    const isAddUser = selected.some(opt => opt.value === "add-user");

                                    if (isAddUser) {
                                        handleCreateUser();
                                        return;
                                    }

                                    setFormOfficeData(prev => ({
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
                <div className="col-lg-6 mb-2">
                    <div className="form-group mb-3">
                        <label className="text-label">Ruc <span className="required">*</span></label>
                        <input
                            type="number"
                            name="taxId"
                            className="form-control"
                            placeholder="1711251482001"
                            value={formOfficeData.taxId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {error && !tenants && (
                    <div className="alert alert-danger">{error}</div>
                )}
                {!loading && (
                    <div className="col-lg-6 mb-2">
                        <div className="form-group mb-3">
                            <label className="text-label">Tenant <span className="required">*</span></label>
                            <Select
                                name="tenantId"
                                options={tenantOptions}
                                value={
                                    tenantOptions.find(tenant => tenant.value === formOfficeData.tenantId) || null
                                }
                                onChange={(selectedOption) => {
                                    if (selectedOption?.value === "add-tenant") {
                                        // handleCreateTenant();
                                        return;
                                    }

                                    setFormOfficeData(prev => ({
                                        ...prev,
                                        tenantId: selectedOption ? selectedOption.value : null,
                                    }));
                                }}
                                isClearable
                                placeholder="Selecciona un tenant"
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
                {error && !tenants && (
                    <div className="alert alert-danger">{error}</div>
                )}
                <div className="col-lg-6 mb-2">
                    <div className="form-group mb-3">
                        <label className="text-label">Ciudad <span className="required">*</span></label>
                        <Select
                            name="city"
                            options={cityOptions}
                            value={cityOptions.find(opt => opt.label === formOfficeData.city) || null}
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
                            value={formOfficeData.address}
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
        name: PropTypes.string.isRequired,
        managerIds: PropTypes.string.isRequired,
        tenantId: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        taxId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        logoUrl: PropTypes.string.isRequired
    }).isRequired,
    setFormData: PropTypes.func.isRequired
};

export default StepOne;
