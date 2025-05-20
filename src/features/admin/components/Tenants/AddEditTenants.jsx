import React, {Fragment, useEffect, useState} from "react";
//import Multistep from "react-multistep";
import {Step, Stepper} from 'react-form-stepper';

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import PageTitle from "../../../../layouts/PageTitle";
import {useDispatch} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import {createTenant, getBasicTenantById, getTenantDetailById, updateTenantById} from "../../api/tenantEndpoints.js";
import {Alerts} from "../../../../utils/alerts.js";
import {getOfficeById} from "../../api/officeEndpoints.js";

const AddEditTenants = () => {
	const {tenantId} = useParams();
	const isEditMode = Boolean(tenantId);

	const [goSteps, setGoSteps] = useState(0);
	const [formTenantData, setFormTenantData] = useState({
		//StepOne
		tenantName: '',
		address: '',
		city: '',
		contactEmail: '',
		contactPhone: '',

		//SteapTwo
		planId: '',
		currency: ''
	})
	const fieldLabels = {
		name: 'Nombre del Tenant',
		address: 'Dirección',
		city: 'Ciudad',
		contactEmail: 'Correo electrónico',
		contactPhone: 'Teléfono',
	};

	const validateStepOne = () => {
		const requiredFields = ['name', 'address', 'city', 'address', 'contactEmail', 'contactPhone'];

		for (const field of requiredFields) {
			if (!formTenantData[field] || formTenantData[field].toString().trim() === '') {
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
		if(isEditMode) {
			getBgetOfficeByIdasicTenantById(tenantId).then((response) => {
				setFormTenantData({
					...response,
				});
			}).catch((error) => {
				Alerts.showError("Error!", error.message);
			})
		}
	}, [tenantId]);

	const handleSubmit = async () => {
		try {
			let response = null;
			if(!isEditMode){
				Alerts.showLoading('Registrando Tenant', 'Guardando información...');
				response = await createTenant(formTenantData);
			} else {
				Alerts.showLoading('Editando Tenant', 'Guardando información...');
				response = await updateTenantById(tenantId, formTenantData);
			}

			Alerts.closeAlerts();
			if(!isEditMode){
				await Alerts.showSuccess('Tenant Creado!', 'El registro se completó exitosamente');
			} else {
				await Alerts.showSuccess('Tenant Editado!', 'El registro se completó exitosamente');
			}
			navigate(`/tenant-details/${response.id}`);
		}catch (error) {
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
			console.error('Error creando Tenant: ', error)
		}
	}

	return (
		<Fragment>
			<div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><Link to={"/home-admin"}>Home Admin</Link></li>
					<li className="breadcrumb-item active"><Link
						to={"#"}>{isEditMode ? "Edit tenant" : "Create tenant"}</Link></li>
				</ol>
			</div>

			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">{isEditMode ? "Editar Tenant" : "Crear Tenants"}</h4>
						</div>
						<div className="card-body">

							<div className="form-wizard ">
								<Stepper className="nav-wizard" activeStep={goSteps} label={false}>
									<Step className="nav-link" onClick={() => setGoSteps(0)}/>
									<Step className="nav-link" onClick={() => setGoSteps(1)}/>{/*
									<Step className="nav-link" onClick={() => setGoSteps(2)} />*/}
								</Stepper>
								{goSteps === 0 && (
									<>
										<StepOne formData={formTenantData} setFormData={setFormTenantData}/>
										<div className="text-end toolbar toolbar-bottom p-2">
											<button className="btn btn-primary sw-btn-next"
													onClick={() => setGoSteps(1)}>Siguiente
											</button>
										</div>
									</>
								)}
								{goSteps === 1 && (
									<>
										<StepTwo formData={formTenantData} setFormData={setFormTenantData}/>
										<div className="text-end toolbar toolbar-bottom p-2">
											<button className="btn btn-secondary sw-btn-prev me-1"
													onClick={() => setGoSteps(0)}>Anterior
											</button>
											<button className="btn btn-success ms-1" onClick={handleSubmit}>{isEditMode ? "Editar Tenant" : "Registrar Tenant"}
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

export default AddEditTenants;
