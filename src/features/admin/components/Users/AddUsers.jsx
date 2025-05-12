import React, {Fragment, useState} from "react";
//import Multistep from "react-multistep";
import {Step, Stepper} from 'react-form-stepper';

import PageTitle from "../../../../layouts/PageTitle";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {Alerts} from "../../../../utils/alerts.js";
import {createUser} from "../../api/userEndpoints.js";
import StepTwo from "./StepTwo.jsx";
import StepOne from "./StepOne.jsx";

const AddUsers = () => {
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

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		const startTime = Date.now();
		try {
			Alerts.showLoading('Registrando Usuario', 'Guardando información...');

			const response = await createUser(formData);

			const elapsed = Date.now() - startTime;
			if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));

			Alerts.closeAlerts();
			await Alerts.showSuccess('Usuario creado!', 'El registro se completó exitosamente');

			navigate('/user-admin');
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
			console.error('Error creando el Usuario: ', error)
		}
	}

	return (
		<Fragment>
			<div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><Link to={"/user-admin"}>User Admin</Link></li>
					<li className="breadcrumb-item active"><Link to={"#"}>Create User</Link></li>
				</ol>
			</div>

			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Crear Usuario</h4>
						</div>
						<div className="card-body">

							<div className="form-wizard ">
								<Stepper className="nav-wizard" activeStep={goSteps} label={false}>
									<Step className="nav-link" onClick={() => setGoSteps(0)} />
									<Step className="nav-link" onClick={() => setGoSteps(1)} />
								</Stepper>
							  {goSteps === 0 && (
								<>
									<StepOne formData={formData} setFormData={setFormData} />
									<div className="text-end toolbar toolbar-bottom p-2">
										<button  className="btn btn-primary sw-btn-next" onClick={() => setGoSteps(1)}>Siguiente</button>
									</div>	
								</>
							  )}
							  {goSteps === 1 && (
								<>
									<StepTwo formData={formData} setFormData={setFormData} />
									<div className="text-end toolbar toolbar-bottom p-2">
										<button className="btn btn-secondary sw-btn-prev me-1"
												onClick={() => setGoSteps(0)}>Anterior
										</button>
										<button className="btn btn-success ms-1" onClick={handleSubmit}>Registrar
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

export default AddUsers;
