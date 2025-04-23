import React from "react";

const StepOne = () => {
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
                      placeholder="Veterinaria Pet Lovers"
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Dirección <span className="required">*</span></label>
                  <input
                      type="text"
                      name="tenantAddres"
                      className="form-control"
                      placeholder="6 de Diciembre 125 y Patria"
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Ruc <span className="required">*</span></label>
                  <input
                      type="number"
                      name="rucNumber"
                      className="form-control"
                      placeholder="1711251482001"
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Url Foto <span className="required">*</span></label>
                  <input
                      type="text"
                      name="urlPhoto"
                      className="form-control"
                      placeholder="http://logo.jpeg"
                      required
                  />
               </div>
            </div>
         </div>
      </section>
   );
};

export default StepOne;
