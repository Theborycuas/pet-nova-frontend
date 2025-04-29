import React, {useState} from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const planOptions = [
   { value: 1, label: 'Free' },
   { value: 2, label: 'Plus' },
   { value: 3, label: 'Premium' },
]
const currencyOptions = [
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
                   <label className="text-label">Plan Actual <span className="required">*</span></label>
                   <Select
                       name="planId"
                       options={planOptions}
                       value={
                           planOptions.find(opt => opt.value === formData.planId)
                           || null
                       }
                       onChange={handlePlanChange}
                       isClearable
                       placeholder="Selecciona un plan"
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
                   <label className="text-label">Moneda <span className="required">*</span></label>
                   <Select
                       name="currency"
                       options={currencyOptions}
                       value={
                           currencyOptions.find(opt => opt.value === formData.currency)
                           || null
                       }
                       onChange={handleCurrencyChange}
                       isClearable
                       placeholder="Selecciona una moneda"
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
      planId: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired
   }).isRequired,
   setFormData: PropTypes.func.isRequired
};
export default StepTwo;
