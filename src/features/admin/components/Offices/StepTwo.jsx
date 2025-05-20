import React, {useState} from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const options = [
   { value: 1, label: 'José' },
   { value: 2, label: 'Emilio' },
   { value: 3, label: 'Juan' },
]
const StepTwo = ({ formData, setFormData}) => {
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };
   const handleSelectChange = (option) => {
      setFormData(prev => ({
         ...prev,
         managerName: option ? option.value : ''
      }));
   };
   return (
      <section>
         <div className="row">
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
                      value={formData.contactEmail}
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
                      value={formData.contactPhone}
                      onChange={handleChange}
                      required
                  />
               </div>
            </div>

            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Administrador <span className="required">*</span></label>
                  <Select
                      name="managerName"
                      options={options}
                      // El value debe ser el objeto cuya value coincida con formData.nombreAdministrador
                      value={
                          options.find(opt => opt.value === formData.managerName)
                          || null
                      }
                      onChange={handleSelectChange}
                      isClearable
                      placeholder="Selecciona un administrador"
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
                  <label className="text-label">Teléfono Administrador <span className="required">*</span></label>
                  <input
                      type="number"
                      name="managerPhone"
                      className="form-control"
                      placeholder="0996588446"
                      value={formData.managerPhone}
                      onChange={handleChange}
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Email Administrador <span className="required">*</span></label>
                  <input
                      type="email"
                      name="managerEmail"
                      className="form-control"
                      id="inputGroupPrepend2"
                      aria-describedby="inputGroupPrepend2"
                      placeholder="example@example.com"
                      value={formData.managerEmail}
                      onChange={handleChange}
                      required
                  />
               </div>
            </div>

         </div>
      </section>
   );
};

StepTwo.propTypes = {
   formData: PropTypes.shape({
      contactEmail: PropTypes.string.isRequired,
      contactPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      managerName: PropTypes.string.isRequired,
      managerPhone: PropTypes.string.isRequired,
      managerEmail: PropTypes.string.isRequired
   }).isRequired,
   setFormData: PropTypes.func.isRequired
};

export default StepTwo;
