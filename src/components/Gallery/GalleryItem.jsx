import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../utils/getApiUrl";
import { Card, Pagination, Empty, Button } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import "tailwindcss/tailwind.css";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiEye, FiRefreshCw, FiImage } from "react-icons/fi";

const Gallery = () => {
  const apiUrl = getApiUrl();
  const { t } = useTranslation();
  const [galleryItems, setGalleryItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}api/add-gallery`);

        if (response.data && response.data.success && response.data.data) {
          const updatedItems = response.data.data.map((item) => {
            const imagePaths = [];

            if (item.images && Array.isArray(item.images)) {
              item.images.forEach((image) => {
                if (
                  typeof image === "object" &&
                  image.response &&
                  image.response.path
                ) {
                  imagePaths.push(image.response.path);
                } else if (typeof image === "string") {
                  imagePaths.push(image);
                }
              });
            }

            return {
              ...item,
              images: imagePaths.map((image) => {
                let formattedImage = image.replace(/\\/g, "/");
                formattedImage = formattedImage.replace(/([^:]\/)\/+/g, "$1");
                if (formattedImage.startsWith("/")) {
                  formattedImage = formattedImage.substring(1);
                }
                return formattedImage;
              }),
              title:
                typeof item.title === "object"
                  ? item.title.en || t("galleryfe.untitled")
                  : item.title || t("galleryfe.untitled"),
              description:
                typeof item.description === "object"
                  ? item.description.en || ""
                  : item.description || "",
            };
          });

          setGalleryItems(updatedItems);
          setError(null);
        } else {
          throw new Error(t("galleryfe.invalidResponse"));
        }
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        setError(t("galleryfe.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, [apiUrl, t]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = galleryItems.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetailPage = (id) => {
    navigate(`/gallery/${id}`);
  };

  const truncateText = (text, length = 100) => {
    if (!text) return "";
    return text.length <= length ? text : `${text.substring(0, length)}...`;
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      y: -8,
      scale: 1.03,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#136094] via-[#0f4a7a] to-[#082f55] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#008830]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#136094]/20 rounded-full blur-3xl"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <Loader />
            <p className="text-white mt-4 text-lg">{t("galleryfe.loading")}</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-6 text-[#ffca40]"
          >
            ⚠️
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl mb-6 text-center"
          >
            {error}
          </motion.p>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#ffca40] text-[#136094] rounded-xl font-bold hover:bg-[#e6b63a] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw className="text-lg" />
            {t("galleryfe.retry")}
          </motion.button>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="flex justify-center items-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FiImage className="text-6xl text-white/50 mx-auto mb-4" />
            <p className="text-white text-xl">{t("galleryfe.noItems")}</p>
          </motion.div>
        </div>
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10"
          >
            {currentItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover="hover"
                className="flex justify-center"
              >
                <Card
                  hoverable
                  className="w-full h-full max-w-sm bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group"
                  cover={
                    <div className="relative w-full h-64 overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <>
                          <img
                            alt={item.description || t("galleryfe.imageAlt")}
                            src={`${apiUrl}uploads/${item.images[0]}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/300x200?text=Image+Not+Available";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#136094]/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                            <span className="text-white font-semibold text-sm leading-relaxed">
                              {truncateText(item.description, 80)}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4 bg-[#ffca40] text-[#136094] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {item.images.length} {t("galleryfe.photos")}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-[#136094]/30 flex items-center justify-center">
                          <div className="text-center">
                            <FiImage className="text-4xl text-white/50 mx-auto mb-2" />
                            <span className="text-white/70 text-sm">
                              {t("galleryfe.noImage")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <span className="text-white font-bold text-lg group-hover:text-[#ffca40] transition-colors duration-300">
                        {item.title}
                      </span>
                    }
                    description={
                      <p className="text-white/80 text-sm line-clamp-2 mt-2 leading-relaxed">
                        {truncateText(item.description, 80)}
                      </p>
                    }
                  />
                  <div className="mt-6 flex justify-center">
                    <motion.button
                      onClick={() => openDetailPage(item.id)}
                      className="px-6 py-3 bg-gradient-to-r from-[#ffca40] to-[#e6b63a] text-[#136094] font-bold rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group/btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiEye className="group-hover/btn:scale-110 transition-transform" />
                      {t("galleryfe.seeMore")}
                    </motion.button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {galleryItems.length > itemsPerPage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-16 relative z-10"
            >
              <Pagination
                current={currentPage}
                total={galleryItems.length}
                pageSize={itemsPerPage}
                onChange={onPageChange}
                showSizeChanger={false}
                className="custom-pagination [&_.ant-pagination-item]:bg-white/10 [&_.ant-pagination-item]:border-white/20 [&_.ant-pagination-item]:text-white [&_.ant-pagination-item]:rounded-lg [&_.ant-pagination-item]:font-medium [&_.ant-pagination-item]:min-w-[40px] [&_.ant-pagination-item]:h-[40px] [&_.ant-pagination-item]:flex [&_.ant-pagination-item]:items-center [&_.ant-pagination-item]:justify-center [&_.ant-pagination-item-active]:bg-[#ffca40] [&_.ant-pagination-item-active]:border-[#ffca40] [&_.ant-pagination-item-active]:text-[#136094] [&_.ant-pagination-item-link]:bg-white/10 [&_.ant-pagination-item-link]:border-white/20 [&_.ant-pagination-item-link]:text-white [&_.ant-pagination-item-link]:rounded-lg [&_.ant-pagination-item-link]:flex [&_.ant-pagination-item-link]:items-center [&_.ant-pagination-item-link]:justify-center hover:[&_.ant-pagination-item]:bg-white/20 hover:[&_.ant-pagination-item-link]:bg-white/20"
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Gallery;
