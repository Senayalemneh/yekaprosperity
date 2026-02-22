import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiPlay,
  FiPause,
  FiMaximize,
  FiMinimize,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "../../utils/getApiUrl";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Button, Tooltip, Progress, Badge } from "antd";

const SuperAmazingCarousel = () => {
  const { t, i18n } = useTranslation();
  const apiUrl = getApiUrl();
  const [carouselItems, setCarouselItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState({});

  // Brand colors
  const BRAND_COLORS = {
    primary: "#136094",
    secondary: "#008830",
    accent: "#ffca40",
  };

  // Mobile detection
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}items`);
        setCarouselItems(response.data);
      } catch (error) {
        console.error("Error fetching carousel data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCarouselData();
  }, [apiUrl]);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Progress bar for 2 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 100 / 100));
    }, 20);
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  const getLocalizedText = useCallback(
    (item, field) => {
      if (!item) return "";
      const jsonField = `${field}_json`;
      if (item[jsonField] && typeof item[jsonField] === "object") {
        return (
          item[jsonField][currentLanguage] ||
          item[jsonField].en ||
          item[field] ||
          ""
        );
      }
      return item[field] || "";
    },
    [currentLanguage]
  );

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

  const handleImageError = (itemId) => {
    setImageLoadError((prev) => ({ ...prev, [itemId]: true }));
  };

  // Arrow buttons
  const ArrowButton = ({ onClick, direction }) => {
    const Icon = direction === "next" ? FiChevronRight : FiChevronLeft;
    return (
      <motion.button
        whileHover={{ scale: 1.2, backgroundColor: BRAND_COLORS.primary }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`absolute top-1/2 z-40 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white backdrop-blur-lg border border-white/30 shadow-lg ${
          direction === "next" ? "right-4" : "left-4"
        } ${isMobile ? "scale-75" : ""}`}
      >
        <Icon size={isMobile ? 18 : 24} />
      </motion.button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: isPlaying,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    fade: true,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    nextArrow: <ArrowButton direction="next" />,
    prevArrow: <ArrowButton direction="prev" />,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
      setProgress(0);
    },
    appendDots: (dots) => (
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <motion.ul className="flex gap-2 backdrop-blur-lg bg-white/20 rounded-full px-4 py-2 border border-white/30">
          {dots}
        </motion.ul>
      </div>
    ),
    customPaging: (i) => (
      <motion.div
        whileHover={{ scale: 1.5 }}
        whileTap={{ scale: 0.8 }}
        className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${
          i === currentSlide
            ? `bg-[${BRAND_COLORS.accent}]`
            : "bg-white/50 hover:bg-white/80"
        }`}
      />
    ),
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#136094]/10 to-[#008830]/10 ${
          isMobile ? "h-[50vh]" : "h-screen"
        }`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#136094]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${
        isMobile ? "h-[70vh]" : "h-80vh"
      } overflow-hidden bg-gradient-to-br from-[#136094]/5 to-[#008830]/5 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-40 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
        {/* Controls */}
        <motion.div className="flex items-center gap-3 backdrop-blur-lg bg-white/20 rounded-xl px-4 py-2 border border-white/30 shadow-lg">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlayPause}
            className="p-1 rounded text-white hover:text-[#ffca40] transition-colors"
          >
            {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
          </motion.button>

          <div className="w-24">
            <Progress
              percent={progress}
              showInfo={false}
              strokeColor={BRAND_COLORS.accent}
              trailColor="rgba(255,255,255,0.3)"
              strokeWidth={4}
            />
          </div>

          <span className="text-white text-sm min-w-[40px] text-center font-medium">
            {currentSlide + 1}/{carouselItems.length}
          </span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className="p-1 rounded text-white hover:text-[#ffca40] transition-colors"
          >
            {isFullscreen ? <FiMinimize size={16} /> : <FiMaximize size={16} />}
          </motion.button>
        </motion.div>
      </div>

      <Slider {...settings}>
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`relative w-full ${isMobile ? "h-[70vh]" : "h-screen"}`}
          >
            {/* Background with Amazing Transition */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {imageLoadError[item.id] ? (
                <div className="w-full h-full bg-gradient-to-br from-[#136094] to-[#008830] flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">📷</div>
                    <p>Image not available</p>
                  </div>
                </div>
              ) : (
                <motion.img
                  src={`${apiUrl}uploads/${item.image}`}
                  alt={getLocalizedText(item, "title")}
                  className="w-full h-full object-fill"
                  onError={() => handleImageError(item.id)}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 8, ease: "easeOut" }}
                />
              )}

              {/* Light Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="absolute bottom-20 z-30 flex items-center justify-center px-4 md:px-8">
              <div className="text-center max-w-4xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${item.id}-${currentLanguage}`}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-4 md:space-y-6"
                  >
                    {/* Category */}
                    {item.category && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Badge.Ribbon
                          text={getLocalizedText(item, "category")}
                          color={BRAND_COLORS.primary}
                          className="text-sm font-bold"
                        >
                          <div className="opacity-0">-</div>
                        </Badge.Ribbon>
                      </motion.div>
                    )}

                    {/* Title */}
                    <motion.h2
                      className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                      style={{
                        textShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {getLocalizedText(item, "title")}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                      className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed"
                      style={{
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      {getLocalizedText(item, "description")}
                    </motion.p>

                    {/* Action Button */}
                    {item.buttonText && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="primary"
                            size="large"
                            shape="round"
                            className="bg-gradient-to-r from-[#136094] to-[#008830] hover:from-[#0f4a7a] hover:to-[#007a2a] border-0 h-12 px-8 text-lg font-bold flex items-center gap-3 shadow-xl"
                          >
                            {getLocalizedText(item, "buttonText")}
                            <FiArrowRight size={20} />
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    y: [null, -100, -200],
                    x: [null, (Math.random() - 0.5) * 50],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </Slider>

      {/* Subtle Corner Accents */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/40" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/40" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40" />
    </div>
  );
};

export default SuperAmazingCarousel;
