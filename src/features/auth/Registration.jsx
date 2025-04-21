import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { registerUser } from '../../api/auth/endpoints'; // Importar el servicio
import {confirmedSignupAction, loadingToggleAction} from '../../store/actions/AuthActions.js';

function Register(props) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        general: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        setErrors(prev => ({
            ...prev,
            [name]: '',
            general: ''
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            username: '',
            email: '',
            password: ''
        };

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        dispatch(loadingToggleAction(true));

        try {
            const response = await registerUser(formData);

            if (response.status === 200) {
                navigate('/login');
                // Si usas Redux para manejar mensajes globales:
                dispatch(confirmedSignupAction('Registration successful!'));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                general: error.response?.data?.message || 'Registration failed. Please try again.'
            }));
        } finally {
            dispatch(loadingToggleAction(false));
        }
    };

    return (
        <div className='authincation h-100 p-meddle'>
            <div className='container h-100'>
                <div className='row justify-content-center h-100 align-items-center'>
                    <div className='col-md-8 col-lg-6'>
                        <div className='authincation-content'>
                            <div className='row no-gutters'>
                                <div className='col-xl-12'>
                                    <div className='auth-form'>
                                        <h4 className='text-center mb-4'>Create your account</h4>

                                        {errors.general && (
                                            <div className='alert alert-danger'>
                                                {errors.general}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit}>
                                            <div className='form-group'>
                                                <label className='mb-1'>
                                                    <strong>Username</strong>
                                                    <span className='required'>*</span>
                                                </label>
                                                <input
                                                    type='text'
                                                    className={`form-control ${errors.username && 'is-invalid'}`}
                                                    placeholder='Enter username'
                                                    name='username'
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.username &&
                                                    <div className="invalid-feedback">{errors.username}</div>}
                                            </div>

                                            <div className='form-group'>
                                                <label className='mb-1'>
                                                    <strong>Email</strong>
                                                    <span className='required'>*</span>
                                                </label>
                                                <input
                                                    type='email'
                                                    className={`form-control ${errors.email && 'is-invalid'}`}
                                                    placeholder='example@example.com'
                                                    name='email'
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.email &&
                                                    <div className="invalid-feedback">{errors.email}</div>}
                                            </div>

                                            <div className='form-group'>
                                                <label className='mb-1'>
                                                    <strong>Password</strong>
                                                    <span className='required'>*</span>
                                                </label>
                                                <input
                                                    type='password'
                                                    className={`form-control ${errors.password && 'is-invalid'}`}
                                                    placeholder='Enter password'
                                                    name='password'
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.password &&
                                                    <div className="invalid-feedback">{errors.password}</div>}
                                            </div>

                                            <div className='text-center mt-4'>
                                                <button
                                                    type='submit'
                                                    className='btn btn-primary btn-block'
                                                    disabled={props.showLoading}
                                                >
                                                    {props.showLoading ? (
                                                        <span>
                                                            <span className='spinner-border spinner-border-sm mr-2'
                                                                  role='status' aria-hidden='true' />
                                                            Registering...
                                                        </span>
                                                    ) : 'Create Account'}
                                                </button>
                                            </div>
                                        </form>

                                        <div className='new-account mt-3 text-center'>
                                            <p>
                                                Already have an account?{' '}
                                                <Link className='text-primary' to='/login'>
                                                    Sign in
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
});

export default connect(mapStateToProps)(Register);