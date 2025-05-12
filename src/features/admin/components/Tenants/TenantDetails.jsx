import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Dropdown, Modal} from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//Image
import widget1 from "../../../../assets/images/widget/1.jpg";
import widget5 from "../../../../assets/images/widget/5.jpg";
import widget6 from "../../../../assets/images/widget/6.jpg";
import widget7 from "../../../../assets/images/widget/7.jpg";
import widget8 from "../../../../assets/images/widget/8.jpg";
import map from "../../../../assets/images/svg/map.svg";

/// Scroll
import {deleteTenantById, getTenantById} from "../../api/tenantEndpoints.js";
import user from "../../../../assets/images/task/user.jpg";
import card1 from "../../../../assets/images/task/img1.jpg";
import {formatDateTimeUtils, formatDateUtils} from "../../../../utils/formatters.js";
import Select from "react-select";
import CustomClearIndicator from "../../../../jsx/components/PluginsMenu/Select2/MultiSelect.jsx";
import {createOffice, getOfficesByTenantId} from "../../api/officeEndpoints.js";
import {Alerts} from "../../../../utils/alerts.js";
import Swal from "sweetalert2";


const initialFormData = {
   name: '',
   address: '',
   taxId: '',
   logoUrl: '',
   contactEmail: '',
   contactPhone: '',
   managerName: '',
   managerPhone: '',
   managerEmail: '',
   currentPlan: '',
   currency: '',
};

