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
         </div>
      </section>
   );
};

StepTwo.propTypes = {
   formData: PropTypes.shape({
      contactEmail: PropTypes.string.isRequired,
      contactPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
   }).isRequired,
   setFormData: PropTypes.func.isRequired
};

export default StepTwo;
