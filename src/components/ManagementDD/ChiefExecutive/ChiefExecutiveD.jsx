import React, { useEffect, useState } from "react";
import AOS from "aos";
import { getApiUrl } from "../../../utils/getApiUrl";
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
  Spin,
  Image,
  Carousel,
  Tabs,
  Collapse,
  Progress,
} from "antd";
import {
  ReadOutlined,
  CloseOutlined,
  MessageOutlined,
  UserOutlined,
  ArrowRightOutlined,
  StarFilled,
  LinkedinFilled,
  TwitterOutlined,
  MailOutlined,
  GlobalOutlined,
  InstagramOutlined,
  FacebookFilled,
  BookOutlined,
  TrophyOutlined,
  RocketOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import Loader from "../../common/Loader";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Styled components with new color palette
const GlassCard = styled(Card)`
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(19, 96, 148, 0.15);
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 202, 64, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 30px 80px rgba(19, 96, 148, 0.25);
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(255, 202, 64, 0.4);
  }

  .ant-card-body {
    padding: 0;
  }
`;

const HeroImageContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  min-height: 600px;
  background: linear-gradient(135deg, #136094 0%, #0f4a7a 50%, #082f55 100%);

  @media (max-width: 992px) {
    min-height: 450px;
  }
`;

const CEOImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.85;
  filter: contrast(115%) saturate(110%);
`;

const FloatingSocialLinks = styled(motion.div)`
  position: absolute;
  bottom: 32px;
  right: 32px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 16px;

  a {
    color: white;
    background: rgba(255, 202, 64, 0.2);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 202, 64, 0.3);
    font-size: 18px;

    &:hover {
      background: rgba(255, 202, 64, 0.4);
      transform: translateY(-5px) scale(1.15);
      box-shadow: 0 8px 20px rgba(255, 202, 64, 0.3);
    }
  }
`;

const Signature = styled(motion.div)`
  font-family: "Dancing Script", cursive;
  font-size: 36px;
  color: #136094;
  margin-top: 24px;
  text-align: right;
  background: linear-gradient(135deg, #136094 0%, #008830 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const LanguageSwitcher = styled(motion.div)`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 20;
  display: flex;
  gap: 8px;
  background: rgba(19, 96, 148, 0.3);
  padding: 8px;
  border-radius: 24px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 202, 64, 0.2);

  button {
    background: transparent;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 18px;
    font-size: 14px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;

    &:hover {
      background: rgba(255, 202, 64, 0.3);
    }

    &.active {
      background: #ffca40;
      color: #136094;
      box-shadow: 0 4px 12px rgba(255, 202, 64, 0.4);
    }
  }
`;

const GalleryCarousel = styled(Carousel)`
  margin-top: 32px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(19, 96, 148, 0.15);
  border: 2px solid rgba(255, 202, 64, 0.1);

  .slick-dots li button {
    background: #ffca40;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .slick-dots li.slick-active button {
    width: 24px;
    border-radius: 12px;
    background: linear-gradient(90deg, #ffca40 0%, #008830 100%);
  }
`;

const ProfileBadge = styled(motion.div)`
  position: absolute;
  bottom: 32px;
  left: 32px;
  z-index: 20;
  background: rgba(19, 96, 148, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 20px 28px;
  max-width: 80%;
  border: 1px solid rgba(255, 202, 64, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 16px 20px;
  }
`;

const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #ffca40 0%, #e6b63a 100%);
  border: none;
  color: #136094;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(255, 202, 64, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  height: 48px;
  font-size: 16px;
  border-radius: 12px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(255, 202, 64, 0.5);
    color: #136094 !important;
    background: linear-gradient(135deg, #e6b63a 0%, #ffca40 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 60px;

  .ant-tag {
    font-size: 16px;
    padding: 10px 24px;
    border-radius: 24px;
    margin-bottom: 20px;
    font-weight: 700;
    border: none;
    background: linear-gradient(135deg, #ffca40 0%, #008830 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(255, 202, 64, 0.3);
  }

  h2 {
    font-size: 3.2rem;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #136094 0%, #008830 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 900;
    text-shadow: 0 4px 8px rgba(19, 96, 148, 0.1);

    @media (max-width: 768px) {
      font-size: 2.4rem;
    }
  }

  p {
    font-size: 1.3rem;
    color: #666;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 40px 0;
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(255, 202, 64, 0.1) 0%,
    rgba(0, 136, 48, 0.1) 100%
  );
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 1px solid rgba(255, 202, 64, 0.2);
  backdrop-filter: blur(10px);

  .stat-number {
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #136094 0%, #008830 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }

  .stat-label {
    color: #136094;
    font-weight: 600;
    font-size: 14px;
  }
`;

const CEOPage = () => {
  const { t, i18n } = useTranslation();
  const apiUrl = getApiUrl();
  const [ceoData, setCEOData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("message");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchCEOData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}api/add-ceo`);
        if (response.data.success && response.data.data.length > 0) {
          setCEOData(response.data.data[0]);
        } else {
          throw new Error("No CEO data available");
        }
      } catch (error) {
        console.error("Error fetching CEO data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCEOData();
  }, [apiUrl]);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  const getLocalizedText = (field) => {
    if (!ceoData) return "";

    if (ceoData[field] && typeof ceoData[field] === "object") {
      return (
        ceoData[field][currentLanguage] ||
        ceoData[field].en ||
        t("ceopage.informationNotAvailable")
      );
    }

    return ceoData[field] || t("ceopage.informationNotAvailable");
  };

  const getImageUrls = () => {
    if (!ceoData || !ceoData.images) return [];

    return ceoData.images
      .map((img) => {
        if (typeof img === "string") {
          return `${apiUrl}${img}`;
        } else if (img.response && img.response.path) {
          return `${apiUrl}${img.response.path}`;
        }
        return "";
      })
      .filter((url) => url !== "");
  };

  // Mock stats for demonstration
  const ceoStats = [
    { number: "15+", label: "Years Experience" },
    { number: "50+", label: "Projects Led" },
    { number: "100+", label: "Team Members" },
    { number: "25+", label: "Awards Won" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-[#136094]/5 to-[#008830]/5">
        <Loader size="large" />
      </div>
    );
  }

  if (!ceoData) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-[#136094]/5 to-[#008830]/5">
        <Text type="danger" className="text-lg">
          {t("ceopage.failedToLoad")}
        </Text>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.17, 0.67, 0.83, 0.67],
      },
    },
  };

  const socialIcons = {
    linkedin: <LinkedinFilled />,
    twitter: <TwitterOutlined />,
    facebook: <FacebookFilled />,
    instagram: <InstagramOutlined />,
    website: <GlobalOutlined />,
    email: <MailOutlined />,
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#136094",
          borderRadius: 12,
          fontFamily: "'Poppins', sans-serif",
        },
        components: {
          Button: {
            paddingContentHorizontal: 24,
          },
          Modal: {
            borderRadiusLG: 20,
          },
          Tabs: {
            itemActiveColor: "#136094",
            itemSelectedColor: "#136094",
            inkBarColor: "#136094",
          },
          Collapse: {
            headerBg: "rgba(255, 202, 64, 0.05)",
          },
        },
      }}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#008830]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#136094]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-[#136094]/5 to-[#008830]/5 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Section Header */}
          <SectionHeader variants={itemVariants}>
            <Tag>{t("ceopage.executiveLeadership")}</Tag>
            <Title level={2}>{t("ceopage.title")}</Title>
            <Text>{t("ceopage.subtitle")}</Text>
          </SectionHeader>

        

          {/* Main Card */}
          <GlassCard>
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <HeroImageContainer variants={itemVariants} className="lg:w-2/5">
                <CEOImage
                  src={`${apiUrl}uploads/${ceoData.image}`}
                  alt={getLocalizedText("fullName")}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.03 }}
                  transition={{ duration: 10, ease: "easeInOut" }}
                />

                {/* Language Switcher */}
                <LanguageSwitcher
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    className={currentLanguage === "en" ? "active" : ""}
                    onClick={() => changeLanguage("en")}
                  >
                    🇬🇧 {t("ceopage.english")}
                  </button>
                  <button
                    className={currentLanguage === "am" ? "active" : ""}
                    onClick={() => changeLanguage("am")}
                  >
                    🇪🇹 {t("ceopage.amharic")}
                  </button>
                  <button
                    className={currentLanguage === "or" ? "active" : ""}
                    onClick={() => changeLanguage("or")}
                  >
                    🇪🇹 {t("ceopage.oromo")}
                  </button>
                </LanguageSwitcher>

                {/* Profile Badge */}
                <ProfileBadge
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Space direction="vertical" size={12}>
                    <Title
                      level={3}
                      className="text-white mb-0 text-2xl md:text-3xl font-extrabold"
                    >
                      {getLocalizedText("fullName")}
                    </Title>
                    <Text className="text-[#ffca40] text-lg md:text-xl font-semibold">
                      {getLocalizedText("position")}
                    </Text>
                    <Space size={4}>
                      {[...Array(5)].map((_, i) => (
                        <StarFilled
                          key={i}
                          className="text-[#ffca40] text-md"
                        />
                      ))}
                    </Space>
                  </Space>
                </ProfileBadge>

                {/* Social Links */}
                {ceoData.socialMediaLinks &&
                  ceoData.socialMediaLinks.length > 0 && (
                    <FloatingSocialLinks
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      {ceoData.socialMediaLinks.map((link, index) => (
                        <Tooltip
                          key={index}
                          title={t(`ceopage.socialMedia.${link.platform}`)}
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {socialIcons[link.platform] || <GlobalOutlined />}
                          </a>
                        </Tooltip>
                      ))}
                    </FloatingSocialLinks>
                  )}
              </HeroImageContainer>

              {/* Content Section */}
              <motion.div
                variants={itemVariants}
                className="lg:w-3/5 p-8 sm:p-10 md:p-12 bg-white"
              >
                <div className="flex items-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-gradient-to-r from-[#ffca40] to-[#e6b63a] rounded-full flex items-center justify-center mr-6 shadow-lg"
                  >
                    <MessageOutlined className="text-[#136094] text-3xl" />
                  </motion.div>
                  <Title
                    level={2}
                    className="mb-0 text-[#136094] text-2xl sm:text-3xl md:text-4xl font-bold"
                  >
                    {getLocalizedText("title")}
                  </Title>
                </div>

                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  className="ceo-tabs"
                  tabBarStyle={{
                    borderBottom: "2px solid rgba(255, 202, 64, 0.2)",
                  }}
                >
                  <TabPane
                    tab={
                      <span className="flex items-center font-semibold">
                        <MessageOutlined className="mr-2 text-[#136094]" />
                        {t("ceopage.tabs.message")}
                      </span>
                    }
                    key="message"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Text className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8">
                        {getLocalizedText("message").length >
                        (isMobile ? 200 : 500)
                          ? `${getLocalizedText("message").substring(
                              0,
                              isMobile ? 200 : 500
                            )}...`
                          : getLocalizedText("message")}
                      </Text>
                    </motion.div>

                    {getLocalizedText("message").length >
                      (isMobile ? 200 : 500) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <GradientButton
                          type="primary"
                          size={isMobile ? "middle" : "large"}
                          icon={<ReadOutlined />}
                          onClick={showModal}
                          shape="round"
                        >
                          {t("ceopage.readFullMessage")}
                          <ArrowRightOutlined className="ml-2" />
                        </GradientButton>
                      </motion.div>
                    )}
                  </TabPane>

                  <TabPane
                    tab={
                      <span className="flex items-center font-semibold">
                        <RocketOutlined className="mr-2 text-[#136094]" />
                        {t("ceopage.tabs.experience")}
                      </span>
                    }
                    key="experience"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Text className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8">
                        {getLocalizedText("workExperience")}
                      </Text>
                    </motion.div>
                  </TabPane>

                  <TabPane
                    tab={
                      <span className="flex items-center font-semibold">
                        <TrophyOutlined className="mr-2 text-[#136094]" />
                        {t("ceopage.tabs.education")}
                      </span>
                    }
                    key="education"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Text className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8">
                        {getLocalizedText("educationalQualification")}
                      </Text>
                    </motion.div>
                  </TabPane>
                </Tabs>

                {/* Gallery Section */}
                {getImageUrls().length > 0 && (
                  <GalleryCarousel autoplay effect="fade">
                    {getImageUrls().map((imgUrl, index) => (
                      <div key={index}>
                        <Image
                          src={imgUrl}
                          alt={`${t("ceopage.galleryImage")} ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                          }}
                          preview={false}
                        />
                      </div>
                    ))}
                  </GalleryCarousel>
                )}

                <motion.div
                  className="mt-12 pt-8 border-t border-[#ffca40]/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center">
                    <Avatar
                      size={isMobile ? 64 : 80}
                      src={`${apiUrl}uploads/${ceoData.image}`}
                      className="bg-[#ffca40] mr-6 shadow-lg border-4 border-white"
                    />
                    <div>
                      <Text
                        strong
                        className="text-xl sm:text-2xl block font-semibold text-[#136094]"
                      >
                        {getLocalizedText("fullName")}
                      </Text>
                      <Text className="text-[#008830] text-md sm:text-lg font-medium">
                        {getLocalizedText("position")}
                      </Text>
                    </div>
                  </div>
                  <Signature
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {t("ceopage.withWarmRegards")}
                  </Signature>
                </motion.div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Modal for Full Message */}
      <AnimatePresence>
        {isModalVisible && (
          <Modal
            title={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#ffca40] to-[#e6b63a] rounded-full flex items-center justify-center mr-4 shadow-md">
                  <BulbOutlined className="text-[#136094] text-2xl" />
                </div>
                <span className="text-2xl font-bold text-[#136094]">
                  {getLocalizedText("title")}
                </span>
              </motion.div>
            }
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={isMobile ? "90%" : 800}
            closeIcon={
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-[#ffca40] text-[#136094] rounded-full p-1"
              >
                <CloseOutlined className="text-lg" />
              </motion.div>
            }
            bodyStyle={{ padding: isMobile ? "20px" : "32px" }}
            className="rounded-2xl"
            centered
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Collapse
                bordered={false}
                defaultActiveKey={["1"]}
                expandIconPosition="right"
                className="ceo-message-collapse"
              >
                <Panel
                  header={
                    <span className="font-semibold text-lg text-[#136094]">
                      {t("ceopage.ceoMessage")}
                    </span>
                  }
                  key="1"
                >
                  <Text className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                    {getLocalizedText("message")}
                  </Text>
                </Panel>
                <Panel
                  header={
                    <span className="font-semibold text-lg text-[#136094]">
                      {t("ceopage.workExperience")}
                    </span>
                  }
                  key="2"
                >
                  <Text className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                    {getLocalizedText("workExperience")}
                  </Text>
                </Panel>
                <Panel
                  header={
                    <span className="font-semibold text-lg text-[#136094]">
                      {t("ceopage.education")}
                    </span>
                  }
                  key="3"
                >
                  <Text className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                    {getLocalizedText("educationalQualification")}
                  </Text>
                </Panel>
              </Collapse>
            </motion.div>

            {getImageUrls().length > 0 && (
              <GalleryCarousel autoplay effect="fade" style={{ marginTop: 24 }}>
                {getImageUrls().map((imgUrl, index) => (
                  <div key={index}>
                    <Image
                      src={imgUrl}
                      alt={`${t("ceopage.galleryImage")} ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                      }}
                      preview={false}
                    />
                  </div>
                ))}
              </GalleryCarousel>
            )}

            <Divider className="my-8 border-[#ffca40]/20" />

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4 sm:mb-0">
                <Avatar
                  size={isMobile ? 80 : 100}
                  src={`${apiUrl}uploads/${ceoData.image}`}
                  className="mr-6 shadow-lg border-4 border-white bg-[#ffca40]"
                />
                <div>
                  <Title
                    level={4}
                    className="mb-1 text-2xl sm:text-3xl text-[#136094]"
                  >
                    {getLocalizedText("fullName")}
                  </Title>
                  <Text className="text-[#008830] text-lg sm:text-xl font-medium">
                    {getLocalizedText("position")}
                  </Text>
                </div>
              </div>

              <Signature
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t("ceopage.withWarmRegards")}
              </Signature>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </ConfigProvider>
  );
};

export default CEOPage;
