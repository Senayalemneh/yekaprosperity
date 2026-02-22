import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../utils/getApiUrl";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import Header from "./Header";
import { Image, Button, Tag, Typography, Modal, Row, Col, Divider, message } from "antd";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  FolderOutlined,
  FullscreenOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Paragraph, Text } = Typography;

const DetailedGallery = () => {
  const apiUrl = getApiUrl();
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [galleryItem, setGalleryItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const fetchGalleryItem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}api/add-gallery/${id}`);

        if (response.data && response.data.success && response.data.data) {
          const item = response.data.data;

          // Process images array
          const processedImages = [];
          if (item.images && Array.isArray(item.images)) {
            item.images.forEach((image) => {
              if (
                typeof image === "object" &&
                image.response &&
                image.response.path
              ) {
                processedImages.push(image.response.path);
              } else if (typeof image === "string") {
                processedImages.push(image);
              }
            });
          }

          setGalleryItem({
            ...item,
            images: processedImages.map((image) => {
              let formattedImage = image.replace(/\\/g, "/");
              formattedImage = formattedImage.replace(/([^:]\/)\/+/g, "$1");
              if (formattedImage.startsWith("/")) {
                formattedImage = formattedImage.substring(1);
              }
              return formattedImage;
            }),
            title:
              typeof item.title === "object"
                ? item.title[i18n.language] ||
                  item.title.en ||
                  t("gallerydes.untitled")
                : item.title || t("gallerydes.untitled"),
            description:
              typeof item.description === "object"
                ? item.description[i18n.language] || item.description.en || ""
                : item.description || "",
            category: item.category || t("gallerydes.general"),
          });
        } else {
          throw new Error(t("gallerydes.invalidData"));
        }
      } catch (error) {
        console.error("Error fetching gallery item:", error);
        setError(t("gallerydes.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItem();
  }, [id, apiUrl, i18n.language, t]);

  const showModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const navigateImages = (direction) => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? galleryItem.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === galleryItem.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalVisible) return;

      if (e.key === "ArrowLeft") {
        navigateImages("prev");
      } else if (e.key === "ArrowRight") {
        navigateImages("next");
      } else if (e.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalVisible, galleryItem]);

  const downloadImage = () => {
    if (galleryItem && galleryItem.images[currentImageIndex]) {
      const imageUrl = `${apiUrl}uploads/${galleryItem.images[currentImageIndex]}`;
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `gallery-image-${currentImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareImage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: galleryItem.title,
          text: galleryItem.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      message.success(t("gallerydes.linkCopied"));
    }
  };

  const formattedDate = galleryItem
    ? new Date(galleryItem.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#136094] to-[#0f4a7a] p-4">
        <Header />
        <div className="max-w-4xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-[#ffca40] mb-6">
              {t("gallerydes.error")}
            </h2>
            <p className="text-xl text-white mb-8">{error}</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/gallery")}
                type="primary"
                icon={<ArrowLeftOutlined />}
                size="large"
                className="bg-[#ffca40] hover:bg-[#e6b63a] border-none text-[#136094] font-bold h-12 px-6"
              >
                {t("gallerydes.backToGallery")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );

  if (!galleryItem)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#136094] to-[#0f4a7a] p-4">
        <Header />
        <div className="max-w-4xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              {t("gallerydes.noData")}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {t("gallerydes.itemNotFound")}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/gallery")}
                type="primary"
                icon={<ArrowLeftOutlined />}
                size="large"
                className="bg-[#ffca40] hover:bg-[#e6b63a] border-none text-[#136094] font-bold h-12 px-6"
              >
                {t("gallerydes.backToGallery")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#136094]/10 to-[#008830]/5">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#008830]/10 rounded-full blur-3xl"></div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={() => navigate("/gallery")}
            type="text"
            icon={<ArrowLeftOutlined />}
            className="mb-6 text-[#136094] hover:text-[#0f4a7a] font-semibold text-lg group"
          >
            <span className="group-hover:underline transition-all">
              {t("gallerydes.backToGallery")}
            </span>
          </Button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#136094]/20"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 p-0">
              <motion.div
                className="relative w-full h-96 lg:h-full cursor-pointer group"
                onClick={() => showModal(0)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {galleryItem.images && galleryItem.images.length > 0 ? (
                  <>
                    <Image
                      alt={t("gallerydes.imageAlt")}
                      src={`${apiUrl}uploads/${galleryItem.images[0]}`}
                      className="w-full h-full object-fill"
                      preview={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-[#ffca40] text-[#136094] rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <FullscreenOutlined className="text-xl font-bold" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#136094]/10 to-[#008830]/10 flex items-center justify-center">
                    <span className="text-[#136094] text-lg">
                      {t("gallerydes.noImage")}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Details Section */}
            <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col">
              <div className="flex-grow">
                <Title
                  level={1}
                  className="text-4xl font-bold text-[#136094] mb-6"
                >
                  {galleryItem.title}
                </Title>

                <div className="flex items-center gap-4 mb-8">
                  <Tag
                    icon={<FolderOutlined />}
                    className="text-sm bg-[#136094] text-white border-none px-4 py-1 rounded-full font-semibold"
                  >
                    {galleryItem.category}
                  </Tag>
                  <Tag
                    icon={<CalendarOutlined />}
                    className="text-sm bg-[#008830] text-white border-none px-4 py-1 rounded-full font-semibold"
                  >
                    {formattedDate}
                  </Tag>
                </div>

                <Paragraph className="text-gray-700 text-lg leading-relaxed mb-8">
                  {galleryItem.description}
                </Paragraph>
              </div>

              <Divider className="border-[#136094]/20" />

              <div className="mt-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/gallery")}
                    className="w-full bg-[#ffca40] hover:bg-[#e6b63a] border-none text-[#136094] font-bold h-12 text-lg"
                  >
                    {t("gallerydes.backToGallery")}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Thumbnail Grid */}
        {galleryItem.images && galleryItem.images.length > 1 && (
          <motion.div
            className="mt-12"
            data-aos="fade-up"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Title level={3} className="text-2xl font-bold text-[#136094] mb-8">
              {t("gallerydes.moreImages")}
            </Title>
            <Row gutter={[16, 16]}>
              {galleryItem.images.slice(1).map((image, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <motion.div
                    className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer h-48"
                    onClick={() => showModal(index + 1)}
                    whileHover={{ y: -5, scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      alt={`${t("gallerydes.galleryImage")} ${index + 2}`}
                      src={`${apiUrl}uploads/${image}`}
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#136094]/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-[#ffca40] text-[#136094] rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <FullscreenOutlined className="text-xl font-bold" />
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}
      </div>

      {/* Enhanced Fullscreen Image Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="100vw"
        style={{
          maxWidth: "100vw",
          margin: 0,
          padding: 0,
          top: 0,
          height: "100vh",
        }}
        bodyStyle={{
          padding: 0,
          margin: 0,
          height: "100vh",
          background:
            "linear-gradient(135deg, #136094 0%, #0f4a7a 50%, #008830 100%)",
        }}
        className="fullscreen-modal"
        closeIcon={
          <div className="bg-[#ffca40] text-[#136094] rounded-full p-3 hover:bg-[#e6b63a] transition-colors shadow-2xl">
            <CloseOutlined className="text-xl font-bold" />
          </div>
        }
        style={{
          top: 0,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Navigation Arrows - Enhanced */}
              {galleryItem.images.length > 1 && (
                <>
                  <motion.div
                    className="absolute left-4 z-20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      type="text"
                      icon={<LeftOutlined className="text-white text-2xl" />}
                      className="bg-[#ffca40] text-[#136094] h-16 w-16 rounded-full flex items-center justify-center border-none hover:bg-[#e6b63a] shadow-2xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImages("prev");
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className="absolute right-4 z-20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      type="text"
                      icon={<RightOutlined className="text-white text-2xl" />}
                      className="bg-[#ffca40] text-[#136094] h-16 w-16 rounded-full flex items-center justify-center border-none hover:bg-[#e6b63a] shadow-2xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImages("next");
                      }}
                    />
                  </motion.div>
                </>
              )}

              {/* Current Image with Click Navigation */}
              <motion.div
                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const width = rect.width;

                  if (clickX < width / 2) {
                    navigateImages("prev");
                  } else {
                    navigateImages("next");
                  }
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  alt={t("gallerydes.fullscreenView")}
                  src={`${apiUrl}uploads/${galleryItem.images[currentImageIndex]}`}
                  className="max-w-full max-h-full object-contain select-none"
                  preview={false}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </motion.div>

              {/* Action Buttons */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
                {/* Image Counter */}
                <div className="bg-[#ffca40] text-[#136094] px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-4">
                  <span className="text-lg">
                    {currentImageIndex + 1} / {galleryItem.images.length}
                  </span>

                  {/* Download Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      type="text"
                      icon={<DownloadOutlined className="text-[#136094]" />}
                      className="h-10 w-10 rounded-full bg-transparent hover:bg-[#e6b63a] border-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage();
                      }}
                    />
                  </motion.div>

                  {/* Share Button */}
                  {navigator.share && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        type="text"
                        icon={<ShareAltOutlined className="text-[#136094]" />}
                        className="h-10 w-10 rounded-full bg-transparent hover:bg-[#e6b63a] border-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareImage();
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {galleryItem.images.length > 1 && (
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="flex gap-2 bg-black/30 backdrop-blur-lg rounded-2xl p-4">
                    {galleryItem.images.map((image, index) => (
                      <motion.div
                        key={index}
                        className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                          index === currentImageIndex
                            ? "border-[#ffca40]"
                            : "border-transparent"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                      >
                        <Image
                          src={`${apiUrl}uploads/${image}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          preview={false}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Modal>
    </div>
  );
};

export default DetailedGallery;