const TenantDetails = () => {

   const [offices, setOffices] = useState([]);
   const [tenant, setTenant] = useState(null);
   const {tenantId} = useParams();

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const [formData, setFormData] = useState(initialFormData);

   const navigate = useNavigate();

   // Carga el tenant details y sus lista de offices
   const loadTenant = async () => {
      setLoading(true);
      setError(null);
      const startTime = Date.now();
      try {
         const [t, o] = await Promise.allSettled([
            getTenantById(tenantId),
            getOfficesByTenantId(tenantId)
         ]);

         // Verificar la promesa de tenant
         if (t.status === "fulfilled") {
            setTenant(t.value); // Acceder a la propiedad `value` de la promesa resuelta
         } else {
            setError("Error en la carga de tenants");
         }

         // Verificar la promesa de offices
         if (o.status === "fulfilled") {
            setOffices(o.value); // Acceder a la propiedad `value` de la promesa resuelta
         } else {
            setError("Error en la carga de Consultorios");
         }
         // Espera al menos 500ms para evitar parpadeos
         const elapsed = Date.now() - startTime;
         if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };


   useEffect(() => {
      loadTenant();
   }, [tenantId])

   function handleDeleteTenant(tenantId) {
      Alerts.confirmDelete('tenant', () => {
         deleteTenantById(tenantId)
             .then(() => {
                Swal.fire('¡Eliminado!', 'El tenant ha sido borrado.', 'success');
                navigate('/home-admin');
             })
             .catch(err => {
                Swal.fire('Error', 'No se pudo eliminar el tenant.', 'error');
                console.log(err);
             });
      });
   }

   const handleSubmitSaveOffice = async (e) => {
      e.preventDefault();
      const startTime = Date.now();
      try {
         Alerts.showLoading('Registrando Consultorio', 'Guardando información...');

         const dataToSend = {
            ...formData,
            tenantId: tenant.id
         };
         await createOffice(dataToSend);
         const elapsed = Date.now() - startTime;
         if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));

         Alerts.closeAlerts();
         await Alerts.showSuccess('Consultorio creado!', 'El registro se completó exitosamente');
         setPostModal(false);
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

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };
   const handleSelectManagerChange = (option) => {
      setFormData(prev => ({
         ...prev,
         managerName: option ? option.value : ''
      }));
   };
   const handlePlanChange = (option) => {
      setFormData(prev => ({
         ...prev,
         currentPlan: option ? option.value : ''
      }));
   };
   const handleCurrencyChange = (option) => {
      setFormData(prev => ({
         ...prev,
         currency: option ? option.value : ''
      }));
   };

   const managerOptions = [
      { value: 1, label: 'José' },
      { value: 2, label: 'Emilio' },
      { value: 3, label: 'Juan' },
   ]
   const planOptions = [
      { value: 1, label: 'Free' },
      { value: 2, label: 'Plus' },
      { value: 3, label: 'Premium' },
   ]
   const currencyOptions = [
      { value: 1, label: 'USD' },
      { value: 2, label: 'EU' },
      { value: 3, label: 'MXN' },
   ]

   const [postModal, setPostModal] = useState(false);


   //For Image upload in ListBlog
   const [file, setFile] = React.useState(null)
   const fileHandler = (e) => {
      setFile(e.target.files[0]);
      setTimeout(function(){
         var src = document.getElementById("saveImageFile").getAttribute("src");
      }, 200);
   }

   return (
       <>
          <div className="page-titles">
             <ol className="breadcrumb">
                <li className="breadcrumb-item active">
                   <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                   <Link to="/tenant-details">Tenant Details</Link>
                </li>
             </ol>
          </div>
          <div className="form-head d-flex mb-3 mb-md-4 align-items-start">
             <div className="me-auto d-lg-block">
                <h3 className="text-black font-w600">Detalles del Tenant</h3>
             </div>
          </div>

          {!loading && tenant && (
             <div className="d-block d-sm-flex mb-3 mb-md-4">
                <Link className="btn btn-primary font-w600 mb-2 me-auto"
                      onClick={() => {
                         setFormData(initialFormData);
                         setFile(null);
                         setPostModal(true)
                      }}
                >+ Agregar Consultorios </Link>

                <Button variant={`${tenant.active ? 'success' : 'danger'} btn-rounded mb-2 d-inline-block`}>
                                          <span
                                              className={`btn-icon-start ${tenant.active ? 'text-success' : 'text-danger'}`}>
                                            <i className={`fa ${tenant.active ? 'fa-check color-success' : 'fa-cancel color-danger'}`}/>
                                          </span>
                   {(tenant.active ? 'ACTIVO' : 'INACTIVO')}
                </Button>
                <Dropdown className="dropdown ms-auto me-1 d-inline-block">
                   <Dropdown.Toggle
                       variant=""
                       type="button"
                       className="btn btn-primary btn-rounded dropdown-toggle light font-w600  mb-2"
                       data-toggle="dropdown"
                       aria-expanded="false"
                   >
                      <i className="las scale5 la-pencil-alt me-2"/>
                      Acciones
                   </Dropdown.Toggle>
                   <Dropdown.Menu className="dropdown-menu">
                      <Dropdown.Item className="dropdown-item" to="/doctor-details">
                         Editar
                      </Dropdown.Item>
                      <Dropdown.Item
                          className="dropdown-item"
                          onClick={() => handleDeleteTenant(tenant.id)}>
                         Eliminar
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item" to="/doctor-details">
                         Otros
                      </Dropdown.Item>
                   </Dropdown.Menu>
                </Dropdown>
             </div>
          )}
          <div className="row">

             {loading && tenant && (
                 <div className="text-center my-5">
                    <div className="spinner-grow text-success" role="status">
                       <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando información del tenant...</p>
                 </div>
             )}
             {!loading && tenant && (
                <div className="col-xl-8 col-xxl-10 col-lg-12">
                   <div className="card">
                      <div className="card-body">
                         <div className="media d-sm-flex d-block text-center text-sm-start pb-4 mb-4 border-bottom">

                            <div className="media-body align-items-center">
                               <div className="d-sm-flex d-block justify-content-between my-3 my-sm-0">
                                  <div>
                                     <h3 className="fs-22 text-black font-w600 mb-0">
                                        {tenant.tenantName || 'S/N'}
                                     </h3>
                                     <p className="mb-2 mb-sm-2">
                                        Creado el {formatDateTimeUtils(tenant.createdAt) || 'S/N'}
                                     </p>
                                  </div>
                                  <span>{tenant && tenant.id ? `#T-${tenant.id.toString().padStart(4, '0')}` : '#T-0000'}</span>
                               </div>
                               <Link
                                   to="/doctor-details"
                                   className="btn bgl-primary btn-rounded text-black mb-2 me-2"
                               >
                                  <svg
                                      className="me-2 scale5"
                                      width={14}
                                      height={14}
                                      viewBox="0 0 26 26"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                  >
                                     <path
                                         d="M18 0.500061V3.00006H21.25L16.625 7.62506C15 6.25006 12.875 5.50006 10.5 5.50006C5 5.50006 0.5 10.0001 0.5 15.5001C0.5 21.0001 5 25.5001 10.5 25.5001C16 25.5001 20.5 21.0001 20.5 15.5001C20.5 13.1251 19.75 11.0001 18.375 9.37506L23 4.75006V8.00006H25.5V0.500061H18ZM10.5 23.0001C6.375 23.0001 3 19.6251 3 15.5001C3 11.3751 6.375 8.00006 10.5 8.00006C14.625 8.00006 18 11.3751 18 15.5001C18 19.6251 14.625 23.0001 10.5 23.0001Z"
                                         fill="#2BC155"
                                     />
                                  </svg>
                                  {" "}
                                  Male
                               </Link>
                               <Link
                                   to="/doctor-details"
                                   className="btn bgl-primary btn-rounded mb-2 text-black"
                               >
                                  <svg
                                      className="me-2 scale5"
                                      width={14}
                                      height={14}
                                      viewBox="0 0 28 28"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                  >
                                     <path
                                         d="M27.75 11.5C27.7538 10.8116 27.568 10.1355 27.213 9.54575C26.8581 8.95597 26.3476 8.47527 25.7376 8.15632C25.1276 7.83737 24.4415 7.69248 23.7547 7.73752C23.0678 7.78257 22.4065 8.01581 21.8434 8.4117C21.2803 8.80758 20.837 9.35083 20.5621 9.98192C20.2872 10.613 20.1913 11.3076 20.2849 11.9896C20.3785 12.6715 20.6581 13.3146 21.0929 13.8482C21.5277 14.3819 22.101 14.7855 22.75 15.015V19C22.75 20.6576 22.0915 22.2473 20.9194 23.4194C19.7473 24.5915 18.1576 25.25 16.5 25.25C14.8424 25.25 13.2527 24.5915 12.0806 23.4194C10.9085 22.2473 10.25 20.6576 10.25 19V17.65C12.3301 17.3482 14.2323 16.3083 15.6092 14.7203C16.9861 13.1322 17.746 11.1019 17.75 9V1.5C17.75 1.16848 17.6183 0.850537 17.3839 0.616116C17.1495 0.381696 16.8315 0.25 16.5 0.25H12.75C12.4185 0.25 12.1005 0.381696 11.8661 0.616116C11.6317 0.850537 11.5 1.16848 11.5 1.5C11.5 1.83152 11.6317 2.14946 11.8661 2.38388C12.1005 2.6183 12.4185 2.75 12.75 2.75H15.25V9C15.25 10.6576 14.5915 12.2473 13.4194 13.4194C12.2473 14.5915 10.6576 15.25 9 15.25C7.34239 15.25 5.75268 14.5915 4.58058 13.4194C3.40848 12.2473 2.75 10.6576 2.75 9V2.75H5.25C5.58152 2.75 5.89946 2.6183 6.13388 2.38388C6.3683 2.14946 6.5 1.83152 6.5 1.5C6.5 1.16848 6.3683 0.850537 6.13388 0.616116C5.89946 0.381696 5.58152 0.25 5.25 0.25H1.5C1.16848 0.25 0.850537 0.381696 0.616116 0.616116C0.381696 0.850537 0.25 1.16848 0.25 1.5V9C0.25402 11.1019 1.01386 13.1322 2.3908 14.7203C3.76773 16.3083 5.6699 17.3482 7.75 17.65V19C7.75 21.3206 8.67187 23.5462 10.3128 25.1872C11.9538 26.8281 14.1794 27.75 16.5 27.75C18.8206 27.75 21.0462 26.8281 22.6872 25.1872C24.3281 23.5462 25.25 21.3206 25.25 19V15.015C25.9792 14.7599 26.6114 14.2848 27.0591 13.6552C27.5069 13.0256 27.7483 12.2726 27.75 11.5Z"
                                         fill="#2BC155"
                                     />
                                  </svg>
                                  {" "}
                                  Diabetes
                               </Link>
                            </div>
                         </div>
                         <div className="row">
                            <div className="col-lg-6 mb-3">
                               <div className="media">
                                 <span className="p-3 border border-primary-light rounded-circle me-3">
                                    <svg
                                        width={22}
                                        height={22}
                                        viewBox="0 0 32 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                       <g clipPath="url(#clip0)">
                                          <path
                                              d="M27.5716 13.4285C27.5716 22.4285 16.0001 30.1428 16.0001 30.1428C16.0001 30.1428 4.42871 22.4285 4.42871 13.4285C4.42871 10.3596 5.64784 7.41637 7.8179 5.24631C9.98797 3.07625 12.9312 1.85712 16.0001 1.85712C19.0691 1.85712 22.0123 3.07625 24.1824 5.24631C26.3524 7.41637 27.5716 10.3596 27.5716 13.4285Z"
                                              stroke="#2BC155"
                                              strokeWidth={3}
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                          />
                                          <path
                                              d="M16.0002 17.2857C18.1305 17.2857 19.8574 15.5588 19.8574 13.4286C19.8574 11.2983 18.1305 9.57141 16.0002 9.57141C13.87 9.57141 12.1431 11.2983 12.1431 13.4286C12.1431 15.5588 13.87 17.2857 16.0002 17.2857Z"
                                              stroke="#2BC155"
                                              strokeWidth={3}
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                          />
                                       </g>
                                       <defs>
                                          <clipPath id="clip0">
                                             <rect
                                                 width="30.8571"
                                                 height="30.8571"
                                                 fill="white"
                                                 transform="translate(0.571533 0.571411)"
                                             />
                                          </clipPath>
                                       </defs>
                                    </svg>
                                 </span>
                                  <div className="media-body">
                                    <span className="d-block text-light mb-2">
                                       Dirección
                                    </span>
                                     <p className="fs-18 text-dark">
                                        {tenant.address}
                                     </p>
                                  </div>
                               </div>
                            </div>
                            <div className="col-lg-6">
                               <div className="map-bx mb-3">
                                  <img src={map} alt=""/>
                                  <Link to="/doctor-details" className="map-button">
                                     Ver en Google Maps
                                  </Link>
                                  <Link className="map-marker" to="#">
                                     <i className="las la-map-marker-alt"/>
                                  </Link>
                               </div>
                            </div>
                            <div className="col-lg-6 mb-lg-0 mb-3">
                               <div className="media">
                                 <span className="p-3 border border-primary-light rounded-circle me-3">
                                    <svg
                                        width={22}
                                        height={22}
                                        viewBox="0 0 31 31"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                       <path
                                           d="M28.2884 21.7563V25.6138C28.2898 25.9719 28.2165 26.3264 28.073 26.6545C27.9296 26.9826 27.7191 27.2771 27.4553 27.5192C27.1914 27.7613 26.8798 27.9456 26.5406 28.0604C26.2014 28.1751 25.8419 28.2177 25.4853 28.1855C21.5285 27.7555 17.7278 26.4035 14.3885 24.238C11.2817 22.2638 8.64771 19.6297 6.67352 16.523C4.50043 13.1685 3.14808 9.34928 2.72601 5.37477C2.69388 5.0192 2.73614 4.66083 2.8501 4.32248C2.96405 3.98413 3.14721 3.67322 3.38792 3.40953C3.62862 3.14585 3.92159 2.93517 4.24817 2.79092C4.57475 2.64667 4.9278 2.57199 5.28482 2.57166H9.14232C9.76634 2.56552 10.3713 2.78649 10.8445 3.1934C11.3176 3.60031 11.6267 4.16538 11.714 4.78329C11.8768 6.01778 12.1788 7.22988 12.6141 8.39648C12.7871 8.85671 12.8245 9.35689 12.722 9.83775C12.6194 10.3186 12.3812 10.76 12.0354 11.1096L10.4024 12.7426C12.2329 15.9617 14.8983 18.6271 18.1174 20.4576L19.7504 18.8246C20.1001 18.4789 20.5414 18.2406 21.0223 18.1381C21.5031 18.0355 22.0033 18.073 22.4636 18.246C23.6302 18.6813 24.8423 18.9832 26.0767 19.1461C26.7014 19.2342 27.2718 19.5488 27.6796 20.0301C28.0874 20.5113 28.304 21.1257 28.2884 21.7563Z"
                                           stroke="#2BC155"
                                           strokeWidth={3}
                                           strokeLinecap="round"
                                           strokeLinejoin="round"
                                       />
                                    </svg>
                                 </span>
                                  <div className="media-body">
                                    <span className="d-block text-light mb-2">
                                       Teléfono
                                    </span>
                                     <p className="fs-18 text-dark font-w600 mb-0">
                                        (+593) {tenant.contactPhone}
                                     </p>
                                  </div>
                               </div>
                            </div>
                            <div className="col-lg-6">
                               <div className="media">
                                 <span className="p-3 border border-primary-light rounded-circle me-3">
                                    <svg
                                        width={22}
                                        height={22}
                                        viewBox="0 0 31 31"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                       <path
                                           d="M5.14344 5.14331H25.7168C27.1312 5.14331 28.2884 6.30056 28.2884 7.71498V23.145C28.2884 24.5594 27.1312 25.7166 25.7168 25.7166H5.14344C3.72903 25.7166 2.57178 24.5594 2.57178 23.145V7.71498C2.57178 6.30056 3.72903 5.14331 5.14344 5.14331Z"
                                           stroke="#2BC155"
                                           strokeWidth={3}
                                           strokeLinecap="round"
                                           strokeLinejoin="round"
                                       />
                                       <path
                                           d="M28.2884 7.71503L15.4301 16.7159L2.57178 7.71503"
                                           stroke="#2BC155"
                                           strokeWidth={3}
                                           strokeLinecap="round"
                                           strokeLinejoin="round"
                                       />
                                    </svg>
                                 </span>
                                  <div className="media-body">
                                    <span className="d-block text-light mb-2">
                                       Email
                                    </span>
                                     <p className="fs-18 text-dark font-w600 mb-0">
                                        {tenant.contactEmail}
                                     </p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}
             {error && !tenant && (
                 <div className="alert alert-danger">{error}</div>
             )}

             {!loading && tenant && (
                <div className=" col-lg-12 col-xl-4 col-xxl-6">
                   <div className="card">
                      <div className="card-header border-0 pb-0">
                         <h4 className="fs-20 font-w600 mb-0">
                            Appointment Schdule
                         </h4>
                      </div>
                      <div className="card-body pt-2 p-0">
                         <div
                             id="DZ_W_Todo2"
                             className="widget-media dz-scroll height370 my-4 px-4"
                         >
                            <ul className="timeline">
                               <li>
                                  <div className="timeline-panel bgl-dark flex-wrap border-0 p-3 rounded">
                                     <div className="media bg-transparent me-2">
                                        <img
                                            className="rounded-circle"
                                            alt="widget"
                                            width={48}
                                            src={widget6}
                                        />
                                     </div>
                                     <div className="media-body">
                                        <h5 className="mb-1 fs-18">Cive Slauw</h5>
                                        <span>Physical Therapy</span>
                                     </div>
                                     <ul className="mt-3 d-flex flex-wrap text-primary font-w600">
                                        <li className="me-2">Sat, 23/08/2020</li>
                                        <li>08:00 - 09:30 AM</li>
                                     </ul>
                                  </div>
                               </li>
                               <li>
                                  <div className="timeline-panel bgl-dark flex-wrap border-0 p-3 rounded">
                                     <div className="media bg-transparent me-2">
                                        <img
                                            className="rounded-circle"
                                            alt="widget"
                                            width={48}
                                            src={widget7}
                                        />
                                     </div>
                                     <div className="media-body">
                                        <h5 className="mb-1 fs-18">Cive Slauw</h5>
                                        <span>Physical Therapy</span>
                                     </div>
                                     <ul className="mt-3 d-flex flex-wrap text-primary font-w600">
                                        <li className="me-2">Sat, 23/08/2020</li>
                                        <li>08:00 - 09:30 AM</li>
                                     </ul>
                                  </div>
                               </li>
                               <li>
                                  <div className="timeline-panel bgl-dark flex-wrap border-0 p-3 rounded">
                                     <div className="media bg-transparent me-2">
                                        <img
                                            className="rounded-circle"
                                            alt="widget"
                                            width={48}
                                            src={widget8}
                                        />
                                     </div>
                                     <div className="media-body">
                                        <h5 className="mb-1 fs-18">Cive Slauw</h5>
                                        <span>Physical Therapy</span>
                                     </div>
                                     <ul className="mt-3 d-flex flex-wrap text-primary font-w600">
                                        <li className="me-2">Sat, 23/08/2020</li>
                                        <li>08:00 - 09:30 AM</li>
                                     </ul>
                                  </div>
                               </li>
                               <li>
                                  <div className="timeline-panel bgl-dark flex-wrap border-0 p-3 rounded">
                                     <div className="media bg-transparent me-2">
                                        <img
                                            className="rounded-circle"
                                            alt="widget"
                                            width={48}
                                            src={widget5}
                                        />
                                     </div>
                                     <div className="media-body">
                                        <h5 className="mb-1 fs-18">Cive Slauw</h5>
                                        <span>Physical Therapy</span>
                                     </div>
                                     <ul className="mt-3 d-flex flex-wrap text-primary font-w600">
                                        <li className="me-2">Sat, 23/08/2020</li>
                                        <li>08:00 - 09:30 AM</li>
                                     </ul>
                                  </div>
                               </li>
                               <li>
                                  <div className="timeline-panel bgl-dark flex-wrap border-0 p-3 rounded">
                                     <div className="media bg-transparent me-2">
                                        <img
                                            className="rounded-circle"
                                            alt="widget"
                                            width={48}
                                            src={widget1}
                                        />
                                     </div>
                                     <div className="media-body">
                                        <h5 className="mb-1 fs-18">Cive Slauw</h5>
                                        <span>Physical Therapy</span>
                                     </div>
                                     <ul className="mt-3 d-flex flex-wrap text-primary font-w600">
                                        <li className="me-2">Sat, 23/08/2020</li>
                                        <li>08:00 - 09:30 AM</li>
                                     </ul>
                                  </div>
                               </li>
                               <li>
                                  <div className="timeline-panel bgl-dark flex-wrap border-0 p-3 rounded">
                                     <div className="media bg-transparent me-2">
                                        <img
                                            className="rounded-circle"
                                            alt="widget"
                                            width={48}
                                            src={widget6}
                                        />
                                     </div>
                                     <div className="media-body">
                                        <h5 className="mb-1 fs-18">Cive Slauw</h5>
                                        <span>Physical Therapy</span>
                                     </div>
                                     <ul className="mt-3 d-flex flex-wrap text-primary font-w600">
                                        <li className="me-2">Sat, 23/08/2020</li>
                                        <li>08:00 - 09:30 AM</li>
                                     </ul>
                                  </div>
                               </li>
                            </ul>
                         </div>
                      </div>
                   </div>
                </div>
             )}
             {error && !tenant && (
                 <div className="alert alert-danger">{error}</div>
             )}
             <div className="mb-sm-5 mb-3 d-flex flex-wrap align-items-center text-head">
               {/* <!-- Modal --> */}
                <Modal className="modal fade" show={postModal} onHide={setPostModal} size={'lg'}>
                   <div className="">
                      <div className="">
                         <form>
                            <div className="modal-header">
                               <h4 className="modal-title fs-20">Agregar Consultorio</h4>
                               <button type="button" className="btn close lineheight1"
                                       onClick={() => setPostModal(false)}>
                                  <span>×</span>
                               </button>
                            </div>
                            <div className="modal-body">
                               <form onSubmit={handleSubmitSaveOffice}>
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
                                     <div className="col-xl-0">

                                     </div>
                                     <div className="col-xl-6">
                                        <div className="form-group">
                                           <label className="text-label">Nombre del Consultorio <span
                                               className="required">*</span></label>
                                           <input
                                               type="text"
                                               name="name"
                                               className="form-control"
                                               placeholder="Veterinaria Pet Lovers"
                                               value={formData.name}
                                               onChange={handleChange}
                                               required
                                           />
                                        </div>
                                     </div>
                                     <div className="col-xl-6">
                                        <div className="form-group">
                                           <label className="text-label">Ruc <span
                                               className="required">*</span></label>
                                           <input
                                               type="number"
                                               name="taxId"
                                               className="form-control"
                                               placeholder="1711251482001"
                                               value={formData.taxId}
                                               onChange={handleChange}
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
                                               name="contactPhone"
                                               className="form-control"
                                               placeholder="0996588446"
                                               value={formData.contactPhone}
                                               onChange={handleChange}
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
                                               name="contactEmail"
                                               className="form-control"
                                               id="inputGroupPrepend2"
                                               aria-describedby="inputGroupPrepend2"
                                               placeholder="example@example.com"
                                               value={formData.contactEmail}
                                               onChange={handleChange}
                                               required
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
                                                     value={formData.address}
                                                     onChange={handleChange}
                                                     required
                                                     rows="3">

                                           </textarea>
                                        </div>
                                     </div>
                                     <div className="col-xl-12">
                                        <div className="form-group mb-3">
                                           <label className="text-label">Administrador <span
                                               className="required">*</span></label>
                                           <Select
                                               name="managerName"
                                               options={managerOptions}
                                               // El value debe ser el objeto cuya value coincida con formData.nombreAdministrador
                                               value={
                                                   managerOptions.find(opt => opt.value === formData.managerName)
                                                   || null
                                               }
                                               onChange={handleSelectManagerChange}
                                               isClearable
                                               placeholder="Selecciona un administrador"
                                               style={{
                                                  lineHeight: '40px',
                                                  color: '#7e7e7e',
                                                  paddingLeft: ' 15px',
                                               }}
                                           />
                                        </div>
                                     </div>
                                     <div className="col-xl-6">
                                        <div className="form-group">
                                           <label className="text-label">Teléfono Administrador <span
                                               className="required">*</span></label>
                                           <input
                                               type="number"
                                               name="managerPhone"
                                               className="form-control"
                                               placeholder="0996588446"
                                               value={formData.managerPhone}
                                               onChange={handleChange}
                                               required
                                           />
                                        </div>
                                     </div>
                                     <div className="col-xl-6">
                                        <div className="form-group">
                                           <label className="text-label">Email Administrador <span
                                               className="required">*</span></label>
                                           <input
                                               type="email"
                                               name="managerEmail"
                                               className="form-control"
                                               id="inputGroupPrepend2"
                                               aria-describedby="inputGroupPrepend2"
                                               placeholder="example@example.com"
                                               value={formData.managerEmail}
                                               onChange={handleChange}
                                               required
                                           />
                                        </div>
                                     </div>
                                     <div className="col-xl-6">
                                        <div className="form-group mb-3">
                                           <label className="text-label">Plan Actual <span className="required">*</span></label>
                                           <Select
                                               name="currentPlan"
                                               options={planOptions}
                                                value={
                                                    planOptions.find(opt => opt.value === formData.currentPlan)
                                                    || null
                                                }
                                                onChange={handlePlanChange}
                                               isClearable
                                               placeholder="Selecciona un plan"
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
                                     <div className="col-xl-6">
                                        <div className="form-group mb-3">
                                           <label className="text-label">Moneda <span
                                               className="required">*</span></label>
                                           <Select
                                               name="currency"
                                               options={currencyOptions}
                                               value={
                                                   currencyOptions.find(opt => opt.value === formData.currency)
                                                   || null
                                               }
                                               onChange={handleCurrencyChange}
                                               isClearable
                                               placeholder="Selecciona una moneda"
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
                                           <label htmlFor="message-text" className="col-form-label">Categorias: </label>
                                           <CustomClearIndicator></CustomClearIndicator>
                                        </div>
                                     </div>
                                  </div>
                               </form>
                            </div>
                            <div className="modal-footer">
                               <button type="submit" className="btn btn-primary" onClick={handleSubmitSaveOffice}>Crear
                                  Consultorio
                               </button>
                               {/*<button type="submit" className="btn btn-primary" onClick={handleAddFormSubmit}>Crear
                                  Consultorio
                               </button>*/}
                               <button type="button" onClick={() => setPostModal(false)} className="btn btn-danger"><i
                                   className="flaticon-delete-1"></i> Cancelar
                               </button>
                            </div>
                         </form>

                      </div>
                   </div>
                </Modal>
             </div>

             {loading && offices && offices.length > 0 && (
                 <div className="text-center my-5">
                    <div className="spinner-grow text-success" role="status">
                       <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando información del tenant...</p>
                 </div>
             )}
             {!loading && offices && offices.length > 0 && (
                <div className="row">

                   <div className="me-auto d-lg-block">
                      <h3 className="text-black font-w600">Lista de Consultorios</h3>
                   </div>
                   {offices.map((office, index) => (
                       <div className="col-xl-3 col-xxl-4 col-lg-6 col-md-6 col-sm-6" key={index}>
                          <div className="card project-boxed d-flex flex-column">
                             <div className="img-bx">
                                <img src={office.logoUrl || card1}
                                     alt=""
                                     className=" me-3 card-list-img w-100"
                                     width="130"/>
                             </div>
                             <div className="card-header align-items-start">
                                <div>
                                   <p className="fs-14 mb-2 text-primary"> {`#O-${office.id.toString().padStart(4, '0')}`}</p>
                                   <h6 className="fs-18 font-w500 mb-3"><Link to={"#"}
                                                                              className="text-black user-name">{office.name}</Link>
                                   </h6>
                                   <div className="text-dark fs-14 text-nowrap"><i className="fas fa-calendar me-3"></i>Creado
                                      el {formatDateUtils(office.createdAt)}</div>
                                </div>
                                <Dropdown className="">
                                   <Dropdown.Toggle variant="" as="div" className="btn-link i-false">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
                                         <path
                                             d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                                             stroke="#342E59" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round"/>
                                         <path
                                             d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                                             stroke="#342E59" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round"/>
                                         <path
                                             d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                                             stroke="#342E59" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round"/>
                                      </svg>
                                   </Dropdown.Toggle>
                                   <Dropdown.Menu align={'end'}>
                                      <Dropdown.Item
                                          /*onClick={(event) => handleEditClick(event, contact)}*/
                                      >Edit
                                      </Dropdown.Item>
                                      <Dropdown.Item className="text-danger"
                                          /*onClick={() => handleDeleteClick(contact.id)}*/
                                      >Delete
                                      </Dropdown.Item>
                                   </Dropdown.Menu>
                                </Dropdown>
                             </div>
                             <div className="card-body p-0 pb-3">
                                <ul className="list-group list-group-flush">
                                   <li className="list-group-item">
                                      <span className="mb-0 title">Dirección</span> :
                                      <span className="text-black ms-2">{office.address}</span>
                                   </li>
                                   <li className="list-group-item">
                                      <span className="mb-0 title">Teléfono</span> :
                                      <span className="text-black ms-2">{office.contactPhone}</span>
                                   </li>
                                   <li className="list-group-item">
                                      <span className="mb-0 title">Administrador</span> :
                                      <span className="text-black desc-text ms-2">{office.managerName}</span>
                                   </li>
                                   <div className="card-body d-flex justify-content-center align-items-center pb-3">
                                      <Button variant={`${office.active ? 'success' : 'danger'} btn-rounded`}>
                                       <span
                                           className={`btn-icon-start ${office.active ? 'text-success' : 'text-danger'}`}>
                                         <i className={`fa ${office.active ? 'fa-check color-success' : 'fa-cancel color-danger'}`}/>
                                       </span>
                                         {(office.active ? 'ACTIVO' : 'INACTIVO')}
                                      </Button>
                                   </div>
                                </ul>
                             </div>

                          </div>
                       </div>
                   ))}
                </div>
             )}
             {error && (
                 <div className="alert alert-danger">{error}</div>
             )}

          </div>
       </>
   );
};

export default TenantDetails;
