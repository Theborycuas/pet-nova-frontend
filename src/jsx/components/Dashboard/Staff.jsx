import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

import avat1 from '../../../assets/images/avatar/1.jpg';
import avat2 from '../../../assets/images/avatar/2.jpg';
import avat3 from '../../../assets/images/avatar/3.jpg';
import avat4 from '../../../assets/images/avatar/4.jpg';
import avat5 from '../../../assets/images/avatar/5.jpg';
import avat6 from '../../../assets/images/avatar/6.jpg';

const tableData = [
    { title:'JOHN D RANDOLPH', image: avat2},
    { title:'Matthew', image: avat1},
    { title:'David Anthony', image: avat6},
    { title:'Anthony David', image: avat3},
    { title:'Asher Anthony', image: avat4},
    { title:'Carter Anthony', image: avat5},
    { title:'JOHN D RANDOLPH', image: avat3},
]

const Staff = () => {
    const  [addStaff, setAddStaff] = useState(false);
    const [data, setData] = useState(
        document.querySelectorAll("#staff tbody tr")
     );
     const sort = 7;
     const activePag = useRef(0);
     const [test, settest] = useState(0);
  
     const chageData = (frist, sec) => {
        for (var i = 0; i < data.length; ++i) {
           if (i >= frist && i < sec) {
              data[i].classList.remove("d-none");
           } else {
              data[i].classList.add("d-none");
           }
        }
     };
  
     useEffect(() => {
        setData(document.querySelectorAll("#staff tbody tr"));
     }, [test]);
    
     activePag.current === 0 && chageData(0, sort);
     let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1);
       
     const onClick = (i) => {
        activePag.current = i;
        chageData(activePag.current * sort, (activePag.current + 1) * sort);
        settest(i);
     };
  
     const chackbox = document.querySelectorAll(".patient_checkbox input");
     const motherChackBox = document.querySelector(".patient_strg input");
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
    return (
        <>
            <div className="text-end mb-3">
                <Link to={"#"} className="btn btn-primary btn-rounded add-staff" onClick={()=>setAddStaff(true)}>+ Add Staff</Link>
            </div>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <div id="staff" className="dataTables_wrapper no-footer">
                                <table id="example5" className="table table-striped patient-list mb-4 dataTablesCard fs-14 dataTable no-footer">
                                    <thead>
                                        <tr role="row">
                                            <th
                                                className="patient_strg"
                                                tabIndex={0}                                            
                                                rowSpan={1}
                                                colSpan={1}                                           
                                                style={{ width: 24 }}
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
                                            <th>Name</th>
                                            <th>Designation</th>
                                            <th>Email</th>
                                            <th>Mobile</th>
                                            <th>Address</th>
                                            <th>Joining Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((item, ind)=>(
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
														<img src={item.image} alt="" />
													</span>
													<span className="text-nowrap ms-2">{item.title}</span>
												</td>
												<td>
													<span>Nurse</span>
												</td>
												
												<td className="text-primary">9876512345</td>
												<td className="text-primary">gabriel@gmail.com</td>
												<td>1310 Glenwood Avenue</td>
												
												<td>22 Mar 2021</td>
												<td>
													<span className="me-3">
														<Link to={"/staff-profile"}><i className="fa fa-eye fs-18"></i></Link>
													</span>	
													<span className="me-3">
														<Link to={"#"} className="edit-staff"><i className="fa fa-pencil fs-18 text-success"></i></Link>
													</span>	
													<span>
														<i className="fa fa-trash-o fs-18 text-danger"></i>
													</span>
												</td>                                          
                                            </tr>
                                        ))}
                                        
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
                                    <div className="dataTables_paginate paging_simple_numbers d-flex  justify-content-center align-items-center pb-3">
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
            <Modal className="modal fade" id="staff-edit-form" centered size={'lg'} show={addStaff} onHide={setAddStaff}>                      
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Edit Staff</h5>
                    <button type="button" className="btn close lineheight1" onClick={()=>setAddStaff(false)}>
                        <span>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            
                            <div className="col-xl-6">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Name:</label>
                                    <input type="text" className="form-control" id="" placeholder="Name" />
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Last Name:</label>
                                    <input type="text" className="form-control" id="" placeholder="Last Name" />
                                </div>
                            </div>
                            <div className="col-xl-12">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Date Of Birth:</label>
                                    <input size="16" type="date" value="13-9-2021" className="form-control" />
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Gender:</label>
                                        <select className="form-control">
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Designation:</label>
                                    <input type="text" className="form-control" id="" placeholder="Nurse" />
                                </div>
                            </div>
                            
                            <div className="col-xl-6">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Mobile No:</label>
                                    <input type="number" className="form-control" id="" placeholder="Mobile" />
                                </div>
                            </div>
                            
                            <div className="col-xl-6">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Email Id:</label>
                                    <input type="email" className="form-control" id="" placeholder="Email" />
                                </div>
                            </div>
                            <div className="col-xl-12">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Address :</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlFile1">Profile Picture:</label>
                                    <input type="file" className="form-control-file" id="exampleFormControlFile1" />
                                </div>
                            </div>
                            <div className="col-xl-12">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Education :</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                            </div>
                            
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={()=>setAddStaff(false)}>Close</button>
                    <button type="button" className="btn btn-primary">Save</button>
                </div>
            </Modal>
        </>
    );
};

export default Staff;