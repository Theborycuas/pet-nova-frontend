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
                      placeholder="Veterinaria Pet Lovers"
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
                  <label className="text-label">Ruc <span className="required">*</span></label>
                  <input
                      type="number"
                      name="taxId"
                      className="form-control"
                      placeholder="1711251482001"
                      value={formData.taxId}
                      onChange={handleChange}
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Url Foto <span className="required">*</span></label>
                  <input
                      type="text"
                      name="logoUrl"
                      className="form-control"
                      placeholder="http://logo.jpeg"
                      value={formData.logoUrl}
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
      taxId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      logoUrl: PropTypes.string.isRequired
   }).isRequired,
   setFormData: PropTypes.func.isRequired
};

export default StepOne;
