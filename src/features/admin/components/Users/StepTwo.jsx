import React, {useEffect, useState} from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import {getAllRoles} from "../../api/roleEndpoints.js";
import {getAllOffices} from "../../api/officeEndpoints.js";
import {getAllTenants} from "../../api/tenantEndpoints.js";

const StepTwo = ({ formData, setFormData}) => {

   const [roles, setRoles] = useState([]);
   const [selectedRole, setSelectedRole] = useState(null);
   const [offices, setOffices] = useState([]);
   const [selectedOffice, setSelectedOffice] = useState(null);
   const [tenants, setTenants] = useState([]);
   const [selectedTenant, setSelectedTenant] = useState(null);
   const [showOfficeSelect, setShowOfficeSelect] = useState(false);
   const [showTenantSelect, setShowTenantSelect] = useState(false);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      // Sincronizar role si viene en formData
      if (!formData || !formData.role) return;

      // Asegúrate de que roles ya están cargados
      if (roles.length > 0 && !selectedRole) {
         const foundRole = roles.find(r => r.value === formData.role.value);
         if (foundRole) {
            setSelectedRole(foundRole);

            // Cargar tenants u offices si corresponde
            if (foundRole.value === 3) {
               loadTenants();
            } else if ([4, 5, 6].includes(foundRole.value)) {
               loadOffices();
            }
         }
      }

      // Ahora sincroniza tenant/office solo si ya están cargados
      if (tenants.length > 0 && formData.tenantId && !selectedTenant) {
         const tenant = tenants.find(t => t.value === formData.tenantId);
         if (tenant) setSelectedTenant(tenant);
      }

      if (offices.length > 0 && formData.officeId && !selectedOffice) {
         const office = offices.find(o => o.value === formData.officeId);
         if (office) setSelectedOffice(office);
      }

      if (
          roles.length > 0 &&
          (formData.role?.value || formData.role?.id) &&
          (selectedRole || formData.role?.value)
      ) {
         setLoading(false);
      }
   }, [formData, roles, offices, tenants]);

   const loadRoles = async () => {
      setLoading(true);
      setError(null);
      const startTime = Date.now();
      try {
         const { data } = await getAllRoles();
         // Espera al menos 500ms para evitar parpadeos
         const elapsed = Date.now() - startTime;
         if (elapsed < 500) await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
         // Transforma los roles a opciones de combo
         const formattedRoles = data.map(role => ({
            value: role.id,
            label: role.roleName.replace(/_/g, ' ')
         }));
         setRoles(formattedRoles);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   const loadOffices = async () => {
      try {
         setLoading(true);
         setError(null);
         const { data } =  await getAllOffices();
         const formattedOffices = data.map(office => ({
            value: office.id,
            label: office.name,
         }));
         setOffices(formattedOffices);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   }

   const loadTenants = async () => {
      try {
         setLoading(true);
         setError(null);
         const { data } = await getAllTenants();
         const formattedTenants = data.map(tenant => ({
            value: tenant.id,
            label: tenant.tenantName,
         }));
         setTenants(formattedTenants);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      loadRoles();
   }, []);

   useEffect(() => {
      if (selectedRole) {
         setFormData(prev => ({
            ...prev,
            role: { id: selectedRole.value } // Envíamos un rol como Objeto
         }));
      }
   }, [selectedRole]);

   useEffect(() => {
      if (selectedOffice) {
         setFormData(prev => ({
            ...prev,
            officeId: selectedOffice.value
         }));
      }
   }, [selectedOffice]);

   useEffect(() => {
      if (selectedTenant) {
         setFormData(prev => ({
            ...prev,
            tenantId: selectedTenant.value
         }));
      }
   }, [selectedTenant]);

   useEffect(() => {
      if (!selectedRole) return;
      const roleValue = selectedRole.value;

      if ([4, 5, 6].includes(roleValue)) {
         setShowOfficeSelect(true);
         setShowTenantSelect(false);
         setSelectedTenant(null); // oculta visualmente el tenant

         // Solo limpiamos tenantId si el rol no es TENANT_ADMIN
         setFormData(prev => ({
            ...prev,
            tenantId: ''
         }));

         loadOffices();
      } else if (roleValue === 3) {
         setShowTenantSelect(true);
         setShowOfficeSelect(false);
         setSelectedOffice(null);

         // Solo limpiamos officeId si el rol no es OFFICE_ADMIN
         setFormData(prev => ({
            ...prev,
            officeId: ''
         }));

         loadTenants();
      } else {
         // Otro rol → limpia ambos
         setShowOfficeSelect(false);
         setShowTenantSelect(false);
         setSelectedOffice(null);
         setSelectedTenant(null);
         setFormData(prev => ({
            ...prev,
            officeId: '',
            tenantId: ''
         }));
      }
   }, [selectedRole]);


   return (
       <section>
          {loading && (
              <div className="text-center my-5">
                 <div className="spinner-grow text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                 </div>
                 <p className="mt-2">Cargando usuarios...</p>
              </div>
          )}
          {!loading && (
             <div className="row">
                <div className="col-lg-6 mb-2">
                   <div className="form-group mb-3">
                      <label className="text-label">Rol del usuario <span className="required">*</span></label>
                      <Select
                          name="roleId"
                          options={roles}
                          value={selectedRole}
                          onChange={setSelectedRole}
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
                {showOfficeSelect && (
                    <div className="col-lg-6 mb-2">
                       <div className="form-group mb-3">
                          <label className="text-label">Consultorio asignado <span className="required">*</span></label>
                          <Select
                              name="officeId"
                              options={offices}
                              value={selectedOffice}
                              onChange={setSelectedOffice}
                              isClearable
                              placeholder="Selecciona un consultorio"
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
                )}

                {showTenantSelect && (
                    <div className="col-lg-6 mb-2">
                       <div className="form-group mb-3">
                          <label className="text-label">Tenant asignado <span className="required">*</span></label>
                          <Select
                              name="tenantId"
                              options={tenants}
                              value={selectedTenant}
                              onChange={setSelectedTenant}
                              isClearable
                              placeholder="Selecciona un tenant"
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
                )}
             </div>
          )}
          {error && (
              <div className="alert alert-danger">{error}</div>
          )}
       </section>
   );
};
StepTwo.propTypes = {
   formData: PropTypes.shape({
      role: PropTypes.object,
      tenantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      officeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
   }).isRequired,
   setFormData: PropTypes.func.isRequired
};
export default StepTwo;
