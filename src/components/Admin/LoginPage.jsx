import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input, Button, message, Form, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";
import { getApiUrl } from "../../utils/getApiUrl";

const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
  const API_URL = getApiUrl();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { user_name, password } = values;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("loginpageadmin.errors.loginFailed"));
      }

      // Store all user data in localStorage
      localStorage.setItem("token", data.token || "dummy-token");
      localStorage.setItem("role", data.role || "admin");
      localStorage.setItem("user_name", data.user_name || "");
      localStorage.setItem("full_name", data.full_name || "");
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("user_id", data.id || "");
      localStorage.setItem("user_data", JSON.stringify(data));

      message.success(t("loginpageadmin.successMessage"));

      if (onLogin) {
        onLogin(data);
      }

      navigate("/adminpage");
    } catch (err) {
      message.error(err.message || t("loginpageadmin.errors.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] p-4 overflow-hidden relative">
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated triangles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`triangle-${i}`}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360,
            }}
            animate={{
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
              rotate: [null, Math.random() * 360 + 180],
              transition: {
                duration: Math.random() * 25 + 15,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
          >
            <div className="w-16 h-16 border-l-[32px] border-r-[32px] border-b-[64px] border-l-transparent border-r-transparent border-b-[#ffca40] opacity-20" />
          </motion.div>
        ))}

        {/* Floating circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full border-2 border-[#ffca40]"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
              scale: [null, Math.random() * 0.5 + 0.5],
              transition: {
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              opacity: 0.15,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div
          className="backdrop-blur-xl bg-white bg-opacity-95 rounded-3xl shadow-2xl overflow-hidden border-2 border-white border-opacity-30"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "linear-gradient(45deg, #ffca40, #008830, #136094, #ffca40)",
              backgroundSize: "400% 400%",
            }}
            animate={{
              backgroundPosition: isHovered
                ? ["0% 50%", "100% 50%", "0% 50%"]
                : "0% 50%",
            }}
            transition={{
              duration: isHovered ? 3 : 0,
              repeat: isHovered ? Infinity : 0,
            }}
          >
            <div className="absolute inset-[2px] rounded-3xl bg-white" />
          </motion.div>

          <div className="relative p-8">
            <motion.div
              className="text-center mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotateY: isHovered ? 360 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <FaUserShield className="text-5xl text-[#136094] mx-auto mb-4" />
              </motion.div>
              <Title
                level={3}
                className="!mb-1 bg-gradient-to-r from-[#136094] to-[#008830] bg-clip-text text-transparent"
              >
                {t("loginpageadmin.title")}
              </Title>
              <Text className="text-gray-600">
                {t("loginpageadmin.subtitle")}
              </Text>
            </motion.div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              initialValues={{ remember: true }}
            >
              <Form.Item
                name="user_name"
                label={
                  <span className="text-[#136094] font-semibold">
                    {t("loginpageadmin.usernameLabel")}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: t("loginpageadmin.validation.usernameRequired"),
                  },
                  {
                    min: 3,
                    message: t("loginpageadmin.validation.usernameMinLength"),
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={t("loginpageadmin.usernamePlaceholder")}
                  prefix={<UserOutlined className="text-[#008830]" />}
                  disabled={loading}
                  className="border-2 border-gray-200 hover:border-[#ffca40] focus:border-[#136094] transition-colors duration-300 rounded-xl"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <span className="text-[#136094] font-semibold">
                    {t("loginpageadmin.passwordLabel")}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: t("loginpageadmin.validation.passwordRequired"),
                  },
                  {
                    min: 4,
                    message: t("loginpageadmin.validation.passwordMinLength"),
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder={t("loginpageadmin.passwordPlaceholder")}
                  prefix={<LockOutlined className="text-[#008830]" />}
                  disabled={loading}
                  className="border-2 border-gray-200 hover:border-[#ffca40] focus:border-[#136094] transition-colors duration-300 rounded-xl"
                />
              </Form.Item>

              <Form.Item className="mb-1 mt-8">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                    className="h-12 font-bold text-white bg-gradient-to-r from-[#136094] via-[#008830] to-[#136094] border-none hover:shadow-lg transition-all duration-300 rounded-xl relative overflow-hidden group"
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#136094] via-[#008830] to-[#136094]"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundSize: "200% 200%",
                      }}
                    />

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: loading ? "-100%" : "100%" }}
                      transition={{
                        duration: 1.5,
                        repeat: loading ? 0 : Infinity,
                        delay: 0.5,
                      }}
                      style={{ opacity: 0.3 }}
                    />

                    <span className="relative z-10">
                      {loading
                        ? t("loginpageadmin.loggingIn")
                        : t("loginpageadmin.loginButton")}
                    </span>
                  </Button>
                </motion.div>
              </Form.Item>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <motion.a
                  href="/forgot-password"
                  className="text-[#136094] hover:text-[#008830] font-medium text-sm transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  {t("loginpageadmin.forgotPassword")}
                </motion.a>
                <Text className="text-gray-500 text-sm font-medium">
                  {t("loginpageadmin.version")}
                </Text>
              </div>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
