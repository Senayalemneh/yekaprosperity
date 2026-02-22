import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../../utils/getApiUrl";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../../common/Loader";
import { useTranslation } from "react-i18next";
import {
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiGlobe,
  FiAward,
  FiUser,
  FiMapPin,
  FiStar,
  FiArrowRight,
  FiMail,
} from "react-icons/fi";
import { Pagination, Tag, Select, Tabs, Badge, Tooltip } from "antd";

const { TabPane } = Tabs;
const { Option } = Select;

const CabinetList = () => {
  let apiUrl = getApiUrl();
  const [cabinets, setCabinets] = useState([]);
  const [filteredCabinets, setFilteredCabinets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCabinet, setSelectedCabinet] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterPositionLevel, setFilterPositionLevel] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const itemsPerPage = 12;
  const { t, i18n } = useTranslation();

  const positionLevels = [
    {
      value: "Federal Level",
      label: "Federal Level",
      color: "#ffca40",
      icon: "🏛️",
    },
    {
      value: "Bureau Level",
      label: "Bureau Level",
      color: "#008830",
      icon: "🏢",
    },
    {
      value: "Subcity Level",
      label: "Subcity Level",
      color: "#136094",
      icon: "📍",
    },
    {
      value: "Office Level",
      label: "Office Level",
      color: "#e6b63a",
      icon: "💼",
    },
    {
      value: "District Level",
      label: "District Level",
      color: "#006625",
      icon: "🗺️",
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const fetchCabinets = async () => {
      try {
        const response = await fetch(`${apiUrl}api/add-cabinet`);
        const data = await response.json();
        setCabinets(data.data || []);
        setFilteredCabinets(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cabinets:", error);
        setLoading(false);
      }
    };

    fetchCabinets();
  }, []);

  useEffect(() => {
    let results = cabinets;

    // Apply position level filter
    if (filterPositionLevel) {
      results = results.filter(
        (cabinet) => cabinet.position_level === filterPositionLevel
      );
    }

    // Apply category filter
    if (activeCategory !== "all") {
      results = results.filter(
        (cabinet) => cabinet.position_level === activeCategory
      );
    }

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (cabinet) =>
          cabinet.fullName?.en
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          cabinet.position?.en?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCabinets(results);
    setCurrentPage(1);
  }, [searchTerm, cabinets, filterPositionLevel, activeCategory]);

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

  // Function to get translated field based on active language
  const getTranslatedField = (field) => {
    if (!field) return "";
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        return parsed[activeLanguage] || parsed.en || "";
      } catch {
        return field;
      }
    }
    return field[activeLanguage] || field.en || "";
  };

  // Function to get position level info
  const getPositionLevelInfo = (level) => {
    return (
      positionLevels.find((l) => l.value === level) || {
        value: level,
        label: level,
        color: "#136094",
        icon: "👤",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#136094] via-[#0f4a7a] to-[#082f55] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#008830]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#136094]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center justify-center p-6 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl mb-8"
        >
          <div className="bg-gradient-to-r from-[#ffca40] to-[#e6b63a] p-4 rounded-2xl mr-4">
            <FiAward className="text-3xl text-[#136094]" />
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-2 bg-gradient-to-r from-white to-[#ffca40] bg-clip-text text-transparent">
              {t("cabinetlist.BoleSubCity")}
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              {t("cabinetlist.cabinetMembers")}
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto"
        >
          {positionLevels.map((level, index) => {
            const count = cabinets.filter(
              (cab) => cab.position_level === level.value
            ).length;
            return (
              <motion.div
                key={level.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center cursor-pointer hover:bg-white/15 transition-all duration-300"
                onClick={() => setActiveCategory(level.value)}
              >
                <div className="text-2xl mb-2">{level.icon}</div>
                <div className="text-white font-bold text-2xl">{count}</div>
                <div className="text-blue-200 text-sm">
                  {t(`cabinetlist.positionLevels.${level.value}`)}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-7xl mx-auto mb-12 relative z-10"
      >
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Language Selector */}
          <div className="w-full lg:w-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
              <Tabs
                activeKey={activeLanguage}
                onChange={setActiveLanguage}
                tabBarStyle={{ marginBottom: 0 }}
                className="custom-tabs"
              >
                <TabPane
                  tab={
                    <span className="text-white font-semibold flex items-center">
                      <FiGlobe className="mr-2" />
                      🇬🇧 {t("cabinetlist.english")}
                    </span>
                  }
                  key="en"
                />
                <TabPane
                  tab={
                    <span className="text-white font-semibold flex items-center">
                      <FiGlobe className="mr-2" />
                      🇪🇹 {t("cabinetlist.amharic")}
                    </span>
                  }
                  key="am"
                />
                <TabPane
                  tab={
                    <span className="text-white font-semibold flex items-center">
                      <FiGlobe className="mr-2" />
                      🇪🇹 {t("cabinetlist.oromo")}
                    </span>
                  }
                  key="or"
                />
              </Tabs>
            </div>
          </div>

          {/* Position Level Filter */}
          <div className="w-full lg:w-72">
            <Select
              placeholder={t("cabinetlist.filterByLevel")}
              allowClear
              suffixIcon={<FiFilter className="text-[#136094]" />}
              onChange={setFilterPositionLevel}
              className="w-full rounded-2xl"
              options={positionLevels.map((level) => ({
                value: level.value,
                label: (
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: level.color }}
                    ></div>
                    <span className="font-semibold text-[#136094]">
                      {t(`cabinetlist.positionLevels.${level.value}`)}
                    </span>
                  </div>
                ),
              }))}
            />
          </div>

          {/* Search Bar */}
          <div className="w-full lg:flex-1">
            <div className="relative">
              <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#136094] text-xl" />
              <input
                type="text"
                placeholder={t("cabinetlist.searchPlaceholder")}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-transparent bg-white shadow-xl focus:border-[#ffca40] focus:outline-none transition-all duration-300 text-[#136094] font-medium placeholder-[#136094]/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#136094] hover:text-[#0f4a7a] transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <FiX className="text-xl" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filterPositionLevel || activeCategory !== "all" || searchTerm) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 flex items-center justify-between bg-[#136094] p-4 rounded-2xl border border-[#ffca40]/30"
          >
            <span className="text-white font-semibold">
              {t("cabinetlist.showingFilteredResults", {
                count: filteredCabinets.length,
              })}
            </span>
            <button
              onClick={() => {
                setFilterPositionLevel(null);
                setActiveCategory("all");
                setSearchTerm("");
              }}
              className="text-[#ffca40] flex items-center font-semibold hover:text-[#e6b63a] transition-colors"
            >
              <FiX className="mr-2" />
              {t("cabinetlist.clearFilters")}
            </button>
          </motion.div>
        )}
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto relative z-10">
          {filteredCabinets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-16 shadow-2xl border border-white/20 text-center"
            >
              <div className="text-[#ffca40] text-6xl mb-6">
                <FiUser />
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">
                {t("cabinetlist.noCabinetMembers")}
              </h3>
              <p className="text-blue-100 mb-6">
                {t("cabinetlist.tryAdjustingSearch")}
              </p>
              <button
                onClick={() => {
                  setFilterPositionLevel(null);
                  setActiveCategory("all");
                  setSearchTerm("");
                }}
                className="bg-[#ffca40] hover:bg-[#e6b63a] text-[#136094] font-bold rounded-2xl px-8 py-3 shadow-lg transition-all duration-300"
              >
                {t("cabinetlist.clearFilters")}
              </button>
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
                      {/* Category Header */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-between mb-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-4 h-12 rounded-full mr-4"
                            style={{ backgroundColor: levelInfo.color }}
                          ></div>
                          <div>
                            <h2 className="text-3xl font-bold text-white">
                              {t(
                                `cabinetlist.positionLevels.${levelInfo.value}`
                              )}
                            </h2>
                            <p className="text-blue-100">
                              {cabinets.length} {t("cabinetlist.members")}
                            </p>
                          </div>
                        </div>
                        <div className="text-4xl">{levelInfo.icon}</div>
                      </motion.div>

                      {/* Cabinet Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {cabinets.map((cabinet, index) => (
                          <motion.div
                            key={cabinet.id}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.1,
                              type: "spring",
                            }}
                            className="group relative"
                            whileHover={{ y: -8, scale: 1.02 }}
                          >
                            {/* Cabinet Card */}
                            <div className="relative h-full bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 group-hover:border-[#ffca40]/30">
                              {/* Image Container */}
                              <div className="relative h-72 overflow-hidden">
                                <img
                                  alt={getTranslatedField(cabinet.fullName)}
                                  src={`${apiUrl}uploads/${cabinet.image}`}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#136094]/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                                  <span className="text-white font-semibold text-sm leading-relaxed line-clamp-2">
                                    {getTranslatedField(
                                      cabinet.message
                                    )?.substring(0, 100)}
                                    ...
                                  </span>
                                </div>
                                <div className="absolute top-4 left-4">
                                  <Badge
                                    count={cabinet.order}
                                    style={{
                                      backgroundColor: levelInfo.color,
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ffca40] transition-colors duration-300">
                                  {getTranslatedField(cabinet.fullName)}
                                </h3>
                                <p className="text-[#ffca40] font-semibold mb-3">
                                  {getTranslatedField(cabinet.position)}
                                </p>
                                <div className="flex justify-center">
                                  <Tag
                                    color={levelInfo.color}
                                    className="font-semibold border-0 text-white px-3 py-1 rounded-full"
                                    style={{ backgroundColor: levelInfo.color }}
                                  >
                                    {t(
                                      `cabinetlist.positionLevels.${cabinet.position_level}`
                                    )}
                                  </Tag>
                                </div>
                              </div>

                              {/* View Button */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal(cabinet)}
                                className="absolute bottom-4 right-4 bg-[#ffca40] text-[#136094] px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center gap-2"
                              >
                                <FiArrowRight />
                                {t("cabinetlist.view")}
                              </motion.button>
                            </div>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-16 relative z-10"
        >
          <Pagination
            current={currentPage}
            total={filteredCabinets.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="custom-pagination"
            itemRender={(page, type, originalElement) => {
              if (type === "prev" || type === "next") {
                return (
                  <button className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-2xl px-6 py-3 shadow-lg mx-2 font-semibold transition-all duration-300">
                    {type === "prev" ? "‹ Previous" : "Next ›"}
                  </button>
                );
              }
              if (type === "page") {
                return (
                  <button
                    className={`${
                      currentPage === page
                        ? "bg-[#ffca40] text-[#136094]"
                        : "bg-white/10 hover:bg-white/20 text-white border-0"
                    } rounded-2xl w-12 h-12 mx-1 shadow-lg font-semibold transition-all duration-300`}
                  >
                    {page}
                  </button>
                );
              }
              return originalElement;
            }}
          />
        </motion.div>
      )}

      {/* Enhanced Cabinet Member Modal */}
      <AnimatePresence>
        {selectedCabinet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/95 z-50 backdrop-blur-sm"
              onClick={closeModal}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-50 p-3 rounded-full bg-[#ffca40] text-[#136094] shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  <FiX className="text-2xl font-bold" />
                </motion.button>

                {/* Navigation Arrows */}
                {currentItems.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigateModal("prev")}
                      className="absolute left-4 top-1/2 z-50 p-4 rounded-full bg-[#ffca40] text-[#136094] shadow-2xl hover:shadow-3xl transition-all duration-300 transform -translate-y-1/2"
                    >
                      <FiChevronLeft className="text-2xl font-bold" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigateModal("next")}
                      className="absolute right-4 top-1/2 z-50 p-4 rounded-full bg-[#ffca40] text-[#136094] shadow-2xl hover:shadow-3xl transition-all duration-300 transform -translate-y-1/2"
                    >
                      <FiChevronRight className="text-2xl font-bold" />
                    </motion.button>
                  </>
                )}

                {/* Modal Content */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 h-full">
                  <div className="flex flex-col lg:flex-row h-full">
                    {/* Image Section */}
                    <div className="lg:w-2/5 relative">
                      <img
                        src={`${apiUrl}uploads/${selectedCabinet.image}`}
                        alt={getTranslatedField(selectedCabinet.fullName)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Tag
                              color={
                                getPositionLevelInfo(
                                  selectedCabinet.position_level
                                ).color
                              }
                              className="font-bold border-0 text-white px-4 py-1 rounded-full mb-2"
                              style={{
                                backgroundColor: getPositionLevelInfo(
                                  selectedCabinet.position_level
                                ).color,
                              }}
                            >
                              {t(
                                `cabinetlist.positionLevels.${selectedCabinet.position_level}`
                              )}
                            </Tag>
                            <p className="text-white text-sm">
                              {t("cabinetlist.order")}:{" "}
                              <strong>#{selectedCabinet.order}</strong>
                            </p>
                          </div>
                          <div className="text-3xl">
                            {
                              getPositionLevelInfo(
                                selectedCabinet.position_level
                              ).icon
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="lg:w-3/5 p-8 overflow-y-auto">
                      <div className="mb-8">
                        <h2 className="text-4xl font-black text-[#136094] mb-2">
                          {getTranslatedField(selectedCabinet.fullName)}
                        </h2>
                        <p className="text-2xl font-semibold text-[#008830] mb-6">
                          {getTranslatedField(selectedCabinet.position)}
                        </p>

                        {/* Language Tabs */}
                        <div className="mb-8">
                          <Tabs
                            activeKey={activeLanguage}
                            onChange={setActiveLanguage}
                            size="large"
                            className="custom-modal-tabs"
                          >
                            <TabPane
                              tab={`🇬🇧 ${t("cabinetlist.english")}`}
                              key="en"
                            />
                            <TabPane
                              tab={`🇪🇹 ${t("cabinetlist.amharic")}`}
                              key="am"
                            />
                            <TabPane
                              tab={`🇪🇹 ${t("cabinetlist.oromo")}`}
                              key="or"
                            />
                          </Tabs>
                        </div>

                        {/* Message Section */}
                        <div className="bg-gradient-to-br from-[#136094]/5 to-[#008830]/5 rounded-2xl p-6 border border-[#136094]/20">
                          <h4 className="text-xl font-bold text-[#136094] mb-4 flex items-center">
                            <FiMail className="mr-3 text-[#ffca40]" />
                            {t("cabinetlist.message")}
                          </h4>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                            {getTranslatedField(selectedCabinet.message)}
                          </p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-[#ffca40]/20 shadow-sm">
                          <div className="flex items-center text-[#136094]">
                            <FiStar className="mr-3 text-[#ffca40]" />
                            <span className="font-semibold">
                              Position Level
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2">
                            {t(
                              `cabinetlist.positionLevels.${selectedCabinet.position_level}`
                            )}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-[#ffca40]/20 shadow-sm">
                          <div className="flex items-center text-[#136094]">
                            <FiMapPin className="mr-3 text-[#ffca40]" />
                            <span className="font-semibold">
                              Hierarchy Order
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2">
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
