import React, {useState} from "react";
import Select from "react-select";

const planActual = [
   { value: 'free', label: 'Free' },
   { value: 'plus', label: 'Plus' },
   { value: 'premium', label: 'Premium' },
]
const options = [
   { value: 'usd', label: 'USD' },
   { value: 'eu', label: 'EU' },
   { value: 'mxn', label: 'MXN' },
]

const StepThree = () => {

   const [selectedPlan, setSelectedPlan] = useState(null)
   const [selectedOption, setSelectedOption] = useState(null)
   return (
      <section>
         <div className="row">
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Plan Actual <span className="required">*</span></label>
                  <Select
                      defaultValue={selectedPlan}
                      onChange={setSelectedPlan}
                      options={planActual}
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
                  <label className="text-label">Moneda <span className="required">*</span></label>
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
         </div>
      </section>
   );
};

export default StepThree;
