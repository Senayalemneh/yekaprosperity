import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Spin, Button, Alert } from "antd";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobeAmericas,
  FaBuilding,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";
import { motion } from "framer-motion";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://yekawebapi.yekasubcity.com";

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [officeData, setOfficeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });

    const fetchOfficeData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/officedata`);
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setOfficeData(res.data.data[0]);
        } else {
          setError(t("aboutclient.no_office_data"));
        }
      } catch (err) {
        console.error("Error fetching office data:", err);
        setError(t("aboutclient.failed_to_load_office_info"));
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeData();
  }, [t, currentLanguage]);

  const getLocalizedText = (field) => {
    if (!officeData || !officeData[field]) {
      return t("aboutclient.information_not_available");
    }

    if (typeof officeData[field] === "object") {
      return (
        officeData[field][currentLanguage] ||
        officeData[field].en ||
        t("aboutclient.information_not_available")
      );
    }

    return officeData[field];
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const openGoogleMaps = () => {
    const mapUrl = getLocalizedText("locationstring");
    if (mapUrl && mapUrl.includes("google.com/maps")) {
      const viewUrl = mapUrl.replace("/embed?", "/@").split("!1m")[0];
      window.open(viewUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#136094]/10 to-[#008830]/5">
        <div className="text-center">
          <Spin size="large" className="mb-4" />
          <p className="text-lg text-[#136094]">{t("aboutclient.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-6 bg-gradient-to-br from-[#136094]/10 to-[#008830]/5">
        <div className="max-w-md">
          <Alert message={error} type="error" showIcon className="mb-6" />
          <Button
            type="primary"
            size="large"
            onClick={() => window.location.reload()}
            className="bg-[#136094] hover:bg-[#0f4a7a] border-none text-white font-semibold h-12 px-8 rounded-xl"
          >
            {t("aboutclient.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#136094]/5 to-[#008830]/5">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#008830]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#136094]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#136094] via-[#0f4a7a] to-[#0a3560] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffca40]/10 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2" data-aos="fade-right">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#ffca40]">
                    {t("aboutclient.about_our_organization")}
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white to-[#ffca40] bg-clip-text text-transparent">
                  {getLocalizedText("officename")}
                </h1>

                <p className="text-xl text-blue-100 max-w-2xl mb-8 leading-relaxed">
                  {getLocalizedText("aboutoffice")}
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="/contact"
                    className="px-8 py-4 bg-[#ffca40] text-[#136094] font-bold rounded-xl hover:bg-[#e6b63a] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEnvelope />
                    {t("aboutclient.contact_us")}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                </div>
              </motion.div>
            </div>

            <div className="lg:w-1/2" data-aos="fade-left">
              <motion.div
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {officeData?.officelogo ? (
                  <img
                    src={`${BACKEND_URL}/uploads/${officeData.officelogo}`}
                    alt={getLocalizedText("officename")}
                    className="w-full h-auto max-h-80 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-64 flex items-center justify-center rounded-lg bg-white/5 ${
                    officeData?.officelogo ? "hidden" : "flex"
                  }`}
                >
                  <FaBuilding className="text-6xl text-white/60" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#136094] mb-6">
              {t("aboutclient.our_purpose")}
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-[#ffca40] to-[#008830] mx-auto rounded-full mb-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              className="group relative bg-gradient-to-br from-[#136094]/5 to-white p-8 rounded-2xl border border-[#136094]/20 hover:border-[#ffca40] transition-all duration-300 hover:shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#136094] to-[#0f4a7a] rounded-t-2xl"></div>
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#136094] flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h.01a1 1 0 100-2H5zm4 0a1 1 0 000 2h.01a1 1 0 100-2H9zm4 0a1 1 0 000 2h.01a1 1 0 100-2H13z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#136094] mb-2">
                    {t("aboutclient.mission")}
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {getLocalizedText("missions")}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-gradient-to-br from-[#008830]/5 to-white p-8 rounded-2xl border border-[#008830]/20 hover:border-[#ffca40] transition-all duration-300 hover:shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#008830] to-[#006625] rounded-t-2xl"></div>
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#008830] flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#136094] mb-2">
                    {t("aboutclient.vision")}
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {getLocalizedText("vissions")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-br from-[#136094]/10 to-[#008830]/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#136094] mb-6">
              {t("aboutclient.core_values")}
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-[#ffca40] to-[#008830] mx-auto rounded-full mb-4"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("aboutclient.core_values_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getLocalizedText("values")
              .split(",")
              .filter((v) => v.trim())
              .map((value, i) => {
                const colors = [
                  "from-[#136094] to-[#0f4a7a]",
                  "from-[#008830] to-[#006625]",
                  "from-[#ffca40] to-[#e6b63a]",
                  "from-[#136094] to-[#008830]",
                ];

                const icons = ["💎", "⚡", "🌟", "🌐", "🚀", "🔑", "🛡️", "❤️"];

                return (
                  <motion.div
                    key={i}
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#136094]/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div
                      className={`h-2 bg-gradient-to-r ${
                        colors[i % colors.length]
                      }`}
                    ></div>
                    <div className="p-6">
                      <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {icons[i % 8]}
                      </div>
                      <h3 className="text-lg font-bold text-[#136094] leading-tight">
                        {value.trim()}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Location & Map Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#136094] mb-6">
              {t("aboutclient.our_location")}
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-[#ffca40] to-[#008830] mx-auto rounded-full mb-4"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("aboutclient.location_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-[#136094]/5 to-white p-8 rounded-2xl border border-[#136094]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#136094] flex items-center justify-center mr-4">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#136094] mb-2">
                      {t("aboutclient.address")}
                    </h3>
                    <p className="text-lg text-gray-700">
                      Bole Sub-City Administration
                    </p>
                    <p className="text-gray-600">Addis Ababa, Ethiopia</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#008830]/5 to-white p-8 rounded-2xl border border-[#008830]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#008830] flex items-center justify-center mr-4">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#136094] mb-4">
                      {t("aboutclient.email")}
                    </h3>
                    {officeData.emails?.map((email, i) => (
                      <motion.a
                        key={i}
                        href={`mailto:${email}`}
                        className="block text-lg text-gray-700 hover:text-[#008830] mb-2 transition-colors duration-200 font-medium"
                        whileHover={{ x: 5 }}
                      >
                        {email}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#ffca40]/10 to-white p-8 rounded-2xl border border-[#ffca40]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#ffca40] flex items-center justify-center mr-4">
                    <FaPhone className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#136094] mb-4">
                      {t("aboutclient.phone")}
                    </h3>
                    {officeData.contact_numbers?.map((number, i) => (
                      <motion.a
                        key={i}
                        href={`tel:${number}`}
                        className="block text-lg text-gray-700 hover:text-[#136094] mb-2 transition-colors duration-200 font-medium"
                        whileHover={{ x: 5 }}
                      >
                        {number}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Google Map */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#136094]/20 hover:border-[#ffca40] transition-all duration-300">
                <div className="relative h-96 lg:h-[500px]">
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#136094]/5">
                      <div className="text-center">
                        <Spin size="large" className="mb-4" />
                        <p className="text-[#136094]">Loading map...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={getLocalizedText("locationstring")}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={handleMapLoad}
                    title="Office Location"
                  />
                </div>
                <div className="p-6 bg-gradient-to-r from-[#136094]/5 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-[#ffca40] text-xl" />
                      <div>
                        <h4 className="font-semibold text-[#136094]">
                          Our Location
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Bole Sub-City, Addis Ababa
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={openGoogleMaps}
                      className="px-6 py-3 bg-[#136094] text-white rounded-xl hover:bg-[#0f4a7a] transition-colors duration-200 font-semibold flex items-center gap-2 group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaExternalLinkAlt className="group-hover:rotate-12 transition-transform" />
                      Open in Maps
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 bg-gradient-to-br from-[#136094] to-[#0f4a7a] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#ffca40] bg-clip-text text-transparent">
              {t("aboutclient.connect_with_us")}
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-[#ffca40] to-[#008830] mx-auto rounded-full mb-4"></div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t("aboutclient.social_media_description")}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {officeData.social_links?.facebook && (
              <motion.a
                href={officeData.social_links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-2xl bg-[#1877f2] flex items-center justify-center hover:bg-[#166fe5] transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiFacebook className="text-2xl" />
              </motion.a>
            )}

            {officeData.social_links?.twitter && (
              <motion.a
                href={officeData.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-2xl bg-[#1da1f2] flex items-center justify-center hover:bg-[#1a91da] transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTwitter className="text-2xl" />
              </motion.a>
            )}

            {officeData.social_links?.instagram && (
              <motion.a
                href={officeData.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center hover:from-[#7a32a9] hover:via-[#e61a1a] hover:to-[#fba944] transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiInstagram className="text-2xl" />
              </motion.a>
            )}

            {officeData.social_links?.linkedin && (
              <motion.a
                href={officeData.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-2xl bg-[#0077b5] flex items-center justify-center hover:bg-[#00669c] transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiLinkedin className="text-2xl" />
              </motion.a>
            )}

            {officeData.social_links?.youtube && (
              <motion.a
                href={officeData.social_links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-2xl bg-[#ff0000] flex items-center justify-center hover:bg-[#e60000] transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiYoutube className="text-2xl" />
              </motion.a>
            )}

            {officeData.social_links?.website && (
              <motion.a
                href={officeData.social_links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-2xl bg-[#ffca40] flex items-center justify-center hover:bg-[#e6b63a] transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGlobeAmericas className="text-2xl text-[#136094]" />
              </motion.a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
