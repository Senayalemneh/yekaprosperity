import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faTimes,
  faBars,
  faGlobe,
  faBullhorn,
  faUserTie,
  faHandshakeAngle,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "../../utils/getApiUrl";
import { Spin, Input, Badge } from "antd";

function Navbar() {
  const apiUrl = getApiUrl();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const [officeData, setOfficeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Color constants
  const colors = {
    primary: "#136094", // Blue
    secondary: "#008830", // Green
    accent: "#ffca40", // Yellow
    white: "#ffffff",
    lightGray: "#f8f9fa",
    darkText: "#2d3748",
  };

  // Navigation items
  const navItems = [
    { path: "/", label: "nav.home", icon: "🏠" },
    { path: "/about", label: "nav.about", icon: "ℹ️" },
     { path: "/election", label: "nav.election", icon: "ℹ️" },
    { path: "/news", label: "nav.news", icon: "📰" },
    { path: "/gallery", label: "nav.gallery", icon: "🖼️" },
    { path: "/topperformers", label: "nav.top_performers", icon: "🏆" },
  ];

  const managementItems = [
    {
      path: "/management/chief-executive",
      label: "nav.chief_executive",
      icon: "👑",
    },
    { path: "/management/cabinets", label: "nav.cabinets", icon: "💼" },
     { path: "/management/orgstructure", label: "nav.orgStructure", icon: "💼" },
  ];

  const serviceItems = [
    { path: "/contact", label: "nav.contact_us", icon: "📞" },
    { path: "/compliant", label: "nav.compliant", icon: "📝" },
    { path: "/complianttracker", label: "nav.compliant_tracker", icon: "🔍" },
    { path: "/resources", label: "nav.documents", icon: "📂" },
    { path: "/announcement/tender", label: "nav.tender", icon: "📋" },
    { path: "/announcement/vacancy", label: "nav.vacancy", icon: "💼" },
    { path: "/announcement/event", label: "nav.event", icon: "🎉" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Fetch office data
    const fetchOfficeData = async () => {
      try {
        const response = await fetch(`${apiUrl}api/officedata`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setOfficeData(data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching office data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch quick message
    const fetchQuickMessage = async () => {
      try {
        const response = await fetch(
          `${apiUrl}api/quick-messages?status=active`
        );
        const data = await response.json();
        if (
          data.success &&
          data.data.length > 0 &&
          data.data[0].status === "active"
        ) {
          // Get localized message based on current language
          const message =
            data.data[0].title[i18n.language] || data.data[0].title.en;
          setQuickMessage({
            text: message,
            content: data.data[0].content,
            id: data.data[0].id,
          });
        }
      } catch (error) {
        console.error("Error fetching quick messages:", error);
      }
    };

    fetchOfficeData();
    fetchQuickMessage();
  }, [apiUrl, i18n.language]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
    setMobileSubmenuOpen(null);
  };

  const changeLanguage = (value) => {
    i18n.changeLanguage(value);
    closeMenu();
  };

  const toggleMobileSubmenu = (menu) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === menu ? null : menu);
  };

  // Get localized office name
  const getLocalizedOfficeName = () => {
    if (!officeData?.officename) return t("nav.office_name");
    if (typeof officeData.officename === "string") return officeData.officename;
    return (
      officeData.officename[i18n.language] ||
      officeData.officename.en ||
      t("nav.office_name")
    );
  };

  if (loading) {
    return (
      <div
        className="sticky top-0 z-50 py-2 shadow-lg"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <Spin size="large" tip={t("nav.loading")} />
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50">
      {/* Quick Message Bar */}
      {quickMessage && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="w-full overflow-hidden shadow-md relative"
          style={{ backgroundColor: colors.secondary }}
        >
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute left-0 ml-6 flex items-center z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              >
                <FontAwesomeIcon
                  icon={faBullhorn}
                  className="text-white mr-3 text-lg"
                />
              </motion.div>
              <Badge color={colors.accent} dot>
                <span className="text-white text-sm font-bold">
                  {t("nav.announcement")}:
                </span>
              </Badge>
            </div>
            <div className="w-full px-20 overflow-hidden">
              <motion.div
                className="whitespace-nowrap text-white text-sm font-semibold py-1 cursor-pointer hover:underline transition-all duration-300"
                animate={{
                  x: ["100%", "-100%"],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
                onClick={() => navigate("/announcement")}
              >
                {quickMessage.text}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled ? "py-2 shadow-xl border-b" : "py-3 shadow-lg"
        } relative`}
        style={{
          backgroundColor: colors.primary,
          borderColor: `${colors.white}20`,
        }}
      >
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <NavLink
              to="/"
              className="flex items-center group"
              onClick={closeMenu}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {officeData?.officelogo ? (
                  <div className="relative">
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img
                        src={`${apiUrl}uploads/${officeData.officelogo}`}
                        alt={getLocalizedOfficeName()}
                        className={`transition-all duration-300 rounded-xl border-2 border-white shadow-lg object-cover relative z-10 ${
                          scrolled ? "h-12 w-12" : "h-14 w-14"
                        }`}
                      />
                    </motion.div>
                  </div>
                ) : (
                  <div
                    className={`transition-all duration-300 rounded-xl border-2 border-white shadow-lg flex items-center justify-center relative overflow-hidden ${
                      scrolled ? "h-12 w-12" : "h-14 w-14"
                    }`}
                    style={{ backgroundColor: colors.secondary }}
                  >
                    <span className="text-white font-bold text-lg relative z-10">
                      {getLocalizedOfficeName().charAt(0) || "G"}
                    </span>
                  </div>
                )}
              </motion.div>
              <div className="ml-4 hidden md:block">
                <h1 className="text-xl font-bold text-white leading-tight">
                  {getLocalizedOfficeName()}
                </h1>
                <p className="text-sm text-blue-100 mt-1 font-light hidden lg:block">
                  {officeData?.specification || t("nav.office_specification")}
                </p>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  className="relative"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center relative group/navitem ${
                        isActive
                          ? "text-white shadow-md"
                          : "text-blue-100 hover:text-white"
                      }`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive
                        ? colors.secondary
                        : "transparent",
                    })}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Hover background */}
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover/navitem:opacity-100 transition-opacity duration-200"
                      style={{ backgroundColor: colors.accent }}
                      initial={false}
                    />

                    {/* Content container */}
                    <div className="relative z-10 flex items-center">
                      <motion.span
                        className="mr-2 text-sm"
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.icon}
                      </motion.span>
                      {t(item.label)}
                    </div>

                    {/* Active indicator */}
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-1/4 w-1/2 h-0.5 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                        layoutId="activeIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </NavLink>
                </motion.div>
              ))}

              {/* Management Dropdown */}
              <motion.div className="relative group" whileHover={{ y: -1 }}>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 relative ${
                    location.pathname.startsWith("/management")
                      ? "text-white shadow-md"
                      : "text-blue-100 hover:text-white"
                  }`}
                  style={{
                    backgroundColor: location.pathname.startsWith("/management")
                      ? colors.secondary
                      : "transparent",
                  }}
                  onMouseEnter={() => setHoveredItem("management")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative z-10 flex items-center">
                    <FontAwesomeIcon
                      icon={faUserTie}
                      className="mr-2 text-sm"
                    />
                    {t("nav.management")}
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180"
                    />
                  </div>
                </button>
                <motion.div
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 border"
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.primary + "20",
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <div className="p-2">
                    {managementItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `block px-3 py-3 rounded-lg text-sm transition-all duration-200 flex items-center group/item relative ${
                              isActive
                                ? "text-white shadow-sm"
                                : "text-gray-700 hover:text-gray-900"
                            }`
                          }
                          style={({ isActive }) => ({
                            backgroundColor: isActive
                              ? colors.primary
                              : "transparent",
                          })}
                        >
                          <span className="mr-3 text-sm">{item.icon}</span>
                          {t(item.label)}
                          <motion.div
                            className="absolute right-3 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                            whileHover={{ x: 2 }}
                          >
                            →
                          </motion.div>
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Services Dropdown */}
              <motion.div className="relative group" whileHover={{ y: -1 }}>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 relative ${
                    location.pathname.startsWith("/contact") ||
                    location.pathname.startsWith("/compliant") ||
                    location.pathname.startsWith("/resources") ||
                    location.pathname.startsWith("/announcement")
                      ? "text-white shadow-md"
                      : "text-blue-100 hover:text-white"
                  }`}
                  style={{
                    backgroundColor:
                      location.pathname.startsWith("/contact") ||
                      location.pathname.startsWith("/compliant") ||
                      location.pathname.startsWith("/resources") ||
                      location.pathname.startsWith("/announcement")
                        ? colors.secondary
                        : "transparent",
                  }}
                  onMouseEnter={() => setHoveredItem("services")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative z-10 flex items-center">
                    <FontAwesomeIcon
                      icon={faHandshakeAngle}
                      className="mr-2 text-sm"
                    />
                    {t("nav.services")}
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180"
                    />
                  </div>
                </button>
                <motion.div
                  className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 border"
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.primary + "20",
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <div className="p-2">
                    {serviceItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center group/item relative ${
                              isActive
                                ? "text-white shadow-sm"
                                : "text-gray-700 hover:text-gray-900"
                            }`
                          }
                          style={({ isActive }) => ({
                            backgroundColor: isActive
                              ? colors.primary
                              : "transparent",
                          })}
                        >
                          <span className="mr-3 text-sm">{item.icon}</span>
                          {t(item.label)}
                          <motion.div
                            className="absolute right-3 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                            whileHover={{ x: 2 }}
                          >
                            →
                          </motion.div>
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <motion.div
                className="relative group hidden lg:block"
                whileHover={{ y: -1 }}
              >
                <button
                  className="px-3 py-2 rounded-lg text-sm font-medium flex items-center text-blue-100 hover:text-white transition-all duration-200"
                  style={{ backgroundColor: "transparent" }}
                >
                  <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                  {i18n.language?.toUpperCase()}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>
                <motion.div
                  className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 border"
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.primary + "20",
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <div className="p-2">
                    {[
                      { code: "en", name: "English", flag: "🇬🇧" },
                      { code: "am", name: "አማርኛ", flag: "🇪🇹" },
                      { code: "or", name: "Afaan Oromoo", flag: "🇪🇹" },
                    ].map((lang) => (
                      <motion.button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center ${
                          i18n.language === lang.code
                            ? "text-white shadow-sm"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                        style={{
                          backgroundColor:
                            i18n.language === lang.code
                              ? colors.primary
                              : "transparent",
                        }}
                        whileHover={{ x: 3 }}
                      >
                        <span className="mr-3 text-base">{lang.flag}</span>
                        {lang.name}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-blue-100 hover:text-white transition-all duration-200 lg:hidden"
                style={{ backgroundColor: "transparent" }}
                aria-label="Toggle menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon
                  icon={isMenuOpen ? faTimes : faBars}
                  className="w-5 h-5"
                />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm shadow-2xl lg:hidden overflow-y-auto"
              style={{ backgroundColor: colors.primary }}
            >
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: `${colors.white}20` }}
              >
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center"
                >
                  {officeData?.officelogo ? (
                    <div className="relative">
                      <img
                        src={`${apiUrl}uploads/${officeData.officelogo}`}
                        alt={getLocalizedOfficeName()}
                        className="h-10 w-10 rounded-lg border border-white shadow-md object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-10 w-10 rounded-lg border border-white shadow-md flex items-center justify-center"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      <span className="text-white font-bold text-sm">
                        {getLocalizedOfficeName().charAt(0) || "G"}
                      </span>
                    </div>
                  )}
                  <div className="ml-3">
                    <h1 className="text-base font-bold text-white">
                      {getLocalizedOfficeName()}
                    </h1>
                    <p className="text-xs text-blue-200">
                      {officeData?.specification ||
                        t("nav.office_specification")}
                    </p>
                  </div>
                </NavLink>
                <motion.button
                  onClick={closeMenu}
                  className="p-2 text-blue-200 hover:text-white rounded-lg transition-colors duration-200"
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          `block px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                            isActive
                              ? "text-white shadow-sm"
                              : "text-blue-100 hover:text-white"
                          }`
                        }
                        style={({ isActive }) => ({
                          backgroundColor: isActive
                            ? colors.secondary
                            : "transparent",
                        })}
                      >
                        <span className="mr-3 text-base">{item.icon}</span>
                        {t(item.label)}
                      </NavLink>
                    </motion.div>
                  ))}

                  {/* Management Mobile Submenu */}
                  <div className="mt-1">
                    <motion.button
                      onClick={() => toggleMobileSubmenu("management")}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-3 py-3 rounded-lg text-sm font-medium flex justify-between items-center transition-all duration-200 ${
                        mobileSubmenuOpen === "management" ||
                        location.pathname.startsWith("/management")
                          ? "text-white shadow-sm"
                          : "text-blue-100 hover:text-white"
                      }`}
                      style={{
                        backgroundColor:
                          mobileSubmenuOpen === "management" ||
                          location.pathname.startsWith("/management")
                            ? colors.secondary
                            : "transparent",
                      }}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faUserTie}
                          className="mr-3 text-sm"
                        />
                        {t("nav.management")}
                      </div>
                      <FontAwesomeIcon
                        icon={
                          mobileSubmenuOpen === "management"
                            ? faChevronUp
                            : faChevronDown
                        }
                        className="text-xs transition-transform duration-300"
                      />
                    </motion.button>
                    <AnimatePresence>
                      {mobileSubmenuOpen === "management" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6 space-y-1 mt-1">
                            {managementItems.map((item) => (
                              <motion.div key={item.path} whileHover={{ x: 3 }}>
                                <NavLink
                                  to={item.path}
                                  onClick={closeMenu}
                                  className={({ isActive }) =>
                                    `block px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center ${
                                      isActive
                                        ? "text-white"
                                        : "text-blue-100 hover:text-white"
                                    }`
                                  }
                                  style={({ isActive }) => ({
                                    backgroundColor: isActive
                                      ? colors.secondary + "80"
                                      : "transparent",
                                  })}
                                >
                                  <span className="mr-3 text-sm">
                                    {item.icon}
                                  </span>
                                  {t(item.label)}
                                </NavLink>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Services Mobile Submenu */}
                  <div className="mt-1">
                    <motion.button
                      onClick={() => toggleMobileSubmenu("services")}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-3 py-3 rounded-lg text-sm font-medium flex justify-between items-center transition-all duration-200 ${
                        mobileSubmenuOpen === "services" ||
                        location.pathname.startsWith("/contact") ||
                        location.pathname.startsWith("/compliant") ||
                        location.pathname.startsWith("/resources") ||
                        location.pathname.startsWith("/announcement")
                          ? "text-white shadow-sm"
                          : "text-blue-100 hover:text-white"
                      }`}
                      style={{
                        backgroundColor:
                          mobileSubmenuOpen === "services" ||
                          location.pathname.startsWith("/contact") ||
                          location.pathname.startsWith("/compliant") ||
                          location.pathname.startsWith("/resources") ||
                          location.pathname.startsWith("/announcement")
                            ? colors.secondary
                            : "transparent",
                      }}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faHandshakeAngle}
                          className="mr-3 text-sm"
                        />
                        {t("nav.services")}
                      </div>
                      <FontAwesomeIcon
                        icon={
                          mobileSubmenuOpen === "services"
                            ? faChevronUp
                            : faChevronDown
                        }
                        className="text-xs transition-transform duration-300"
                      />
                    </motion.button>
                    <AnimatePresence>
                      {mobileSubmenuOpen === "services" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6 space-y-1 mt-1">
                            {serviceItems.map((item) => (
                              <motion.div key={item.path} whileHover={{ x: 3 }}>
                                <NavLink
                                  to={item.path}
                                  onClick={closeMenu}
                                  className={({ isActive }) =>
                                    `block px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center ${
                                      isActive
                                        ? "text-white"
                                        : "text-blue-100 hover:text-white"
                                    }`
                                  }
                                  style={({ isActive }) => ({
                                    backgroundColor: isActive
                                      ? colors.secondary + "80"
                                      : "transparent",
                                  })}
                                >
                                  <span className="mr-3 text-sm">
                                    {item.icon}
                                  </span>
                                  {t(item.label)}
                                </NavLink>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Language Selector in Mobile Menu */}
                  <div
                    className="mt-4 pt-3 border-t"
                    style={{ borderColor: `${colors.white}20` }}
                  >
                    <h3 className="px-3 py-2 text-sm font-medium text-blue-200 flex items-center">
                      <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                      {t("nav.language")}
                    </h3>
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      {[
                        { code: "en", name: "English", flag: "🇬🇧" },
                        { code: "am", name: "አማርኛ", flag: "🇪🇹" },
                        { code: "or", name: "Afaan Oromoo", flag: "🇪🇹" },
                      ].map((lang) => (
                        <motion.button
                          key={lang.code}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => changeLanguage(lang.code)}
                          className={`px-3 py-2 rounded-lg text-sm text-left flex items-center transition-all duration-200 ${
                            i18n.language === lang.code
                              ? "text-white shadow-sm"
                              : "text-blue-100 hover:text-white"
                          }`}
                          style={{
                            backgroundColor:
                              i18n.language === lang.code
                                ? colors.secondary
                                : "transparent",
                          }}
                        >
                          <span className="mr-3 text-lg">{lang.flag}</span>
                          {lang.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
