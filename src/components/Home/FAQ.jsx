import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import {
  Button,
  Modal,
  Typography,
  Divider,
  Avatar,
  Card,
  ConfigProvider,
  Tag,
  Space,
  Tooltip,
  FloatButton,
  Collapse,
  Input,
  Select,
} from "antd";
import {
  ReadOutlined,
  CloseOutlined,
  MessageOutlined,
  ArrowRightOutlined,
  StarFilled,
  SearchOutlined,
  FilterOutlined,
  UpOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import Loader from "../common/Loader";
import { useTranslation } from "react-i18next";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { getApiUrl } from "../../utils/getApiUrl";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { Search } = Input;

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
const GlassCard = styled(Card)`
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.18);

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
    transform: translateY(-8px);
  }
`;

const FaqCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);

    &::before {
      transform: scaleY(1);
    }
  }

  &.active {
    background: linear-gradient(
      135deg,
      ${colors.primary}08,
      ${colors.secondary}08
    );

    &::before {
      transform: scaleY(1);
    }
  }
`;

const CategoryTag = styled(Tag)`
  border: none;
  border-radius: 50px;
  padding: 6px 16px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SearchContainer = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const FloatingQuestion = styled(motion.div)`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: white;
  font-size: 32px;
  box-shadow: 0 8px 25px rgba(19, 96, 148, 0.3);
  z-index: 10;
`;

