import React, {useContext, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../../../../assets/css/custom-table.css';

/*import {ThemeContext} from "../../../../context/ThemeContext.jsx"*/

// Images
import {deleteOfficeById} from "../../api/officeEndpoints.js";
import {Alerts} from "../../../../utils/alerts.js";
import Swal from "sweetalert2";
import {deleteUserById, getAllUsers} from "../../api/userEndpoints.js";
import defaultAvatar from "../../../../assets/images/avatar/1.jpg"
import {Button, Dropdown} from "react-bootstrap";

const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

    const [data, setData] = useState(
        document.querySelectorAll("#doctor_list tbody tr")
    );
    const sort = 10;
    const activePag = useRef(0);


    // Carga todos los users
    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        const startTime = Date.now();
        try {
            const { data } = await getAllUsers();
            // Espera al menos 500ms para evitar parpadeos
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // use effect
    useEffect(() => {
        loadUsers();
        setData(document.querySelectorAll("#doctor_list tbody tr"));
    }, []);


    // Active pagginarion
    const paginatedUsers = users.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

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

/*   const { changeBackground } = useContext(ThemeContext);
   useEffect(() => {
       changeBackground({ value: "light", label: "Light" });
   }, []);*/

   function handleDeleteUser(userId) {
       Alerts.confirmDelete('usuario', () => {
           deleteUserById(userId)
               .then(() => {
                   setUsers(current => current.filter(o => o.id !== userId));
                   Swal.fire('Eliminado!', 'El Usuario a sido Borraod!', 'success');
               })
               .catch(err => {
                   Swal.fire('Error', 'No se pudo eliminar el tenant.', 'error');
                   console.log(err);
               });
       });
   }


   return (
       <div>
           <div className="form-head d-flex mb-3 mb-md-4 align-items-start">
               <div className="me-auto d-lg-block">
                   <h3 className="text-black font-w600">Bienvenido!</h3>
                   <p className="mb-0 fs-18">Desde este espacio podrás administrar los Usuarios de PetNova</p>
               </div>
           </div>

           <div className="form-head d-flex mb-3 mb-md-4 align-items-start">

               <div className="me-auto d-lg-block">
                   <Link
                       to="/add-users"
                       className="btn btn-primary btn-rounded"
                   >
                       + Agregar Usuario
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

           {/* Table Users*/}
           <div className="row">
               <div className="col-xl-12">
                   <div className="card">
                       <div className="card-body">
                           <div className="table-responsive">
                               <div id="staff" className="dataTables_wrapper no-footer">
                                   {loading && (
                                       <div className="text-center my-5">
                                           <div className="spinner-grow text-success" role="status">
                                               <span className="visually-hidden">Cargando...</span>
                                           </div>
                                           <p className="mt-2">Cargando usuarios...</p>
                                       </div>
                                   )}
                                   {!loading && users.length > 0 && (

                                       <table id="example5"
                                              className="table table-striped patient-list mb-4 dataTablesCard fs-14 dataTable no-footer">
                                           <thead>
                                           <tr role="row">
                                               <th
                                                   className="patient_strg"
                                                   tabIndex={0}
                                                   rowSpan={1}
                                                   colSpan={1}
                                                   style={{width: 24}}
                                               >
                                                   <div className="checkbox text-right align-self-center">
                                                       <div className="form-check custom-checkbox ">
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
                                               <th>Nombre</th>
                                               <th>Estado</th>
                                               <th>Rol</th>
                                               <th className="hide-on-mobile hide-on-table">Email</th>
                                               <th className="hide-on-mobile hide-on-table">Teléfono</th>
                                               <th className="hide-on-mobile hide-on-table">Cédula</th>
                                               <th className="hide-on-mobile hide-on-table">Ciudad</th>
                                               <th>Acciones</th>
                                           </tr>
                                           </thead>
                                           <tbody>
                                           {paginatedUsers.map((user, ind) => (
                                               <tr key={user.id}>
                                                   <td className="patient_checkbox">
                                                       <div className="checkbox text-right align-self-center">
                                                           <div className="form-check custom-checkbox ">
                                                               <input
                                                                   type="checkbox"
                                                                   onClick={() => chackboxFun()}
                                                                   className="form-check-input"
                                                                   id="customCheckBox1"
                                                                   required
                                                               />
                                                               <label
                                                                   className="form-check-label"
                                                                   htmlFor="customCheckBox1"
                                                               />
                                                           </div>
                                                       </div>
                                                   </td>
                                                   <td className="patient-info ps-0">
                                                        <span>
                                                            <img src={user.avatarUrl || defaultAvatar} alt=""/>
                                                        </span>
                                                       <span className="text-nowrap ms-2">{user.name}</span>
                                                   </td>
                                                   <td>
                                                       <Button
                                                           variant={`${user.active ? 'success' : 'danger'} btn-sm btn-rounded mb-1`}
                                                           className="d-inline-flex align-items-center"
                                                       >
                                                           <i className={`fa ${user.active ? 'fa-check text-white' : 'fa-times text-white'} me-1`}/>
                                                           {user.active ? 'ACTIVO' : 'INACTIVO'}
                                                       </Button>
                                                   </td>
                                                   <td>
                                                       <span>{user.role.roleName}</span>
                                                   </td>
                                                   <td className="text-primary hide-on-mobile hide-on-table">{user.email}</td>
                                                   <td className="text-primary hide-on-mobile hide-on-table">{user.phoneNumber}</td>
                                                   <td className="hide-on-mobile hide-on-table">{user.idNumber}</td>

                                                   <td className="hide-on-mobile hide-on-table">{user.city}</td>
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
                                                               <Dropdown.Menu
                                                                   className="dropdown-menu dropdown-menu-right">
                                                                   <Dropdown.Item
                                                                       as={Link}
                                                                       to={`/user-details/${user.id}`}
                                                                   >
                                                                       Ver Detalles
                                                                   </Dropdown.Item>
                                                                   <Dropdown.Item
                                                                       as={Link}
                                                                       to={`/edit-user/${user.id}`}
                                                                   >
                                                                       Editar
                                                                   </Dropdown.Item>
                                                                   <Dropdown.Item
                                                                       onClick={() => handleDeleteUser(user.id)}
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
                                   {!loading && users.length === 0 && !error && (
                                       <p className="text-center">No se encontraron Usuarios</p>
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
                                               aria-controls="example5"
                                               data-dt-idx={0}
                                               tabIndex={0}
                                               id="previous"
                                               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                                               disabled={currentPage === 0}
                                           >
                                               Anterior
                                           </Link>
                                           <span>
                                              {pageNumbers.map((number) => (
                                                  <button
                                                      key={number}
                                                      className={`paginate_button ${currentPage === number ? 'current' : ''} ${number > 0 ? 'ms-1' : ''}`}
                                                      onClick={() => setCurrentPage(number)}
                                                  >
                                                      {number + 1}
                                                  </button>
                                              ))}
                                            </span>

                                           <Link
                                               to="#"
                                               className="paginate_button next disabled"
                                               aria-controls="example5"
                                               data-dt-idx={2}
                                               tabIndex={0}
                                               id="next"
                                               onClick={() =>
                                                   setCurrentPage(prev =>
                                                       prev + 1 < Math.ceil(users.length / itemsPerPage) ? prev + 1 : prev
                                                   )
                                               }
                                               disabled={currentPage + 1 >= Math.ceil(users.length / itemsPerPage)}
                                           >
                                               Siguiente
                                           </Link>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>

               </div>
           </div>
       </div>
   );
};

export default UserAdmin;
