import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import {cityOptions} from "../../../../utils/cityOptions.js";
import {getAllRoles} from "../../api/roleEndpoints.js";
import {getAllUsers} from "../../api/userEndpoints.js";

const StepOne = ({ formData: formTenantData, setFormData }) => {

   const [users, setUsers] = useState(null);
   const [selectedUser, setSelectedUser] = useState(null);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handleCurrencyChange = (selectedOption) => {
      setFormData((prev) => ({
         ...prev,
         city: selectedOption ? selectedOption.label : null
      }));
   };

   const loadAllUser = async () => {
      const { data } = await getAllUsers();
      const formattedUsers = data.map(user => ({
         value: user.id,
         label: user.name,
      }));
      setUsers(formattedUsers);
   }

   useEffect(() => {
      loadAllUser();
   })

   useEffect(() => {
      if(selectedUser) {
         setFormData(prev => ({
            ...prev,
            managerId: selectedUser.value,
         }));
      }
   })

   return (
      <section>
         <div className="row">
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Nombre del Tenant <span className="required">*</span></label>
                  <input
                      type="text"
                      name="tenantName"
                      className="form-control"
                      placeholder="Clinica del Gato"
                      value={formTenantData.tenantName}
                      onChange={handleChange}
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Administrador <span className="required">*</span></label>
                  <Select
                      name="managerId"
                      options={users}
                      value={selectedUser}
                      onChange={setSelectedUser}
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
               <div className="col-lg-6 mb-2">
                  <div className="form-group mb-3">
                     <label className="text-label">Ciudad <span className="required">*</span></label>
                     <Select
                         name="city"
                         options={cityOptions}
                         value={cityOptions.find(opt => opt.label === formTenantData.city) || null}
                         onChange={handleCurrencyChange}
                         isClearable
                         placeholder="Selecciona una ciudad"
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
               <div className="col-lg-6 mb-2">
                  <div className="form-group mb-3">
                     <label className="text-label">Dirección <span className="required">*</span></label>
                     <input
                         type="text"
                         name="address"
                         className="form-control"
                         placeholder="6 de Diciembre 125 y Patria"
                         value={formTenantData.address}
                         onChange={handleChange}
                         required
                     />
                  </div>
               </div>
               <div className="col-lg-6 mb-2">
                  <div className="form-group mb-3">
                     <label className="text-label">Email <span className="required">*</span></label>
                     <input
                         type="email"
                         name="contactEmail"
                         className="form-control"
                         id="inputGroupPrepend2"
                         aria-describedby="inputGroupPrepend2"
                         placeholder="example@example.com"
                         value={formTenantData.contactEmail}
                         onChange={handleChange}
                         required
                     />
                  </div>
               </div>
               <div className="col-lg-6 mb-2">
                  <div className="form-group mb-3">
                     <label className="text-label">Teléfono <span className="required">*</span></label>
                     <input
                         type="number"
                         name="contactPhone"
                         className="form-control"
                         placeholder="0996588446"
                         value={formTenantData.contactPhone}
                         onChange={handleChange}
                         required
                     />
                  </div>
               </div>
            </div>
      </section>
);
};

StepOne.propTypes = {
   formData: PropTypes.shape({
      tenantName: PropTypes.string.isRequired,
      managerId: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      contactEmail: PropTypes.string.isRequired,
      contactPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
   }).isRequired,
       setFormData
:
   PropTypes.func.isRequired
};

export default StepOne;
