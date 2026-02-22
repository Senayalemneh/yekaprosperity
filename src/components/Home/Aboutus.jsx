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
  Tag,
  Collapse,
  Timeline,
  Badge,
  Progress,
  Avatar,
  Tooltip,
} from "antd";
import {
  FaUsers,
  FaTools,
  FaBuilding,
  FaHome,
  FaClipboardCheck,
  FaCogs,
  FaBolt,
  FaWrench,
  FaShieldAlt,
  FaTree,
  FaChild,
  FaParking,
  FaUtensils,
  FaTint,
  FaPlug,
  FaElevator,
  FaBroom,
  FaUserShield,
  FaSeedling,
  FaBaby,
  FaCar,
  FaCoffee,
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaGlobeAmericas,
  FaTrophy,
  FaLandmark,
  FaLightbulb,
  FaChartLine,
  FaCog,
  FaHammer,
  FaClipboardList,
  FaEye,
  FaHandHoldingUsd,
  FaRegCheckCircle,
  FaSyncAlt,
  FaExpandArrowsAlt,
  FaRulerCombined,
  FaChartBar,
  FaExclamationTriangle,
  FaSearch,
  FaHandHoldingHeart,
  FaHandsHelping,
  FaRegStar,
  FaStar,
} from "react-icons/fa";
import { getApiUrl } from "../../utils/getApiUrl";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

