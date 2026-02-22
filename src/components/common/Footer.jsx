import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaFax,
  FaRegClock,
} from "react-icons/fa";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiGlobe,
  FiLinkedin,
  FiLink,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Spin } from "antd";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://yekawebapi.yekasubcity.com";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [officeData, setOfficeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color constants
  const colors = {
    primary: "#136094", // Blue
    secondary: "#008830", // Green
    accent: "#ffca40", // Yellow
    white: "#ffffff",
    lightGray: "#f8f9fa",
    darkText: "#2d3748",
  };

  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/officedata`);
        if (res.data.data && res.data.data.length > 0) {
          setOfficeData(res.data.data[0]); // Take the first office data
        }
      } catch (err) {
        console.error("Error fetching office data:", err);
        setError("Failed to load office information");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const footerLinks = [
    {
      title: t("Quick Links"),
      links: [
        { name: t("Home"), path: "/" },
        { name: t("About Us"), path: "/about" },
        { name: t("News & Updates"), path: "/news" },
        { name: t("Photo Gallery"), path: "/gallery" },
        { name: t("Contact Us"), path: "/contact" },
        { name: t("Admin Portal"), path: "/login" },
      ],
    },
    {
      title: t("Resources"),
      links: [
        { name: t("Annual Reports"), path: "/resources/reports" },
        { name: t("Policies"), path: "/resources/policies" },
        { name: t("Forms"), path: "/resources/forms" },
        { name: t("FAQs"), path: "/resources/faqs" },
        { name: t("Tenders"), path: "/announcement/tender" },
        { name: t("Vacancies"), path: "/announcement/vacancy" },
      ],
    },
  ];

  const getSocialLinks = () => {
    if (!officeData?.social_links) return [];

    return [
      {
        icon: <FiFacebook className="w-5 h-5" />,
        url: officeData.social_links.facebook || "#",
        name: "Facebook",
        color: "hover:bg-blue-600",
      },
      {
        icon: <FiInstagram className="w-5 h-5" />,
        url: officeData.social_links.instagram || "#",
        name: "Instagram",
        color: "hover:bg-pink-600",
      },
      {
        icon: <FiTwitter className="w-5 h-5" />,
        url: officeData.social_links.twitter || "#",
        name: "Twitter",
        color: "hover:bg-blue-400",
      },
      {
        icon: <FiYoutube className="w-5 h-5" />,
        url: officeData.social_links.youtube || "#",
        name: "YouTube",
        color: "hover:bg-red-600",
      },
      {
        icon: <FiLinkedin className="w-5 h-5" />,
        url: officeData.social_links.linkedin || "#",
        name: "LinkedIn",
        color: "hover:bg-blue-700",
      },
      {
        icon: <FiGlobe className="w-5 h-5" />,
        url: officeData.social_links.website || "#",
        name: "Website",
        color: "hover:bg-green-600",
      },
    ].filter((link) => link.url !== "#"); // Filter out empty links
  };

  const getContactInfo = () => {
    if (!officeData) return [];

    return [
      ...(officeData.emails?.length
        ? [
            {
              icon: <FaEnvelope className="w-5 h-5" />,
              text: officeData.emails[0],
            },
          ]
        : []),
      ...(officeData.contact_numbers?.length
        ? [
            {
              icon: <FaPhone className="w-5 h-5" />,
              text: officeData.contact_numbers[0],
            },
          ]
        : []),
      {
        icon: <FaRegClock className="w-5 h-5" />,
        text: t("Mon-Fri: 8:30AM - 5:30PM"),
      },
    ];
  };

  if (loading) {
    return (
      <div
        className="py-12 flex justify-center"
        style={{ backgroundColor: colors.primary }}
      >
        <Spin size="large" tip="Loading footer..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="text-white py-12 text-center"
        style={{ backgroundColor: colors.primary }}
      >
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <footer
      className="text-white pt-16 pb-8"
      style={{ backgroundColor: colors.primary }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo and About */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center"
            >
              {officeData?.officelogo ? (
                <img
                  src={`${BACKEND_URL}/uploads/${officeData.officelogo}`}
                  alt={officeData.officename?.en || "Office Logo"}
                  className="w-16 h-16 object-contain rounded-lg border-2 border-white shadow-lg"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-lg border-2 border-white shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <FiLink className="text-white text-2xl" />
                </div>
              )}
              <div className="ml-4">
                <h3 className="text-xl font-bold text-white">
                  {officeData?.officename?.en || t("Office Name")}
                </h3>
                <p className="text-xs" style={{ color: colors.accent }}>
                  {officeData?.specification || t("Office specification")}
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-blue-100 text-sm leading-relaxed"
            >
              {officeData?.aboutoffice?.en ||
                t(
                  "Committed to providing excellent services for all citizens."
                )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3"
            >
              {getSocialLinks().map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-white bg-opacity-10 p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md ${social.color}`}
                  aria-label={social.name}
                  whileHover={{ y: -3 }}
                  style={{ color: colors.white }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <h4
                className="text-lg font-semibold text-white border-b pb-2 inline-block"
                style={{ borderColor: colors.accent }}
              >
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <NavLink
                      to={link.path}
                      className="text-blue-100 hover:text-white transition-colors duration-300 flex items-start group"
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full mt-2 mr-3 transition-colors"
                        style={{ backgroundColor: colors.accent }}
                      ></span>
                      <span className="group-hover:text-blue-50 transition-colors">
                        {link.name}
                      </span>
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <h4
              className="text-lg font-semibold text-white border-b pb-2 inline-block"
              style={{ borderColor: colors.accent }}
            >
              {t("Contact Us")}
            </h4>
            <ul className="space-y-4">
              {getContactInfo().map((info, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span
                    className="mr-3 mt-0.5"
                    style={{ color: colors.accent }}
                  >
                    {info.icon}
                  </span>
                  <span className="text-blue-100 hover:text-white transition-colors">
                    {info.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Newsletter Subscription */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <h5 className="text-sm font-medium text-white mb-2">
                {t("Subscribe to our newsletter")}
              </h5>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("Your email address")}
                  className="bg-white bg-opacity-10 text-white px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 w-full text-sm border border-white border-opacity-20"
                  style={{
                    focusRingColor: colors.accent,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  required
                />
                <button
                  type="submit"
                  className="text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors"
                  style={{ backgroundColor: colors.secondary }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = colors.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = colors.secondary)
                  }
                >
                  {t("Subscribe")}
                </button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-xs mt-2"
                >
                  {t("Thank you for subscribing!")}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright and Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="border-t pt-8 flex flex-col md:flex-row justify-between items-center"
          style={{ borderColor: `${colors.white}20` }}
        >
          <p className="text-sm mb-4 md:mb-0" style={{ color: colors.accent }}>
            &copy; {new Date().getFullYear()}{" "}
            {officeData?.officename?.en || t("Office Name")}.{" "}
            {t("All rights reserved.")}
          </p>

          <div className="flex space-x-6">
            <NavLink
              to="/privacy"
              className="text-blue-100 hover:text-white text-sm transition-colors"
            >
              {t("Privacy Policy")}
            </NavLink>
            <NavLink
              to="/terms"
              className="text-blue-100 hover:text-white text-sm transition-colors"
            >
              {t("Terms of Service")}
            </NavLink>
            <NavLink
              to="/sitemap"
              className="text-blue-100 hover:text-white text-sm transition-colors"
            >
              {t("Sitemap")}
            </NavLink>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
