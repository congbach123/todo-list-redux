import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, clearError } from '../../store/authSlice';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setFormError('Username is required');
      return false;
    }
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setFormError('Valid email is required');
      return false;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!formData.phoneNumber.trim() || !phoneRegex.test(formData.phoneNumber.replace(/[-()\s]/g, ''))) {
      setFormError('Valid phone number is required (10-15 digits)');
      return false;
    }

    if (!formData.password) {
      setFormError('Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }

    setFormError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const success = await dispatch(register(formData));
      if (success) {
        navigate('/todos');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <form
          className="p-8"
          onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Register</h2>

          {formError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{formError}</div>}

          <div className="form-group">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50">
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div className="mt-6 text-center">
            <p>
              Already have an account?{' '}
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-800 font-medium">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
