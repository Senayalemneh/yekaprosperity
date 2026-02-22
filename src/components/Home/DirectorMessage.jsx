import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import { getApiUrl } from "../../utils/getApiUrl";
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
} from "antd";
import {
  ReadOutlined,
  CloseOutlined,
  MessageOutlined,
  ArrowRightOutlined,
  StarFilled,
  LinkedinFilled,
  TwitterOutlined,
  MailOutlined,
  UpOutlined,
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

const { Title, Text } = Typography;

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

  .ant-card-body {
    padding: 0;
  }
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  min-height: 600px;
  background: linear-gradient(
    135deg,
    ${colors.primary} 0%,
    ${colors.primary}dd 100%
  );
  display: flex;
  align-items: flex-end;

  @media (max-width: 992px) {
    min-height: 450px;
  }
`;

const DirectorImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  top: 0;
  left: 0;
`;

const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  z-index: 2;
`;

const SocialLinks = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 20;
  display: flex;
  gap: 16px;

  a {
    color: white;
    background: rgba(255, 255, 255, 0.2);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-5px) scale(1.1);
    }
  }
`;

const Signature = styled(motion.div)`
  font-family: "Dancing Script", cursive;
  font-size: 32px;
  color: ${colors.primary};
  margin-top: 20px;
  text-align: right;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FloatingBadge = styled(motion.div)`
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FloatingQuote = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  width: 80%;
  opacity: 0.8;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const ContentSection = styled(motion.div)`
  padding: 40px;
  background: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(
      90deg,
      ${colors.primary},
      ${colors.secondary},
      ${colors.accent}
    );
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const DirectorMessage = () => {
  const { t, i18n } = useTranslation();
  const apiUrl = getApiUrl();
  const [directorData, setDirectorData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
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
    const fetchDirectorData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}api/directormessage`);
        if (response.data.success && response.data.data.length > 0) {
          setDirectorData(response.data.data[0]);
        } else {
          throw new Error("No director data available");
        }
      } catch (error) {
        console.error("Error fetching director data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectorData();
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
    if (!directorData) return "";

    if (directorData[field] && typeof directorData[field] === "object") {
      return (
        directorData[field][currentLanguage] ||
        directorData[field].en ||
        t("information_not_available")
      );
    }

    return directorData[field] || t("information_not_available");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader size="large" />
      </div>
    );
  }

  if (!directorData) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Text type="danger">{t("Failed to load director message")}</Text>
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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.17, 0.67, 0.83, 0.67],
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

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
          Modal: {
            borderRadiusLG: 20,
            paddingContentHorizontal: 0,
          },
        },
      }}
    >
      {/* Main Section */}
      <section
        className="w-full py-16 md:py-28 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
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
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          variants={containerVariants}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
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
                {t("Leadership")}
              </Tag>
            </motion.div>
            <Title
              level={2}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ color: colors.primary }}
            >
              {t("Message from Our Director")}
            </Title>
            <Text
              className="text-xl max-w-3xl mx-auto"
              style={{ color: colors.primary + "CC" }}
            >
              {t("Hear from our visionary leader about our mission and values")}
            </Text>
          </motion.div>

          {/* Main Card */}
          <GlassCard
            hoverable
            className="border-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <ImageContainer className="lg:w-3/5 relative">
                <motion.div
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="absolute inset-0 object-fill "
                >
                  <DirectorImage
                    src={`${apiUrl}uploads/${directorData.image}`}
                    alt={getLocalizedText("name")}
                  />
                </motion.div>

                <GradientOverlay />

                <FloatingBadge
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <StarFilled
                    style={{ color: colors.accent, marginRight: "8px" }}
                  />
                  {t("Executive Team")}
                </FloatingBadge>

                {/* <FloatingQuote
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 0.8 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  "
                  {getLocalizedText("quote") ||
                    t("Leading with vision and purpose")}
                  "
                </FloatingQuote> */}

                {/* Name and Position */}
                <div className="relative z-10 p-8 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Space direction="vertical" size={6}>
                      <Title
                        level={3}
                        className="text-white mb-0 text-4xl md:text-5xl font-extrabold leading-tight"
                      >
                        <span style={{ color: colors.accent }}>
                          {getLocalizedText("name")}
                        </span>
                      </Title>
                      <Text className="text-white/90 text-xl md:text-2xl font-medium">
                        {getLocalizedText("position")}
                      </Text>
                      <Space size={6}>
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <StarFilled
                              style={{ color: colors.accent, fontSize: "18px" }}
                            />
                          </motion.div>
                        ))}
                      </Space>
                    </Space>
                  </motion.div>
                </div>

                {/* Social Links */}
                <SocialLinks
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {directorData.linkedin && (
                    <Tooltip title={t("LinkedIn")} placement="left">
                      <motion.a
                        href={directorData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <LinkedinFilled className="text-lg" />
                      </motion.a>
                    </Tooltip>
                  )}
                  {directorData.twitter && (
                    <Tooltip title={t("Twitter")} placement="left">
                      <motion.a
                        href={directorData.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <TwitterOutlined className="text-lg" />
                      </motion.a>
                    </Tooltip>
                  )}
                  {directorData.email && (
                    <Tooltip title={t("Email")} placement="left">
                      <motion.a
                        href={`mailto:${directorData.email}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MailOutlined className="text-lg" />
                      </motion.a>
                    </Tooltip>
                  )}
                </SocialLinks>

                <ScrollIndicator
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <UpOutlined className="text-2xl" />
                  </motion.div>
                  <span>Scroll</span>
                </ScrollIndicator>
              </ImageContainer>

              {/* Content Section */}
              <ContentSection variants={itemVariants} className="lg:w-3/5">
                <div className="flex items-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mr-6 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    <MessageOutlined className="text-white text-3xl" />
                  </motion.div>
                  <Title
                    level={2}
                    className="mb-0 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                    style={{ color: colors.primary }}
                  >
                    {getLocalizedText("title")}
                  </Title>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Text
                    className="text-lg sm:text-xl leading-relaxed mb-10"
                    style={{ color: colors.darkText }}
                  >
                    {getLocalizedText("message").length > (isMobile ? 200 : 500)
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-12"
                  >
                    <Button
                      type="primary"
                      size="large"
                      icon={<ReadOutlined />}
                      onClick={showModal}
                      className="h-14 px-8 border-0 shadow-lg flex items-center"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        color: colors.white,
                      }}
                      shape="round"
                    >
                      <span className="text-lg font-medium">
                        {t("Read Full Message")}
                      </span>
                      <ArrowRightOutlined className="ml-3 text-lg" />
                    </Button>
                  </motion.div>
                )}

                <motion.div
                  className="pt-8 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring" }}
                    >
                      <Avatar
                        size={isMobile ? 64 : 80}
                        src={`${apiUrl}uploads/${directorData.image}`}
                        className="mr-6 shadow-lg border-4 border-white object-fill"
                        style={{ backgroundColor: colors.primary + "20" }}
                      />
                    </motion.div>
                    <div>
                      <Text
                        strong
                        className="text-xl sm:text-2xl block font-bold"
                        style={{ color: colors.primary }}
                      >
                        {getLocalizedText("name")}
                      </Text>
                      <Text
                        className="text-base sm:text-lg"
                        style={{ color: colors.primary + "CC" }}
                      >
                        {getLocalizedText("position")}
                      </Text>
                    </div>
                  </div>
                  <Signature
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {t("Best Regards")}
                  </Signature>
                </motion.div>
              </ContentSection>
            </div>
          </GlassCard>
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
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <MessageOutlined className="text-white text-2xl" />
                </div>
                <span
                  className="text-3xl font-bold"
                  style={{ color: colors.primary }}
                >
                  {getLocalizedText("title")}
                </span>
              </motion.div>
            }
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={isMobile ? "90%" : 900}
            closeIcon={
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <CloseOutlined
                  style={{ color: colors.primary, fontSize: "20px" }}
                />
              </motion.div>
            }
            bodyStyle={{ padding: isMobile ? "24px" : "40px" }}
            className="rounded-2xl"
            centered
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Text
                className="text-lg leading-relaxed whitespace-pre-line"
                style={{ color: colors.darkText }}
              >
                {getLocalizedText("message")}
              </Text>
            </motion.div>

            <Divider className="my-8" />

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4 sm:mb-0">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring" }}
                >
                  <Avatar
                    size={isMobile ? 80 : 100}
                    src={`${apiUrl}uploads/${directorData.image}`}
                    className="mr-6 shadow-lg border-4 border-white"
                    style={{ backgroundColor: colors.primary + "20" }}
                  />
                </motion.div>
                <div>
                  <Title
                    level={4}
                    className="mb-2 text-2xl sm:text-3xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {getLocalizedText("name")}
                  </Title>
                  <Text
                    className="text-lg sm:text-xl"
                    style={{ color: colors.primary + "CC" }}
                  >
                    {getLocalizedText("position")}
                  </Text>
                  <div className="mt-3">
                    {directorData.linkedin && (
                      <Button
                        type="text"
                        icon={
                          <LinkedinFilled
                            style={{ color: colors.primary, fontSize: "20px" }}
                          />
                        }
                        href={directorData.linkedin}
                        target="_blank"
                      />
                    )}
                    {directorData.twitter && (
                      <Button
                        type="text"
                        icon={
                          <TwitterOutlined
                            style={{ color: colors.primary, fontSize: "20px" }}
                          />
                        }
                        href={directorData.twitter}
                        target="_blank"
                      />
                    )}
                    {directorData.email && (
                      <Button
                        type="text"
                        icon={
                          <MailOutlined
                            style={{ color: colors.primary, fontSize: "20px" }}
                          />
                        }
                        href={`mailto:${directorData.email}`}
                      />
                    )}
                  </div>
                </div>
              </div>

              <Signature
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t("Best Regards")}
              </Signature>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </ConfigProvider>
  );
};

export default DirectorMessage;
