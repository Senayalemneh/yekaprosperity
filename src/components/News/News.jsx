import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../utils/getApiUrl";
import {
  Card,
  Button,
  Pagination,
  Tag,
  Dropdown,
  Empty,
  Input,
  Select,
  Space,
  Row,
  Col,
  Tooltip,
  Badge,
} from "antd";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "tailwindcss/tailwind.css";
import axios from "axios";
import Loader from "../common/Loader";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  ReloadOutlined,
  FireOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";

const { Option } = Select;
const { Meta } = Card;

// Color constants
const colors = {
  primary: "#136094", // Blue
  secondary: "#008830", // Green
  accent: "#ffca40", // Yellow
  white: "#ffffff",
  lightGray: "#f8f9fa",
  darkText: "#2d3748",
};

const NewsList = () => {
  const { t, i18n } = useTranslation();
  const apiUrl = getApiUrl();
  const [newsItems, setNewsItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(i18n.language);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const itemsPerPage = 8;

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    i18n.on("languageChanged", (lng) => setLanguage(lng));

    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}api/news`);
        setNewsItems(response.data.data);
        setFilteredItems(response.data.data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            response.data.data.map((item) => getLocalizedContent(item.category))
          ),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    return () => {
      i18n.off("languageChanged", (lng) => setLanguage(lng));
    };
  }, [apiUrl, i18n]);

  useEffect(() => {
    filterNews();
  }, [searchQuery, categoryFilter, statusFilter, newsItems, language]);

  const filterNews = debounce(() => {
    let filtered = [...newsItems];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          getLocalizedContent(item.title)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          getLocalizedContent(item.description)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (item) => getLocalizedContent(item.category) === categoryFilter
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, 300);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString(
      language === "am" ? "en-GB" : "en-US",
      options
    );
  };

  const getLocalizedContent = (content) => {
    return content?.[language] || content?.en || "";
  };

  const statusColor = (status) => {
    switch (status) {
      case "published":
        return colors.secondary;
      case "draft":
        return colors.accent;
      case "archived":
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  // Calculate time ago for news items
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return t("newsclient.justNow");
    if (diffInHours < 24) return `${diffInHours}h ${t("newsclient.ago")}`;
    if (diffInHours < 168)
      return `${Math.floor(diffInHours / 24)}d ${t("newsclient.ago")}`;
    return formatDate(dateString);
  };

  // Check if news is trending (published in last 24 hours)
  const isTrending = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    return diffInHours < 24;
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
        

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t("newsclient.title")}
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: colors.accent }}
          >
            {t("newsclient.subtitle")}
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 shadow-xl"
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <div className="relative">
                <Input
                  placeholder={t("newsclient.searchPlaceholder")}
                  value={searchQuery}
                  onChange={handleSearch}
                  prefix={<SearchOutlined style={{ color: colors.primary }} />}
                  className="rounded-xl h-12 border-none"
                  style={{ backgroundColor: colors.white + "90" }}
                  allowClear
                />
              </div>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="w-full rounded-xl h-12"
                style={{ backgroundColor: colors.white + "90" }}
                suffixIcon={
                  <FilterOutlined style={{ color: colors.primary }} />
                }
              >
                <Option value="all">{t("newsclient.allCategories")}</Option>
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Select
                value={statusFilter}
                onChange={handleStatusChange}
                className="w-full rounded-xl h-12"
                style={{ backgroundColor: colors.white + "90" }}
                suffixIcon={
                  <FilterOutlined style={{ color: colors.primary }} />
                }
              >
                <Option value="all">{t("newsclient.allStatuses")}</Option>
                <Option value="published">{t("newsclient.published")}</Option>
                <Option value="draft">{t("newsclient.draft")}</Option>
                <Option value="archived">{t("newsclient.archived")}</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Button
                icon={<ReloadOutlined />}
                onClick={resetFilters}
                className="w-full h-12 rounded-xl text-white border-none font-semibold"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.secondary;
                  e.target.style.color = colors.white;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.accent;
                  e.target.style.color = colors.primary;
                }}
              >
                {t("newsclient.resetFilters")}
              </Button>
            </Col>

            <Col
              xs={24}
              md={4}
              className="flex items-center justify-center md:justify-end"
            >
              <Badge
                count={filteredItems.length}
                showZero
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                <span className="text-white font-medium">
                  {t("newsclient.results")}
                </span>
              </Badge>
            </Col>
          </Row>
        </motion.div>

        {/* Results Info */}
        {(searchQuery ||
          categoryFilter !== "all" ||
          statusFilter !== "all") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center justify-between p-4 rounded-xl border"
            style={{
              backgroundColor: colors.primary + "80",
              borderColor: colors.accent + "50",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ color: colors.accent }}>
              {t("newsclient.showingFilteredResults")} ({filteredItems.length})
            </span>
          </motion.div>
        )}

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
                className="bg-white/10 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-white/20"
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-lg" style={{ color: colors.accent }}>
                      {t("newsclient.noArticlesFound")}
                    </span>
                  }
                >
                  <Button
                    type="primary"
                    onClick={resetFilters}
                    size="large"
                    className="rounded-xl h-11 px-6 font-semibold border-none"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primary,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.secondary;
                      e.target.style.color = colors.white;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = colors.accent;
                      e.target.style.color = colors.primary;
                    }}
                  >
                    {t("newsclient.resetFilters")}
                  </Button>
                </Empty>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="relative group"
                    >
                      <Card
                        bordered={false}
                        className="rounded-2xl overflow-hidden border shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                        style={{
                          backgroundColor: colors.white + "10",
                          backdropFilter: "blur(10px)",
                          borderColor: colors.white + "20",
                        }}
                        cover={
                          <div className="relative h-56 overflow-hidden">
                            {/* Trending Badge */}
                            {isTrending(item.published_date) && (
                              <div className="absolute top-3 left-3 z-10">
                                <Tag
                                  style={{
                                    backgroundColor: colors.accent,
                                    color: colors.primary,
                                    border: "none",
                                    fontWeight: "bold",
                                    borderRadius: "12px",
                                  }}
                                  icon={<FireOutlined />}
                                >
                                  {t("newsclient.trending")}
                                </Tag>
                              </div>
                            )}

                            <div
                              className="h-full w-full absolute opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                              style={{
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                              }}
                            ></div>
                            <img
                              alt={getLocalizedContent(item.title)}
                              src={`${apiUrl}uploads/${item.cover_image}`}
                              className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80";
                              }}
                            />
                            <div className="absolute top-3 right-3">
                              <Tag
                                style={{
                                  backgroundColor:
                                    statusColor(item.status) + "80",
                                  color: colors.white,
                                  border: "none",
                                  borderRadius: "12px",
                                  fontWeight: "bold",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                {t(`newsclient.${item.status}`)}
                              </Tag>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <Tag
                                style={{
                                  backgroundColor: colors.primary + "80",
                                  color: colors.white,
                                  border: "none",
                                  borderRadius: "12px",
                                  fontWeight: "bold",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                {getLocalizedContent(item.category)}
                              </Tag>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        }
                      >
                        <div className="flex flex-col flex-grow">
                          <h3
                            className="text-lg font-bold text-white mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-white"
                            style={{ color: colors.white }}
                          >
                            {getLocalizedContent(item.title)}
                          </h3>

                          <p
                            className="mb-4 line-clamp-3 leading-relaxed flex-grow"
                            style={{ color: colors.accent }}
                          >
                            {getLocalizedContent(item.description).length > 120
                              ? `${getLocalizedContent(
                                  item.description
                                ).substring(0, 120)}...`
                              : getLocalizedContent(item.description)}
                          </p>

                          <div
                            className="flex flex-wrap items-center text-sm mb-4 gap-2"
                            style={{ color: colors.white + "80" }}
                          >
                            <span className="flex items-center">
                              <ClockCircleOutlined className="mr-1" />
                              {getTimeAgo(item.published_date)}
                            </span>
                            <span className="flex items-center">
                              <UserOutlined className="mr-1" />
                              {item.posted_by}
                            </span>
                          </div>

                          <Link to={`/news/${item.id}`} className="mt-auto">
                            <Button
                              type="primary"
                              icon={<EyeOutlined />}
                              className="w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md border-none"
                              style={{
                                background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                                color: colors.primary,
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`;
                                e.target.style.color = colors.white;
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`;
                                e.target.style.color = colors.primary;
                              }}
                            >
                              {t("newsclient.readMore")}
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredItems.length > itemsPerPage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mt-12"
                  >
                    <Pagination
                      current={currentPage}
                      total={filteredItems.length}
                      pageSize={itemsPerPage}
                      onChange={onPageChange}
                      showSizeChanger={false}
                      className="news-pagination"
                      itemRender={(page, type, originalElement) => {
                        if (type === "prev") {
                          return (
                            <Button
                              className="rounded-xl px-4 py-2 h-auto shadow-md border-none font-semibold"
                              style={{
                                background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                                color: colors.primary,
                              }}
                            >
                              {t("newsclient.previous")}
                            </Button>
                          );
                        }
                        if (type === "next") {
                          return (
                            <Button
                              className="rounded-xl px-4 py-2 h-auto shadow-md border-none font-semibold"
                              style={{
                                background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                                color: colors.primary,
                              }}
                            >
                              {t("newsclient.next")}
                            </Button>
                          );
                        }
                        if (type === "page") {
                          return (
                            <Button
                              className={`rounded-xl px-4 py-2 h-auto mx-1 border-none font-semibold ${
                                currentPage === page
                                  ? "text-white"
                                  : "text-white"
                              }`}
                              style={{
                                backgroundColor:
                                  currentPage === page
                                    ? colors.primary
                                    : colors.white + "20",
                                color:
                                  currentPage === page
                                    ? colors.white
                                    : colors.accent,
                              }}
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
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .news-pagination .ant-pagination-item-active {
          border-color: transparent;
        }

        .ant-card-cover {
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          overflow: hidden;
        }

        .ant-card-body {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          padding: 20px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NewsList;
