import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";

const LoginForm = ({ onLogin }) => {
  const API_URL = getApiUrl();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}api/login`, {
        user_name: username,
        password,
      });

      const { token, user } = response.data;
      
      // Store all necessary user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.user_name);
      localStorage.setItem("fullName", user.full_name || "");
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("userData", JSON.stringify(user));
      
      onLogin(user); // Notify parent component
    } catch (err) {
      let errorMessage = t("loginForm.errors.general");
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = t("loginForm.errors.credentials");
        } else if (err.response.status === 403) {
          errorMessage = t("loginForm.errors.accessDenied");
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = t("loginForm.errors.network");
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">
              {t("loginForm.welcomeMessage")}
            </h2>
            <p className="text-blue-100 mt-1">
              {t("loginForm.welcomeSubtitle")}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-4 mt-4 rounded"
            >
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6">
            <div className="mb-5">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="username"
              >
                {t("loginForm.usernameLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t("loginForm.usernamePlaceholder")}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password"
              >
                {t("loginForm.passwordLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t("loginForm.passwordPlaceholder")}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-sm text-blue-600 hover:text-blue-800">
                    {showPassword ? t("loginForm.hide") : t("loginForm.show")}
                  </span>
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  {t("loginForm.rememberMe")}
                </label>
              </div>
              <a
                href="#forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t("loginForm.forgotPassword")}
              </a>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {t("loginForm.loggingIn")}
                </>
              ) : (
                t("loginForm.loginButton")
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center border-t">
            <p className="text-sm text-gray-600">
              {t("loginForm.noAccount")}{" "}
              <a
                href="#register"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {t("loginForm.registerHere")}
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;