import React, {useEffect, useContext, useState, useRef} from "react";
import { Link } from "react-router-dom";
import loadable from "@loadable/component";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ThemeContext } from "../../context/ThemeContext.jsx"

// Images
import DrAlexandro from "../../assets/images/doctors/5.jpg";
import DrSamantha from "../../assets/images/doctors/1.jpg";
import DrAliandro from "../../assets/images/doctors/2.jpg";
import DrSamuel from "../../assets/images/doctors/4.jpg";
import DrMelinda from "../../assets/images/doctors/3.jpg";
import widget01 from "../../assets/images/widget/1.jpg";
import widget02 from "../../assets/images/widget/2.jpg";
import widget03 from "../../assets/images/widget/3.jpg";
import widget05 from "../../assets/images/widget/5.jpg";


const ApexBar3 = loadable(() => import("../../componets/charts/apexcharts/Bar3.jsx"));
const ApexLine5 = loadable(() => import("../../componets/charts/apexcharts/Line5.jsx"));

const HomeAdmin = () => {
   const [data, setData] = useState(
       document.querySelectorAll("#patient_list tbody tr")
   );
   const sort = 9;
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
   // use effect
   useEffect(() => {
      setData(document.querySelectorAll("#patient_list tbody tr"));
   }, [test]);

   // Active pagginarion
   activePag.current === 0 && chageData(0, sort);
   // paggination
   let paggination = Array(Math.ceil(data.length / sort))
       .fill()
       .map((_, i) => i + 1);

   // Active paggination & chage data
   const onClick = (i) => {
      activePag.current = i;
      chageData(activePag.current * sort, (activePag.current + 1) * sort);
      settest(i);
   };

   const chackbox = document.querySelectorAll(".patient_checkbox input");
   const motherChackBox = document.querySelector(".patient_strg input");
   // console.log(document.querySelectorAll(".all_spending_strg input")[0].checked);
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

   function SampleNextArrow(props) {
      const { onClick } = props;
      return (
         <div className="owl-next" onClick={onClick} style={{ zIndex: 2 }}>
            <i className="fa fa-caret-right" />
         </div>
      );
   }

   function SamplePrevArrow(props) {
      const { onClick } = props;
      return (
         <div
            className="owl-prev disabled"
            onClick={onClick}
            style={{ zIndex: 99 }}
         >
            <i className="fa fa-caret-left" />
         </div>
      );
   }

   const settings = {
      focusOnSelect: true,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      speed: 500,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
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
             <div className="me-auto d-none d-lg-block">
                <h3 className="text-black font-w600">Bienvenido!</h3>
                <p className="mb-0 fs-18">Desde este espacio podrás administrar los clientes de PetNova</p>
             </div>
          </div>

          <div className="form-head d-flex mb-3 mb-md-4 align-items-start">

             <div className="me-auto d-none d-lg-block">
                <Link
                    to="/patient-details"
                    className="btn btn-primary btn-rounded"
                >
                   + Add New
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

          <div className="row">
             <div className="col-xl-12">
                <div className="card">
                   <div className="card-body">
                      <div className="table-responsive">
                         <div
                             id="patient_list"
                             className="dataTables_wrapper no-footer"
                         >
                            <table
                                id="example5"
                                className="table table-striped patient-list mb-4 dataTablesCard fs-14 dataTable no-footer"
                                role="grid"
                                aria-describedby="example5_info"
                            >
                               <thead>
                               <tr role="row">
                                  <th
                                      className="patient_strg"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-sort="ascending"
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
                                  <th
                                      className="sorting"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Patient ID: activate to sort column ascending"
                                      style={{width: 79}}
                                  >
                                     Patient ID
                                  </th>
                                  <th
                                      className="sorting"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Date Check In: activate to sort column ascending"
                                      style={{width: 113}}
                                  >
                                     Date Check In
                                  </th>
                                  <th
                                      className="sorting"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Patient Name: activate to sort column ascending"
                                      style={{width: 108}}
                                  >
                                     Patient Name
                                  </th>
                                  <th
                                      className="sorting"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Doctor Assgined: activate to sort column ascending"
                                      style={{width: 135}}
                                  >
                                     Doctor Assgined
                                  </th>
                                  <th
                                      className="sorting"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Disease: activate to sort column ascending"
                                      style={{width: 68}}
                                  >
                                     Disease
                                  </th>
                                  <th
                                      className="sorting"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Status: activate to sort column ascending"
                                      style={{width: 103}}
                                  >
                                     Status
                                  </th>
                                  <th
                                      className="sorting"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Room No: activate to sort column ascending"
                                      style={{width: 75}}
                                  >
                                     Room No
                                  </th>
                                  <th
                                      className="sorting"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label=": activate to sort column ascending"
                                      style={{width: 24}}
                                  />
                                  <th
                                      className="sorting"
                                      tabIndex={0}
                                      aria-controls="example5"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label=": activate to sort column ascending"
                                      style={{width: 24}}
                                  />
                               </tr>
                               </thead>
                               <tbody>
                               <tr role="row" className="odd">
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
                                  <td>#P-00012</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>Alexia Kev</td>
                                  <td>Dr. Samantha</td>
                                  <td>Allergies &amp; Asthma</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#FFB800"
                                             />
                                          </svg>
                                          <span className="text-warning">
                                             Pending
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-002</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               <tr role="row" className="even">
                                  <td className="patient_checkbox">
                                     <div className="checkbox text-right align-self-center">
                                        <div className="form-check custom-checkbox ">
                                           <input
                                               type="checkbox"
                                               onClick={() => chackboxFun()}
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
                                  </td>
                                  <td>#P-00013</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>Andrew Stevano</td>
                                  <td>Dr. Marcus Jr</td>
                                  <td>Dental Care</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#FFB800"
                                             />
                                          </svg>
                                          <span className="text-warning">
                                             Pending
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-003</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               <tr role="row" className="odd">
                                  <td className="patient_checkbox">
                                     <div className="checkbox text-right align-self-center">
                                        <div className="form-check custom-checkbox ">
                                           <input
                                               type="checkbox"
                                               onClick={() => chackboxFun()}
                                               className="form-check-input"
                                               id="customCheckBox3"
                                               required
                                           />
                                           <label
                                               className="form-check-label"
                                               htmlFor="customCheckBox3"
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td>#P-00014</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>Brian Lucky</td>
                                  <td>Dr. David Lee</td>
                                  <td>Sleep Problem</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#2BC155"
                                             />
                                          </svg>
                                          <span className="text-primary">
                                             Recovered
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-002</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               <tr role="row" className="even">
                                  <td className="patient_checkbox">
                                     <div className="checkbox text-right align-self-center">
                                        <div className="form-check custom-checkbox ">
                                           <input
                                               type="checkbox"
                                               onClick={() => chackboxFun()}
                                               className="form-check-input"
                                               id="customCheckBox4"
                                               required
                                           />
                                           <label
                                               className="form-check-label"
                                               htmlFor="customCheckBox4"
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td>#P-00015</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>Bella Simatupang</td>
                                  <td>Dr. Olivia Jean</td>
                                  <td>Hearing Loss</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#369DC9"
                                             />
                                          </svg>
                                          <span className="text-info">
                                             On Recovery
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-005</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               <tr role="row" className="odd">
                                  <td className="patient_checkbox">
                                     <div className="checkbox text-right align-self-center">
                                        <div className="form-check custom-checkbox ">
                                           <input
                                               type="checkbox"
                                               onClick={() => chackboxFun()}
                                               className="form-check-input"
                                               id="customCheckBox5"
                                               required
                                           />
                                           <label
                                               className="form-check-label"
                                               htmlFor="customCheckBox5"
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td>#P-00016</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>Cive Slauw</td>
                                  <td>Dr. Samantha</td>
                                  <td>Diabetes</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#2BC155"
                                             />
                                          </svg>
                                          <span className="text-primary">
                                             Recovered
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-006</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               <tr role="row" className="even">
                                  <td className="patient_checkbox">
                                     <div className="checkbox text-right align-self-center">
                                        <div className="form-check custom-checkbox ">
                                           <input
                                               type="checkbox"
                                               onClick={() => chackboxFun()}
                                               className="form-check-input"
                                               id="customCheckBox6"
                                               required
                                           />
                                           <label
                                               className="form-check-label"
                                               htmlFor="customCheckBox6"
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td>#P-00017</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>David Bekam</td>
                                  <td>Dr. Kevin Zidan</td>
                                  <td>Alcoholism</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#FFB800"
                                             />
                                          </svg>
                                          <span className="text-warning">
                                             Pending
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-007</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               <tr role="row" className="odd">
                                  <td className="patient_checkbox">
                                     <div className="checkbox text-right align-self-center">
                                        <div className="form-check custom-checkbox ">
                                           <input
                                               type="checkbox"
                                               onClick={() => chackboxFun()}
                                               className="form-check-input"
                                               id="customCheckBox7"
                                               required
                                           />
                                           <label
                                               className="form-check-label"
                                               htmlFor="customCheckBox7"
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td>#P-00018</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>Enjeline Sari</td>
                                  <td>Dr. Gustauv Loi</td>
                                  <td>Cold &amp; Flu</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#369DC9"
                                             />
                                          </svg>
                                          <span className="text-info">
                                             On Recovery
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-008</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               <tr role="row" className="even">
                                  <td className="patient_checkbox">
                                     <div className="checkbox text-right align-self-center">
                                        <div className="form-check custom-checkbox ">
                                           <input
                                               type="checkbox"
                                               onClick={() => chackboxFun()}
                                               className="form-check-input"
                                               id="customCheckBox8"
                                               required
                                           />
                                           <label
                                               className="form-check-label"
                                               htmlFor="customCheckBox8"
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td>#P-00019</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>Eddy Cusuma</td>
                                  <td>Dr. Samantha</td>
                                  <td>Dental Care</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#F46B68"
                                             />
                                          </svg>
                                          <span className="text-danger">
                                             Rejected
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-009</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               <tr role="row" className="odd">
                                  <td className="patient_checkbox">
                                     <div className="checkbox text-right align-self-center">
                                        <div className="form-check custom-checkbox ">
                                           <input
                                               type="checkbox"
                                               onClick={() => chackboxFun()}
                                               className="form-check-input"
                                               id="customCheckBox9"
                                               required
                                           />
                                           <label
                                               className="form-check-label"
                                               htmlFor="customCheckBox9"
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td>#P-00020</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>Frank Azire</td>
                                  <td>Dr. David Lee</td>
                                  <td>Allergies &amp; Asthma</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#2BC155"
                                             />
                                          </svg>
                                          <span className="text-primary">
                                             Recovered
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-020</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               <tr role="row" className="even">
                                  <td className="patient_checkbox">
                                     <div className="checkbox text-right align-self-center">
                                        <div className="form-check custom-checkbox ">
                                           <input
                                               type="checkbox"
                                               onClick={() => chackboxFun()}
                                               className="form-check-input"
                                               id="customCheckBox10"
                                               required
                                           />
                                           <label
                                               className="form-check-label"
                                               htmlFor="customCheckBox10"
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td>#P-00012</td>
                                  <td>26/02/2023, 12:42 AM</td>
                                  <td>Alexia Kev</td>
                                  <td>Dr. Samantha</td>
                                  <td>Allergies &amp; Asthma</td>
                                  <td>
                                       <span className="text-nowrap">
                                          <svg
                                              className="me-2"
                                              width={9}
                                              height={9}
                                              viewBox="0 0 9 9"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <circle
                                                 cx="4.5"
                                                 cy="4.5"
                                                 r="4.5"
                                                 fill="#FFB800"
                                             />
                                          </svg>
                                          <span className="text-warning">
                                             Pending
                                          </span>
                                       </span>
                                  </td>
                                  <td>AB-002</td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                                               stroke="#3E4954"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                                  <td>
                                     <Link to="/patient-list">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                           <path
                                               d="M3 6H5H21"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                           <path
                                               d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                               stroke="#F46B68"
                                               strokeWidth={2}
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                           />
                                        </svg>
                                     </Link>
                                  </td>
                               </tr>
                               </tbody>
                            </table>
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
                                      to="/patient-list"
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
                                            to="/patient-list"
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
                                      to="/patient-list"
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
