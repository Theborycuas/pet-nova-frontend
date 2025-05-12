import React from "react";
import PropTypes from "prop-types";
import user from "../../../../assets/images/task/user.jpg";
import Select from "react-select";
import {cityOptions} from "../../../../utils/cityOptions.js";

const StepOne = ({ formData, setFormData }) => {
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   //For Image upload in ListBlog
   const [file, setFile] = React.useState(null)
   const fileHandler = (e) => {
      setFile(e.target.files[0]);
      setTimeout(function(){
         var src = document.getElementById("saveImageFile").getAttribute("src");
      }, 200);
   }
   const handleCurrencyChange = (selectedOption) => {
      setFormData((prev) => ({
         ...prev,
         city: selectedOption ? selectedOption.label : null
      }));
   };

   return (
       <section>
          <div className="row">
             <div className="image-placeholder">
                <div className="avatar-edit">
                   <input type="file" onChange={fileHandler} id="imageUpload"
                          onClick={(event) => setFile(event.target.value)}
                   />
                   <label htmlFor="imageUpload" name=''></label>
                </div>
                <div className="avatar-preview">
                   <div id="imagePreview">
                      <img id="saveImageFile" src={file ? URL.createObjectURL(file) : user}
                           alt={file ? file.name : null}
                      />
                   </div>
                </div>
             </div>
          </div>
          <br/>
          <div className="row">
             <div className="col-lg-6 mb-2">
                <div className="form-group mb-3">
                   <label className="text-label">Nombre del Usuario <span className="required">*</span></label>
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
                   <label className="text-label">Cédula <span className="required">*</span></label>
                   <input
                       type="text"
                       name="idNumber"
                       className="form-control"
                       placeholder="171187422"
                       value={formData.idNumber}
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

             <div className="col-lg-6 mb-2">
                <div className="form-group mb-3">
                   <label className="text-label">Ciudad <span className="required">*</span></label>
                   <Select
                       name="city"
                       options={cityOptions}
                       value={cityOptions.find(opt => opt.label === formData.city) || null}
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
                       value={formData.address}
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
      idNumber: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phoneNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
   }).isRequired,
   setFormData:
   PropTypes.func.isRequired
};

export default StepOne;
