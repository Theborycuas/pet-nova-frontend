import React, {useEffect, useState} from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import {getAllUsers} from "../../api/userEndpoints.js";
import {getAllRoles} from "../../api/roleEndpoints.js";

const tenantOptions = [
   { value: 1, label: 'USD' },
   { value: 2, label: 'EU' },
   { value: 3, label: 'MXN' },
]

const StepTwo = ({ formData, setFormData}) => {

   const [selectedRole, setSelectedRole] = useState(null);
   const [selectedOption, setSelectedOption] = useState(null)
   const [roles, setRoles] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };
   const handlePlanChange = (option) => {
      setFormData(prev => ({
         ...prev,
         planId: option ? option.value : ''
      }));
   };
   const handleCurrencyChange = (option) => {
      setFormData(prev => ({
         ...prev,
         currency: option ? option.value : ''
      }));
   };

   // Carga todos los users
   const loadRoles = async () => {
      setLoading(true);
      setError(null);
      const startTime = Date.now();
      try {
         const { data } = await getAllRoles();
         // Espera al menos 500ms para evitar parpadeos
         const elapsed = Date.now() - startTime;
         if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
         // Transforma los roles a opciones de combo
         const formattedRoles = data.map(role => ({
            value: role.id,
            label: role.roleName.replace(/_/g, ' ') // Opcional: SUPER_ADMIN → SUPER ADMIN
         }));

         setRoles(formattedRoles);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadRoles();
      if (selectedRole) {
         setFormData(prev => ({
            ...prev,
            roleId: selectedRole.value
         }));
      }
   }, [selectedRole]);

   return (
       <section>
          <div className="row">
             <div className="col-lg-6 mb-2">
                <div className="form-group mb-3">
                   <label className="text-label">Rol del usuario <span className="required">*</span></label>
                   <Select
                       name="roleId"
                       options={roles}
                       value={selectedRole}
                       onChange={setSelectedRole}
                       isClearable
                       placeholder="Selecciona un role"
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
                   <label className="text-label">Tenant <span className="required">*</span></label>
                   <Select
                       name="tenantId"
                       options={tenantOptions}
                       value={
                           tenantOptions.find(opt => opt.value === formData.tenantId)
                           || null
                       }
                       onChange={handleCurrencyChange}
                       isClearable
                       placeholder="Selecciona un Consultorio"
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
          </div>
       </section>
   );
};
StepTwo.propTypes = {
   formData: PropTypes.shape({
      roleId: PropTypes.string.isRequired,
      tenantId: PropTypes.string.isRequired,
      officeId: PropTypes.string.isRequired,
   }).isRequired,
   setFormData: PropTypes.func.isRequired
};
export default StepTwo;
