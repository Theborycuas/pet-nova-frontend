import React, {useContext, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {ThemeContext} from "../../../../context/ThemeContext.jsx"

// Images
import doctors9 from "../../../../assets/images/doctors/9.jpg";
import {Dropdown} from "react-bootstrap";
import {deleteOfficeById, getAllOffices} from "../../api/officeEndpoints.js";
import {formatDateTimeUtils} from "../../../../utils/formatters.js";
import {Alerts} from "../../../../utils/alerts.js";
import Swal from "sweetalert2";
import {getAllUsers} from "../../api/userEndpoints.js";
import avat2 from "../../../../assets/images/avatar/2.jpg";
import avat1 from "../../../../assets/images/avatar/1.jpg";
import avat6 from "../../../../assets/images/avatar/6.jpg";
import avat3 from "../../../../assets/images/avatar/3.jpg";
import avat4 from "../../../../assets/images/avatar/4.jpg";
import avat5 from "../../../../assets/images/avatar/5.jpg";

const UserAdmin = () => {
    const [users, setUsers] = useState([]);
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
    }, [users]);

    function handleDeleteUser(officeId) {
        Alerts.confirmDelete('usuario', () => {
            deleteOfficeById(officeId)
                .then(() => {
                    setUsers(current => current.filter(o => o.id !== officeId));
                    Swal.fire('¡Eliminado!', 'El usuario ha sido borrado.', 'success');
                })
                .catch(err => {
                    Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
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

   const { changeBackground } = useContext(ThemeContext);
   useEffect(() => {
       changeBackground({ value: "light", label: "Light" });
   }, []);


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
                                               <th>Rol</th>
                                               <th>Email</th>
                                               <th>Teléfono</th>
                                               <th>Cédula</th>
                                               <th>Dirección</th>
                                               <th>Action</th>
                                           </tr>
                                           </thead>
                                           <tbody>
                                           {users.map((user, ind) => (
                                               <tr className="odd" key={ind}>
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
                                                            <img src={user.avatarUrl} alt=""/>
                                                        </span>
                                                       <span className="text-nowrap ms-2">{user.name}</span>
                                                   </td>
                                                   <td>
                                                       <span>{user.role.roleName}</span>
                                                   </td>

                                                   <td className="text-primary">{user.email}</td>
                                                   <td className="text-primary">{user.phoneNumber}</td>
                                                   <td>{user.idNumber}</td>

                                                   <td>{user.address}</td>
                                                   <td>
                                                        <span className="me-3">
                                                            <Link to={"/staff-profile"}><i className="fa fa-eye fs-18"></i></Link>
                                                        </span>
                                                       <span className="me-3">
                                                            <Link to={"#"} className="edit-staff"><i
                                                                className="fa fa-pencil fs-18 text-success"></i></Link>
                                                        </span>
                                                       <span>
                                                            <i className="fa fa-trash-o fs-18 text-danger"></i>
                                                        </span>
                                                   </td>
                                               </tr>
                                           ))}

                                           </tbody>
                                       </table>
                                   )}
                                   {!loading && users.length === 0 && !error && (
                                       <p className="text-center">No se encontraron Consultorios</p>
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
                                               to="#"
                                               className="paginate_button previous disabled"
                                               aria-controls="example5"
                                               data-dt-idx={0}
                                               tabIndex={0}
                                               id="example5_previous"
                                               onClick={() =>
                                                   activePag.current > 0 &&
                                                   onClick(activePag.current - 1)
                                               }
                                           >
                                               Previous
                                           </Link>
                                           <span className="d-flex">
                                            {paggination.map((number, i) => (
                                                <Link
                                                    key={i}
                                                    to="#"
                                                    className={`paginate_button d-flex align-items-center justify-content-center ${
                                                        activePag.current === i ? "current" : ""
                                                    } ${i > 0 ? "ms-1" : ""}`}
                                                    aria-controls="example5"
                                                    data-dt-idx={1}
                                                    tabIndex={0}
                                                    onClick={() => onClick(i)}
                                                >
                                                    {number}
                                                </Link>
                                            ))}
                                        </span>

                                           <Link
                                               to="#"
                                               className="paginate_button next disabled"
                                               aria-controls="example5"
                                               data-dt-idx={2}
                                               tabIndex={0}
                                               id="example5_next"
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

               </div>
           </div>
       </div>
   );
};

export default UserAdmin;
