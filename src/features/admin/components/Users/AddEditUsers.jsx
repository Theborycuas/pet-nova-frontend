import React, {Fragment, useEffect, useState} from "react";
//import Multistep from "react-multistep";
import {Step, Stepper} from 'react-form-stepper';
import {useDispatch} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Alerts} from "../../../../utils/alerts.js";
import {createUser, getUserById, updateUserDetailById} from "../../api/userEndpoints.js";
import StepTwo from "./StepTwo.jsx";
import StepOne from "./StepOne.jsx";

const AddEditUsers = () => {
    const {userId} = useParams();
    const isEditMode = Boolean(userId);

    const [goSteps, setGoSteps] = useState(0);
    const [formData, setFormData] = useState({
        //StepOne
        name: '',
        idNumber: '',
        city: '',
        address: '',
        email: '',
        phoneNumber: '',
        avatarUrl: '',

        //StepTwo
        role: null,
        officeId: '',
        tenantId: ''
    })
    const fieldLabels = {
        name: 'Nombre',
        idNumber: 'Cédula',
        city: 'Ciudad',
        address: 'Dirección',
        email: 'Correo electrónico',
        phoneNumber: 'Teléfono'
    };

    const validateStepOne = () => {
        const requiredFields = ['name', 'idNumber', 'city', 'address', 'email', 'phoneNumber'];

        for (const field of requiredFields) {
            if (!formData[field] || formData[field].toString().trim() === '') {
                const friendlyName = fieldLabels[field] || field;
                Alerts.showError('Campo requerido', `El campo "${friendlyName}" no puede estar vacío.`);
                return false;
            }
        }

        return true;
    };


    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditMode) {
            getUserById(userId).then((response) => {
                setFormData({
                    ...response,
                    role: {
                        value: response.role.id,
                        label: response.role.roleName.replace(/_/g, ' ')
                    },
                    officeId: response.officeId || '',
                    tenantId: response.tenantId || ''
                });
            }).catch((error) => {
                Alerts.showError("Error!", error.message);
            })
        }
    }, [userId]);

    const handleSubmit = async () => {
        const startTime = Date.now();
        try {
            if (!isEditMode) {
                Alerts.showLoading('Registrando Usuario', 'Guardando información...');
                const response = await createUser(formData);
            } else {
                Alerts.showLoading('Editando Usuario', 'Guardando información...');
                const response = await updateUserDetailById(userId, formData);
            }

            const elapsed = Date.now() - startTime;
            if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));

            Alerts.closeAlerts();
            if (!isEditMode) {
                await Alerts.showSuccess('Usuario creado!', 'El registro se completó exitosamente');
            } else {
                await Alerts.showSuccess('Usuario Editado!', ' La Edición se completó exitosamente');
            }

            navigate('/user-admin');
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
            console.error('Error creando el Usuario: ', error)
        }
    }

    return (
        <Fragment>
            <div className="page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to={"/user-admin"}>User Admin</Link></li>
                    <li className="breadcrumb-item active"><Link
                        to={"#"}>{isEditMode ? "Edit user" : "Create User"}</Link></li>
                </ol>
            </div>

            <div className="row">
                <div className="col-xl-12 col-xxl-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">{isEditMode ? "Editar Usuario" : "Crear Usuario"}</h4>
                        </div>
                        <div className="card-body">

                            <div className="form-wizard ">
                                <Stepper className="nav-wizard" activeStep={goSteps} label={false}>
                                    <Step className="nav-link" onClick={() => setGoSteps(0)}/>
                                    <Step className="nav-link" onClick={() => setGoSteps(1)}/>
                                </Stepper>
                                {goSteps === 0 && (
                                    <>
                                        <StepOne formData={formData} setFormData={setFormData}/>
                                        <div className="text-end toolbar toolbar-bottom p-2">
                                            <Link className="btn btn-danger sw-btn-prev me-1"
                                                  to={"/user-admin"}>Cancelar
                                            </Link>
                                            <button
                                                className="btn btn-primary sw-btn-next"
                                                onClick={() => {
                                                    if (validateStepOne()) {
                                                        setGoSteps(1);
                                                    }
                                                }}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </>
                                )}
                                {goSteps === 1 && (
                                    <>
                                        <StepTwo formData={formData} setFormData={setFormData}/>
                                        <div className="text-end toolbar toolbar-bottom p-2">
                                            <button className="btn btn-secondary sw-btn-prev me-1"
                                                    onClick={() => setGoSteps(0)}>Anterior
                                            </button>
                                            <button className="btn btn-success ms-1"
                                                    onClick={handleSubmit}>{isEditMode ? "Editar " : "Registrar "}
                                                Usuario
                                            </button>
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AddEditUsers;