function Welcome2() {
  const API_URL = getApiUrl();
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [officeData, setOfficeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeService, setActiveService] = useState(0);

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

  // Service data structure
  const servicesData = [
    {
      id: 1,
      icon: <FaUsers className="text-blue-500" />,
      title: "የስራዎች አስተባባሪ የስራ ድርሻ",
      color: "blue",
      tasks: [
        "ቡድኖችን ያማክራል",
        "የጽ/ቤቱን የበጀት ዓመት እቅድ ያቅዳል",
        "ቡድኖችን ያስተባብራል",
        "ሪፖርት ያዘጋጃል",
        "ስራዎችን ይገመግማል",
        "መረጃዎች እንዲደራጁ ያደርጋል",
        "የበጀት ፍላጎት መነሻ በማድረግ የግዥ ፍላጎት ያቅዳል",
        "ግብዓት እንዲሟሉ ያደርጋል",
      ],
    },
    {
      id: 2,
      icon: <FaHome className="text-green-500" />,
      title: "የመንግስት ምድረ ግቢ ማልማትና ደህንነት አገልግሎት ቡድን",
      color: "green",
      tasks: [
        "ምድረ ግቢ ውብ፣ ፅዱ በማድረግ ለሰራተኞችና ተገልጋዮች ማራኪና ምቹ የስራ አካባቢ መፍጠር",
        "ምቹና ደህንነቱ የተረጋገጠ የስራ አካባቢ እንዲፈጠር ማድረግ",
      ],
    },
    {
      id: 3,
      icon: <FaBuilding className="text-purple-500" />,
      title: "የህንፃ አስተዳደር ጥናት ቡድን",
      color: "purple",
      tasks: [
        "በህንፃ አስተዳደር ላይ ቴክኒካዊ ድጋፍ የመስጠትና የማማከር ስራ ይሰራል",
        "የተዘረጋውን የህንፃ አስተዳደር ስርዓት ማስፈን",
        "የህንፃ የውስጥ አደረጃጀት ስታንዳርድ ማስተግበር",
        "ጥገናና እድሳት የሚያስፈልጋቸውን ህንፃዎች በሌላ አካል እንዲጠገኑ ማድረግ",
      ],
    },
    {
      id: 4,
      icon: <FaTools className="text-orange-500" />,
      title: "የንብረት አስተዳደር ዋና የሰራ ሂደት",
      color: "orange",
      tasks: [
        "በንብረት አስተዳደር ጉዳይ ማማከርና ቴክኒካዊ ድጋፍ መስጠት",
        "የንብረት አስተዳደር ስርዓት ማስፈን",
        "በተዘጋጀው የቢሮ መገልገያ ቁሳቁስ ስታንዳርድ መሰረት ማስተግበር",
        "ውጤታማ የንብረት አያያዝና አጠቃቀም ሰርዓትን ማሳደግ",
      ],
    },
    {
      id: 5,
      icon: <FaClipboardCheck className="text-red-500" />,
      title: "የህንፃና ንብረት ኦዲት ቡድን",
      color: "red",
      tasks: [
        "የመንግስት ንብረቶች በአግባቡ ስለመያዛቸው እና ለመንግስት ጥቅም ስለመዋላቸው የንብረት ኦዲት ማድረግ",
        "በህንፃና ንብረት ላይ በሚፈፀሙ ህገ-ወጥ ድርጊቶች ላይ እርምጃ ማስወሰድ",
      ],
    },
    {
      id: 6,
      icon: <FaCogs className="text-cyan-500" />,
      title: "የህንፃ አስተዳደር ጥገና ቡድን",
      color: "cyan",
      subTeams: [
        {
          name: "የኤሌክትሪክ ስራ ተግባራት",
          icon: <FaBolt />,
          tasks: [
            "የኤሌክትሪክ ጥገና ጥያቄ መቀበልና የጥገናውን ዓይነት መለየት",
            "አዳዲስ የውስጥ የኤሌክትሪክ መስመሮችን እና የተበላሹ መስመሮችን መዘርጋት",
            "ለቢሮ አገልግሎት የሚውሉ የኤሌክትሪክ መገልገያ ዕቃዎችን መጠገን",
            "የሊፍት አገልግሎት ስራዎች",
          ],
        },
        {
          name: "የቧንቧና የሳኒተሪ ስራ ተግባራት",
          icon: <FaTint />,
          tasks: [
            "የቧንቧ ስራ (የተለያዩ መስመሮች መዘርጋት)",
            "የቧንቧ የጥገና ጥያቄ መቀበል",
            "የጥገናውን ዓይነት መለየት",
            "የሣኒቴሪ ኘላኖችና ድሮዊንጐችን ማንበብ",
          ],
        },
        {
          name: "የቢሮ መገልገያ ቁሳቁሶች የጥገና አገልግሎት",
          icon: <FaWrench />,
          tasks: [
            "አነስተኛ ብልሽት ያለባቸውን የቢሮ መገልገያ መሳሪያዎችን መጠገን",
            "ለጥገና የሚውሉ መለዋወጫዎችና መሳሪያዎች እንዲገዙ ጥያቄ ማቅረብ",
            "ከፍተኛ ብልሽት የገጠማቸውን መሳሪያዎች ጥገና እንዲደረግ ማሳወቅ",
          ],
        },
        {
          name: "የሊፍት አገልግሎት ስራዎች",
          icon: <FaElevator />,
          tasks: [
            "የሊፍት ብልሽት ሲገጥም ጥገና በማድረግ አገልግሎት እንዲሰጥ ማድረግ",
            "የሊፍቱን ፍጥነት የሚቆጣጠር ሰርቪስ ማድረግ",
            "የሊፍቱን የዕለት ከዕለት ደህንነት መቆጣጠርና መከታተል",
          ],
        },
      ],
    },
    {
      id: 7,
      icon: <FaShieldAlt className="text-indigo-500" />,
      title: "የፋሲሊቲ አገልግሎት ቡድን",
      color: "indigo",
      subTeams: [
        {
          name: "የጽዳትና መልዕክት አገልግሎት",
          icon: <FaBroom />,
          tasks: [
            "የቢሮዎችን፤ኮሊደሮችንና የመጸዳጃ ቤቶችን ንጽህና መጠበቅ",
            "የመሰብሰቢያ አዳራሽና መድረኮችን ንጽህና መጠበቅ",
            "የተቋሙን ግቢ ማጽዳት",
          ],
        },
        {
          name: "የጥበቃ አገልግሎት",
          icon: <FaUserShield />,
          tasks: ["የደህንነት አገልግሎት ማስተዋወቅ"],
        },
        {
          name: "አትክልተኛ",
          icon: <FaTree />,
          tasks: ["የአትክልት እንክብካቤ"],
        },
        {
          name: "የህጻናት ማቆያ ማእከል",
          icon: <FaChild />,
          tasks: ["የህጻናት ማቆያ ማእከል ጽዳት", "የህጻናት ሞግዚት"],
        },
        {
          name: "የፓርኪንግ ስራዎች",
          icon: <FaParking />,
          tasks: ["የፓርኪንግ ስራዎችን ማከናወን"],
        },
        {
          name: "የካፍቴሪያ አገልግሎት",
          icon: <FaUtensils />,
          tasks: ["የሰራተኞች ካፍቴሪያ አገልግሎት አሰጣጡን የተሻለ እንዲሆን ማድረግ"],
        },
      ],
    },
  ];

  if (isLoading || !officeData) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-400 rounded-full mb-4 flex items-center justify-center">
            <FaBuilding className="text-white text-2xl" />
          </div>
          <div className="h-6 w-64 bg-blue-300 rounded mb-2"></div>
          <div className="h-4 w-80 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  const currentLanguage = i18n.language;
  const officeName =
    officeData.officename[currentLanguage] || officeData.officename.en;
  const mission =
    officeData.missions[currentLanguage] || officeData.missions.en;

  const getColorClass = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600",
      cyan: "from-cyan-500 to-cyan-600",
      indigo: "from-indigo-500 to-indigo-600",
    };
    return colors[color] || "from-blue-500 to-blue-600";
  };

  return (
    <div>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 12,
        },
      }}
    >
      {/* Hero Section */}
      <div className="relative w-full min-h-[60vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-500 opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-400 opacity-10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-white opacity-5 blur-xl animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full bg-indigo-400 opacity-10 blur-2xl animate-spin"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 px-4 py-16 w-full max-w-7xl">
          <Row gutter={[48, 32]} align="middle" justify="center">
            <Col
              xs={24}
              md={8}
              lg={6}
              className="flex flex-col items-center md:items-start"
            >
              <div
                className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-4 mb-6 transform hover:scale-105 transition-transform duration-300"
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
                  className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white border-opacity-20"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <Title
                    level={5}
                    className="text-white mb-3 flex items-center"
                  >
                    <FaGlobeAmericas className="mr-3 text-blue-200" />
                    <span className="text-white">
                      {t("welcomepage.officeInfo")}
                    </span>
                  </Title>
                  <Divider className="bg-white bg-opacity-30 my-3" />

                  <Space direction="vertical" size="middle" className="w-full">
                    {officeData.emails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center group cursor-pointer"
                      >
                        <FaEnvelope className="text-blue-200 mr-3 group-hover:text-white transition-colors" />
                        <Text className="text-white group-hover:text-blue-200 transition-colors text-sm">
                          {email}
                        </Text>
                      </div>
                    ))}

                    {officeData.contact_numbers.map((number, index) => (
                      <div
                        key={index}
                        className="flex items-center group cursor-pointer"
                      >
                        <FaPhone className="text-blue-200 mr-3 group-hover:text-white transition-colors" />
                        <Text className="text-white group-hover:text-blue-200 transition-colors text-sm">
                          {number}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </div>

                {/* Quick Stats */}
                <div
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                  data-aos="fade-right"
                  data-aos-delay="300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Text className="text-white font-semibold">Teams</Text>
                    <Badge count={7} style={{ backgroundColor: "#3B82F6" }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Text className="text-white font-semibold">Services</Text>
                    <Badge count="20+" style={{ backgroundColor: "#10B981" }} />
                  </div>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={16} lg={18}>
              <div className="text-center md:text-left">
                <div
                  className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm mb-6"
                  data-aos="fade-up"
                >
                  <FaRegStar className="text-yellow-300 mr-2" />
                  <Text className="text-blue-100 uppercase tracking-widest text-sm font-semibold">
                    {t("welcomepage.greeting")}
                  </Text>
                </div>

                <Title
                  level={1}
                  className="text-white mb-6 leading-tight"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {t("welcomepage.welcomeTo")} {officeName}
                  </span>
                </Title>

                <Text
                  className="text-xl text-blue-100 mb-6 block max-w-3xl mx-auto md:mx-0 leading-relaxed"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  {t("welcomepage.welcomeMessage")}
                </Text>

                <div
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white border-opacity-20"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Text className="text-lg text-blue-50 leading-relaxed">
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
                      className="flex items-center bg-white text-blue-800 hover:bg-blue-50 border-0 shadow-2xl font-semibold h-12 px-6 rounded-xl transform hover:scale-105 transition-all duration-300"
                      icon={<FaArrowRight className="text-blue-800" />}
                    >
                      {t("welcomepage.learnMore")}
                    </Button>
                  </a>

                  <a href="/contact">
                    <Button
                      size={isMobile ? "middle" : "large"}
                      className="flex items-center bg-transparent text-white hover:bg-white hover:text-blue-800 border-2 border-white shadow-2xl font-semibold h-12 px-6 rounded-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {t("welcomepage.contactUs")}
                    </Button>
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Animated wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden transform rotate-180">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-20 md:h-28 animate-wave"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-blue-800"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-blue-700"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-blue-600"
            ></path>
          </svg>
        </div>
      </div>

      {/* Services Section */}
      <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 mb-4">
              <FaHandsHelping className="mr-2" />
              <Text className="font-semibold">Our Services</Text>
            </div>
            <Title level={2} className="mb-4 text-gray-800">
              Professional Office Services
            </Title>
            <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive office management and facility services
              with dedicated teams ensuring efficiency and quality.
            </Text>
          </div>

          {/* Services Grid */}
          <Row gutter={[24, 24]} className="mb-12">
            {servicesData.map((service, index) => (
              <Col xs={24} md={12} lg={8} key={service.id}>
                <Card
                  className={`h-full transform hover:scale-105 transition-all duration-300 cursor-pointer border-0 shadow-lg hover:shadow-2xl ${
                    activeService === index ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setActiveService(index)}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  cover={
                    <div
                      className={`h-2 bg-gradient-to-r ${getColorClass(
                        service.color
                      )}`}
                    ></div>
                  }
                >
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${getColorClass(
                        service.color
                      )} mb-4`}
                    >
                      <div className="text-2xl text-white">{service.icon}</div>
                    </div>
                    <Title level={4} className="mb-4 text-gray-800">
                      {service.title}
                    </Title>

                    {/* Tasks List */}
                    <Space
                      direction="vertical"
                      size="small"
                      className="w-full text-left"
                    >
                      {service.tasks?.slice(0, 3).map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-start">
                          <FaRegCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <Text className="text-gray-600 text-sm">{task}</Text>
                        </div>
                      ))}
                      {service.tasks && service.tasks.length > 3 && (
                        <Text className="text-blue-600 text-sm font-semibold">
                          +{service.tasks.length - 3} more tasks
                        </Text>
                      )}
                    </Space>

                    {/* Sub-teams */}
                    {service.subTeams && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Text strong className="text-gray-700 mb-2 block">
                          Sub-teams:
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          {service.subTeams.map((subTeam, subIndex) => (
                            <Tag key={subIndex} color="blue" className="m-0">
                              <div className="flex items-center">
                                <span className="mr-1">{subTeam.icon}</span>
                                {subTeam.name}
                              </div>
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      type="link"
                      className="mt-4 text-blue-600 font-semibold flex items-center justify-center"
                      icon={<FaArrowRight className="ml-1" />}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Detailed Service View */}
          <div data-aos="fade-up">
            <Card
              className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50"
              title={
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getColorClass(
                      servicesData[activeService]?.color
                    )} flex items-center justify-center mr-4`}
                  >
                    {servicesData[activeService]?.icon}
                  </div>
                  <div>
                    <Title level={3} className="mb-0 text-gray-800">
                      {servicesData[activeService]?.title}
                    </Title>
                    <Text className="text-gray-600">
                      Detailed service information
                    </Text>
                  </div>
                </div>
              }
            >
              {servicesData[activeService]?.subTeams ? (
                <Collapse
                  ghost
                  expandIconPosition="end"
                  className="service-collapse"
                >
                  {servicesData[activeService].subTeams.map(
                    (subTeam, index) => (
                      <Panel
                        header={
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                              {subTeam.icon}
                            </div>
                            <Text strong className="text-gray-800">
                              {subTeam.name}
                            </Text>
                          </div>
                        }
                        key={index}
                      >
                        <Timeline>
                          {subTeam.tasks.map((task, taskIndex) => (
                            <Timeline.Item
                              key={taskIndex}
                              dot={
                                <FaRegCheckCircle className="text-green-500" />
                              }
                            >
                              <Text className="text-gray-700">{task}</Text>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </Panel>
                    )
                  )}
                </Collapse>
              ) : (
                <Timeline>
                  {servicesData[activeService]?.tasks.map((task, index) => (
                    <Timeline.Item
                      key={index}
                      dot={<FaRegCheckCircle className="text-green-500" />}
                    >
                      <Text className="text-gray-700 text-lg">{task}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12} data-aos="fade-right">
              <Title level={2} className="text-white mb-4">
                Why Choose Our Services?
              </Title>
              <Text className="text-blue-100 text-lg mb-6 block">
                With dedicated teams and comprehensive service coverage, we
                ensure your office operations run smoothly and efficiently.
              </Text>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-300 mr-3 text-xl" />
                  <Text className="text-white">7 Specialized Teams</Text>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-300 mr-3 text-xl" />
                  <Text className="text-white">20+ Service Categories</Text>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-300 mr-3 text-xl" />
                  <Text className="text-white">Professional Expertise</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12} data-aos="fade-left">
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <FaUsers className="text-white text-3xl mx-auto mb-3" />
                    <Title level={3} className="text-white mb-1">
                      7+
                    </Title>
                    <Text className="text-blue-100">Dedicated Teams</Text>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <FaCogs className="text-white text-3xl mx-auto mb-3" />
                    <Title level={3} className="text-white mb-1">
                      20+
                    </Title>
                    <Text className="text-blue-100">Services</Text>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <FaClipboardCheck className="text-white text-3xl mx-auto mb-3" />
                    <Title level={3} className="text-white mb-1">
                      100%
                    </Title>
                    <Text className="text-blue-100">Quality Assurance</Text>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <FaHandsHelping className="text-white text-3xl mx-auto mb-3" />
                    <Title level={3} className="text-white mb-1">
                      24/7
                    </Title>
                    <Text className="text-blue-100">Support</Text>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
    
    </div>
  );
}

export default Welcome2;
