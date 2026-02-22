import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Spin, Alert, Tag, Select, Input, Empty, Button, Tooltip, Progress } from "antd";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaUser,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVoteYea,
  FaFlag,
  FaStar,
  FaBalanceScale,
  FaShieldAlt,
  FaRocket,
  FaQuoteLeft,
  FaQuoteRight,
  FaGlobeAfrica,
  FaHandsHelping,
  FaChartLine,
  FaUsers,
  FaBullhorn,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiSearch,
  FiThumbsUp,
  FiMessageCircle,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiPlay,
  FiPause,
  FiMaximize,
  FiMinimize,
  FiHeart,
  FiEye,
  FiAward,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import {
  MdOutlineCampaign,
  MdOutlinePsychology,
  MdOutlineEmojiEvents,
  MdVerified,
  MdOutlineVerified,
} from "react-icons/md";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { getApiUrl } from "../../utils/getApiUrl";

const { Option } = Select;
const { Search } = Input;

const BACKEND_URL = getApiUrl();

// Brand colors
const BRAND_COLORS = {
  primary: "#136094",
  secondary: "#008830",
  accent: "#ffca40",
  dark: "#0a2a44",
  light: "#f0f9ff",
};

const CandidateShowcase = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    region: "",
    electionType: "",
    party: "",
  });
  const [expandedBio, setExpandedBio] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [supportedCandidates, setSupportedCandidates] = useState([]);
  const [hoveredCandidate, setHoveredCandidate] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoadError, setImageLoadError] = useState({});
  const [showQuickView, setShowQuickView] = useState(null);

  const sliderRef = useRef(null);
  const controls = useAnimation();

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    hover: {
      y: -12,
      scale: 1.02,
      boxShadow: "0 30px 60px -15px rgba(19, 96, 148, 0.3)",
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 20
      },
    },
    tap: { scale: 0.98 },
  };

  const modalVariants = {
    initial: { opacity: 0, scale: 0.9, y: 50 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 50,
      transition: { duration: 0.3 }
    },
  };

  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: [0, 0.5, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }
    },
  };

  // Mobile detection
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
      offset: 100,
    });

    fetchCandidates();
    
    // Load saved candidates from localStorage
    const saved = localStorage.getItem('savedCandidates');
    if (saved) setSavedCandidates(JSON.parse(saved));
    
    const supported = localStorage.getItem('supportedCandidates');
    if (supported) setSupportedCandidates(JSON.parse(supported));
  }, []);

  useEffect(() => {
    applyFilters();
  }, [candidates, searchTerm, filters, activeCategory]);

  // Progress bar for 5 seconds
  useEffect(() => {
    if (!isPlaying || candidates.length === 0) return;
    
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 100 / 50; // 5 seconds * 10 updates per second = 50 steps
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        progressValue = 0;
        if (sliderRef.current) {
          sliderRef.current.slickNext();
        }
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, candidates.length]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}api/candidates`);
      if (res.data.success) {
        setCandidates(res.data.data);
        setFilteredCandidates(res.data.data);
      } else {
        setError(t("candidateShowcase.fetchError"));
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError(t("candidateShowcase.failedToLoad"));
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[currentLanguage] || obj.en || "";
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BACKEND_URL}uploads/${path}`;
  };

  const applyFilters = () => {
    let filtered = [...candidates];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          getLocalizedText(candidate.name)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          getLocalizedText(candidate.party)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (candidate.bio && getLocalizedText(candidate.bio)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply region filter
    if (filters.region) {
      filtered = filtered.filter((c) => c.region === filters.region);
    }

    // Apply election type filter
    if (filters.electionType) {
      filtered = filtered.filter(
        (c) => c.election_type === filters.electionType,
      );
    }

    // Apply party filter
    if (filters.party) {
      filtered = filtered.filter(
        (c) => getLocalizedText(c.party) === filters.party,
      );
    }

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (candidate) =>
          (candidate.status || "").toLowerCase() === activeCategory,
      );
    }

    setFilteredCandidates(filtered);
  };

  const clearFilters = () => {
    setFilters({
      region: "",
      electionType: "",
      party: "",
    });
    setSearchTerm("");
    setActiveCategory("all");
  };

  const toggleBio = (id) => {
    setExpandedBio((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSaveCandidate = (candidate, e) => {
    e?.stopPropagation();
    const updated = savedCandidates.includes(candidate.id)
      ? savedCandidates.filter(id => id !== candidate.id)
      : [...savedCandidates, candidate.id];
    
    setSavedCandidates(updated);
    localStorage.setItem('savedCandidates', JSON.stringify(updated));
  };

  const toggleSupportCandidate = (candidate, e) => {
    e?.stopPropagation();
    const updated = supportedCandidates.includes(candidate.id)
      ? supportedCandidates.filter(id => id !== candidate.id)
      : [...supportedCandidates, candidate.id];
    
    setSupportedCandidates(updated);
    localStorage.setItem('supportedCandidates', JSON.stringify(updated));
  };

  const getUniqueValues = (field) => {
    return [...new Set(candidates.map((c) => c[field]).filter(Boolean))];
  };

  const getUniqueParties = () => {
    return [
      ...new Set(
        candidates.map((c) => getLocalizedText(c.party)).filter(Boolean),
      ),
    ];
  };

  const getAgeRange = (age) => {
    if (age < 30) return { 
      name: t("candidateShowcase.badges.ageRange.young"), 
      icon: <FaRocket />, 
      color: "blue" 
    };
    if (age < 50) return { 
      name: t("candidateShowcase.badges.ageRange.middleAged"), 
      icon: <FaBalanceScale />, 
      color: "green" 
    };
    return { 
      name: t("candidateShowcase.badges.ageRange.senior"), 
      icon: <FaShieldAlt />, 
      color: "purple" 
    };
  };

  const getElectionIcon = (type) => {
    const icons = {
      Parliament: { icon: "🏛️", color: "gold" },
      "Regional Council": { icon: "🏢", color: "cyan" },
      "City Mayor": { icon: "🏙️", color: "orange" },
      "Zonal Council": { icon: "🗺️", color: "lime" },
      "Woreda Council": { icon: "🏘️", color: "geekblue" },
    };
    return icons[type] || { icon: "🗳️", color: "default" };
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      inactive: "warning",
      withdrawn: "error",
      elected: "processing",
    };
    return colors[status] || "default";
  };

  const getStatusText = (status) => {
    const statusMap = {
      active: t("candidateShowcase.badges.status.active"),
      inactive: t("candidateShowcase.badges.status.inactive"),
      withdrawn: t("candidateShowcase.badges.status.withdrawn"),
      elected: t("candidateShowcase.badges.status.elected"),
    };
    return statusMap[status] || status?.toUpperCase() || "";
  };

  const categories = [
    { id: "all", name: t("candidateShowcase.categories.all"), icon: "👥", count: candidates.length },
    { id: "active", name: t("candidateShowcase.categories.active"), icon: "✅", count: candidates.filter(c => c.status === "active").length },
    { id: "elected", name: t("candidateShowcase.categories.elected"), icon: "🏆", count: candidates.filter(c => c.status === "elected").length },
    { id: "withdrawn", name: t("candidateShowcase.categories.withdrawn"), icon: "🚫", count: candidates.filter(c => c.status === "withdrawn").length },
  ];

  // Carousel functions
  const togglePlayPause = () => setIsPlaying(!isPlaying);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleImageError = (candidateId) => {
    setImageLoadError((prev) => ({ ...prev, [candidateId]: true }));
  };

  const goToSlide = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  // Arrow buttons for carousel
  const ArrowButton = ({ onClick, direction }) => {
    const Icon = direction === "next" ? FiChevronRight : FiChevronLeft;
    return (
      <motion.button
        whileHover={{ scale: 1.2, backgroundColor: BRAND_COLORS.primary, boxShadow: "0 0 20px rgba(255,202,64,0.5)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`absolute top-1/2 z-40 -translate-y-1/2 p-4 rounded-full bg-gradient-to-r from-[#136094] to-[#008830] text-white shadow-xl border-2 border-white/50 ${
          direction === "next" ? "right-8" : "left-8"
        } ${isMobile ? "scale-75" : ""} hover:border-[#ffca40] transition-all duration-300`}
        aria-label={direction === "next" ? t("candidateShowcase.accessibility.nextSlide") : t("candidateShowcase.accessibility.previousSlide")}
      >
        <Icon size={isMobile ? 20 : 28} />
      </motion.button>
    );
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: isPlaying,
    autoplaySpeed: 5000, // 5 seconds
    pauseOnHover: true,
    fade: false,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    nextArrow: <ArrowButton direction="next" />,
    prevArrow: <ArrowButton direction="prev" />,
    ref: sliderRef,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
      setProgress(0);
    },
    appendDots: (dots) => (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <motion.ul 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex gap-3 backdrop-blur-xl bg-black/40 rounded-2xl px-6 py-3 border border-white/20 shadow-2xl"
        >
          {dots}
        </motion.ul>
      </div>
    ),
    customPaging: (i) => (
      <motion.div
        whileHover={{ scale: 1.8, backgroundColor: BRAND_COLORS.accent }}
        whileTap={{ scale: 0.8 }}
        onClick={() => goToSlide(i)}
        className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
          i === currentSlide
            ? "bg-[#ffca40] scale-125 shadow-lg shadow-[#ffca40]/50"
            : "bg-white/40 hover:bg-white/60"
        }`}
        aria-label={`${t("candidateShowcase.slide")} ${i + 1}`}
      />
    ),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#136094] via-[#0a2a44] to-[#008830]">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-white/20 border-t-[#ffca40] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-[#ffca40] rounded-full animate-pulse"></div>
          </div>
        </motion.div>
        <p className="ml-4 text-white text-xl font-light">{t("candidateShowcase.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-6 bg-gradient-to-br from-[#136094] to-[#008830]">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
        >
          <Alert message={error} type="error" showIcon className="mb-6" />
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -10px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCandidates}
            className="px-8 py-4 bg-gradient-to-r from-[#ffca40] to-[#e6b63a] text-[#136094] font-bold rounded-xl hover:shadow-xl transition-all duration-300"
          >
            {t("candidateShowcase.retry")}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#136094]/5 via-[#f0f9ff] to-[#008830]/5">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            variants={particleVariants}
            initial="initial"
            animate="animate"
            className="absolute w-2 h-2 bg-[#ffca40]/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#ffca40]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-[#008830]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#136094]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Hero Carousel Section */}
      {candidates.length > 0 && (
        <section className="relative w-full h-screen overflow-hidden">
          {/* Floating Control Bar */}
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-6 left-6 right-6 z-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0"
          >
            {/* Brand Logo/Text */}
            <motion.div 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
              className="backdrop-blur-xl bg-black/30 rounded-2xl px-8 py-3 border-2 border-white/30 shadow-2xl"
            >
              <span className="text-white font-bold text-xl tracking-wider">
                <span className="text-[#ffca40]">🗳️</span> {t("candidateShowcase.meetYourCandidates")}
              </span>
            </motion.div>

            {/* Controls */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 backdrop-blur-xl bg-black/30 rounded-2xl px-6 py-2 border-2 border-white/30 shadow-2xl"
            >
              <motion.button
                whileHover={{ scale: 1.2, color: BRAND_COLORS.accent }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlayPause}
                className="p-2 rounded-full text-white hover:text-[#ffca40] transition-all duration-300"
                aria-label={isPlaying ? t("candidateShowcase.accessibility.pauseCarousel") : t("candidateShowcase.accessibility.playCarousel")}
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </motion.button>

              <div className="w-32">
                <Progress
                  percent={progress}
                  showInfo={false}
                  strokeColor={BRAND_COLORS.accent}
                  trailColor="rgba(255,255,255,0.2)"
                  strokeWidth={6}
                  format={() => `${Math.round(progress)}%`}
                />
              </div>

              <span className="text-white text-sm font-medium bg-[#ffca40]/20 px-3 py-1 rounded-full">
                {currentSlide + 1} / {candidates.length}
              </span>

              <motion.button
                whileHover={{ scale: 1.2, color: BRAND_COLORS.accent }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="p-2 rounded-full text-white hover:text-[#ffca40] transition-all duration-300"
                aria-label={isFullscreen ? t("candidateShowcase.accessibility.exitFullscreen") : t("candidateShowcase.accessibility.toggleFullscreen")}
              >
                {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
              </motion.button>
            </motion.div>
          </motion.div>

          <Slider {...carouselSettings}>
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="relative w-full h-screen overflow-hidden">
                {/* Split Layout: Left side image, Right side info */}
                <div className="flex w-full h-full">
                  {/* LEFT SIDE - Full Image */}
                  <div className="w-1/2 h-full relative overflow-hidden bg-gradient-to-br from-[#136094] to-[#008830]">
                    {imageLoadError[candidate.id] || !candidate.photo_url ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="text-center text-white"
                        >
                          <FaUser className="text-9xl mx-auto mb-6 opacity-30" />
                          <p className="text-3xl font-light tracking-wider">{t("candidateShowcase.candidatePortrait")}</p>
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8, ease: "easeOut" }}
                        className="w-full h-full"
                      >
                        <img
                          src={getFullImageUrl(candidate.photo_url)}
                          alt={t("candidateShowcase.accessibility.candidateImage")}
                          className="w-full h-full object-fill object-center"
                          onError={() => handleImageError(candidate.id)}
                        />
                      </motion.div>
                    )}
                    
                    {/* Gradient Overlay on image for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                  </div>

                  {/* RIGHT SIDE - Full Information */}
                  <div className="w-1/2 h-full bg-gradient-to-br from-[#136094] to-[#008830] flex items-center relative overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-20 right-20 w-64 h-64 bg-[#ffca40] rounded-full blur-3xl"></div>
                      <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white/30 rounded-full"
                          initial={{
                            x: Math.random() * 800,
                            y: Math.random() * 800,
                          }}
                          animate={{
                            y: [null, -300, -600],
                            x: [null, (Math.random() - 0.5) * 100],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: Math.random() * 8 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                          }}
                        />
                      ))}
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 w-full px-16 py-12">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${candidate.id}-${currentLanguage}`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="text-white"
                        >
                          {/* Candidate Number with Animation */}
                          <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-6"
                          >
                            <span className="text-[#ffca40] text-sm font-semibold tracking-wider bg-white/10 px-4 py-2 rounded-full">
                              {t("candidateShowcase.carousel.candidateNumber", { number: String(index + 1).padStart(2, '0') })}
                            </span>
                          </motion.div>

                          {/* Name with Gradient */}
                          <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
                          >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#ffca40]">
                              {getLocalizedText(candidate.name)}
                            </span>
                          </motion.h2>

                          {/* Badges Row */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-3 mb-8"
                          >
                            <div className="px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
                              <span className="text-green-300 font-semibold">{getStatusText(candidate.status)}</span>
                            </div>
                            <div className="px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30">
                              <span className="mr-2">{getElectionIcon(candidate.election_type).icon}</span>
                              <span className="text-purple-300 font-semibold">
                                {t(`candidateShowcase.badges.electionType.${candidate.election_type?.toLowerCase().replace(/\s+/g, '')}`, candidate.election_type)}
                              </span>
                            </div>
                            <div className="px-4 py-2 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-500/30">
                              <span className="mr-2">{getAgeRange(candidate.age).icon}</span>
                              <span className="text-orange-300 font-semibold">{getAgeRange(candidate.age).name}</span>
                            </div>
                          </motion.div>

                          {/* Key Details Grid */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-2 gap-4 mb-8"
                          >
                            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                              <div className="p-2 bg-[#ffca40]/20 rounded-lg">
                                <FaFlag className="text-[#ffca40] text-xl" />
                              </div>
                              <div>
                                <p className="text-white/60 text-sm">{t("candidateShowcase.details.party")}</p>
                                <p className="text-white font-semibold">{getLocalizedText(candidate.party)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                              <div className="p-2 bg-[#ffca40]/20 rounded-lg">
                                <FaMapMarkerAlt className="text-[#ffca40] text-xl" />
                              </div>
                              <div>
                                <p className="text-white/60 text-sm">{t("candidateShowcase.details.region")}</p>
                                <p className="text-white font-semibold">{candidate.region}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                              <div className="p-2 bg-[#ffca40]/20 rounded-lg">
                                <FaBirthdayCake className="text-[#ffca40] text-xl" />
                              </div>
                              <div>
                                <p className="text-white/60 text-sm">{t("candidateShowcase.details.age")}</p>
                                <p className="text-white font-semibold">{candidate.age} {t("candidateShowcase.details.years")}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                              <div className="p-2 bg-[#ffca40]/20 rounded-lg">
                                <FaVoteYea className="text-[#ffca40] text-xl" />
                              </div>
                              <div>
                                <p className="text-white/60 text-sm">{t("candidateShowcase.details.election")}</p>
                                <p className="text-white font-semibold">
                                  {t(`candidateShowcase.badges.electionType.${candidate.election_type?.toLowerCase().replace(/\s+/g, '')}`, candidate.election_type)}
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Bio Preview */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mb-8"
                          >
                            <p className="text-white/80 text-lg leading-relaxed">
                              {getLocalizedText(candidate.bio).substring(0, 200)}...
                            </p>
                          </motion.div>

                          {/* Key Policies */}
                          {candidate.policies && candidate.policies.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                              className="mb-8"
                            >
                              <h3 className="text-white/60 text-sm font-semibold mb-3">{t("candidateShowcase.carousel.keyPolicies")}</h3>
                              <div className="flex flex-wrap gap-2">
                                {candidate.policies.slice(0, 3).map((policy, idx) => (
                                  <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05, backgroundColor: "#ffca40", color: "#136094" }}
                                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm"
                                  >
                                    {policy.length > 20 ? `${policy.substring(0, 20)}...` : policy}
                                  </motion.div>
                                ))}
                                {candidate.policies.length > 3 && (
                                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm">
                                    +{candidate.policies.length - 3} {t("candidateShowcase.carousel.more")}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}

                          {/* Action Buttons */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex gap-4"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -10px rgba(255,202,64,0.5)" }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedCandidate(candidate)}
                              className="group relative px-8 py-4 bg-gradient-to-r from-[#ffca40] to-[#e6b63a] text-[#136094] rounded-xl font-bold text-lg flex items-center gap-2 shadow-xl overflow-hidden"
                            >
                              <span className="relative z-10 flex items-center gap-2">
                                <FiEye size={20} />
                                {t("candidateShowcase.actions.viewFullProfile")}
                              </span>
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-white to-transparent"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.5 }}
                              />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => toggleSupportCandidate(candidate, e)}
                              className={`px-8 py-4 backdrop-blur-xl border-2 rounded-xl font-bold text-lg flex items-center gap-2 transition-all duration-300 ${
                                supportedCandidates.includes(candidate.id)
                                  ? "bg-[#ffca40] border-[#ffca40] text-[#136094]"
                                  : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                              }`}
                            >
                              {supportedCandidates.includes(candidate.id) ? (
                                <>
                                  <FaHeart />
                                  {t("candidateShowcase.actions.supported")}
                                </>
                              ) : (
                                <>
                                  <FiHeart />
                                  {t("candidateShowcase.actions.support")}
                                </>
                              )}
                            </motion.button>
                          </motion.div>

                          {/* Social Links */}
                          {candidate.social_links && Object.values(candidate.social_links).some(Boolean) && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 }}
                              className="flex gap-3 mt-8"
                            >
                              {candidate.social_links.facebook && (
                                <motion.a
                                  whileHover={{ y: -3, scale: 1.1 }}
                                  href={candidate.social_links.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-[#1877f2] transition-all duration-300"
                                  aria-label={t("candidateShowcase.accessibility.socialLink")}
                                >
                                  <FiFacebook />
                                </motion.a>
                              )}
                              {candidate.social_links.twitter && (
                                <motion.a
                                  whileHover={{ y: -3, scale: 1.1 }}
                                  href={candidate.social_links.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-[#1da1f2] transition-all duration-300"
                                  aria-label={t("candidateShowcase.accessibility.socialLink")}
                                >
                                  <FiTwitter />
                                </motion.a>
                              )}
                              {candidate.social_links.instagram && (
                                <motion.a
                                  whileHover={{ y: -3, scale: 1.1 }}
                                  href={candidate.social_links.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] transition-all duration-300"
                                  aria-label={t("candidateShowcase.accessibility.socialLink")}
                                >
                                  <FiInstagram />
                                </motion.a>
                              )}
                              {candidate.social_links.linkedin && (
                                <motion.a
                                  whileHover={{ y: -3, scale: 1.1 }}
                                  href={candidate.social_links.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-[#0077b5] transition-all duration-300"
                                  aria-label={t("candidateShowcase.accessibility.socialLink")}
                                >
                                  <FiLinkedin />
                                </motion.a>
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator with Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/10 z-50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#ffca40] to-[#e6b63a] shadow-lg shadow-[#ffca40]/50"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </section>
      )}

      {/* Filters Section with Glassmorphism */}
      <section className="sticky top-0 z-40 py-8 bg-white/70 backdrop-blur-xl border-b border-[#136094]/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search with Animation */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-full lg:w-96"
            >
              <Search
                placeholder={t("candidateShowcase.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                size="large"
                className="rounded-2xl shadow-lg"
                prefix={<FiSearch className="text-[#136094] text-lg" />}
                enterButton={
                  <Button 
                    type="primary" 
                    className="bg-gradient-to-r from-[#136094] to-[#008830] border-none"
                  >
                    {t("candidateShowcase.filters.search")}
                  </Button>
                }
              />
            </motion.div>

            {/* Filters with Icons */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <Select
                placeholder={
                  <span>
                    <FaMapMarkerAlt className="inline mr-2 text-[#136094]" />
                    {t("candidateShowcase.filterByRegion")}
                  </span>
                }
                value={filters.region}
                onChange={(value) => setFilters({ ...filters, region: value })}
                allowClear
                className="min-w-[200px] rounded-2xl"
                size="large"
                dropdownRender={(menu) => (
                  <div className="rounded-2xl shadow-xl">
                    {menu}
                  </div>
                )}
              >
                {getUniqueValues("region").map((region) => (
                  <Option key={region} value={region}>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#136094]" />
                      <span>{region}</span>
                    </div>
                  </Option>
                ))}
              </Select>

              <Select
                placeholder={
                  <span>
                    <span className="mr-2">🗳️</span>
                    {t("candidateShowcase.filterByElection")}
                  </span>
                }
                value={filters.electionType}
                onChange={(value) =>
                  setFilters({ ...filters, electionType: value })
                }
                allowClear
                className="min-w-[200px] rounded-2xl"
                size="large"
              >
                {getUniqueValues("election_type").map((type) => {
                  const election = getElectionIcon(type);
                  return (
                    <Option key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{election.icon}</span>
                        <span>{t(`candidateShowcase.badges.electionType.${type?.toLowerCase().replace(/\s+/g, '')}`, type)}</span>
                      </div>
                    </Option>
                  );
                })}
              </Select>

              <Select
                placeholder={
                  <span>
                    <FaFlag className="inline mr-2 text-[#008830]" />
                    {t("candidateShowcase.filterByParty")}
                  </span>
                }
                value={filters.party}
                onChange={(value) => setFilters({ ...filters, party: value })}
                allowClear
                className="min-w-[200px] rounded-2xl"
                size="large"
              >
                {getUniqueParties().map((party) => (
                  <Option key={party} value={party}>
                    <div className="flex items-center gap-2">
                      <FaFlag className="text-[#008830]" />
                      <span>{party}</span>
                    </div>
                  </Option>
                ))}
              </Select>

              {(searchTerm ||
                filters.region ||
                filters.electionType ||
                filters.party) && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-[#136094] to-[#008830] text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <FiCheckCircle />
                  {t("candidateShowcase.clearFilters")}
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Category Tabs with Count */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center mt-6"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-[#136094] to-[#008830] text-white shadow-xl scale-105"
                    : "bg-white text-gray-600 hover:bg-[#136094]/10 border-2 border-transparent hover:border-[#136094]/20"
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span>{category.name}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  activeCategory === category.id
                    ? "bg-white/20 text-white"
                    : "bg-[#136094]/10 text-[#136094]"
                }`}>
                  {category.count}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* View Mode Toggle */}
          <div className="flex justify-end mt-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-1 flex gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === "grid" 
                    ? "bg-gradient-to-r from-[#136094] to-[#008830] text-white" 
                    : "text-gray-600 hover:bg-[#136094]/10"
                }`}
              >
                {t("candidateShowcase.filters.grid")}
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === "list" 
                    ? "bg-gradient-to-r from-[#136094] to-[#008830] text-white" 
                    : "text-gray-600 hover:bg-[#136094]/10"
                }`}
              >
                {t("candidateShowcase.filters.list")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Candidates Grid/List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filteredCandidates.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-32"
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-gray-500 text-xl">
                      {t("candidateShowcase.noCandidates")}
                    </span>
                  }
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="mt-4 px-8 py-3 bg-gradient-to-r from-[#136094] to-[#008830] text-white rounded-xl font-semibold"
                  >
                    {t("candidateShowcase.clearFilters")}
                  </motion.button>
                </Empty>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "flex flex-col gap-6"
                }
              >
                {filteredCandidates.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                    onHoverStart={() => setHoveredCandidate(candidate.id)}
                    onHoverEnd={() => setHoveredCandidate(null)}
                    layout
                    className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    {/* Save Button */}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => toggleSaveCandidate(candidate, e)}
                      className="absolute top-4 left-4 z-20 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                      aria-label={savedCandidates.includes(candidate.id) ? t("candidateShowcase.tooltips.unsaveCandidate") : t("candidateShowcase.tooltips.saveCandidate")}
                    >
                      {savedCandidates.includes(candidate.id) ? (
                        <FaBookmark className="text-[#ffca40] text-xl" />
                      ) : (
                        <FaRegBookmark className="text-gray-600 text-xl" />
                      )}
                    </motion.button>

                    {/* Status Badge */}
                    <motion.div 
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute top-4 right-4 z-10"
                    >
                      <Tag
                        color={getStatusColor(candidate.status)}
                        className="px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm"
                      >
                        {getStatusText(candidate.status)}
                      </Tag>
                    </motion.div>

                    {/* Age Category Badge */}
                    <motion.div 
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-4 left-4 z-10"
                    >
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                        <span className={`
                          ${getAgeRange(candidate.age).color === "blue" ? "text-blue-500" : ""}
                          ${getAgeRange(candidate.age).color === "green" ? "text-green-500" : ""}
                          ${getAgeRange(candidate.age).color === "purple" ? "text-purple-500" : ""}
                        `}>
                          {getAgeRange(candidate.age).icon}
                        </span>
                        {getAgeRange(candidate.age).name}
                      </div>
                    </motion.div>

                    {/* Image Container */}
                    <div className={`relative ${viewMode === "list" ? "md:w-72 h-72" : "h-80"} overflow-hidden bg-gradient-to-br from-[#136094]/20 to-[#008830]/20`}>
                      {candidate.photo_url && !imageLoadError[candidate.id] ? (
                        <img
                          src={getFullImageUrl(candidate.photo_url)}
                          alt={t("candidateShowcase.accessibility.candidateImage")}
                          className="w-full h-full object-fill object-center group-hover:scale-110 transition-transform duration-700"
                          onError={() => handleImageError(candidate.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#136094] to-[#008830]">
                          <FaUser className="text-8xl text-white/30" />
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                      {/* Quick Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-bold mb-2">
                          {getLocalizedText(candidate.name)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <FaFlag className="text-[#ffca40]" />
                            <span>{getLocalizedText(candidate.party)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaBirthdayCake className="text-[#ffca40]" />
                            <span>{candidate.age} {t("candidateShowcase.details.years")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className={`p-6 bg-white ${viewMode === "list" ? "flex-1" : ""}`}>
                      {/* Name and Quick Stats */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#136094] mb-2">
                            {getLocalizedText(candidate.name)}
                          </h3>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-2xl">
                                {getElectionIcon(candidate.election_type).icon}
                              </span>
                              <span className="text-gray-600">
                                {t(`candidateShowcase.badges.electionType.${candidate.election_type?.toLowerCase().replace(/\s+/g, '')}`, candidate.election_type)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <FaMapMarkerAlt className="text-[#008830]" />
                              <span>{candidate.region}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Support Button */}
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleSupportCandidate(candidate, e)}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            supportedCandidates.includes(candidate.id)
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white"
                          }`}
                          aria-label={supportedCandidates.includes(candidate.id) ? t("candidateShowcase.tooltips.unsupportCandidate") : t("candidateShowcase.tooltips.supportCandidate")}
                        >
                          {supportedCandidates.includes(candidate.id) ? (
                            <FaHeart />
                          ) : (
                            <FiHeart />
                          )}
                        </motion.button>
                      </div>

                      {/* Bio Preview */}
                      <div className="mb-4">
                        <p className="text-gray-600 line-clamp-2">
                          {expandedBio[candidate.id]
                            ? getLocalizedText(candidate.bio)
                            : `${getLocalizedText(candidate.bio).substring(0, 100)}...`}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBio(candidate.id);
                          }}
                          className="text-[#136094] text-sm font-semibold hover:text-[#008830] transition-colors mt-1"
                        >
                          {expandedBio[candidate.id]
                            ? t("candidateShowcase.showLess")
                            : t("candidateShowcase.readMore")}
                        </button>
                      </div>

                      {/* Policies Tags with Animation */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {candidate.policies
                            ?.slice(0, 3)
                            .map((policy, idx) => (
                              <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05, backgroundColor: "#136094", color: "white" }}
                                className="px-3 py-1 bg-[#136094]/10 text-[#136094] rounded-full text-sm cursor-default"
                              >
                                {policy.length > 15
                                  ? `${policy.substring(0, 15)}...`
                                  : policy}
                              </motion.div>
                            ))}
                          {candidate.policies?.length > 3 && (
                            <Tag
                              color="default"
                              className="px-3 py-1 rounded-full"
                            >
                              +{candidate.policies.length - 3}
                            </Tag>
                          )}
                        </div>
                      </div>

                      {/* Social Links with Animation */}
                      {candidate.social_links &&
                        Object.values(candidate.social_links).some(Boolean) && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3 pt-4 border-t border-gray-100"
                          >
                            {candidate.social_links.facebook && (
                              <motion.a
                                whileHover={{ y: -3, scale: 1.1 }}
                                href={candidate.social_links.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-10 h-10 rounded-xl bg-[#136094]/10 flex items-center justify-center hover:bg-[#136094] hover:text-white transition-all duration-300"
                                aria-label={t("candidateShowcase.accessibility.socialLink")}
                              >
                                <FiFacebook />
                              </motion.a>
                            )}
                            {candidate.social_links.twitter && (
                              <motion.a
                                whileHover={{ y: -3, scale: 1.1 }}
                                href={candidate.social_links.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-10 h-10 rounded-xl bg-[#008830]/10 flex items-center justify-center hover:bg-[#008830] hover:text-white transition-all duration-300"
                                aria-label={t("candidateShowcase.accessibility.socialLink")}
                              >
                                <FiTwitter />
                              </motion.a>
                            )}
                            {candidate.social_links.instagram && (
                              <motion.a
                                whileHover={{ y: -3, scale: 1.1 }}
                                href={candidate.social_links.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#ffca40]/20 to-[#ffca40]/10 flex items-center justify-center hover:from-[#ffca40] hover:to-[#e6b63a] hover:text-white transition-all duration-300"
                                aria-label={t("candidateShowcase.accessibility.socialLink")}
                              >
                                <FiInstagram />
                              </motion.a>
                            )}
                            {candidate.social_links.linkedin && (
                              <motion.a
                                whileHover={{ y: -3, scale: 1.1 }}
                                href={candidate.social_links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-10 h-10 rounded-xl bg-[#136094]/10 flex items-center justify-center hover:bg-[#136094] hover:text-white transition-all duration-300"
                                aria-label={t("candidateShowcase.accessibility.socialLink")}
                              >
                                <FiLinkedin />
                              </motion.a>
                            )}
                          </motion.div>
                        )}
                    </div>

                    {/* Hover Overlay with Quick View */}
                    <AnimatePresence>
                      {hoveredCandidate === candidate.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-t from-[#136094]/95 via-[#136094]/70 to-transparent flex items-end justify-center p-8"
                        >
                          <motion.button
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            exit={{ y: 50 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowQuickView(candidate);
                            }}
                            className="bg-white text-[#136094] px-8 py-4 rounded-xl font-bold shadow-xl flex items-center gap-2"
                            aria-label={t("candidateShowcase.tooltips.quickView")}
                          >
                            <FiEye size={20} />
                            {t("candidateShowcase.quickView")}
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowQuickView(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 bg-gradient-to-r from-[#136094] to-[#008830]">
                {showQuickView.photo_url && !imageLoadError[showQuickView.id] ? (
                  <img
                    src={getFullImageUrl(showQuickView.photo_url)}
                    alt={t("candidateShowcase.accessibility.candidateImage")}
                    className="w-full h-full object-fill"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="text-8xl text-white/30" />
                  </div>
                )}
                
                <button
                  onClick={() => setShowQuickView(null)}
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  aria-label={t("candidateShowcase.accessibility.closeModal")}
                >
                  ✕
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {getLocalizedText(showQuickView.name)}
                  </h3>
                  <div className="flex gap-4 text-white/80">
                    <span className="flex items-center gap-1">
                      <FaFlag className="text-[#ffca40]" />
                      {getLocalizedText(showQuickView.party)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-[#ffca40]" />
                      {showQuickView.region}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  {getLocalizedText(showQuickView.bio)}
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCandidate(showQuickView);
                      setShowQuickView(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#136094] to-[#008830] text-white rounded-xl font-semibold"
                  >
                    {t("candidateShowcase.viewFullProfile")}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => toggleSupportCandidate(showQuickView, e)}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      supportedCandidates.includes(showQuickView.id)
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {supportedCandidates.includes(showQuickView.id) ? (
                      <>
                        <FaHeart /> {t("candidateShowcase.actions.supported")}
                      </>
                    ) : (
                      <>
                        <FiHeart /> {t("candidateShowcase.actions.support")}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candidate Detail Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCandidate(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-96 bg-gradient-to-br from-[#136094] to-[#008830]">
                {selectedCandidate.photo_url && !imageLoadError[selectedCandidate.id] ? (
                  <img
                    src={getFullImageUrl(selectedCandidate.photo_url)}
                    alt={t("candidateShowcase.accessibility.candidateImage")}
                    className="w-full h-full object-fill"
                    onError={() => handleImageError(selectedCandidate.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="text-9xl text-white/30" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  aria-label={t("candidateShowcase.accessibility.closeModal")}
                >
                  ✕
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-5xl font-bold mb-3">
                    {getLocalizedText(selectedCandidate.name)}
                  </h2>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <FaFlag className="text-[#ffca40]" />
                      <span className="text-xl">
                        {getLocalizedText(selectedCandidate.party)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBirthdayCake className="text-[#ffca40]" />
                      <span className="text-xl">
                        {selectedCandidate.age} {t("candidateShowcase.yearsOld")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#ffca40]" />
                      <span className="text-xl">
                        {selectedCandidate.region}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {/* Status and Election Type */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <Tag
                    color={getStatusColor(selectedCandidate.status)}
                    className="px-6 py-2 rounded-full text-base font-semibold"
                  >
                    {getStatusText(selectedCandidate.status)}
                  </Tag>
                  <Tag
                    color="purple"
                    className="px-6 py-2 rounded-full text-base font-semibold"
                  >
                    <span className="mr-2">
                      {getElectionIcon(selectedCandidate.election_type).icon}
                    </span>
                    {t(`candidateShowcase.badges.electionType.${selectedCandidate.election_type?.toLowerCase().replace(/\s+/g, '')}`, selectedCandidate.election_type)}
                  </Tag>
                  <Tag
                    color={getAgeRange(selectedCandidate.age).color}
                    className="px-6 py-2 rounded-full text-base font-semibold"
                  >
                    <span className="mr-2">
                      {getAgeRange(selectedCandidate.age).icon}
                    </span>
                    {getAgeRange(selectedCandidate.age).name}
                  </Tag>
                </div>

                {/* Biography */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#136094] mb-4 flex items-center gap-2">
                    <MdOutlinePsychology className="text-[#ffca40] text-3xl" />
                    {t("candidateShowcase.biography")}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                    {getLocalizedText(selectedCandidate.bio)}
                  </p>
                </div>

                {/* Policies */}
                {selectedCandidate.policies &&
                  selectedCandidate.policies.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#136094] mb-4 flex items-center gap-2">
                        <MdOutlineCampaign className="text-[#ffca40] text-3xl" />
                        {t("candidateShowcase.keyPolicies")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCandidate.policies.map((policy, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#136094]/5 to-transparent rounded-xl border border-[#136094]/10"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#ffca40] flex items-center justify-center flex-shrink-0">
                              <FaStar className="text-[#136094]" />
                            </div>
                            <p className="text-gray-700">{policy}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Experience Timeline (if available) */}
                {selectedCandidate.experience && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#136094] mb-4 flex items-center gap-2">
                      <FiAward className="text-[#ffca40] text-3xl" />
                      {t("candidateShowcase.experience")}
                    </h3>
                    <div className="space-y-4">
                      {selectedCandidate.experience.map((exp, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#136094] flex items-center justify-center text-white font-bold">
                            {exp.year}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#136094]">{exp.position}</h4>
                            <p className="text-gray-600">{exp.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {selectedCandidate.social_links &&
                  Object.values(selectedCandidate.social_links).some(
                    Boolean,
                  ) && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#136094] mb-4">
                        {t("candidateShowcase.connect")}
                      </h3>
                      <div className="flex gap-4">
                        {selectedCandidate.social_links.facebook && (
                          <motion.a
                            whileHover={{ y: -5, scale: 1.1 }}
                            href={selectedCandidate.social_links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-2xl bg-[#1877f2] text-white flex items-center justify-center hover:shadow-xl transition-all duration-300"
                            aria-label={t("candidateShowcase.accessibility.socialLink")}
                          >
                            <FiFacebook size={24} />
                          </motion.a>
                        )}
                        {selectedCandidate.social_links.twitter && (
                          <motion.a
                            whileHover={{ y: -5, scale: 1.1 }}
                            href={selectedCandidate.social_links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-2xl bg-[#1da1f2] text-white flex items-center justify-center hover:shadow-xl transition-all duration-300"
                            aria-label={t("candidateShowcase.accessibility.socialLink")}
                          >
                            <FiTwitter size={24} />
                          </motion.a>
                        )}
                        {selectedCandidate.social_links.instagram && (
                          <motion.a
                            whileHover={{ y: -5, scale: 1.1 }}
                            href={selectedCandidate.social_links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white flex items-center justify-center hover:shadow-xl transition-all duration-300"
                            aria-label={t("candidateShowcase.accessibility.socialLink")}
                          >
                            <FiInstagram size={24} />
                          </motion.a>
                        )}
                        {selectedCandidate.social_links.linkedin && (
                          <motion.a
                            whileHover={{ y: -5, scale: 1.1 }}
                            href={selectedCandidate.social_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-2xl bg-[#0077b5] text-white flex items-center justify-center hover:shadow-xl transition-all duration-300"
                            aria-label={t("candidateShowcase.accessibility.socialLink")}
                          >
                            <FiLinkedin size={24} />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => toggleSupportCandidate(selectedCandidate, e)}
                    className={`flex-1 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      supportedCandidates.includes(selectedCandidate.id)
                        ? "bg-red-500 text-white"
                        : "bg-gradient-to-r from-[#136094] to-[#008830] text-white"
                    }`}
                  >
                    {supportedCandidates.includes(selectedCandidate.id) ? (
                      <>
                        <FaHeart />
                        {t("candidateShowcase.actions.supported")}
                      </>
                    ) : (
                      <>
                        <FiThumbsUp />
                        {t("candidateShowcase.actions.support")}
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-4 border-2 border-[#136094] text-[#136094] rounded-xl font-bold hover:bg-[#136094] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle />
                    {t("candidateShowcase.actions.message")}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:border-[#ffca40] hover:text-[#ffca40] transition-all duration-300 flex items-center justify-center"
                  >
                    <FiShare2 />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CandidateShowcase;