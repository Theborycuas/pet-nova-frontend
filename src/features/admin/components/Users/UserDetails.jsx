import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';

import {deleteUserById, getUserById} from "../../api/userEndpoints.js";
import {Button, Dropdown} from "react-bootstrap";
import defaultAvatar from "../../../../assets/images/avatar/1.jpg";
import Alert from "sweetalert2";
import Swal from "sweetalert2";
import {Alerts} from "../../../../utils/alerts.js";



const StaffProfile = () => {

    const [user, setUser] = useState(null);
    const {userId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUser = async () => {
        setLoading(true);
        setError(null);
        const startTime = Date.now();
        try {
            const [u] = await Promise.all([
                getUserById(userId)
            ]);
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
            setUser(u);
        }catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, [userId]);

    const navigate = useNavigate();

    function handleDeleteUser(userId) {
        Alerts.confirmDelete('usuario', () => {
            deleteUserById(userId)
                .then(() => {
                    Swal.fire('¡Eliminado!', 'El Usuario ha sido borrado.', 'success');
                    navigate('/user-admin');
                })
                .catch(err => {
                    Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
                    console.log(err);
                });
        });
    }

    return (
        <>
            <div className="page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to={"/user-admin"}>User Admin</Link></li>
                    <li className="breadcrumb-item active"><Link to={"#"}>User Profile</Link></li>
                </ol>
            </div>
            <div className="form-head d-flex mb-3 mb-md-4 align-items-start">
                <div className="me-auto d-lg-block">
                    <h3 className="text-black font-w600">Detalles del Usuario</h3>
                </div>
            </div>
            {!loading && (
                <div className="d-block d-sm-flex mb-3 mb-md-4">
                    <Link className="btn btn-primary font-w600 mb-2 me-auto"

                    >+ Add </Link>
                    <Button variant={`${user.active ? 'success' : 'danger'} btn-rounded mb-2 d-inline-block`}>
                                              <span
                                                  className={`btn-icon-start ${user.active ? 'text-success' : 'text-danger'}`}>
                                                <i className={`fa ${user.active ? 'fa-check color-success' : 'fa-cancel color-danger'}`}/>
                                              </span>
                        {(user.active ? 'ACTIVO' : 'INACTIVO')}
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
                            <Dropdown.Item className="dropdown-item"
                                           as={Link}
                                           to={`/edit-user/${user.id}`}
                            >
                                Editar
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="dropdown-item"
                                onClick={() => handleDeleteUser(user.id)}
                            >
                                Borrar
                            </Dropdown.Item>
                            <Dropdown.Item className="dropdown-item" to="#">
                                Otros
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                {loading && (
                                    <div className="text-center my-5">
                                        <div className="spinner-grow text-success" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                        <p className="mt-2">Cargando información del usuario...</p>
                                    </div>
                                )}
                                {!loading && (
                                    <div className="col-xl-8">
                                        <div className="profile">
                                            <div className="staff">
                                                <img src={user.avatarUrl || defaultAvatar} alt=""/>
                                            </div>
                                            <div className="staf-info">
                                                <div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <h4 className="mb-0">Name :</h4><p
                                                        className="ms-2 mb-0">{user.name}</p>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <h4 className="mb-0">Gender :</h4><p
                                                        className="ms-2 mb-0">Female</p>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <h4 className="mb-0">Degrer :</h4><p
                                                        className="ms-2 mb-0">BSN</p>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <h4 className="mb-0">Designation :</h4><p
                                                        className="ms-2 mb-0">Nurse</p>
                                                    </div>
                                                </div>
                                                <div className="location mt-4">
                                                    <div>
                                                        <span><i
                                                            className="fa fa-phone me-2 text-primary"/>{user.phoneNumber}</span>
                                                        <span><i
                                                            className="fa fa-envelope me-2 text-primary"/>{user.email}</span>
                                                    </div>
                                                    <div className="mb-3">
                                                        <span><i
                                                            className="fa fa-id-card text-secondary me-2"/> {user.idNumber}</span>
                                                        <span><i
                                                            className="fa-solid fa-location-dot me-2 text-secondary"/>{user.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                {loading && (
                                    <div className="text-center my-5">
                                    <div className="spinner-grow text-success" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                        <p className="mt-2">Cargando mascotas del usuario...</p>
                                    </div>
                                )}
                                {!loading && (
                                    <div className="col-xl-4">
                                        <div
                                            className="d-flex justify-content-between border-bottom mb-3 pb-2 mt-xl-0 mt-3">
                                            <span className="font-w600 text-black">Perros</span>
                                            <span>500</span>
                                        </div>
                                        <div className="d-flex justify-content-between border-bottom mb-3 pb-2">
                                            <span className="font-w600 text-black">Gatos</span>
                                            <span>300</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="font-w600 text-black">Friends</span>
                                            <span>300</span>
                                        </div>
                                        <div className="mt-4">
                                            <button to={"#"} className="btn btn-primary me-3">Follow</button>
                                            <button to={"#"} className="btn btn-secondary">Message</button>
                                        </div>
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}
                                <div className="col-lg-12">
                                    <hr/>
                                    <h4 className="fs-20 font-w600">Citas Asistidas</h4>
                                    <div className="staff-info">
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>Identify patients’ care
                                            requirements, focus on their needs and act on them</p>
                                        <p><i className="fas fa-dot-circle me-2 text-primary "/>Nurture a compassionate
                                            environment by providing psychological support</p>
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>Resolve or report on
                                            patients’ needs or problems</p>
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>Prepare patients for
                                            examinations and perform routine diagnostic checks (monitor pulse, blood
                                            pressure and temperature, provide drugs and injections etc)</p>
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>Monitor and record
                                            patient’s condition and document provided care services</p>
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>Treat medical emergencies
                                        </p>
                                    </div>
                                    <hr/>
                                    <h4 className="fs-20 font-w600">Tratamientos a sus mascotas</h4>
                                    <div className="staff-info">
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>Lorem Ipsum is simply
                                            dummy text of the printing and typesetting industrypsychological suppor.</p>
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>Nurture a compassionate
                                            environment by providing psychological support</p>
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>Lorem Ipsum is simply
                                            dummy text of the printing and typesetting industry psychological suppor.
                                        </p>
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>PLorem Ipsum is simply
                                            dummy text of the printing and typesetting industry.</p>
                                        <p><i className="fas fa-dot-circle me-2 text-primary"/>Monitor and record
                                            patient’s condition and document provided care services</p>
                                    </div>
                                    <hr/>
                                    <div className="col-lg-12">
                                        <h4 className="fs-20 font-w600">Historial medico de mascotas</h4>
                                        <div className="staff-info">
                                            <p><i className="fas fa-dot-circle me-2 text-primary"/>Lorem Ipsum is simply
                                                dummy text of the printing and typesetting industrypsychological suppor.
                                            </p>
                                            <p><i className="fas fa-dot-circle me-2 text-primary"/>Nurture a
                                                compassionate environment by providing psychological support</p>
                                            <p><i className="fas fa-dot-circle me-2 text-primary"/>Lorem Ipsum is simply
                                                dummy text of the printing and typesetting industry psychological
                                                suppor.</p>
                                        </div>
                                        <hr/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StaffProfile;