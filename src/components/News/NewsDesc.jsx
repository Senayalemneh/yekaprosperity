import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getApiUrl } from "../../utils/getApiUrl";
import { AnimatePresence } from "framer-motion";

import {
  Button,
  Tag,
  Dropdown,
  Image,
  Avatar,
  message,
  Tooltip,
  Skeleton,
  Card,
  Typography,
  Row,
  Col,
  Space,
  Breadcrumb,
  Modal,
  Input,
} from "antd";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
  FaChevronDown,
  FaShareAlt,
  FaRegBookmark,
  FaBookmark,
  FaHeart,
  FaRegHeart,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaLink,
  FaClock,
  FaEye,
  FaArrowRight,
  FaExpand,
} from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";

const { Title, Text, Paragraph } = Typography;

const NewsDetail = () => {
  const apiUrl = getApiUrl();
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(342);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [activeShare, setActiveShare] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);

  const getLocalizedContent = useCallback(
    (content) => {
      return content?.[language] || content?.en || "";
    },
    [language]
  );

  // Function to safely parse additional images
  const parseAdditionalImages = useCallback((newsData) => {
    let images = [];

    // First, check if additionalImages array exists and is valid
    if (newsData.additionalImages && Array.isArray(newsData.additionalImages)) {
      images = newsData.additionalImages;
    }
    // If not, try to parse additional_images
    else if (newsData.additional_images) {
      try {
        if (typeof newsData.additional_images === "string") {
          images = JSON.parse(newsData.additional_images);
        } else if (Array.isArray(newsData.additional_images)) {
          images = newsData.additional_images;
        }
      } catch (parseError) {
        console.error("Error parsing additional_images:", parseError);
        images = [];
      }
    }

    return images;
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    i18n.on("languageChanged", (lng) => setLanguage(lng));

    const fetchNewsItem = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/news/${id}`);
        const newsData = response.data.data;

        // Parse additional images safely
        const parsedImages = parseAdditionalImages(newsData);

        setNewsItem(newsData);
        setAdditionalImages(parsedImages);
        setLikeCount(newsData.likes || 0);
      } catch (error) {
        console.error("Error fetching news item:", error);
        setError(t("newsdetail.fetchError"));
      }
    };

    const fetchRelatedNews = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/news`);
        const filteredNews = response.data.data
          .filter((item) => item.id !== id)
          .slice(0, 3);
        setRelatedNews(filteredNews);
      } catch (error) {
        console.error("Error fetching related news:", error);
      }
    };

    const fetchBookmarkStatus = async () => {
      const bookmarks = JSON.parse(localStorage.getItem("newsBookmarks")) || [];
      setIsBookmarked(bookmarks.includes(id));
    };

    const fetchLikeStatus = async () => {
      const likedPosts = JSON.parse(localStorage.getItem("likedNews")) || [];
      setIsLiked(likedPosts.includes(id));
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchNewsItem(),
        fetchRelatedNews(),
        fetchBookmarkStatus(),
        fetchLikeStatus(),
      ]);
      setLoading(false);
    };

    fetchData();

    return () => {
      i18n.off("languageChanged", (lng) => setLanguage(lng));
    };
  }, [id, apiUrl, i18n, t, parseAdditionalImages]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString(
      language === "am" ? "en-GB" : "en-US",
      options
    );
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("newsBookmarks")) || [];
    let updatedBookmarks;

    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((bookmarkId) => bookmarkId !== id);
      message.success(t("newsdetail.bookmarkRemoved"));
    } else {
      updatedBookmarks = [...bookmarks, id];
      message.success(t("newsdetail.bookmarkAdded"));
    }

    localStorage.setItem("newsBookmarks", JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const toggleLike = () => {
    const likedPosts = JSON.parse(localStorage.getItem("likedNews")) || [];
    let updatedLikes;

    if (isLiked) {
      updatedLikes = likedPosts.filter((postId) => postId !== id);
      setLikeCount((prev) => prev - 1);
      message.success(t("newsdetail.likeRemoved"));
    } else {
      updatedLikes = [...likedPosts, id];
      setLikeCount((prev) => prev + 1);
      message.success(t("newsdetail.likeAdded"));
    }

    localStorage.setItem("likedNews", JSON.stringify(updatedLikes));
    setIsLiked(!isLiked);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success(t("newsdetail.linkCopied"));
    setActiveShare(false);
  };

  const toggleShare = () => {
    setActiveShare(!activeShare);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton.Button active size="large" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton.Image active className="w-full h-96 rounded-xl" />
              <div className="mt-6 space-y-4">
                <Skeleton active paragraph={{ rows: 4 }} />
                <Skeleton active paragraph={{ rows: 6 }} />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton active paragraph={{ rows: 2 }} />
              <Skeleton active paragraph={{ rows: 4 }} />
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <Button
            type="primary"
            size="large"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            {t("newsdetail.retryButton")}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            {t("newsdetail.noNewsFound")}
          </h2>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/")}
            className="mt-4"
          >
            {t("newsdetail.backToHome")}
          </Button>
        </motion.div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const title = getLocalizedContent(newsItem.title);
  const description = getLocalizedContent(newsItem.description).substring(
    0,
    160
  );

  const hasAdditionalImages = additionalImages.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Share Button */}
      <div className="fixed right-6 bottom-6 z-10">
        <AnimatePresence>
          {activeShare && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-3 flex flex-col space-y-3 mb-3"
            >
              <Tooltip title={t("newsdetail.share.facebook")} placement="left">
                <FacebookShareButton url={shareUrl} quote={title}>
                  <Button
                    shape="circle"
                    icon={<FaFacebook className="text-blue-600" />}
                    size="middle"
                    className="hover:scale-110 transition-transform"
                  />
                </FacebookShareButton>
              </Tooltip>
              <Tooltip title={t("newsdetail.share.twitter")} placement="left">
                <TwitterShareButton url={shareUrl} title={title}>
                  <Button
                    shape="circle"
                    icon={<FaTwitter className="text-blue-400" />}
                    size="middle"
                    className="hover:scale-110 transition-transform"
                  />
                </TwitterShareButton>
              </Tooltip>
              <Tooltip title={t("newsdetail.share.linkedin")} placement="left">
                <LinkedinShareButton
                  url={shareUrl}
                  title={title}
                  summary={description}
                >
                  <Button
                    shape="circle"
                    icon={<FaLinkedin className="text-blue-700" />}
                    size="middle"
                    className="hover:scale-110 transition-transform"
                  />
                </LinkedinShareButton>
              </Tooltip>
              <Tooltip title={t("newsdetail.share.whatsapp")} placement="left">
                <WhatsappShareButton url={shareUrl} title={title}>
                  <Button
                    shape="circle"
                    icon={<FaWhatsapp className="text-green-500" />}
                    size="middle"
                    className="hover:scale-110 transition-transform"
                  />
                </WhatsappShareButton>
              </Tooltip>
              <Tooltip title={t("newsdetail.copyLink")} placement="left">
                <Button
                  shape="circle"
                  icon={<FaLink className="text-gray-600" />}
                  onClick={copyToClipboard}
                  size="middle"
                  className="hover:scale-110 transition-transform"
                />
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<FaShareAlt />}
            onClick={toggleShare}
            className="shadow-lg bg-blue-600 border-0"
          />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { title: <Link to="/">{t("newsdetail.home")}</Link> },
              { title: <Link to="/news">{t("newsdetail.news")}</Link> },
              { title: getLocalizedContent(newsItem.category) },
            ]}
          />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <motion.div whileHover={{ x: -3 }}>
            <Button
              type="text"
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium p-0"
              icon={<FaArrowLeft className="mr-2" />}
            >
              {t("newsdetail.backButton")}
            </Button>
          </motion.div>

          <Dropdown
            menu={{
              items: [
                { key: "en", label: "English" },
                { key: "am", label: "አማርኛ" },
                { key: "or", label: "Afaan Oromoo" },
              ],
              onClick: ({ key }) => i18n.changeLanguage(key),
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              className="flex items-center font-medium bg-white rounded-lg px-3 py-1 shadow-sm border border-gray-200"
              icon={<FaGlobe className="mr-2 text-blue-500" />}
            >
              {language.toUpperCase()}
              <FaChevronDown className="ml-1" />
            </Button>
          </Dropdown>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Article Header */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Tag
                    color="blue"
                    className="font-medium px-3 py-1 rounded-md text-xs bg-blue-100 text-blue-700 border-0"
                  >
                    {getLocalizedContent(newsItem.category)}
                  </Tag>
                  <Tag
                    color="green"
                    className="font-medium px-3 py-1 rounded-md text-xs bg-green-100 text-green-700 border-0"
                  >
                    {t(`newsdetail.status.${newsItem.status}`)}
                  </Tag>
                </div>
                <Title
                  level={1}
                  className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4"
                >
                  {getLocalizedContent(newsItem.title)}
                </Title>
                <div className="flex flex-wrap items-center text-gray-600 mb-4 gap-3 text-sm">
                  <div className="flex items-center">
                    <Avatar
                      size="small"
                      src="https://randomuser.me/api/portraits/men/3.jpg"
                      className="mr-2"
                    />
                    <Text className="font-medium">{newsItem.posted_by}</Text>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-blue-500" />
                    <Text className="font-medium">
                      {formatDate(newsItem.published_date)}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <motion.div
                className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 shadow-md"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  alt={getLocalizedContent(newsItem.title)}
                  src={`${apiUrl}uploads/${newsItem.cover_image}`}
                  className="w-full h-full object-fill"
                  preview={false}
                  fallback="https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
                />
              </motion.div>

              {/* Article Body */}
              <div className="prose max-w-none mb-8">
                <Paragraph className="text-gray-700 leading-relaxed text-base bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  {getLocalizedContent(newsItem.description)}
                </Paragraph>
              </div>

         {/* Gallery Section - Grid Layout */}
{hasAdditionalImages && (
  <div className="mb-8">
    <Title
      level={3}
      className="text-xl font-semibold text-gray-800 mb-4"
    >
      {t("newsdetail.galleryTitle")}
    </Title>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {additionalImages.map((image, index) => (
        <motion.div
          key={index}
          className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer w-full h-full"
          whileHover={{ y: -5 }}
          onClick={() => openImageModal(image)}
        >
          <Image
            src={`${apiUrl}uploads/${image}`}
            alt={`${getLocalizedContent(newsItem.title)} - ${index + 1}`}
            className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
            preview={false}
            fallback="https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <FaExpand className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
)}


              {/* Article Footer */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <Tooltip title={t("newsdetail.likeTooltip")}>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          type="text"
                          icon={
                            isLiked ? (
                              <FaHeart className="text-red-500" />
                            ) : (
                              <FaRegHeart className="text-gray-600" />
                            )
                          }
                          onClick={toggleLike}
                          className="flex items-center font-medium bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
                        >
                          <Text className="ml-2">{likeCount}</Text>
                        </Button>
                      </motion.div>
                    </Tooltip>

                    <Tooltip title={t("newsdetail.bookmarkTooltip")}>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          type="text"
                          icon={
                            isBookmarked ? (
                              <FaBookmark className="text-yellow-500" />
                            ) : (
                              <FaRegBookmark className="text-gray-600" />
                            )
                          }
                          onClick={toggleBookmark}
                          className="font-medium bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
                        >
                          <Text className="ml-2">
                            {t(
                              isBookmarked
                                ? "newsdetail.saved"
                                : "newsdetail.save"
                            )}
                          </Text>
                        </Button>
                      </motion.div>
                    </Tooltip>
                  </div>

                  <div className="flex items-center">
                    <Text className="text-gray-500 mr-2 text-sm">Share:</Text>
                    <Space size="small">
                      <FacebookShareButton url={shareUrl} quote={title}>
                        <Button
                          shape="circle"
                          icon={<FaFacebook className="text-blue-600" />}
                          size="small"
                          className="bg-blue-50"
                        />
                      </FacebookShareButton>
                      <TwitterShareButton url={shareUrl} title={title}>
                        <Button
                          shape="circle"
                          icon={<FaTwitter className="text-blue-400" />}
                          size="small"
                          className="bg-blue-50"
                        />
                      </TwitterShareButton>
                      <Button
                        shape="circle"
                        icon={<FaLink />}
                        onClick={copyToClipboard}
                        size="small"
                        className="bg-gray-100"
                      />
                    </Space>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related News Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
            >
              <Title level={3} className="text-lg font-bold text-gray-800 mb-4">
                {t("newsdetail.relatedNews")}
              </Title>

              {relatedNews.length > 0 ? (
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to={`/news/${item.id}`}>
                        <div className="flex gap-3 group">
                          <div className="w-20 h-16 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              alt={getLocalizedContent(item.title)}
                              src={`${apiUrl}uploads/${item.cover_image}`}
                              className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                              fallback="https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                              preview={false}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Text className="text-xs text-blue-600 font-medium block mb-1">
                              {getLocalizedContent(item.category)}
                            </Text>
                            <Text className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                              {getLocalizedContent(item.title)}
                            </Text>
                            <Text
                              type="secondary"
                              className="text-xs block mt-1"
                            >
                              {formatDate(item.published_date)}
                            </Text>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {t("newsdetail.noRelatedNews")}
                </div>
              )}

              {relatedNews.length > 0 && (
                <div className="mt-4 text-center">
                  <Button
                    type="link"
                    onClick={() => navigate("/news")}
                    className="text-blue-600 font-medium text-sm flex items-center justify-center mx-auto"
                    icon={<FaArrowRight className="text-xs" />}
                  >
                    {t("newsdetail.viewAllNews")}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="80%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
        className="image-modal"
      >
        {selectedImage && (
          <img
            src={`${apiUrl}uploads/${selectedImage}`}
            alt="Enlarged view"
            className="w-auto h-auto object-contain"
          />
        )}
      </Modal>

      <style jsx>{`
        .image-modal .ant-modal-body {
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.9);
        }

        .image-modal .ant-modal-close {
          color: white;
          top: -40px;
          right: 0;
        }

        .image-modal .ant-modal-close:hover {
          color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default NewsDetail;
