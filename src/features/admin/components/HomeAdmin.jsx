import React, {useContext, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {ThemeContext} from "../../../context/ThemeContext.jsx"

// Images
import DrAlexandro from "../../../assets/images/doctors/5.jpg";
import DrSamantha from "../../../assets/images/doctors/1.jpg";
import DrAliandro from "../../../assets/images/doctors/2.jpg";
import DrSamuel from "../../../assets/images/doctors/4.jpg";
import DrMelinda from "../../../assets/images/doctors/3.jpg";
import widget01 from "../../../assets/images/widget/1.jpg";
import widget02 from "../../../assets/images/widget/2.jpg";
import widget03 from "../../../assets/images/widget/3.jpg";
import widget05 from "../../../assets/images/widget/5.jpg";
import doctors9 from "../../../assets/images/doctors/9.jpg";
import {Dropdown} from "react-bootstrap";
import {deleteOfficeById, getAllOffices} from "../api/officeEndpoints.js";
import {deleteTenantById, getAllTenants} from "../api/tenantEndpoints.js";
import {formatDateUtils} from "../../../utils/formatters.js";
import {Alerts} from "../../../utils/alerts.js";
import Swal from "sweetalert2";

const HomeAdmin = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [data, setData] = useState(
        document.querySelectorAll("#doctor_list tbody tr")
    );
    const sort = 10;
    const activePag = useRef(0);
    const [test, settest] = useState(0);

    // Active data
    const chageData = (frist, sec) => {
        for (var i = 0; i < data.length; ++i) {
            if (i >= frist && i < sec) {
                data[i].classList.remove("d-none");
            } else {
                data[i].classList.add("d-none");
            }
        }
    };

    // Carga todos los tenants
    const loadTenants = async () => {
        setLoading(true);
        setError(null);
        const startTime = Date.now();
        try {
            const { data } = await getAllTenants();
            // Espera al menos 500ms para evitar parpadeos
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
            setTenants(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    // use effect
    useEffect(() => {
        loadTenants();
        setData(document.querySelectorAll("#doctor_list tbody tr"));
    }, [test]);


    function handleDeleteTenant(tenantId) {
        Alerts.confirmDelete('tenant', () => {
            deleteTenantById(tenantId)
                .then(() => {
                    setTenants(current => current.filter(o => o.id !== tenantId));
                    Swal.fire('¡Eliminado!', 'El tenant ha sido borrado.', 'success');
                })
                .catch(err => {
                    Swal.fire('Error', 'No se pudo eliminar el tenant.', 'error');
                    console.log(err);
                });
        });
    }


    // Active pagginarion
    activePag.current === 0 && chageData(0, sort);
    // paggination
    let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1);


    const onClick = (i) => {
        activePag.current = i;
        chageData(activePag.current * sort, (activePag.current + 1) * sort);
        settest(i);
    };

    const chackbox = document.querySelectorAll(".doctor_checkbox input");
    const motherChackBox = document.querySelector(".doctor_strg input");
    const chackboxFun = (type) => {
        for (let i = 0; i < chackbox.length; i++) {
            const element = chackbox[i];
            if (type === "all") {
                if (motherChackBox.checked) {
                    element.checked = true;
                } else {
                    element.checked = false;
                }
            } else {
                if (!element.checked) {
                    motherChackBox.checked = false;
                    break;
                } else {
                    motherChackBox.checked = true;
                }
            }
        }
    };

   const settings = {
      focusOnSelect: true,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      speed: 500,
      responsive: [
         {
            breakpoint: 1600,
            settings: {
               slidesToShow: 3,
               slidesToScroll: 1,
            },
         },

         {
            breakpoint: 1200,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 991,
            settings: {
               slidesToShow: 3,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 767,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 575,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
      ],
   };
   const { changeBackground } = useContext(ThemeContext);
   useEffect(() => {
       changeBackground({ value: "light", label: "Light" });
   }, []);


   return (
       <div>
           <div className="form-head d-flex mb-3 mb-md-4 align-items-start">
               <div className="me-auto d-lg-block">
                   <h3 className="text-black font-w600">Bienvenido!</h3>
                   <p className="mb-0 fs-18">Desde este espacio podrás administrar los clientes de PetNova</p>
               </div>
           </div>

           <div className="form-head d-flex mb-3 mb-md-4 align-items-start">

               <div className="me-auto d-lg-block">
                   <Link
                       to="/add-tenants"
                       className="btn btn-primary btn-rounded"
                   >
                       + Agregar nuevo Tenant
                   </Link>
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

           {/* Table Tenants*/}
           <div className="row">
               <div className="col-xl-12">
                   <div className="table-responsive">
                       <div id="example5_wrapper" className="dataTables_wrapper no-footer">
                           {loading && (
                               <div className="text-center my-5">
                                   <div className="spinner-grow text-success" role="status">
                                       <span className="visually-hidden">Cargando...</span>
                                   </div>
                                   <p className="mt-2">Cargando tenants...</p>
                               </div>
                           )}
                           {!loading && tenants.length > 0 && (
                               <table id="doctor_list"
                                      className="table shadow-hover  mb-4 table-responsive-xl dataTablesCard fs-14 dataTable no-footer">
                                   <thead>
                                   <tr role="row">
                                       <th
                                           className="doctor_strg"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-sort="ascending"
                                           style={{width: 91}}
                                       >
                                           <div className="checkbox align-self-center">
                                               <div className="form-check custom-checkbox ms-1">
                                                   <input
                                                       type="checkbox"
                                                       onClick={() => chackboxFun("all")}
                                                       className="form-check-input"
                                                       id="checkAll"
                                                       required
                                                   />
                                                   <label
                                                       className="form-check-label"
                                                       htmlFor="checkAll"
                                                   />
                                               </div>
                                           </div>
                                       </th>
                                       <th
                                           className="sorting"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-label="ID: activate to sort column ascending"
                                           style={{width: 50}}
                                       >
                                           Tenand Id
                                       </th>
                                       <th
                                           className="sorting"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-label="Date Join: activate to sort column ascending"
                                           style={{width: 123}}
                                       >
                                           Nombre del Tenand
                                       </th>
                                       <th
                                           className="sorting"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-label="Doctor Name: activate to sort column ascending"
                                           style={{width: 111}}
                                       >
                                           Email
                                       </th>
                                       <th
                                           className="sorting"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-label="Specialist: activate to sort column ascending"
                                           style={{width: 80}}
                                       >
                                           Teléfono
                                       </th>
                                       <th
                                           className="sorting"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-label="Schedule: activate to sort column ascending"
                                           style={{width: 150}}
                                       >
                                           Dirección
                                       </th>
                                       <th
                                           className="sorting"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-label="Schedule: activate to sort column ascending"
                                           style={{width: 150}}
                                       >
                                           Fecha Inicio
                                       </th>
                                       <th
                                           className="sorting"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-label="Contact: activate to sort column ascending"
                                           style={{width: 150}}
                                       >
                                           Fecha Fín
                                       </th>
                                       <th
                                           className="sorting"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-label="Status: activate to sort column ascending"
                                           style={{width: 98}}
                                       >
                                           Estado
                                       </th>
                                       <th
                                           className="sorting"
                                           tabIndex={0}
                                           aria-controls="example5"
                                           rowSpan={1}
                                           colSpan={1}
                                           aria-label="Status: activate to sort column ascending"
                                           style={{width: 10}}
                                       >
                                           Acciones
                                       </th>
                                   </tr>
                                   </thead>
                                   <tbody>
                                   {tenants.map((tenant, index) => (
                                       <tr role="row" className="odd">
                                           <td className="doctor_checkbox">
                                               <div className="d-flex align-items-center">
                                                   <div className="checkbox text-right align-self-center">
                                                       <div className="form-check custom-checkbox ">
                                                           <input
                                                               type="checkbox"
                                                               onClick={() => chackboxFun(tenant.id)}
                                                               className="form-check-input"
                                                               id="customCheckBox2"
                                                               required
                                                           />
                                                           <label
                                                               className="form-check-label"
                                                               htmlFor="customCheckBox2"
                                                           />
                                                       </div>
                                                   </div>
                                               </div>
                                           </td>
                                           <td>{`#T-${tenant.id.toString().padStart(4, '0')}`}</td>
                                           <td>{tenant.tenantName}</td>
                                           <td>{tenant.contactEmail}</td>
                                           <td>
                                               <Link
                                                   to="/tenant-details"
                                                   className="btn btn-primary light btn-rounded btn-sm text-nowrap"
                                               >
                                                   {tenant.contactPhone}
                                               </Link>
                                           </td>
                                           <td>{tenant.address}</td>
                                           <td>
                                            <span className="font-w500">
                                                {formatDateUtils(tenant.subscriptionStartDate) || 'N/A'}
                                            </span>
                                           </td>
                                           <td>
                                            <span className="font-w500">
                                                {formatDateUtils(tenant.subscriptionEndDate) || 'N/A'}
                                            </span>
                                           </td>
                                           <td>
                                               <div className="d-flex align-items-center">
                                                <span
                                                    className={`${tenant.active ? 'text-primary' : 'text-danger'} font-w600`}>
                                                      {(tenant.active ? 'ACTIVO' : 'INACTIVO')}
                                                </span>
                                               </div>
                                           </td>
                                           <td>
                                               <div className="d-flex align-items-center">
                                                   <Dropdown className="dropdown ms-auto text-right">
                                                       <Dropdown.Toggle
                                                           variant=""
                                                           className="btn-link i-false"
                                                       >
                                                           <svg
                                                               width={24}
                                                               height={24}
                                                               viewBox="0 0 24 24"
                                                               fill="none"
                                                               xmlns="http://www.w3.org/2000/svg"
                                                           >
                                                               <path
                                                                   d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z"
                                                                   stroke="#3E4954"
                                                                   strokeWidth={2}
                                                                   strokeLinecap="round"
                                                                   strokeLinejoin="round"
                                                               />
                                                               <path
                                                                   d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z"
                                                                   stroke="#3E4954"
                                                                   strokeWidth={2}
                                                                   strokeLinecap="round"
                                                                   strokeLinejoin="round"
                                                               />
                                                               <path
                                                                   d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z"
                                                                   stroke="#3E4954"
                                                                   strokeWidth={2}
                                                                   strokeLinecap="round"
                                                                   strokeLinejoin="round"
                                                               />
                                                           </svg>
                                                       </Dropdown.Toggle>
                                                       <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                                                           <Dropdown.Item
                                                               as={Link}
                                                               to={`/tenant-details/${tenant.id}`}
                                                           >
                                                               Ver Detalles
                                                           </Dropdown.Item>
                                                           <Dropdown.Item
                                                               as={Link}
                                                               to={`/tenant-details/${tenant.id}`}
                                                           >
                                                               Editar
                                                           </Dropdown.Item>
                                                           <Dropdown.Item
                                                               onClick={() => handleDeleteTenant(tenant.id)}
                                                           >
                                                               Eliminar
                                                           </Dropdown.Item>
                                                       </Dropdown.Menu>
                                                   </Dropdown>
                                               </div>
                                           </td>
                                       </tr>
                                   ))}
                                   </tbody>
                               </table>

                           )}
                           {!loading && tenants.length === 0 && !error && (
                               <p className="text-center">No se encontraron tenants</p>
                           )}
                           {error && (
                               <div className="alert alert-danger">{error}</div>
                           )}
                           <div className="d-sm-flex text-center justify-content-between align-items-center">
                               <div
                                   className="dataTables_info"
                                   id="example5_info"
                                   role="status"
                                   aria-live="polite"
                               >
                                   Showing {activePag.current * sort + 1} to{" "}
                                   {data.length > (activePag.current + 1) * sort
                                       ? (activePag.current + 1) * sort
                                       : data.length}{" "}
                                   of {data.length} entries
                               </div>
                               <div
                                   className="dataTables_paginate paging_simple_numbers d-flex  justify-content-center align-items-center pb-3">
                                   <Link
                                       className="paginate_button previous disabled"
                                       to="/tenant-details"
                                       onClick={() =>
                                           activePag.current > 0 &&
                                           onClick(activePag.current - 1)
                                       }
                                   >
                                       Previous
                                   </Link>
                                   <span>
                              {paggination.map((number, i) => (
                                  <Link
                                      key={i}
                                      className={`paginate_button  ${
                                          activePag.current === i ? "current" : ""
                                      } ${i > 0 ? "ms-1" : ""}`}
                                      to="/tenant-details"
                                      onClick={() => onClick(i)}
                                  >
                                      {number}
                                  </Link>
                              ))}
                           </span>
                                   <Link
                                       className="paginate_button next disabled"
                                       to="/tenant-details"
                                       onClick={() =>
                                           activePag.current + 1 < paggination.length &&
                                           onClick(activePag.current + 1)
                                       }
                                   >
                                       Next
                                   </Link>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>

           <div className="row">
               <div className="col-xl-9 col-xxl-8 col-lg-12">
                   <div className="card">
                       <div className="card-header border-0 pb-0">
                           <h3 className="fs-20 mb-0 text-black">
                               Top Rated Doctors
                           </h3>
                           <Link to="/reviews" className="text-primary font-w500">
                               View more &gt;&gt;
                           </Link>
                       </div>
                       <div className="card-body">
                           <div className="">
                               <Slider {...settings} className="assigned-doctor owl-carousel">
                                   <div className="items owl-item">
                                       <div className="text-center">
                                           <img src={DrAlexandro} alt="profile"/>
                                           <div className="dr-star">
                                               <i className="las la-star"/> 4.2
                                           </div>
                                           <h5 className="fs-16 mb-1 font-w600">
                                               <Link className="text-black" to="/reviews">
                                                   Dr. Alexandro Jr.
                                               </Link>
                                           </h5>
                                           <span className="text-primary mb-2 d-block">
                                    Dentist
                                 </span>
                                           <p className="fs-12">
                                               795 Folsom Ave, Suite 600 San Francisco,
                                               CADGE 94107
                                           </p>
                                           <div className="social-media">
                                               <Link to="#">
                                                   <i className="lab la-instagram"/>
                                               </Link>
                                               <Link to="#">
                                                   <i className="lab la-facebook-f"/>
                                               </Link>
                                               <Link to="#">
                                                   <i className="lab la-twitter"/>
                                               </Link>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="items owl-item">
                                       <div className="text-center">
                                           <img src={DrSamantha} alt="profile"/>
                                           <div className="dr-star">
                                               <i className="las la-star"/> 4.2
                                           </div>
                                           <h5 className="fs-16 mb-1 font-w600">
                                               <Link className="text-black" to="/reviews">
                                                   Dr. Samantha
                                               </Link>
                                           </h5>
                                           <span className="text-primary mb-2 d-block">
                                    Physical Therapy
                                 </span>
                                           <p className="fs-12">
                                               795 Folsom Ave, Suite 600 San Francisco,
                                               CADGE 94107
                                           </p>
                                           <div className="social-media">
                                           <Link to="/">
                                                   <i className="lab la-instagram"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-facebook-f"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-twitter"/>
                                               </Link>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="items owl-item">
                                       <div className="text-center">
                                           <img src={DrAliandro} alt="profile"/>
                                           <div className="dr-star">
                                               <i className="las la-star"/> 4.2
                                           </div>
                                           <h5 className="fs-16 mb-1 font-w600">
                                               <Link className="text-black" to="/reviews">
                                                   Dr. Aliandro M
                                               </Link>
                                           </h5>
                                           <span className="text-primary mb-2 d-block">
                                    Nursing
                                 </span>
                                           <p className="fs-12">
                                               795 Folsom Ave, Suite 600 San Francisco,
                                               CADGE 94107
                                           </p>
                                           <div className="social-media">
                                               <Link to="/">
                                                   <i className="lab la-instagram"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-facebook-f"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-twitter"/>
                                               </Link>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="items owl-item">
                                       <div className="text-center">
                                           <img src={DrMelinda} alt="profile"/>
                                           <div className="dr-star">
                                               <i className="las la-star"/> 4.2
                                           </div>
                                           <h5 className="fs-16 mb-1 font-w600">
                                               <Link className="text-black" to="/reviews">
                                                   Dr. Samuel
                                               </Link>
                                           </h5>
                                           <span className="text-primary mb-2 d-block">
                                    Gynecologist
                                 </span>
                                           <p className="fs-12">
                                               795 Folsom Ave, Suite 600 San Francisco,
                                               CADGE 94107
                                           </p>
                                           <div className="social-media">
                                               <Link to="/">
                                                   <i className="lab la-instagram"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-facebook-f"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-twitter"/>
                                               </Link>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="items owl-item">
                                       <div className="text-center">
                                           <img src={DrSamuel} alt="profile"/>
                                           <div className="dr-star">
                                               <i className="las la-star"/> 4.2
                                           </div>
                                           <h5 className="fs-16 mb-1 font-w600">
                                               <Link className="text-black" to="/reviews">
                                                   Dr. Melinda
                                               </Link>
                                           </h5>
                                           <span className="text-primary mb-2 d-block">
                                    Dentist
                                 </span>
                                           <p className="fs-12">
                                               795 Folsom Ave, Suite 600 San Francisco,
                                               CADGE 94107
                                           </p>
                                           <div className="social-media">
                                               <Link to="/">
                                                   <i className="lab la-instagram"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-facebook-f"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-twitter"/>
                                               </Link>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="items owl-item">
                                       <div className="text-center">
                                           <img src={DrSamantha} alt="profile"/>
                                           <div className="dr-star">
                                               <i className="las la-star"/> 4.2
                                           </div>
                                           <h5 className="fs-16 mb-1 font-w600">
                                               <Link className="text-black" to="/reviews">
                                                   Dr. Alexandro Jr.
                                               </Link>
                                           </h5>
                                           <span className="text-primary mb-2 d-block">
                                    Dentist
                                 </span>
                                           <p className="fs-12">
                                               795 Folsom Ave, Suite 600 San Francisco,
                                               CADGE 94107
                                           </p>
                                           <div className="social-media">
                                               <Link to="/">
                                                   <i className="lab la-instagram"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-facebook-f"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-twitter"/>
                                               </Link>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="items owl-item">
                                       <div className="text-center">
                                           <img src={DrAliandro} alt="profile"/>
                                           <div className="dr-star">
                                               <i className="las la-star"/> 4.2
                                           </div>
                                           <h5 className="fs-16 mb-1 font-w600">
                                               <Link className="text-black" to="/reviews">
                                                   Dr. Aliandro M
                                               </Link>
                                           </h5>
                                           <span className="text-primary mb-2 d-block">
                                    Nursing
                                 </span>
                                           <p className="fs-12">
                                               795 Folsom Ave, Suite 600 San Francisco,
                                               CADGE 94107
                                           </p>
                                           <div className="social-media">
                                               <Link to="/">
                                                   <i className="lab la-instagram"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-facebook-f"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-twitter"/>
                                               </Link>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="items owl-item">
                                       <div className="text-center">
                                           <img src={DrMelinda} alt="profile"/>
                                           <div className="dr-star">
                                               <i className="las la-star"/> 4.2
                                           </div>
                                           <h5 className="fs-16 mb-1 font-w600">
                                               <Link className="text-black" to="/reviews">
                                                   Dr. Samuel
                                               </Link>
                                           </h5>
                                           <span className="text-primary mb-2 d-block">
                                    Gynecologist
                                 </span>
                                           <p className="fs-12">
                                               795 Folsom Ave, Suite 600 San Francisco,
                                               CADGE 94107
                                           </p>
                                           <div className="social-media">
                                               <Link to="/">
                                                   <i className="lab la-instagram"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-facebook-f"/>
                                               </Link>
                                               <Link to="/">
                                                   <i className="lab la-twitter"/>
                                               </Link>
                                           </div>
                                       </div>
                                   </div>
                               </Slider>
                           </div>
                       </div>
                   </div>
               </div>
               <div className="col-xl-3 col-xxl-4 col-lg-12">
                   <div className="card border-0 pb-0">
                       <div className="card-header flex-wrap border-0 pb-0">
                           <h3 className="fs-20 mb-0 text-black">Recent Patient</h3>
                           <Link
                               to="/patient-list"
                               className="text-primary font-w500"
                           >
                               View more &gt;&gt;
                           </Link>
                       </div>
                       <div className="card-body p-0">
                           <div
                               id="DZ_W_Todo2"
                               className="widget-media dz-scroll height320 my-4 px-4"
                           >
                               <ul className="timeline">
                                   <li>
                                       <div className="timeline-panel flex-wrap">
                                           <div className="media me-3">
                                               <img
                                                   className="rounded-circle"
                                                   alt="widget"
                                                   width={50}
                                                   src={widget01}
                                               />
                                           </div>
                                           <div className="media-body">
                                               <h5 className="mb-1">
                                                   <Link
                                                       className="text-black"
                                                       to="/patient-details"
                                                   >
                                                       Aziz Bakree
                                                   </Link>
                                               </h5>
                                               <span className="fs-14">24 Years</span>
                                           </div>
                                           <Link to="/" className="text-warning mt-2">
                                               Pending
                                           </Link>
                                       </div>
                                   </li>
                                   <li>
                                       <div className="timeline-panel flex-wrap">
                                           <div className="media me-3">
                                               <img
                                                   className="rounded-circle"
                                                   alt="widget"
                                                   width={50}
                                                   src={widget02}
                                               />
                                           </div>
                                           <div className="media-body">
                                               <h5 className="mb-1">
                                                   <Link
                                                       className="text-black"
                                                       to="/patient-details"
                                                   >
                                                       Griezerman
                                                   </Link>
                                               </h5>
                                               <span className="fs-14">24 Years</span>
                                           </div>
                                           <Link to="/" className="text-info mt-2">
                                               On Recovery
                                           </Link>
                                       </div>
                                   </li>
                                   <li>
                                       <div className="timeline-panel flex-wrap">
                                           <div className="media me-3">
                                               <img
                                                   className="rounded-circle"
                                                   alt="widget"
                                                   width={50}
                                                   src={widget03}
                                               />
                                           </div>
                                           <div className="media-body">
                                               <h5 className="mb-1">
                                                   <Link
                                                       className="text-black"
                                                       to="/patient-details"
                                                   >
                                                       Oconner
                                                   </Link>
                                               </h5>
                                               <span className="fs-14">24 Years</span>
                                           </div>
                                           <Link to="/" className="text-danger mt-2">
                                               Rejected
                                           </Link>
                                       </div>
                                   </li>
                                   <li>
                                       <div className="timeline-panel flex-wrap">
                                           <div className="media me-3">
                                               <img
                                                   className="rounded-circle"
                                                   alt="widget"
                                                   width={50}
                                                   src={widget05}
                                               />
                                           </div>
                                           <div className="media-body">
                                               <h5 className="mb-1">
                                                   <Link
                                                       className="text-black"
                                                       to="/patient-details"
                                                   >
                                                       Uli Trumb
                                                   </Link>
                                               </h5>
                                               <span className="fs-14">24 Years</span>
                                           </div>
                                           <Link to="/" className="text-primary mt-2">
                                               Recovered
                                           </Link>
                                       </div>
                                   </li>
                                   <li>
                                       <div className="timeline-panel flex-wrap">
                                           <div className="media me-3">
                                               <img
                                                   className="rounded-circle"
                                                   alt="widget"
                                                   width={50}
                                                   src={widget01}
                                               />
                                           </div>
                                           <div className="media-body">
                                               <h5 className="mb-1">
                                                   <Link
                                                       className="text-black"
                                                       to="/patient-details"
                                                   >
                                                       Aziz Bakree
                                                   </Link>
                                               </h5>
                                               <span className="fs-14">24 Years</span>
                                           </div>
                                           <Link to="/" className="text-warning mt-2">
                                               Pending
                                           </Link>
                                       </div>
                                   </li>
                                   <li>
                                       <div className="timeline-panel flex-wrap">
                                           <div className="media me-3">
                                               <img
                                                   className="rounded-circle"
                                                   alt="widget"
                                                   width={50}
                                                   src={widget02}
                                               />
                                           </div>
                                           <div className="media-body">
                                               <h5 className="mb-1">
                                                   <Link
                                                       className="text-black"
                                                       to="/patient-details"
                                                   >
                                                       Aziz Bakree
                                                   </Link>
                                               </h5>
                                               <span className="fs-14">24 Years</span>
                                           </div>
                                           <Link to="/" className="text-warning mt-2">
                                               Pending
                                           </Link>
                                       </div>
                                   </li>
                               </ul>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
   );
};

export default HomeAdmin;
