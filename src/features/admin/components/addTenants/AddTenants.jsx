import React, {Fragment, useState} from "react";
//import Multistep from "react-multistep";
import {Step, Stepper} from 'react-form-stepper';

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import PageTitle from "../../../../layouts/PageTitle";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createTenant} from "../../api/adminEndpoints.js";

const AddTenants = () => {
	const [goSteps, setGoSteps] = useState(0);
	const [formData, setFormData] = useState({
		//StepOne
		name: '',
		address: '',
		taxId: '',
		logoUrl: '',

		//StepTwo
		contactEmail: '',
		phoneNumber: '',
		managerName: '',
		managerPhone: '',
		managerEmail: '',

		//Steap Three
		currentPlan: '',
		currency: ''
	})

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		try {
			const response = await createTenant(formData);
			console.log('Tenant creado:', response.data);
			navigate('/');
		}catch (error) {
			console.error('Error creando Tenant: ', error)
		}
	}

	return (
		<Fragment>
			<PageTitle activeMenu="Add Tenants" motherMenu="Home" />

			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Crear Tenants</h4>
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
										<button  className="btn btn-secondary sw-btn-prev me-1" onClick={() => setGoSteps(0)}>Anterior</button>
										<button className="btn btn-primary sw-btn-next ms-1" onClick={() => setGoSteps(2)}>Siguiente</button>
									</div>	
								</>
							  )}
							  {goSteps === 2 && (
								<>
									<StepThree formData={formData} setFormData={setFormData} />
									<div className="text-end toolbar toolbar-bottom p-2">
										<button className="btn btn-secondary sw-btn-prev me-1"
												onClick={() => setGoSteps(1)}>Anterior
										</button>
										<button className="btn btn-success ms-1" onClick={handleSubmit}>Registrar Tenant</button>
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

export default AddTenants;
