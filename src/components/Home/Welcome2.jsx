import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Button,
  ConfigProvider,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Card,
  Modal,
  Tabs,
} from "antd";
import {
  ArrowRightOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  TeamOutlined,
  TrophyOutlined,
  BankOutlined,
  CompassOutlined,
  CustomerServiceOutlined,
  CloseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import { getApiUrl } from "../../utils/getApiUrl";
import axios from "axios";

const { Title, Text } = Typography;

function Welcome2() {
  const API_URL = getApiUrl();
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [officeData, setOfficeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [directionModalVisible, setDirectionModalVisible] = useState(false);
  const [complaintModalVisible, setComplaintModalVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    const fetchCarouselData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}api/officedata`);
        setOfficeData(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching carousel data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselData();
  }, [API_URL]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle fullscreen functionality
  const toggleFullscreen = () => {
    const iframe = document.getElementById("direction-iframe");
    if (!iframe) return;

    if (!isFullscreen) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  if (isLoading || !officeData) {
    return (
      <div
        className="w-full h-[50vh] flex items-center justify-center"
        style={{ backgroundColor: colors.primary + "10" }}
      >
        <div className="animate-pulse flex flex-col items-center">
          <div
            className="h-12 w-12 rounded-full mb-4"
            style={{ backgroundColor: colors.primary }}
          ></div>
          <div
            className="h-6 w-64 rounded mb-2"
            style={{ backgroundColor: colors.primary + "80" }}
          ></div>
          <div
            className="h-4 w-80 rounded"
            style={{ backgroundColor: colors.primary + "60" }}
          ></div>
        </div>
      </div>
    );
  }

  const currentLanguage = i18n.language;
  const officeName =
    officeData.officename[currentLanguage] || officeData.officename.en;
  const mission =
    officeData.missions[currentLanguage] || officeData.missions.en;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.primary,
          borderRadius: 8,
        },
      }}
    >
      {/* Hero Section */}
      <div
        className="relative w-full min-h-[50vh] flex flex-col justify-center items-center overflow-hidden"
        style={{ backgroundColor: colors.primary }}
      >
        {/* Floating decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: colors.secondary }}
          ></div>
          <div
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: colors.accent }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full blur-xl opacity-10"
            style={{ backgroundColor: colors.white }}
          ></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 px-4 py-12 w-full max-w-7xl">
          <Row gutter={[48, 32]} align="middle" justify="center">
            <Col
              xs={24}
              md={8}
              lg={6}
              className="flex flex-col items-center md:items-start"
            >
              <div
                className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-4 mb-6"
                data-aos="fade-right"
              >
                <img
                  src={`${API_URL}uploads/${officeData.officelogo}`}
                  alt={officeName}
                  className="w-full h-full object-contain"
                />
              </div>

              <Space direction="vertical" size="middle" className="w-full">
                <div
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white border-opacity-20"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <Title
                    level={5}
                    className="text-white mb-2 flex items-center"
                  >
                    <GlobalOutlined
                      className="mr-2"
                      style={{ color: colors.accent }}
                    />{" "}
                    <span className="text-white">
                      {t("welcomepage.officeInfo")}
                    </span>
                  </Title>
                  <Divider className="bg-white bg-opacity-20 my-2" />

                  <Space direction="vertical" size="small" className="w-full">
                    {officeData.emails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center group cursor-pointer"
                      >
                        <MailOutlined
                          className="mr-2 group-hover:text-white transition-colors"
                          style={{ color: colors.accent }}
                        />
                        <Text className="text-white group-hover:text-blue-200 transition-colors">
                          {email}
                        </Text>
                      </div>
                    ))}

                    {officeData.contact_numbers.map((number, index) => (
                      <div
                        key={index}
                        className="flex items-center group cursor-pointer"
                      >
                        <PhoneOutlined
                          className="mr-2 group-hover:text-white transition-colors"
                          style={{ color: colors.accent }}
                        />
                        <Text className="text-white group-hover:text-blue-200 transition-colors">
                          {number}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </div>

                {/* Quick Stats */}
                <div
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white border-opacity-20"
                  data-aos="fade-right"
                  data-aos-delay="300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-white font-semibold">Teams</Text>
                    <div
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{
                        backgroundColor: colors.secondary,
                        color: colors.white,
                      }}
                    >
                      7
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Text className="text-white font-semibold">Services</Text>
                    <div
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.primary,
                      }}
                    >
                      20+
                    </div>
                  </div>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={16} lg={18}>
              <div className="text-center md:text-left">
                <div
                  className="inline-flex items-center px-4 py-2 rounded-full mb-4"
                  style={{ backgroundColor: colors.white + "20" }}
                  data-aos="fade-up"
                >
                  <TrophyOutlined
                    className="mr-2"
                    style={{ color: colors.accent }}
                  />
                  <Text className="text-white uppercase tracking-widest text-sm font-semibold">
                    {t("welcomepage.greeting")}
                  </Text>
                </div>

                <Title
                  level={1}
                  className="text-white mb-4 leading-tight"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <span className="text-white">
                    {t("welcomepage.welcomeTo")} {officeName}
                  </span>
                </Title>

                <Text
                  className="text-xl text-white mb-6 block max-w-3xl mx-auto md:mx-0 opacity-90"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  {t("welcomepage.welcomeMessage")}
                </Text>

                <div
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white border-opacity-20"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Text className="text-lg text-white leading-relaxed opacity-90">
                    {mission}
                  </Text>
                </div>

                <div
                  className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <a href="/about">
                    <Button
                      type="primary"
                      size={isMobile ? "middle" : "large"}
                      className="flex items-center border-0 shadow-lg font-medium transform hover:scale-105 transition-all duration-300"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.primary,
                      }}
                      icon={
                        <ArrowRightOutlined style={{ color: colors.primary }} />
                      }
                    >
                      {t("welcomepage.learnMore")}
                    </Button>
                  </a>

                  <a href="/contact">
                    <Button
                      size={isMobile ? "middle" : "large"}
                      className="flex items-center bg-transparent text-white border-2 shadow-lg font-medium transform hover:scale-105 transition-all duration-300"
                      style={{
                        borderColor: colors.white,
                        color: colors.white,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.color = colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = colors.white;
                      }}
                    >
                      {t("welcomepage.contactUs")}
                    </Button>
                  </a>

                  {/* Direction Locator Button */}
                  <Button
                    size={isMobile ? "middle" : "large"}
                    className="flex items-center border-0 shadow-lg font-medium transform hover:scale-105 transition-all duration-300"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.white,
                    }}
                    icon={<CompassOutlined />}
                    onClick={() => setDirectionModalVisible(true)}
                  >
                    {t("DirectionLocator") || "Direction Locator"}
                  </Button>

                  {/* Complaint Page Button */}
                  <Button
                    size={isMobile ? "middle" : "large"}
                    className="flex items-center bg-transparent text-white border-2 shadow-lg font-medium transform hover:scale-105 transition-all duration-300"
                    style={{
                      borderColor: colors.accent,
                      color: colors.accent,
                    }}
                    icon={<CustomerServiceOutlined />}
                    onClick={() => setComplaintModalVisible(true)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.accent;
                      e.target.style.color = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = colors.accent;
                    }}
                  >
                   <p className="text-blue">{t("ComplaintService") || "Customer Service"}</p>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 md:h-24"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              style={{ fill: colors.primary }}
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              style={{ fill: colors.primary }}
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              style={{ fill: colors.primary }}
            ></path>
          </svg>
        </div>
      </div>

      {/* Direction Locator Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CompassOutlined
                className="mr-2"
                style={{ color: colors.primary }}
              />
              <span>Direction Locator</span>
            </div>
            <Space>
              <Button
                icon={
                  isFullscreen ? (
                    <FullscreenExitOutlined />
                  ) : (
                    <FullscreenOutlined />
                  )
                }
                onClick={toggleFullscreen}
                size="small"
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={() => setDirectionModalVisible(false)}
                size="small"
                type="text"
              />
            </Space>
          </div>
        }
        open={directionModalVisible}
        onCancel={() => setDirectionModalVisible(false)}
        width="90vw"
        style={{ top: 20 }}
        footer={[
          <Button
            key="open"
            type="primary"
            onClick={() =>
              window.open("https://yekadirloc.bolesubcity.com/", "_blank")
            }
            style={{ backgroundColor: colors.primary }}
          >
            Open in New Tab
          </Button>,
          <Button key="close" onClick={() => setDirectionModalVisible(false)}>
            Close
          </Button>,
        ]}
        className="direction-modal"
      >
        <div className="w-full" style={{ height: "100vh" }}>
          <iframe
            id="direction-iframe"
            src="https://yekadirloc.bolesubcity.com/"
            title="Direction Locator"
            className="w-full h-full border-0 rounded-lg"
            allow="fullscreen"
            allowFullScreen
          />
        </div>
      </Modal>

      {/* Complaint Page Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CustomerServiceOutlined
              className="mr-2"
              style={{ color: colors.primary }}
            />
            <span>Customer Service & Complaint Management</span>
          </div>
        }
        open={complaintModalVisible}
        onCancel={() => setComplaintModalVisible(false)}
        width="90vw"
        style={{ top: 20 }}
        footer={[
          <Button
            key="open"
            type="primary"
            onClick={() =>
              window.open(
                "https://customer-service.dukayouthledorganization.org/en",
                "_blank"
              )
            }
            style={{ backgroundColor: colors.primary }}
          >
            Open in New Tab
          </Button>,
          <Button key="close" onClick={() => setComplaintModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <div className="w-full" style={{ height: "100vh" }}>
          <iframe
            src="https://customer-service.dukayouthledorganization.org/en"
            title="Customer Service & Complaint Management"
            className="w-full h-full border-0 rounded-lg"
            allowFullScreen
          />
        </div>
      </Modal>

      {/* Services Section - Added below the hero */}
      <div
        className="w-full py-16 px-4"
        style={{ backgroundColor: colors.lightGray }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <Title level={2} style={{ color: colors.primary }}>
              Quick Access Services
            </Title>
            <Text type="secondary" className="text-lg">
              Access our most used services directly from here
            </Text>
          </div>

          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="text-center h-full transform hover:-translate-y-2 transition-all duration-300"
                onClick={() => setDirectionModalVisible(true)}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="mb-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primary + "20" }}
                  >
                    <CompassOutlined
                      style={{ fontSize: 28, color: colors.primary }}
                    />
                  </div>
                </div>
                <Title level={4} style={{ color: colors.primary }}>
                  Direction Locator
                </Title>
                <Text type="secondary">
                  Find our office location and get directions
                </Text>
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    style={{ backgroundColor: colors.primary }}
                  >
                    Open Map
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="text-center h-full transform hover:-translate-y-2 transition-all duration-300"
                onClick={() => setComplaintModalVisible(true)}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="mb-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.secondary + "20" }}
                  >
                    <CustomerServiceOutlined
                      style={{ fontSize: 28, color: colors.secondary }}
                    />
                  </div>
                </div>
                <Title level={4} style={{ color: colors.secondary }}>
                  Customer Service
                </Title>
                <Text type="secondary">Submit complaints and get support</Text>
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    style={{ backgroundColor: colors.secondary }}
                  >
                    File Complaint
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="text-center h-full transform hover:-translate-y-2 transition-all duration-300"
                onClick={() => window.open("/contact", "_self")}
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="mb-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.accent + "20" }}
                  >
                    <MailOutlined
                      style={{ fontSize: 28, color: colors.primary }}
                    />
                  </div>
                </div>
                <Title level={4} style={{ color: colors.primary }}>
                  Contact Us
                </Title>
                <Text type="secondary">
                  Get in touch with our team directly
                </Text>
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primary,
                    }}
                  >
                    Contact Now
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="text-center h-full transform hover:-translate-y-2 transition-all duration-300"
                onClick={() => window.open("/about", "_self")}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="mb-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primary + "20" }}
                  >
                    <TeamOutlined
                      style={{ fontSize: 28, color: colors.primary }}
                    />
                  </div>
                </div>
                <Title level={4} style={{ color: colors.primary }}>
                  About Us
                </Title>
                <Text type="secondary">Learn more about our organization</Text>
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    style={{ backgroundColor: colors.primary }}
                  >
                    Learn More
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Welcome2;
