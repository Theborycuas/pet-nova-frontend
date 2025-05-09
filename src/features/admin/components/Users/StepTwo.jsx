import React, {useState} from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const roleOptions = [
   { value: 1, label: 'SUPER ADMIN' },
   { value: 2, label: 'ADMIN' },
   { value: 3, label: 'USER' },
]
const tenantOptions = [
   { value: 1, label: 'USD' },
   { value: 2, label: 'EU' },
   { value: 3, label: 'MXN' },
]

const StepTwo = ({ formData, setFormData}) => {

   const [selectedPlan, setSelectedPlan] = useState(null)
   const [selectedOption, setSelectedOption] = useState(null)

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
   return (
       <section>
          <div className="row">
             <div className="col-lg-6 mb-2">
                <div className="form-group mb-3">
                   <label className="text-label">Rol del usuario <span className="required">*</span></label>
                   <Select
                       name="roleId"
                       options={roleOptions}
                       value={
                           roleOptions.find(opt => opt.value === formData.roleId)
                           || null
                       }
                       onChange={handlePlanChange}
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
