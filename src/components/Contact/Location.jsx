import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaDirections,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  FiMapPin,
  FiClock,
  FiPhone,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";
import axios from "axios";
import { Spin } from "antd";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = "https://yekawebapi.yekasubcity.com/";

function Location() {
  const { t } = useTranslation();
  const [officeData, setOfficeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}api/officedata`);
        setOfficeData(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching office data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeData();
  }, []);

  // Convert the location string to a usable embed URL
  const getLocationUrl = () => {
    const rawUrl = officeData?.locationstring?.en || "";

    if (!rawUrl) return "";

    // If it's already an embed link, return as is
    if (rawUrl.includes("google.com/maps/embed")) {
      return rawUrl;
    }

    // If it's a short Google Maps link, convert to query embed
    if (rawUrl.includes("maps.app.goo.gl")) {
      return `https://www.google.com/maps?q=${encodeURIComponent(
        rawUrl
      )}&output=embed`;
    }

    // Fallback: treat it as a query
    return `https://www.google.com/maps?q=${encodeURIComponent(
      rawUrl
    )}&output=embed`;
  };

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#136094] via-[#0a4275] to-[#082f55]">
        <div className="text-center">
          <Spin size="large" className="mb-4" />
          <p className="text-white text-lg">{t("location.loading")}</p>
        </div>
      </div>
    );
  }

  const contactInfoItems = [
    {
      icon: <FiMapPin className="text-2xl" />,
      title: t("location.address"),
      content: (
        <>
          <p className="font-semibold text-gray-900">
            {officeData?.officename?.en}
          </p>
          <p className="text-gray-600">{t("location.addisAbabaEthiopia")}</p>
        </>
      ),
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      delay: 0.1,
    },
    {
      icon: <FiClock className="text-2xl" />,
      title: t("location.workingHours"),
      content: (
        <>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {t("location.weekdays")}:
            </span>{" "}
            8:30 AM - 5:30 PM
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {t("location.saturday")}:
            </span>{" "}
            8:30 AM - 12:30 PM
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {t("location.sunday")}:
            </span>{" "}
            {t("location.closed")}
          </p>
        </>
      ),
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      delay: 0.2,
    },
    {
      icon: <FiPhone className="text-2xl" />,
      title: t("location.phone"),
      content: (
        <div className="space-y-1">
          {officeData?.contact_numbers?.map((number, index) => (
            <a
              key={index}
              href={`tel:${number}`}
              className="block text-gray-600 hover:text-[#136094] transition-colors duration-300 font-medium"
            >
              {number}
            </a>
          ))}
        </div>
      ),
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      delay: 0.3,
    },
    {
      icon: <FiMail className="text-2xl" />,
      title: t("location.email"),
      content: (
        <div className="space-y-1">
          {officeData?.emails?.map((email, index) => (
            <a
              key={index}
              href={`mailto:${email}`}
              className="block text-gray-600 hover:text-[#136094] transition-colors duration-300 font-medium"
            >
              {email}
            </a>
          ))}
        </div>
      ),
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      delay: 0.4,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#136094] via-[#0a4275] to-[#082f55]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#008830]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#136094]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#136094]/50 to-[#136094]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {t("location.title")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            {t("location.subtitle")}
          </motion.p>

          {/* Animated scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/70 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            {/* Map Container with Glass Effect */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500">
              {/* Loading Overlay */}
              <AnimatePresence>
                {!isMapLoaded && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-[#136094] to-[#0a4275] z-10 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                      <p className="text-white font-medium">Loading Map...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glass Morphism Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm z-0 pointer-events-none"></div>

              {/* Map */}
              <iframe
                src={getLocationUrl()}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={officeData?.officename?.en || "Office Location"}
                className="w-full h-96 lg:h-[500px] relative z-0"
                onLoad={handleMapLoad}
              />

              {/* Floating Action Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-6 right-6 z-20"
              >
                <a
                  href={officeData?.locationstring?.en || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-[#136094] px-6 py-3 rounded-xl shadow-2xl font-semibold hover:shadow-3xl transition-all duration-300 group/btn"
                >
                  <FaDirections className="group-hover/btn:rotate-12 transition-transform duration-300" />
                  {t("location.getDirections")}
                  <FaExternalLinkAlt className="text-sm opacity-70" />
                </a>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ffca40]/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#008830]/20 rounded-full blur-xl"></div>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Contact Info Cards */}
            <div className="grid gap-6">
              {contactInfoItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <div
                    className={`${item.bgColor} p-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                  >
                    {/* Gradient Accent */}
                    <div
                      className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${item.color}`}
                    ></div>

                    {/* Content */}
                    <div className="flex items-start space-x-4 ml-2">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <div className="text-sm leading-relaxed">
                          {item.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl shadow-2xl group/cta"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#136094] via-[#0a4275] to-[#082f55]"></div>

              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffca40] rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#008830] rounded-full blur-3xl transform -translate-x-16 translate-y-16"></div>
              </div>

              {/* Content */}
              <div className="relative p-8 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-2xl lg:text-3xl font-bold text-white mb-4"
                >
                  {t("location.needHelp")}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-blue-100 mb-6 text-lg leading-relaxed"
                >
                  {t("location.assistanceText")}
                </motion.p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-3 bg-white text-[#136094] px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group/btn"
                  >
                    {t("location.contactUs")}
                    <FiArrowRight className="transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Location;
