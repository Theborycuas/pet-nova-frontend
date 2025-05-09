import React from "react";
import PropTypes from "prop-types";

const StepOne = ({ formData, setFormData }) => {
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };
   return (
      <section>
         <div className="row">
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Nombre del Tenant <span className="required">*</span></label>
                  <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="José Armas"
                      value={formData.name}
                      onChange={handleChange}
                      required
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
                      value={formData.address}
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
                      name="email"
                      className="form-control"
                      id="inputGroupPrepend2"
                      aria-describedby="inputGroupPrepend2"
                      placeholder="example@example.com"
                      value={formData.email}
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
                      name="phoneNumber"
                      className="form-control"
                      placeholder="0996588446"
                      value={formData.phoneNumber}
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
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phoneNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
   }).isRequired,
   setFormData: PropTypes.func.isRequired
};

export default StepOne;
