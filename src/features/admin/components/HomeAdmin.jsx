import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/*import {ThemeContext} from "../../../context/ThemeContext.jsx"*/
// Images
import DrAlexandro from "../../../assets/images/doctors/5.jpg";
import DrSamantha from "../../../assets/images/doctors/1.jpg";
import DrAliandro from "../../../assets/images/doctors/2.jpg";
import DrSamuel from "../../../assets/images/doctors/4.jpg";
import DrMelinda from "../../../assets/images/doctors/3.jpg";
import widget01 from "../../../assets/images/widget/1.jpg";
import widget1 from "../../../assets/images/widget/1.jpg";
import widget02 from "../../../assets/images/widget/2.jpg";
import widget03 from "../../../assets/images/widget/3.jpg";
import widget05 from "../../../assets/images/widget/5.jpg";
import widget5 from "../../../assets/images/widget/5.jpg";
import {deleteTenantById, getAllTenants, getRecentInactiveTenants} from "../api/tenantEndpoints.js";
import {Alerts} from "../../../utils/alerts.js";
import Swal from "sweetalert2";
import widget6 from "../../../assets/images/widget/6.jpg";
import widget7 from "../../../assets/images/widget/7.jpg";
import widget8 from "../../../assets/images/widget/8.jpg";
import {Button} from "react-bootstrap";

const HomeAdmin = () => {
    const [inactiveTenants, setInactiveTenants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const [data, setData] = useState(
        document.querySelectorAll("#doctor_list tbody tr")
    );


    // Carga todos los InactiveTenants
    const loadTenants = async () => {
        setLoading(true);
        setError(null);
        try {
            const {data} = await getRecentInactiveTenants();
            const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setInactiveTenants(sorted);
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
    }, []);

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
        focusOnSelect: false,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        speed: 500,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },

            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
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
    /*   const { changeBackground } = useContext(ThemeContext);
       useEffect(() => {
           changeBackground({ value: "light", label: "Light" });
       }, []);*/


    return (
        <div>
            <div className="form-head d-flex mb-3 mb-md-4 align-items-start">
                <div className="me-auto d-lg-block">
                    <h3 className="text-black font-w600">Bienvenido!</h3>
                    <p className="mb-0 fs-18">Desde este espacio podrás administrar PetNova</p>
                </div>
            </div>

            <div className="form-head d-flex mb-3 mb-md-4 align-items-start">

                <div className="me-auto d-lg-block">
                    {/*<Link
                       to="/add-InactiveTenants"
                       className="btn btn-primary btn-rounded"
                   >
                       + Agregar nuevo Tenant
                   </Link>*/}
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

            <div className="row">
                <div className="col-xl-9 col-xxl-8 col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h3 className="fs-20 mb-0 text-black">
                                Tenants Registrados Inactivos
                            </h3>
                            <Link to="/reviews" className="text-primary font-w500">
                                View more &gt;&gt;
                            </Link>
                        </div>
                        <div className="card-body">
                            <div className="">
                                <Slider {...settings} className="assigned-doctor owl-carousel">
                                    {inactiveTenants.map((tenant, index) => (
                                        <div className="items owl-item" key={tenant.id || index}>
                                            <div className="text-center">


                                                <h5 className="fs-16 mb-1 font-w600">
                                                    <Link className="text-black" to={`/tenant/${tenant.id}`}>
                                                        {tenant.tenantName}
                                                    </Link>
                                                </h5>
                                                <span className="text-danger mb-2 d-block">
                                                  {tenant.emailVerified ? 'Email verificado' : 'Email no verificado'}
                                                </span>
                                                <p className="fs-12">
                                                    Registrado el {new Date(tenant.createdAt).toLocaleDateString()}
                                                </p>
                                                <div className="social-media">
                                                    <Button
                                                        variant= "info btn-sm btn-rounded mb-1"
                                                        className="d-inline-flex align-items-center"
                                                    >
                                                        <i className= "fa fa-check text-white me-1"/>
                                                        Activar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-12 col-xxl-4">
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
            </div>
            <div className="row">

                <div className="col-xl-3 col-xxl-4 col-lg-12">
                    <div className="card border-0 pb-0">
                        <div className="card-header flex-wrap border-0 pb-0">
                            <h3 className="fs-20 mb-0 text-black">Solicitudes de Usuarios</h3>
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
                <div className="col-xl-3 col-xxl-4 col-lg-12">
                    <div className="card border-0 pb-0">
                        <div className="card-header flex-wrap border-0 pb-0">
                            <h3 className="fs-20 mb-0 text-black">Solicitudes de Usuarios</h3>
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
                <div className="col-xl-3 col-xxl-4 col-lg-12">
                    <div className="card border-0 pb-0">
                        <div className="card-header flex-wrap border-0 pb-0">
                            <h3 className="fs-20 mb-0 text-black">Solicitudes de Usuarios</h3>
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
                <div className="col-xl-3 col-xxl-4 col-lg-12">
                    <div className="card border-0 pb-0">
                        <div className="card-header flex-wrap border-0 pb-0">
                            <h3 className="fs-20 mb-0 text-black">Solicitudes de Usuarios</h3>
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

            <div className="row">
                <div className="col-xl-9 col-xxl-8 col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h3 className="fs-20 mb-0 text-black">
                                Usuarios Nuevos
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
                <div className="col-xl-3 col-lg-12 col-xxl-4">
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
            </div>

        </div>
    );
};

export default HomeAdmin;
