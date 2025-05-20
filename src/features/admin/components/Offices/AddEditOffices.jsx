import React, {Fragment, useEffect, useState} from "react";
//import Multistep from "react-multistep";
import {Step, Stepper} from 'react-form-stepper';

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import PageTitle from "../../../../layouts/PageTitle";
import {useDispatch} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import {createOffice, getOfficeById, updateOfficeById} from "../../api/officeEndpoints.js";
import {Alerts} from "../../../../utils/alerts.js";
import {updateTenantById} from "../../api/tenantEndpoints.js";

const AddEditOffices = () => {
	const { officeId } = useParams();
	const isEditMode = Boolean(officeId);

	const [goSteps, setGoSteps] = useState(0);
	const [formOfficeData, setFormOfficeData] = useState({
		//StepOne
		name: '',
		address: '',
		taxId: '',
		logoUrl: '',

		//StepTwo
		contactEmail: '',
		contactPhone: '',
		managerName: '',
		managerPhone: '',
		managerEmail: '',

		//Steap Three
		currentPlan: '',
		currency: ''
	})

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if(isEditMode) {
			getOfficeById(officeId).then((response) => {
				setFormOfficeData(response);
			}).catch((error) => {
				Alerts.showError("Error!", error.message);
			})
		}
	}, [officeId]);

	const handleSubmit = async () => {
		try {
			let response = null;
			if(!isEditMode){
				Alerts.showLoading('Registrando Consultorio', 'Guardando información...');
				await createOffice(formOfficeData);
			} else {
				Alerts.showLoading('Editando Consultorio', 'Guardando información...');
				await updateOfficeById(officeId, formOfficeData);
			}


			Alerts.closeAlerts();
			if(!isEditMode){
				await Alerts.showSuccess('Consultorio Creado!', 'El registro se completó exitosamente');
			} else {
				await Alerts.showSuccess('Consultorio Editado!', 'El registro se completó exitosamente');
			}
			navigate('/office-admin');
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
			console.error('Error creando Office: ', error)
		}
	}

	return (
		<Fragment>
			<div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><Link to={"/user-admin"}>Office Admin</Link></li>
					<li className="breadcrumb-item active"><Link to={"#"}>{isEditMode ? "Edit office" : "Create office"}</Link></li>
				</ol>
			</div>

			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">{isEditMode ? "Editar Consultorio" : "Crear Consultorio"}</h4>
						</div>
						<div className="card-body">

							<div className="form-wizard ">
								<Stepper className="nav-wizard" activeStep={goSteps} label={false}>
									<Step className="nav-link" onClick={() => setGoSteps(0)} />
									<Step className="nav-link" onClick={() => setGoSteps(1)} />
									<Step className="nav-link" onClick={() => setGoSteps(2)} />
								</Stepper>
							  {goSteps === 0 && (
								<>
									<StepOne formData={formOfficeData} setFormData={setFormOfficeData} />
									<div className="text-end toolbar toolbar-bottom p-2">
										<button  className="btn btn-primary sw-btn-next" onClick={() => setGoSteps(1)}>Siguiente</button>
									</div>	
								</>
							  )}
							  {goSteps === 1 && (
								<>
									<StepTwo formData={formOfficeData} setFormData={setFormOfficeData} />
									<div className="text-end toolbar toolbar-bottom p-2">
										<button  className="btn btn-secondary sw-btn-prev me-1" onClick={() => setGoSteps(0)}>Anterior</button>
										<button className="btn btn-primary sw-btn-next ms-1" onClick={() => setGoSteps(2)}>Siguiente</button>
									</div>	
								</>
							  )}
							  {goSteps === 2 && (
								<>
									<StepThree formData={formOfficeData} setFormData={setFormOfficeData} />
									<div className="text-end toolbar toolbar-bottom p-2">
										<button className="btn btn-secondary sw-btn-prev me-1"
												onClick={() => setGoSteps(1)}>Anterior
										</button>
										<button className="btn btn-success ms-1" onClick={handleSubmit}>{isEditMode ? "Editar Consultorio" : "Crear Consultorio"}</button>
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

export default AddEditOffices;
