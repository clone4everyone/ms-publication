import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaUniversity, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    affiliation: '',
  });

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [emailValid, setEmailValid] = useState(null);

  const { prefix, firstName, lastName, email, password, password2, affiliation } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/author/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // Validate password requirements
  useEffect(() => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  }, [password]);

  // Check if passwords match
  useEffect(() => {
    if (password2.length > 0) {
      setPasswordsMatch(password === password2);
    } else {
      setPasswordsMatch(null);
    }
  }, [password, password2]);

  // Validate email format
  useEffect(() => {
    if (email.length > 0) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailValid(emailRegex.test(email));
    } else {
      setEmailValid(null);
    }
  }, [email]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every((value) => value === true);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!emailValid) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid()) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }

    const userData = {
      prefix,
      firstName,
      lastName,
      email,
      password,
      affiliation,
    };

    dispatch(register(userData));
  };

  const RequirementItem = ({ met, text }) => (
    <div className={`flex items-center space-x-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? (
        <FaCheck className="w-4 h-4" />
      ) : (
        <FaTimes className="w-4 h-4" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-outlook-blue to-outlook-darkBlue py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Register as Author
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account to submit articles
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 mb-1">
                Prefix
              </label>
              <input
                id="prefix"
                name="prefix"
                type="text"
                value={prefix}
                onChange={onChange}
                placeholder="Dr., Prof., Mr., Ms."
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-outlook-blue focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={onChange}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-outlook-blue focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={onChange}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-outlook-blue focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={onChange}
                  className={`appearance-none block w-full px-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                    emailValid === null
                      ? 'border-gray-300 focus:ring-outlook-blue'
                      : emailValid
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-red-500 focus:ring-red-500'
                  }`}
                  placeholder="your.email@example.com"
                />
                {emailValid !== null && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {emailValid ? (
                      <FaCheck className="text-green-500 w-5 h-5" />
                    ) : (
                      <FaTimes className="text-red-500 w-5 h-5" />
                    )}
                  </div>
                )}
              </div>
              {emailValid === false && (
                <p className="mt-1 text-sm text-red-600">
                  Please enter a valid email address
                </p>
              )}
              {emailValid === true && (
                <p className="mt-1 text-sm text-green-600">
                  Valid email format
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-1">
              Affiliation / Institution
            </label>
            <input
              id="affiliation"
              name="affiliation"
              type="text"
              value={affiliation}
              onChange={onChange}
              placeholder="University or Organization"
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-outlook-blue focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={onChange}
                onFocus={() => setShowPasswordRequirements(true)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-outlook-blue focus:border-transparent"
              />
              
              {/* Password Requirements */}
              {showPasswordRequirements && password.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                  <RequirementItem 
                    met={passwordValidation.minLength} 
                    text="At least 8 characters" 
                  />
                  <RequirementItem 
                    met={passwordValidation.hasUpperCase} 
                    text="One uppercase letter (A-Z)" 
                  />
                  <RequirementItem 
                    met={passwordValidation.hasLowerCase} 
                    text="One lowercase letter (a-z)" 
                  />
                  <RequirementItem 
                    met={passwordValidation.hasNumber} 
                    text="One number (0-9)" 
                  />
                  <RequirementItem 
                    met={passwordValidation.hasSpecialChar} 
                    text="One special character (!@#$%^&*)" 
                  />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password2}
                  onChange={onChange}
                  className={`appearance-none block w-full px-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                    passwordsMatch === null
                      ? 'border-gray-300 focus:ring-outlook-blue'
                      : passwordsMatch
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-red-500 focus:ring-red-500'
                  }`}
                />
                {passwordsMatch !== null && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {passwordsMatch ? (
                      <FaCheck className="text-green-500 w-5 h-5" />
                    ) : (
                      <FaTimes className="text-red-500 w-5 h-5" />
                    )}
                  </div>
                )}
              </div>
              {passwordsMatch === false && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
              {passwordsMatch === true && (
                <p className="mt-1 text-sm text-green-600">
                  Passwords match!
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !emailValid || !isPasswordValid() || passwordsMatch === false}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-outlook-blue hover:bg-outlook-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-outlook-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-outlook-blue hover:text-outlook-darkBlue"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;