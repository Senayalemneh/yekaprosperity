import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../utils/getApiUrl";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../../components/common/Loader";
import { useTranslation } from "react-i18next";
import {
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiGlobe,
  FiExternalLink,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { Pagination, Tag, Select, Tabs, Button, Avatar, Divider } from "antd";
import styled from "styled-components";

const { TabPane } = Tabs;
const { Option } = Select;

// Color constants
const colors = {
  primary: "#136094", // Blue
  secondary: "#008830", // Green
  accent: "#ffca40", // Yellow
  white: "#ffffff",
  lightGray: "#f8f9fa",
  darkText: "#2d3748",
};

// Styled components
const StyledCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  }
`;

const CabinetList = () => {
  let apiUrl = getApiUrl();
  const [cabinets, setCabinets] = useState([]);
  const [filteredCabinets, setFilteredCabinets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCabinet, setSelectedCabinet] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [filterPositionLevel, setFilterPositionLevel] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const itemsPerPage = 12;
  const { t, i18n } = useTranslation();

  const positionLevels = [
    {
      value: "Federal Level",
      label: "Federal Level",
      color: colors.primary,
      icon: "🏛️",
    },
    {
      value: "Bureau Level",
      label: "Bureau Level",
      color: colors.secondary,
      icon: "🏢",
    },
    {
      value: "Subcity Level",
      label: "Subcity Level",
      color: colors.accent,
      icon: "🏙️",
    },
    {
      value: "Office Level",
      label: "Office Level",
      color: colors.primary,
      icon: "🏣",
    },
    {
      value: "District Level",
      label: "District Level",
      color: colors.secondary,
      icon: "🏘️",
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-quart",
    });
  }, []);

  useEffect(() => {
    const fetchCabinets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}api/add-cabinet`);
        const data = await response.json();

        if (data.success && data.data) {
          // Process the data to ensure we have proper fullName field
          const processedData = data.data.map((cabinet) => ({
            ...cabinet,
            // Ensure fullName is properly parsed
            fullName:
              typeof cabinet.full_name === "string"
                ? JSON.parse(cabinet.full_name)
                : cabinet.full_name,
          }));

          setCabinets(processedData);
          setFilteredCabinets(processedData);
        } else {
          setCabinets([]);
          setFilteredCabinets([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cabinets:", error);
        setCabinets([]);
        setFilteredCabinets([]);
        setLoading(false);
      }
    };

    fetchCabinets();
  }, [apiUrl]);

  useEffect(() => {
    let results = cabinets;

    // Apply tab filter
    if (activeTab !== "all") {
      results = results.filter(
        (cabinet) => cabinet.position_level === activeTab
      );
    }

    // Apply position level filter
    if (filterPositionLevel) {
      results = results.filter(
        (cabinet) => cabinet.position_level === filterPositionLevel
      );
    }

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (cabinet) =>
          getTranslatedField(cabinet.fullName)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          getTranslatedField(cabinet.position)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCabinets(results);
    setCurrentPage(1);
  }, [searchTerm, cabinets, filterPositionLevel, activeTab, i18n.language]);

  // Function to get translated field based on current language
  const getTranslatedField = (field) => {
    if (!field) return "";

    try {
      // If field is a string, try to parse it as JSON
      if (typeof field === "string") {
        const parsed = JSON.parse(field);
        return parsed[i18n.language] || parsed.en || "";
      }

      // If field is already an object
      if (typeof field === "object") {
        return field[i18n.language] || field.en || "";
      }

      return field;
    } catch (e) {
      // If parsing fails, return as is
      return field;
    }
  };

  // Categorize and sort cabinets by position_level and order
  const getCategorizedCabinets = () => {
    const categories = {};

    // Initialize categories in the order we want them displayed
    positionLevels.forEach((level) => {
      categories[level.value] = [];
    });

    filteredCabinets.forEach((cabinet) => {
      if (categories.hasOwnProperty(cabinet.position_level)) {
        categories[cabinet.position_level].push(cabinet);
      }
    });

    // Sort each category by order (ascending)
    Object.keys(categories).forEach((category) => {
      categories[category].sort((a, b) => a.order - b.order);
    });

    return categories;
  };

  const categorizedCabinets = getCategorizedCabinets();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCabinets.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = (cabinet) => {
    setSelectedCabinet(cabinet);
    setModalImageIndex(
      currentItems.findIndex((item) => item.id === cabinet.id)
    );
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedCabinet(null);
    document.body.style.overflow = "auto";
  };

  const navigateModal = (direction) => {
    const newIndex =
      direction === "next"
        ? (modalImageIndex + 1) % currentItems.length
        : (modalImageIndex - 1 + currentItems.length) % currentItems.length;

    setModalImageIndex(newIndex);
    setSelectedCabinet(currentItems[newIndex]);
  };

  // Function to get position level info
  const getPositionLevelInfo = (level) => {
    return (
      positionLevels.find((l) => l.value === level) || {
        value: level,
        label: level,
        color: colors.primary,
        icon: "👤",
      }
    );
  };

  // Language change handler
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      }}
    >
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("ourteam.title")}
          </h1>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: colors.accent }}
          >
            {t("ourteam.subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-7xl mx-auto mb-12"
      >
        {/* Category Tabs */}
        <div className="mb-8">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="custom-tabs"
            tabBarStyle={{ marginBottom: 0 }}
          >
            <TabPane
              tab={
                <span className="flex items-center">
                  <FiGlobe className="mr-2" />
                  <span className="text-white">
                    {" "}
                    {t("ourteam.all_members")}
                  </span>
                </span>
              }
              key="all"
            />
            {positionLevels.map((level) => (
              <TabPane
                tab={
                  <span className="flex items-center">
                    <span className="mr-2">{level.icon}</span>
                    <span className="text-white">
                      {t(`ourteam.levels.${level.value}`)}
                    </span>
                  </span>
                }
                key={level.value}
              />
            ))}
          </Tabs>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Position Level Filter */}
          <div className="w-full md:w-64">
            <Select
              placeholder={t("ourteam.filter_by_level")}
              allowClear
              suffixIcon={<FiFilter />}
              onChange={setFilterPositionLevel}
              className="w-full"
              options={positionLevels.map((level) => ({
                value: level.value,
                label: (
                  <div className="flex items-center">
                    <Tag
                      style={{
                        backgroundColor: level.color,
                        color: colors.white,
                        border: "none",
                      }}
                      className="mr-2"
                    >
                      {t(`ourteam.levels.${level.value}`)}
                    </Tag>
                  </div>
                ),
              }))}
            />
          </div>

          {/* Search Bar */}
          <div className="w-full md:flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder={t("ourteam.search_placeholder")}
                className="w-full pl-12 pr-6 py-4 rounded-full border-none shadow-lg focus:ring-2 focus:outline-none transition-all duration-300"
                style={{
                  focusRingColor: colors.accent,
                  backgroundColor: colors.white,
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {filteredCabinets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <h3 className="text-2xl font-medium text-white mb-4">
                {t("ourteam.no_results_title")}
              </h3>
              <p style={{ color: colors.accent }}>
                {t("ourteam.no_results_description")}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Render each category in order */}
              {Object.entries(categorizedCabinets).map(
                ([category, cabinets]) => {
                  if (cabinets.length === 0) return null;

                  const levelInfo = getPositionLevelInfo(category);

                  return (
                    <div key={category} className="mb-16">
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center mb-8"
                      >
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4"
                          style={{
                            backgroundColor: colors.white + "20",
                            color: colors.accent,
                          }}
                        >
                          {levelInfo.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {t(`ourteam.levels.${levelInfo.value}`)}
                          </h2>
                          <p style={{ color: colors.accent }}>
                            {cabinets.length} {t("ourteam.members")}
                          </p>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cabinets.map((cabinet) => (
                          <motion.div
                            key={cabinet.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.5,
                              type: "spring",
                              stiffness: 100,
                            }}
                            className="group h-full"
                          >
                            <StyledCard>
                              <div className="relative h-64 overflow-hidden">
                                <button
                                  onClick={() => openModal(cabinet)}
                                  className="block w-full h-full focus:outline-none"
                                >
                                  <img
                                    alt={getTranslatedField(cabinet.fullName)}
                                    src={`${apiUrl}uploads/${cabinet.image}`}
                                    className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                      e.target.src = "/api/placeholder/300/300";
                                    }}
                                  />
                                </button>
                                <Tag
                                  style={{
                                    backgroundColor: levelInfo.color,
                                    color: colors.white,
                                    border: "none",
                                  }}
                                  className="absolute top-4 left-4"
                                >
                                  #{cabinet.order}
                                </Tag>
                              </div>

                              <div className="p-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {getTranslatedField(cabinet.fullName)}
                                  </h3>
                                  <p
                                    className="font-medium mb-3"
                                    style={{ color: colors.primary }}
                                  >
                                    {getTranslatedField(cabinet.position)}
                                  </p>
                                  <p className="text-gray-500 text-sm line-clamp-2">
                                    {getTranslatedField(cabinet.message) ||
                                      t("ourteam.no_message")}
                                  </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <Button
                                    type="primary"
                                    shape="round"
                                    onClick={() => openModal(cabinet)}
                                    className="w-full"
                                    style={{
                                      backgroundColor: colors.primary,
                                      borderColor: colors.primary,
                                      color: colors.white,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor =
                                        colors.secondary;
                                      e.target.style.borderColor =
                                        colors.secondary;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor =
                                        colors.primary;
                                      e.target.style.borderColor =
                                        colors.primary;
                                    }}
                                  >
                                    {t("ourteam.view_profile")}
                                  </Button>
                                </div>
                              </div>
                            </StyledCard>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredCabinets.length > itemsPerPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <Pagination
            current={currentPage}
            total={filteredCabinets.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="rounded-lg p-2"
            style={{ backgroundColor: colors.white + "20" }}
            itemRender={(page, type, originalElement) => {
              if (type === "prev" || type === "next") {
                return (
                  <button
                    className="text-white hover:text-blue-300 px-2"
                    style={{ color: colors.accent }}
                  >
                    {type === "prev" ? "‹" : "›"}
                  </button>
                );
              }
              return (
                <button
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "text-white"
                      : "text-white hover:bg-white/10"
                  }`}
                  style={{
                    backgroundColor:
                      currentPage === page ? colors.primary : "transparent",
                    color: currentPage === page ? colors.white : colors.accent,
                  }}
                >
                  {page}
                </button>
              );
            }}
          />
        </motion.div>
      )}

      {/* Cabinet Member Modal */}
      <AnimatePresence>
        {selectedCabinet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm"
              onClick={closeModal}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 p-3 rounded-full text-white shadow-md transition-all hover:scale-110"
                  style={{ backgroundColor: colors.primary + "80" }}
                >
                  <FiX className="text-2xl" />
                </button>

                {/* Navigation Arrows */}
                {currentItems.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateModal("prev")}
                      className="absolute left-4 top-1/2 z-10 p-3 rounded-full text-white shadow-md transition-all hover:scale-110 transform -translate-y-1/2"
                      style={{ backgroundColor: colors.primary + "80" }}
                    >
                      <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                      onClick={() => navigateModal("next")}
                      className="absolute right-4 top-1/2 z-10 p-3 rounded-full text-white shadow-md transition-all hover:scale-110 transform -translate-y-1/2"
                      style={{ backgroundColor: colors.primary + "80" }}
                    >
                      <FiChevronRight className="text-2xl" />
                    </button>
                  </>
                )}

                {/* Modal Content */}
                <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-2/5">
                      <div className="relative h-full min-h-[400px]">
                        <img
                          src={`${apiUrl}uploads/${selectedCabinet.image}`}
                          alt={getTranslatedField(selectedCabinet.fullName)}
                          className="w-full h-full object-fill"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/400/400";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                          <div className="flex items-center">
                            <Avatar
                              src={`${apiUrl}uploads/${selectedCabinet.image}`}
                              size={64}
                              className="border-2 border-white mr-4"
                            />
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                {getTranslatedField(selectedCabinet.fullName)}
                              </h3>
                              <p style={{ color: colors.accent }}>
                                {getTranslatedField(selectedCabinet.position)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="lg:w-3/5 p-8">
                      <div className="mb-6 flex justify-between items-start">
                        <div>
                          <Tag
                            style={{
                              backgroundColor: getPositionLevelInfo(
                                selectedCabinet.position_level
                              ).color,
                              color: colors.white,
                              border: "none",
                            }}
                            className="mb-2"
                          >
                            {t(
                              `ourteam.levels.${selectedCabinet.position_level}`
                            )}
                          </Tag>
                          <p className="text-sm text-gray-500">
                            {t("ourteam.order")}: {selectedCabinet.order}
                          </p>
                        </div>

                        {/* Social Links - You can add these if available in your API */}
                        <div className="flex gap-3">
                          <a
                            href="#"
                            style={{ color: colors.primary }}
                            title="Contact"
                          >
                            <FiMail />
                          </a>
                        </div>
                      </div>

                      <Divider />

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          {t("ourteam.position")}
                        </h4>
                        <p className="text-gray-700">
                          {getTranslatedField(selectedCabinet.position)}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          {t("ourteam.message")}
                        </h4>
                        <p className="text-gray-700 whitespace-pre-line">
                          {getTranslatedField(selectedCabinet.message) ||
                            t("ourteam.no_message_available")}
                        </p>
                      </div>

                      <Divider />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar
                            src={`${apiUrl}uploads/${selectedCabinet.image}`}
                            size={48}
                            className="mr-4"
                          />
                          <div>
                            <p className="text-sm text-gray-500">
                              {t("ourteam.position_level")}
                            </p>
                            <p
                              className="font-medium"
                              style={{ color: colors.primary }}
                            >
                              {t(
                                `ourteam.levels.${selectedCabinet.position_level}`
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {t("ourteam.order_number")}
                          </p>
                          <p
                            className="font-medium text-lg"
                            style={{ color: colors.primary }}
                          >
                            #{selectedCabinet.order}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CabinetList;
