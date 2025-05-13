import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {ThemeContext} from "../../../../context/ThemeContext.jsx"

// Images
import {createSubscripPlan, getAllSubscripPlan, updateSubscripPlan} from "../../api/subscriptionEndpoints.js";
import {Modal} from "react-bootstrap";
import Select from "react-select";
import {Alerts} from "../../../../utils/alerts.js";

const initialFormData = {
    name: '',
    features: '',
    interval: '',
    priceUsd: ''
};

const SubscriptionAdmin = () => {
    const [subscripPlans, setSubscripPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carga todos los subscripPlans
    const loadSubscripPlan = async () => {
        setLoading(true);
        setError(null);
        const startTime = Date.now();
        try {
            const { data } = await getAllSubscripPlan();
            // Espera al menos 500ms para evitar parpadeos
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
            setSubscripPlans(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // use effect
    useEffect(() => {
        loadSubscripPlan();
    }, []);


   const { changeBackground } = useContext(ThemeContext);
   useEffect(() => {
       changeBackground({ value: "light", label: "Light" });
   }, []);

    const [postModal, setPostModal] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isEditing, setIsEditing] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitSaveSubscripPlan = async (e) => {
        e.preventDefault();
        const startTime = Date.now();
        try {
            Alerts.showLoading('Registrando Plan', 'Guardando información...');

            const dataToSend = {
                ...formData
            };
            await createSubscripPlan(dataToSend);
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));

            Alerts.closeAlerts();
            await Alerts.showSuccess('Plan creado!', 'El registro se completó exitosamente');
            await loadSubscripPlan();
            setPostModal(false);
        }catch (error) {
            Alerts.closeAlerts();
            if (!error.response) {
                // Error de conexión (no hay respuesta del backend)
                console.error('Error de red:', error.message);
                await Alerts.showConnectionError();
            } else {
                // Error del servidor (4xx/5xx)
                const errorMessage = error.response.data?.message || 'Error desconocido';
                await Alerts.showError('Error en el servidor', errorMessage);
            }
            console.error('Error creando Plan: ', error)
        }
    }

    const handleSubmitUpdateSubscripPlan = async (e) => {
        e.preventDefault();
        const startTime = Date.now();
        try {
            Alerts.showLoading('Actualizando Plan', 'Guardando información...');

            const dataToSend = {
                ...formData
            };
            await updateSubscripPlan(dataToSend.id, dataToSend);
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));

            Alerts.closeAlerts();
            await Alerts.showSuccess('Plan Actualizado!', 'El registro se completó exitosamente');
            await loadSubscripPlan();
            setPostModal(false);
        }catch (error) {
            Alerts.closeAlerts();
            if (!error.response) {
                // Error de conexión (no hay respuesta del backend)
                console.error('Error de red:', error.message);
                await Alerts.showConnectionError();
            } else {
                // Error del servidor (4xx/5xx)
                const errorMessage = error.response.data?.message || 'Error desconocido';
                await Alerts.showError('Error en el servidor', errorMessage);
            }
            console.error('Error creando Plan: ', error)
        }
    }

    const intervalOptions = [
        { value: 1, label: 'MONTHLY' },
        { value: 2, label: 'ANNUAL' },
    ]
    const handleIntervalChange = (option) => {
        setFormData(prev => ({
            ...prev,
            interval: option ? option.label : ''
        }));
    };


    const handleEditClick = (plan) => {
        setFormData({
            id: plan.id,
            name: plan.name,
            priceUsd: plan.priceUsd,
            features: plan.features,
            interval: plan.interval,
        });

        setIsEditing(true);
        setSelectedPlan(plan);
        setPostModal(true);
    };

   return (
       <div>
           <div className="form-head d-flex mb-3 mb-md-4 align-items-start">
               <div className="me-auto d-lg-block">
                   <h3 className="text-black font-w600">Bienvenido!</h3>
                   <p className="mb-0 fs-18">Desde este espacio podrás administrar los Planes de PetNova</p>
               </div>
           </div>

           <div className="form-head d-flex mb-3 mb-md-4 align-items-start">

               <div className="me-auto d-lg-block">
                   <Link className="btn btn-primary font-w600 mb-2 me-auto"
                         onClick={()=> {
                             setPostModal(true);
                             setFormData(initialFormData);
                         }}>+ Nuevo Plan</Link>
               </div>
               <div className="input-group search-area ms-auto d-inline-flex">
                   <input
                       type="text"
                       className="form-control"
                       placeholder="Search here"
                   />
                   <div className="input-group-append">
                       <button type="button" className="input-group-text">
                           <i className="flaticon-381-search-2"/>
                       </button>
                   </div>
               </div>
               <Link to="/" className="settings-icon  ms-3">
                   <i className="flaticon-381-settings-2 me-0"/>
               </Link>
           </div>

           {/* Table Subscription Plan*/}
           {loading && (
               <div className="text-center my-5">
                   <div className="spinner-grow text-success" role="status">
                       <span className="visually-hidden">Cargando...</span>
                   </div>
                   <p className="mt-2">Cargando planes...</p>
               </div>
           )}
           {!loading && subscripPlans.length > 0 && (
               <div className="row">
                   {
                       subscripPlans.map((subscripPlan, index) => (
                           <div
                               className="col-xl-3 col-xxl-6 col-sm-6"
                               onClick={() => handleEditClick(subscripPlan)}
                           >
                               <div className={`card gradient-bx text-white rounded 
                               ${subscripPlan.name === "PLAN FREE"
                                   ? "bg-danger"
                                   : subscripPlan.name === "PLAN PRO"
                                       ? "bg-primary"
                                       : "bg-blue"}`}>
                                   <div className="card-body">
                                       <div className="media align-items-center">
                                           <div className="media-body">
                                               <h4 className="fs-40 font-w600 text-white mb-0 me-3">
                                                   {subscripPlan.name}
                                               </h4>
                                               <div className="d-flex flex-wrap">
                                                   <h2 className="fs-40 font-w600 text-white mb-0 me-3">
                                                       ${subscripPlan.priceUsd}
                                                   </h2>
                                                   <div>
                                                       <p className="mb-1">Suscriptores <br/>{subscripPlan.subscribers}</p>

                                                   </div>
                                               </div>
                                           </div>
                                           <span className="border rounded-circle p-4">
                               <svg
                                   width={34}
                                   height={34}
                                   viewBox="0 0 21 35"
                                   fill="none"
                                   xmlns="http://www.w3.org/2000/svg"
                               >
                                  <path
                                      d="M9.21864 35H11.6667V31.7747C17.7104 31.496 21.0001 27.7133 21.0001 23.413C21.0001 17.2412 15.7596 16.0865 11.6667 14.8919V8.72014C12.7378 9.11832 13.4645 10.0341 13.6175 11.5074H20.6175C20.2733 6.45051 16.9072 3.66325 11.6667 3.22526V0H9.21864V3.22526C4.01645 3.58362 6.10352e-05 6.53015 6.10352e-05 11.5074C6.10352e-05 17.7588 5.12574 18.9534 9.21864 20.0683V26.3595C7.91809 25.9215 7.15307 24.9261 7.00006 23.2935H0.0383124C0.229569 28.43 4.01645 31.2571 9.21864 31.7349V35ZM14.1531 23.6519C14.1531 25.1251 13.1968 26.2002 11.6667 26.479V20.8248C13.1585 21.4221 14.1531 22.2184 14.1531 23.6519ZM6.92356 11.1889C6.92356 9.63595 7.80334 8.75995 9.21864 8.52105V14.0557C7.84159 13.4187 6.92356 12.5825 6.92356 11.1889Z"
                                      fill="white"
                                  />
                               </svg>
                            </span>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       ))}

               </div>
           )}
           {!loading && subscripPlans.length === 0 && !error && (
               <p className="text-center">No se encontraron Planes</p>
           )}
           {error && (
               <div className="alert alert-danger">{error}</div>
           )}
           <div className="mb-sm-5 mb-3 d-flex flex-wrap align-items-center text-head">
               {/* <!-- Modal --> */}
               <Modal className="modal fade" show={postModal} onHide={setPostModal} size={'lg'}>
                   <div className="">
                       <div className="">
                           <form>
                               <div className="modal-header">
                                   <h4 className="modal-title fs-20">{isEditing ? "Editar Plan" : "Agregar Plan"}</h4>
                                   <button type="button" className="btn close lineheight1"
                                           onClick={() => setPostModal(false)}>
                                       <span>×</span>
                                   </button>
                               </div>
                               <div className="modal-body">
                                   <form onSubmit={isEditing ? handleSubmitUpdateSubscripPlan : handleSubmitSaveSubscripPlan}>
                                       <div className="row">
                                           {/*<div className="col-xl-12">
                                        <div className="form-group">
                                           <label htmlFor="recipient-name" className="col-form-label">Title:</label>
                                           <select className="form-control">
                                              <option>Miss</option>
                                              <option>Mr.</option>
                                              <option>Mrs.</option>
                                           </select>
                                        </div>
                                     </div>*/}
                                           <div className="form-group mb-3">
                                               <div className="form-group">
                                                   <label className="text-label">Nombre del Plan <span
                                                       className="required">*</span></label>
                                                   <input
                                                       type="text"
                                                       name="name"
                                                       className="form-control"
                                                       placeholder="PLAN PREMIUM+"
                                                       value={formData.name}
                                                       onChange={handleChange}
                                                       required
                                                       style={{ textTransform: 'uppercase' }}
                                                   />
                                               </div>
                                           </div>
                                           <div className="form-group mb-3">
                                               <div className="form-group mb-3">
                                                   <label className="text-label">Intervalo <span
                                                       className="required">*</span></label>
                                                   <Select
                                                       name="interval"
                                                       options={intervalOptions}
                                                       value={
                                                           intervalOptions.find(opt => opt.label === formData.interval)
                                                           || null
                                                       }
                                                       onChange={handleIntervalChange}
                                                       isClearable
                                                       placeholder="Selecciona un intervalo"
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
                                           <div className="form-group mb-3">
                                               <div className="form-group">
                                                   <label className="text-label">Precio <span
                                                       className="required">*</span></label>
                                                   <input
                                                       type="number"
                                                       name="priceUsd"
                                                       className="form-control"
                                                       placeholder="10"
                                                       value={formData.priceUsd}
                                                       onChange={handleChange}
                                                       required
                                                   />
                                               </div>
                                           </div>
                                           <div className="form-group mb-3">
                                               <div className="form-group">
                                                   <label className="text-label">Características <span
                                                       className="required">*</span></label>
                                                   <textarea className="form-control"
                                                             name="features"
                                                             placeholder="60 días de servicio gratis"
                                                             value={formData.features}
                                                             onChange={handleChange}
                                                             required
                                                             rows="3">

                                           </textarea>
                                               </div>
                                           </div>
                                       </div>
                                   </form>
                               </div>
                               <div className="modal-footer">
                                   <button type="submit" className="btn btn-primary"
                                           onClick={isEditing ? handleSubmitUpdateSubscripPlan : handleSubmitSaveSubscripPlan}>{isEditing ? "Editar Plan" : "Crear Plan"}
                                   </button>
                                   <button type="button" onClick={() => setPostModal(false)} className="btn btn-danger">
                                       <i
                                           className="flaticon-delete-1"></i> Cancelar
                                   </button>
                               </div>
                           </form>

                       </div>
                   </div>
               </Modal>

           </div>
       </div>
   );
};

export default SubscriptionAdmin;
