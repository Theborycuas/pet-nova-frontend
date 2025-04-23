import React, {useState} from "react";
import Select from "react-select";

const options = [
   { value: 'chocolate', label: 'Chocolate' },
   { value: 'strawberry', label: 'Strawberry' },
   { value: 'vanilla', label: 'Vanilla' },
]
const StepTwo = () => {
   const [selectedOption, setSelectedOption] = useState(null)
   return (
      <section>
         <div className="row">
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Email <span className="required">*</span></label>
                  <input
                      type="email"
                      className="form-control"
                      id="inputGroupPrepend2"
                      aria-describedby="inputGroupPrepend2"
                      placeholder="example@example.com.com"
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
                      required
                  />
               </div>
            </div>

            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Administrador <span className="required">*</span></label>
                  <Select
                      defaultValue={selectedOption}
                      onChange={setSelectedOption}
                      options={options}
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
                  <label className="text-label">Teléfono Administrador <span className="required">*</span></label>
                  <input
                      type="number"
                      name="phoneNumberAdministrator"
                      className="form-control"
                      placeholder="0996588446"
                      required
                  />
               </div>
            </div>
         </div>
      </section>
   );
};

export default StepTwo;
