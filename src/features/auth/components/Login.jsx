import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import {
	clearAuthErrorAction, loadingToggleAction, loginAction,
} from '../../../store/actions/AuthActions.js';

//
import logo from '../../../assets/images/logo.png'
import logotext from '../../../assets/images/logo-text.png'
import PropTypes from 'prop-types';

Login.propTypes = {
	errorMessage: PropTypes.string,
	successMessage: PropTypes.string,
	showLoading: PropTypes.bool.isRequired,
	dispatch: PropTypes.func.isRequired,
	navigate: PropTypes.func.isRequired
};

Login.defaultProps = {
	errorMessage: '',
	successMessage: ''
};

function Login (props) {
	const [credentials, setCredentials] = useState({
		username: '',
		password: ''
	});

	const [errors, setErrors] = useState({
		username: '',
		password: ''
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCredentials(prev => ({
			...prev,
			[name]: value
		}));

		if (errors.general) {
			setErrors(prev => ({...prev, general: ''}));
			dispatch(clearAuthErrorAction());
		}

		// Limpiar errores al escribir
		setErrors(prev => ({
			...prev,
			[name]: '',
		}));
	};

	const validateForm = () => {
		let isValid = true;
		const newErrors = {
			username: '',
			password: ''
		};

		if (!credentials.username.trim()) {
			newErrors.username = 'Username is required';
			isValid = false;
		}

		if (!credentials.password) {
			newErrors.password = 'Password is required';
			isValid = false;
		} else if (credentials.password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
			isValid = false;
		}
		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		// Limpiar error general antes de nuevo intento
		setErrors(prev => ({...prev, general: ''}));

		dispatch(loadingToggleAction(true));
		dispatch(loginAction(credentials, navigate));
	};

	// Efecto para manejar errores de Redux
	React.useEffect(() => {
		if (props.errorMessage) {
			setErrors(prev => ({
				...prev,
				general: props.errorMessage
			}));

			// Opcional: limpiar el error después de 5 segundos
			const timer = setTimeout(() => {
				setErrors(prev => ({...prev, general: ''}));
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [props.errorMessage]);


	return (

		<div className="login-form-bx">
			<div className="container-fluid">
				<div className="row">
					<div className="col-lg-6 col-md-7 box-skew d-flex">
						<div className="authincation-content">
							<Link to="#" className="login-logo">
								<img src={logo} alt="" className="logo-icon me-2"/>
								<img src={logotext} alt="" className="logo-text ms-1"/>
							</Link>
							<div className="mb-4">
								<h3 className="mb-1 font-w600">Welcome to PetNova</h3>
								<p className="">Sign in to your veterinary account</p>
							</div>

							{errors.general && (
								<div className='alert alert-danger'>
									{errors.general}
								</div>
							)}

							<form onSubmit={handleSubmit}>
								<div className="form-group">
									<label className="mb-2">
										<strong>Username</strong>
										<span className='required'>*</span>
									</label>
									<input
										type="text"
										className={`form-control ${errors.username && 'is-invalid'}`}
										name="username"
										value={credentials.username}
										onChange={handleInputChange}
									/>
									{errors.username &&
										<div className="invalid-feedback">{errors.username}</div>}
								</div>

								<div className="form-group">
									<label className="mb-2">
										<strong>Password</strong>
										<span className='required'>*</span>
									</label>
									<input
										type="password"
										className={`form-control ${errors.password && 'is-invalid'}`}
										name="password"
										value={credentials.password}
										onChange={handleInputChange}
									/>
									{errors.password &&
										<div className="invalid-feedback">{errors.password}</div>}
								</div>

								<div className="text-center mt-4">
									<button
										type="submit"
										className="btn btn-primary btn-block"
										disabled={props.showLoading}
									>
										{props.showLoading ? (
											<span>
                                                <span className="spinner-border spinner-border-sm me-2"
													  role="status" aria-hidden="true"></span>
                                                Signing In...
                                            </span>
										) : 'Sign In'}
									</button>
								</div>
							</form>

							<div className="new-account mt-3 text-center">
								<p className="mb-0">
									Don't have an account?{" "}
									<Link className="text-primary" to="/page-register">
										Sign up
									</Link>
								</p>
							</div>
						</div>
					</div>
					<div className="col-lg-6 col-md-5 d-flex box-skew1"></div>
				</div>
			</div>
		</div>

	)
}

const mapStateToProps = (state) => {
	return {
		errorMessage: state.auth.errorMessage,
		successMessage: state.auth.successMessage,
		showLoading: state.auth.showLoading,
	};
};
export default connect(mapStateToProps)(Login);