const FaqClient = () => {
  const ApiUrl = getApiUrl();
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedKey, setExpandedKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${ApiUrl}api/faq`);
        if (response.data.success) {
          const faqData = response.data.data;
          setFaqs(faqData);
          setFilteredFaqs(faqData);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(
              faqData.map((faq) => {
                const category = faq.category;
                if (typeof category === "object") {
                  return category[currentLanguage] || category.en || "general";
                }
                return category || "general";
              }),
            ),
          ];
          setCategories(["all", ...uniqueCategories]);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, [currentLanguage]);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    filterFaqs();
  }, [searchQuery, selectedCategory, faqs, currentLanguage]);

  const filterFaqs = () => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => {
        const category = getLocalizedData(faq.category);
        return category.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((faq) => {
        const question = getLocalizedData(faq.question).toLowerCase();
        const answer = getLocalizedData(faq.answer).toLowerCase();
        return (
          question.includes(searchQuery.toLowerCase()) ||
          answer.includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredFaqs(filtered);
  };

  const getLocalizedData = (field) => {
    if (!field) return "";

    if (typeof field === "object") {
      return (
        field[currentLanguage] || field.en || t("information_not_available")
      );
    }

    return field || t("information_not_available");
  };

  const getCategoryColor = (category) => {
    const categoryStr =
      typeof category === "string" ? category : getLocalizedData(category);
    const colorMap = {
      general: "blue",
      technical: "green",
      billing: "orange",
      account: "purple",
      shipping: "cyan",
      support: "red",
      product: "geekblue",
      test: "magenta",
      news: "gold",
    };
    return colorMap[categoryStr.toLowerCase()] || "blue";
  };

  const toggleFaq = (id) => {
    setExpandedKey(expandedKey === id ? null : id);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.primary,
          borderRadius: 16,
          fontFamily: "'Inter', sans-serif",
        },
        components: {
          Button: {
            paddingContentHorizontal: 28,
          },
          Collapse: {
            borderRadiusLG: 16,
          },
        },
      }}
    >
      {/* Main Section */}
      <section
        className="w-full py-16 md:py-28 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)`,
        }}
        ref={containerRef}
      >
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ y }}
        >
          <div
            className="absolute top-20 left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: colors.primary }}
          ></div>
          <div
            className="absolute bottom-10 right-20 w-60 h-60 rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: colors.secondary }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: colors.accent }}
          ></div>
        </motion.div>

        {/* Floating Questions */}
        <FloatingQuestion
          variants={floatingVariants}
          animate="animate"
          style={{ top: "10%", left: "5%" }}
        >
          <QuestionCircleOutlined />
        </FloatingQuestion>
        <FloatingQuestion
          variants={floatingVariants}
          animate="animate"
          style={{
            top: "20%",
            right: "8%",
            width: "60px",
            height: "60px",
            fontSize: "24px",
          }}
        >
          ?
        </FloatingQuestion>
        <FloatingQuestion
          variants={floatingVariants}
          animate="animate"
          style={{
            bottom: "15%",
            left: "8%",
            width: "50px",
            height: "50px",
            fontSize: "20px",
          }}
        >
          !
        </FloatingQuestion>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          variants={containerVariants}
          className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 md:mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <Tag
                style={{
                  fontSize: "14px",
                  padding: "8px 16px",
                  borderRadius: "50px",
                  marginBottom: "16px",
                  fontWeight: 600,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                  color: colors.white,
                  border: "none",
                }}
              >
                {t("faqsfe.support")}
              </Tag>
            </motion.div>
            <Title
              level={1}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ color: colors.primary }}
            >
              {t("faqsfe.title")}
            </Title>
            <Text
              className="text-xl max-w-3xl mx-auto"
              style={{ color: colors.primary + "CC" }}
            >
              {t("faqsfe.subtitle")}
            </Text>
          </motion.div>

          {/* Search and Filter Section */}
          <SearchContainer variants={itemVariants}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full lg:max-w-md">
                <Search
                  placeholder={t("faqsfe.searchPlaceholder")}
                  allowClear
                  size="large"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefix={
                    <SearchOutlined style={{ color: colors.primary + "99" }} />
                  }
                  style={{
                    borderRadius: "50px",
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <FilterOutlined style={{ color: colors.primary }} />
                <Text strong style={{ color: colors.primary }}>
                  {t("faqsfe.filterBy")}
                </Text>
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  size="large"
                  style={{ width: 200, borderRadius: "50px" }}
                  dropdownStyle={{ borderRadius: "16px" }}
                >
                  <Option value="all">
                    <Tag color="default">{t("faqsfe.allCategories")}</Tag>
                  </Option>
                  {categories
                    .filter((cat) => cat !== "all")
                    .map((category) => (
                      <Option key={category} value={category}>
                        <CategoryTag color={getCategoryColor(category)}>
                          {category}
                        </CategoryTag>
                      </Option>
                    ))}
                </Select>
              </div>
            </div>

            {/* Results count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4"
            >
              <Text style={{ color: colors.primary + "99" }}>
                {t("faqsfe.showing")} <strong>{filteredFaqs.length}</strong>{" "}
                {t("faqsfe.of")} <strong>{faqs.length}</strong> {t("FAQs")}
                {selectedCategory !== "all" && (
                  <>
                    {" "}
                    {t("faqsfe.in")} <strong>{selectedCategory}</strong>
                  </>
                )}
                {searchQuery && (
                  <>
                    {" "}
                    {t("faqsfe.for")} "<strong>{searchQuery}</strong>"
                  </>
                )}
              </Text>
            </motion.div>
          </SearchContainer>

          {/* FAQs Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <FaqCard
                  key={faq.id}
                  variants={itemVariants}
                  className={expandedKey === faq.id ? "active" : ""}
                  onClick={() => toggleFaq(faq.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <CategoryTag color={getCategoryColor(faq.category)}>
                      {getLocalizedData(faq.category)}
                    </CategoryTag>
                    <motion.div
                      animate={{ rotate: expandedKey === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandedKey === faq.id ? (
                        <MinusOutlined style={{ color: colors.primary }} />
                      ) : (
                        <PlusOutlined style={{ color: colors.primary }} />
                      )}
                    </motion.div>
                  </div>

                  <Title
                    level={4}
                    className="mb-3 text-lg font-semibold leading-relaxed"
                    style={{ color: colors.primary }}
                  >
                    {getLocalizedData(faq.question)}
                  </Title>

                  <AnimatePresence>
                    {expandedKey === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Divider
                          style={{
                            margin: "16px 0",
                            borderColor: colors.primary + "20",
                          }}
                        />
                        <Text
                          className="text-gray-600 leading-relaxed whitespace-pre-line"
                          style={{ fontSize: "15px", lineHeight: "1.7" }}
                        >
                          {getLocalizedData(faq.answer)}
                        </Text>

                        {/* Language indicators */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Space size="small">
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {t("faqsfe.availableIn")}
                            </Text>
                            {["en", "am", "or"].map((lang) => (
                              <Tooltip
                                key={lang}
                                title={
                                  lang === "en"
                                    ? "English"
                                    : lang === "am"
                                      ? "Amharic"
                                      : "Oromo"
                                }
                              >
                                <Avatar
                                  size="small"
                                  style={{
                                    backgroundColor: getLocalizedData(
                                      faq.question,
                                    )[lang]
                                      ? colors.primary
                                      : "#f0f0f0",
                                    color: getLocalizedData(faq.question)[lang]
                                      ? "white"
                                      : "#999",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {lang.toUpperCase()}
                                </Avatar>
                              </Tooltip>
                            ))}
                          </Space>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FaqCard>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-2 text-center py-16"
              >
                <QuestionCircleOutlined
                  style={{
                    fontSize: "64px",
                    color: colors.primary + "40",
                    marginBottom: "16px",
                  }}
                />
                <Title level={3} style={{ color: colors.primary + "80" }}>
                  {t("faqsfe.noFaqsFound")}
                </Title>
                <Text style={{ color: colors.primary + "60" }}>
                  {t("faqsfe.tryAdjusting")}
                </Text>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <FloatButton.BackTop
          visibilityHeight={300}
          icon={<UpOutlined className="text-white" />}
          style={{
            backgroundColor: colors.primary,
            width: 48,
            height: 48,
          }}
        />
      </section>
    </ConfigProvider>
  );
};

export default FaqClient;
