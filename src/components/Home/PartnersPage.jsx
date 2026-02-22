import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Tag, Spin, Typography, ConfigProvider, Button, Tooltip } from "antd";
import {
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../../utils/getApiUrl";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text } = Typography;

const PartnersShowcase = () => {
  const API_URL = getApiUrl();
  const { t, i18n } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    const fetchPartners = async () => {
      try {
        const res = await axios.get(`${API_URL}api/partners?status=published`);
        setPartners(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch partners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: partners.length >= 5 ? 5 : partners.length,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: partners.length >= 4 ? 4 : partners.length,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: partners.length >= 3 ? 3 : partners.length,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: partners.length >= 2 ? 2 : partners.length,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#136094",
          borderRadius: 12,
        },
      }}
    >
      <div className="partners-showcase py-20 bg-gradient-to-b from-[#136094]/5 to-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#008830]/10 rounded-full blur-3xl"></div>
        </div>

        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          data-aos="fade-up"
        >
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#ffca40] text-[#136094] rounded-full text-sm font-bold tracking-wide uppercase mb-4 shadow-lg">
              {t("partners.collaboration")}
            </span>
            <Title
              level={2}
              className="text-4xl md:text-5xl font-bold text-[#136094] mb-4"
            >
              {t("partners.ourPartners")}
            </Title>
            <Text className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("partners.message")}
            </Text>
          </div>

          {partners.length > 0 ? (
            <div className="relative">
              <Slider ref={sliderRef} {...settings}>
                {partners.map((partner) => (
                  <div key={partner.id} className="px-3 h-full">
                    <PartnerCard
                      partner={partner}
                      currentLanguage={i18n.language}
                    />
                  </div>
                ))}
              </Slider>

              {/* Custom Navigation Buttons */}
              <div className="flex justify-center mt-12 space-x-4">
                <button
                  onClick={() => sliderRef.current.slickPrev()}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#136094] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#0f4a7a] hover:scale-110 active:scale-95 group"
                >
                  <FiChevronLeft
                    size={20}
                    className="group-hover:-translate-x-0.5 transition-transform"
                  />
                </button>
                <button
                  onClick={() => sliderRef.current.slickNext()}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#136094] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#0f4a7a] hover:scale-110 active:scale-95 group"
                >
                  <FiChevronRight
                    size={20}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-r from-[#136094]/10 to-[#008830]/10 rounded-2xl border border-[#136094]/20">
              <MdOutlineImageNotSupported className="mx-auto text-6xl text-[#136094]/50 mb-4" />
              <Text className="text-[#136094] text-lg font-medium">
                {t("partners.empty")}
              </Text>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

const PartnerCard = ({ partner, currentLanguage }) => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_URL}uploads/${path}`;
  };

  const getLocalized = (field) => {
    return (
      partner[field]?.[currentLanguage] ||
      partner[field]?.en ||
      t(`partners.default.${field}`)
    );
  };

  return (
    <div
      data-aos="zoom-in"
      data-aos-delay={Math.random() * 300}
      className="h-full"
    >
      <div
        className="rounded-2xl h-full flex flex-col border-2 border-[#136094]/10 hover:border-[#ffca40] transition-all duration-500 group overflow-hidden shadow-lg hover:shadow-2xl bg-white hover:scale-105"
        style={{ minHeight: "400px" }}
      >
        {/* Logo container with gradient background */}
        <div
          className="relative flex items-center justify-center p-8 bg-gradient-to-br from-[#136094]/5 to-[#008830]/5 group-hover:from-[#ffca40]/10 group-hover:to-[#136094]/10 transition-all duration-500"
          style={{ height: "250px" }}
        >
          {partner.featured && (
            <Tooltip title={t("partners.featured")} placement="top">
              <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-[#ffca40] to-[#ffb400] text-[#136094] p-2 rounded-full shadow-lg">
                <FiStar className="text-lg" />
              </div>
            </Tooltip>
          )}

          {partner.logo ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={getFullImageUrl(partner.logo)}
                alt={getLocalized("name")}
                className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                style={{ maxHeight: "140px", maxWidth: "180px" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              {/* Fallback container - hidden by default */}
              <div className="hidden flex-col items-center justify-center text-[#136094]/50 h-full">
                <MdOutlineImageNotSupported className="text-4xl mb-2" />
                <Text className="text-xs">{getLocalized("name")}</Text>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-[#136094]/50 h-full">
              <MdOutlineImageNotSupported className="text-4xl mb-3" />
              <Text className="text-sm text-center">
                {t("partners.noLogo")}
              </Text>
            </div>
          )}
        </div>

        {/* Info section with solid color background */}
        <div
          className="p-6 bg-gradient-to-r from-[#136094] to-[#0f4a7a] text-white flex flex-col flex-grow"
          style={{ height: "150px" }}
        >
          <Title
            level={4}
            className="mb-3 font-bold text-center text-white group-hover:text-[#ffca40] transition-colors duration-300"
          >
            <span className="text-white">{getLocalized("name")}</span>
          </Title>

          <div className="flex-grow overflow-hidden mb-3">
            {partner.description && (
              <Text className="text-blue-100 text-sm text-center line-clamp-2 leading-relaxed">
                {getLocalized("description")}
              </Text>
            )}
          </div>

          {partner.website && (
            <div className="flex justify-center mt-auto">
              <a
                href={
                  partner.website.startsWith("http")
                    ? partner.website
                    : `https://${partner.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-semibold text-white hover:text-[#ffca40] transition-all duration-300 border-b-2 border-transparent hover:border-[#ffca40] pb-1 group/link"
              >
                <FiExternalLink className="mr-2 group-hover/link:translate-x-1 transition-transform" />
                {t("partners.visitSite")}
              </a>
            </div>
          )}
        </div>

        {/* Hover effect border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#ffca40] transition-all duration-500 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default PartnersShowcase;
