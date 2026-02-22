import React, { useState, useEffect } from "react";
import { getApiUrl } from "../utils/getApiUrl";
import {
  Card,
  Button,
  Pagination,
  Tag,
  Dropdown,
  Empty,
  Input,
  Modal,
  Descriptions,
  Image,
  Spin,
  Rate,
  Progress,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "tailwindcss/tailwind.css";
import axios from "axios";
import Loader from "../components/common/Loader";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

// React Icons imports
import {
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaCalendarAlt,
  FaTrophy,
  FaStar,
  FaCrown,
  FaEye,
  FaRedo,
  FaFire,
  FaRocket,
  FaChartLine,
  FaAward,
  FaTimes,
  FaMedal,
  FaUserTie,
  FaUserCheck,
  FaRegStar,
  FaSeedling,
  FaLightbulb,
} from "react-icons/fa";
import {
  FiAward,
  FiTrendingUp,
  FiTarget,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";

const { Meta } = Card;

const TopPerformersList = () => {
  const { t, i18n } = useTranslation();
  const apiUrl = getApiUrl();
  const [performers, setPerformers] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(i18n.language);
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [performancePeriods, setPerformancePeriods] = useState([]);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPerformer, setSelectedPerformer] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const itemsPerPage = 8;

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    i18n.on("languageChanged", (lng) => setLanguage(lng));

    const fetchPerformers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}api/top-performers`, {
          params: {
            status: "active",
          },
        });
        setPerformers(response.data.data || []);
        setFilteredItems(response.data.data || []);

        // Extract unique performance periods
        const uniquePeriods = [
          ...new Set(response.data.data.map((item) => item.performance_period)),
        ];
        setPerformancePeriods(uniquePeriods);
      } catch (error) {
        console.error("Error fetching top performers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformers();

    return () => {
      i18n.off("languageChanged", (lng) => setLanguage(lng));
    };
  }, [apiUrl, i18n]);

  useEffect(() => {
    filterPerformers();
  }, [searchQuery, periodFilter, statusFilter, performers, language]);

  const filterPerformers = debounce(() => {
    let filtered = [...performers];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          getLocalizedContent(item.name)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          getLocalizedContent(item.position)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply performance period filter
    if (periodFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.performance_period === periodFilter
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, 300);

  const handleViewDetails = async (performerId) => {
    try {
      setModalLoading(true);
      setIsModalVisible(true);
      const performer = performers.find((p) => p.id === performerId);
      setSelectedPerformer(performer);
    } catch (error) {
      console.error("Error fetching performer details:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPerformer(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString(
      language === "am" ? "en-GB" : "en-US",
      options
    );
  };

  const formatDateRange = (startDate, endDate) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getLocalizedContent = (content) => {
    return (
      content?.[language] || content?.en || t("topperformerlist.notSpecified")
    );
  };

  const statusColor = (status) => {
    switch (status) {
      case "active":
        return "#008830";
      case "inactive":
        return "#ffca40";
      case "archived":
        return "#136094";
      default:
        return "#136094";
    }
  };

  const periodColor = (period) => {
    switch (period) {
      case "monthly":
        return "#136094";
      case "quarterly":
        return "#008830";
      case "yearly":
        return "#ffca40";
      default:
        return "#136094";
    }
  };

  const getPeriodIcon = (period) => {
    switch (period) {
      case "monthly":
        return <FiBarChart2 />;
      case "quarterly":
        return <FiTrendingUp />;
      case "yearly":
        return <FaCrown />;
      default:
        return <FaTrophy />;
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePeriodChange = (period) => {
    setPeriodFilter(period);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPeriodFilter("all");
    setStatusFilter("all");
  };

  const renderRankBadge = (index) => {
    if (index < 3) {
      const colors = ["#ffca40", "#008830", "#136094"];
      const icons = [<FaCrown />, <FaStar />, <FaMedal />];
      const bgColors = ["#ffca40", "#008830", "#136094"];

      return (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="absolute -top-4 -right-4 z-20"
        >
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full shadow-2xl text-white font-bold text-lg"
            style={{ backgroundColor: bgColors[index] }}
          >
            {icons[index]}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white text-[#136094] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
            #{index + 1}
          </div>
        </motion.div>
      );
    }
    return (
      <div className="absolute -top-3 -right-3 z-10">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#136094] text-white font-bold shadow-lg">
          #{index + 1}
        </div>
      </div>
    );
  };

  const PerformanceScore = ({ score }) => {
    let color = "#136094";
    let icon = <FiTrendingUp />;
    let bgColor = "from-[#136094] to-[#0f4a7a]";

    if (score >= 90) {
      color = "#ffca40";
      icon = <FaFire />;
      bgColor = "from-[#ffca40] to-[#e6b63a]";
    } else if (score >= 80) {
      color = "#008830";
      icon = <FaRocket />;
      bgColor = "from-[#008830] to-[#006625]";
    } else if (score >= 70) {
      color = "#136094";
      icon = <FiTrendingUp />;
      bgColor = "from-[#136094] to-[#0f4a7a]";
    }

    return (
      <div className={`flex flex-col items-center`}>
        <div
          className={`bg-gradient-to-r ${bgColor} rounded-2xl p-3 shadow-lg`}
        >
          {React.cloneElement(icon, { className: "text-white text-2xl" })}
        </div>
        <div className="mt-2 text-center">
          <div className="text-white font-bold text-lg">{score}%</div>
          <Progress
            percent={score}
            showInfo={false}
            strokeColor={color}
            trailColor="#ffffff20"
            size="small"
            className="mt-1"
          />
        </div>
      </div>
    );
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90)
      return { label: "Elite", color: "#ffca40", icon: <FaCrown /> };
    if (score >= 80)
      return { label: "Expert", color: "#008830", icon: <FaAward /> };
    if (score >= 70)
      return { label: "Pro", color: "#136094", icon: <FaUserTie /> };
    return { label: "Rising", color: "#136094", icon: <FaSeedling /> };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#136094] via-[#0f4a7a] to-[#082f55] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#008830]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#136094]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center p-6 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl mb-8"
          >
            <div className="bg-gradient-to-r from-[#ffca40] to-[#e6b63a] p-4 rounded-2xl mr-4">
              <FaAward className="text-3xl text-[#136094]" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-2 bg-gradient-to-r from-white to-[#ffca40] bg-clip-text text-transparent">
                {t("topperformerlist.title")}
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                {t("topperformerlist.subtitle")}
              </p>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              {
                icon: <FiUsers />,
                value: performers.length,
                label: "Total Performers",
                color: "#136094",
              },
              {
                icon: <FaTrophy />,
                value: performers.filter((p) => p.result >= 90).length,
                label: "Elite Performers",
                color: "#ffca40",
              },
              {
                icon: <FiTrendingUp />,
                value:
                  Math.round(
                    performers.reduce((acc, p) => acc + p.result, 0) /
                      performers.length
                  ) || 0,
                label: "Avg Score",
                color: "#008830",
              },
              {
                icon: <FaAward />,
                value: performancePeriods.length,
                label: "Periods",
                color: "#136094",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center"
              >
                <div className="text-2xl mb-2" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="text-white font-bold text-2xl">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-white/20 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="relative w-full lg:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-[#136094]" />
              </div>
              <Input
                size="large"
                placeholder={t("topperformerlist.searchPlaceholder")}
                value={searchQuery}
                onChange={handleSearch}
                className="rounded-2xl bg-white hover:bg-white focus:bg-white border-0 shadow-lg pl-12 h-12 text-lg"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Dropdown
                menu={{
                  items: [
                    { key: "all", label: t("topperformerlist.allPeriods") },
                    ...performancePeriods.map((period) => ({
                      key: period,
                      label: t(`topperformerlist.periods.${period}`),
                      icon: getPeriodIcon(period),
                    })),
                  ],
                  onClick: ({ key }) => handlePeriodChange(key),
                }}
                trigger={["click"]}
              >
                <Button
                  size="large"
                  className="flex items-center bg-white hover:bg-gray-50 border-0 rounded-2xl shadow-lg h-12 px-6 font-semibold text-[#136094]"
                >
                  <FaFilter className="mr-3" />
                  {periodFilter === "all"
                    ? t("topperformerlist.performancePeriod")
                    : t(`topperformerlist.periods.${periodFilter}`)}
                  <FaChevronDown className="ml-3" />
                </Button>
              </Dropdown>

              <Button
                size="large"
                icon={<FaRedo />}
                onClick={resetFilters}
                className="bg-[#ffca40] hover:bg-[#e6b63a] border-0 rounded-2xl shadow-lg h-12 px-6 font-semibold text-[#136094]"
              >
                {t("topperformerlist.reset")}
              </Button>
            </div>
          </div>

          {(searchQuery ||
            periodFilter !== "all" ||
            statusFilter !== "all") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 flex items-center justify-between bg-[#136094] p-4 rounded-2xl border border-[#ffca40]/30"
            >
              <span className="text-white font-semibold">
                {t("topperformerlist.showingFilteredResults", {
                  count: filteredItems.length,
                })}
              </span>
              <Button
                type="link"
                onClick={resetFilters}
                className="text-[#ffca40] flex items-center font-semibold hover:text-[#e6b63a]"
                icon={<FaRedo />}
              >
                {t("topperformerlist.resetFilters")}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader />
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-16 shadow-2xl border border-white/20 text-center"
              >
                <div className="text-[#ffca40] text-6xl mb-6">
                  <FaAward />
                </div>
                <h3 className="text-white text-2xl font-bold mb-4">
                  {t("topperformerlist.noPerformersFound")}
                </h3>
                <Button
                  type="primary"
                  size="large"
                  onClick={resetFilters}
                  className="rounded-2xl bg-[#ffca40] hover:bg-[#e6b63a] border-0 shadow-lg mt-4 h-12 px-8 font-semibold text-[#136094]"
                  icon={<FaRedo />}
                >
                  {t("topperformerlist.resetFilters")}
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  <AnimatePresence>
                    {currentItems.map((item, index) => {
                      const performanceLevel = getPerformanceLevel(item.result);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -30, scale: 0.9 }}
                          transition={{
                            duration: 0.5,
                            type: "spring",
                            delay: index * 0.1,
                          }}
                          className="relative group"
                          whileHover={{ y: -8, scale: 1.02 }}
                        >
                          {renderRankBadge(index)}
                          <Card
                            bordered={false}
                            cover={
                              <div className="relative h-64 overflow-hidden rounded-t-2xl">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#136094]/90 to-transparent z-10"></div>
                                <img
                                  alt={getLocalizedContent(item.name)}
                                  src={`${apiUrl}uploads/${item.image}`}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                                  }}
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                  <h3 className="text-white font-bold text-xl mb-1">
                                    {getLocalizedContent(item.name)}
                                  </h3>
                                  <p className="text-[#ffca40] text-sm font-semibold">
                                    {getLocalizedContent(item.position)}
                                  </p>
                                </div>
                                <div className="absolute top-4 left-4 z-20">
                                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                    <span
                                      style={{ color: performanceLevel.color }}
                                    >
                                      {performanceLevel.icon}
                                    </span>
                                    <span className="text-white text-xs font-semibold">
                                      {performanceLevel.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            }
                            className="rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden h-full flex flex-col border-0 bg-white/10 backdrop-blur-lg group-hover:bg-white/15 border border-white/10"
                            bodyStyle={{
                              padding: 0,
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <div className="p-6 flex-grow">
                              <div className="flex justify-between items-start mb-4">
                                <Tag
                                  color={periodColor(item.performance_period)}
                                  icon={getPeriodIcon(item.performance_period)}
                                  className="capitalize font-semibold border-0 shadow-md text-white px-3 py-1"
                                  style={{
                                    backgroundColor: periodColor(
                                      item.performance_period
                                    ),
                                  }}
                                >
                                  {t(
                                    `topperformerlist.periods.${item.performance_period}`
                                  )}
                                </Tag>
                                <PerformanceScore score={item.result} />
                              </div>

                              <div className="mb-4 flex items-center text-sm text-blue-100">
                                <FaCalendarAlt className="mr-2 text-[#ffca40]" />
                                <span>
                                  {formatDateRange(
                                    item.start_date,
                                    item.end_date
                                  )}
                                </span>
                              </div>

                              {item.achievements && (
                                <div className="mb-4">
                                  <p className="text-blue-100 text-sm line-clamp-3 leading-relaxed">
                                    {getLocalizedContent(item.achievements)}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="p-4 bg-white/5 border-t border-white/10">
                              <motion.button
                                onClick={() => handleViewDetails(item.id)}
                                className="w-full bg-gradient-to-r from-[#ffca40] to-[#e6b63a] hover:from-[#e6b63a] hover:to-[#ffca40] text-[#136094] font-bold rounded-xl border-0 shadow-lg transition-all duration-300 h-12 flex items-center justify-center group/btn"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <FaEye className="mr-3 group-hover/btn:scale-110 transition-transform" />
                                {t("topperformerlist.viewDetails")}
                              </motion.button>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {filteredItems.length > itemsPerPage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center mt-16"
                  >
                    <Pagination
                      current={currentPage}
                      total={filteredItems.length}
                      pageSize={itemsPerPage}
                      onChange={onPageChange}
                      showSizeChanger={false}
                      className="custom-pagination"
                      itemRender={(page, type, originalElement) => {
                        if (type === "prev" || type === "next") {
                          return (
                            <Button className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-2xl px-6 py-3 shadow-lg mx-2 font-semibold">
                              {type === "prev"
                                ? t("topperformerlist.previous")
                                : t("topperformerlist.next")}
                            </Button>
                          );
                        }
                        if (type === "page") {
                          return (
                            <Button
                              className={`${
                                currentPage === page
                                  ? "bg-[#ffca40] text-[#136094]"
                                  : "bg-white/10 hover:bg-white/20 text-white border-0"
                              } rounded-2xl w-12 h-12 mx-1 shadow-lg font-semibold`}
                            >
                              {page}
                            </Button>
                          );
                        }
                        return originalElement;
                      }}
                    />
                  </motion.div>
                )}
              </>
            )}
          </>
        )}

        {/* Enhanced Details Modal */}
        <Modal
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={900}
          closeIcon={
            <div className="bg-[#ffca40] text-[#136094] rounded-full p-2">
              <FaTimes className="text-lg" />
            </div>
          }
          className="top-performer-modal"
          styles={{ body: { padding: 0 } }}
        >
          {modalLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : selectedPerformer ? (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Image and Basic Info */}
                <div className="w-full lg:w-2/5">
                  <div className="relative">
                    <Image
                      src={`${apiUrl}uploads/${selectedPerformer.image}`}
                      alt={getLocalizedContent(selectedPerformer.name)}
                      className="rounded-2xl shadow-2xl w-full h-64 object-cover"
                      fallback="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#ffca40] to-[#e6b63a] text-[#136094] rounded-2xl p-4 shadow-2xl">
                      <div className="text-center">
                        <div className="text-2xl font-black">
                          {selectedPerformer.result}%
                        </div>
                        <div className="text-xs font-semibold">SCORE</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <h2 className="text-2xl font-black text-[#136094] mb-2">
                      {getLocalizedContent(selectedPerformer.name)}
                    </h2>
                    <p className="text-[#008830] font-semibold text-lg">
                      {getLocalizedContent(selectedPerformer.position)}
                    </p>

                    <div className="mt-4 flex justify-center gap-2">
                      <Tag color="#136094" className="font-semibold border-0">
                        {t(
                          `topperformerlist.periods.${selectedPerformer.performance_period}`
                        )}
                      </Tag>
                      <Tag color="#008830" className="font-semibold border-0">
                        {formatDate(selectedPerformer.start_date)}
                      </Tag>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="w-full lg:w-3/5">
                  <div className="bg-gradient-to-br from-[#136094]/10 to-[#008830]/5 rounded-2xl p-6 border border-[#136094]/20">
                    <h3 className="text-xl font-bold text-[#136094] mb-4 flex items-center">
                      <FaLightbulb className="mr-2 text-[#ffca40]" />
                      Performance Details
                    </h3>

                    <Descriptions
                      column={1}
                      size="middle"
                      className="performance-details"
                      labelStyle={{
                        fontWeight: "bold",
                        color: "#136094",
                        width: "140px",
                      }}
                      contentStyle={{ color: "#1f2937" }}
                    >
                      <Descriptions.Item label="Performance Level">
                        <div className="flex items-center gap-2">
                          <span
                            style={{
                              color: getPerformanceLevel(
                                selectedPerformer.result
                              ).color,
                            }}
                          >
                            {getPerformanceLevel(selectedPerformer.result).icon}
                          </span>
                          <span
                            className="font-semibold"
                            style={{
                              color: getPerformanceLevel(
                                selectedPerformer.result
                              ).color,
                            }}
                          >
                            {
                              getPerformanceLevel(selectedPerformer.result)
                                .label
                            }
                          </span>
                        </div>
                      </Descriptions.Item>

                      <Descriptions.Item label="Performance Period">
                        <div className="flex items-center gap-2">
                          {getPeriodIcon(selectedPerformer.performance_period)}
                          <span className="font-semibold">
                            {t(
                              `topperformerlist.periods.${selectedPerformer.performance_period}`
                            )}
                          </span>
                        </div>
                      </Descriptions.Item>

                      <Descriptions.Item label="Evaluation Period">
                        <div className="flex items-center gap-2 text-[#008830] font-semibold">
                          <FaCalendarAlt />
                          {formatDateRange(
                            selectedPerformer.start_date,
                            selectedPerformer.end_date
                          )}
                        </div>
                      </Descriptions.Item>

                      {selectedPerformer.achievements && (
                        <Descriptions.Item label="Key Achievements">
                          <div className="bg-white/50 rounded-lg p-3 border border-[#136094]/20">
                            <p className="text-gray-700 leading-relaxed">
                              {getLocalizedContent(
                                selectedPerformer.achievements
                              )}
                            </p>
                          </div>
                        </Descriptions.Item>
                      )}

                      <Descriptions.Item label="Performance Score">
                        <div className="flex items-center gap-4">
                          <Progress
                            percent={selectedPerformer.result}
                            strokeColor={
                              selectedPerformer.result >= 90
                                ? "#ffca40"
                                : selectedPerformer.result >= 80
                                ? "#008830"
                                : "#136094"
                            }
                            trailColor="#e5e7eb"
                            size="default"
                            showInfo={false}
                          />
                          <span
                            className="font-bold text-lg"
                            style={{
                              color:
                                selectedPerformer.result >= 90
                                  ? "#ffca40"
                                  : selectedPerformer.result >= 80
                                  ? "#008830"
                                  : "#136094",
                            }}
                          >
                            {selectedPerformer.result}%
                          </span>
                        </div>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Empty description="Performer details not found" />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default TopPerformersList;
