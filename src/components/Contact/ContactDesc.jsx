import React, { useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiSend,
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiPaperclip,
  FiCheckCircle,
  FiXCircle,
  FiUpload,
  FiFile,
  FiImage,
  FiFileText,
} from "react-icons/fi";

const ContactForm = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();
  const [formData, setFormData] = useState({
    userName: "",
    contactInfo: "",
    message: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({
        ...formData,
        file: e.dataTransfer.files[0],
      });
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
      setFileName(e.target.files[0].name);
    }
  };

  const removeFile = () => {
    setFormData({
      ...formData,
      file: null,
    });
    setFileName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userName", formData.userName);
      formDataToSend.append("contactInfo", formData.contactInfo);
      formDataToSend.append("message", formData.message);
      if (formData.file) {
        formDataToSend.append("evidence", formData.file);
      }

      await axios.post(`${API_URL}api/contacts`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitStatus({
        success: true,
        message: t("contactuspageclient.successMessage"),
      });
      setFormData({
        userName: "",
        contactInfo: "",
        message: "",
        file: null,
      });
      setFileName("");
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          error.response?.data?.error || t("contactuspageclient.errorMessage"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = () => {
    if (!fileName) return <FiUpload className="text-3xl mb-3 text-white" />;

    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return <FiImage className="text-3xl mb-3 text-white" />;
    } else if (["pdf"].includes(ext)) {
      return <FiFileText className="text-3xl mb-3 text-white" />;
    }
    return <FiFile className="text-3xl mb-3 text-white" />;
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#136094] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="relative">
          {/* Card with solid colors */}
          <div className="bg-[#136094] rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Header */}
            <div className="p-8 md:p-10">
              <div className="text-center mb-10">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl font-bold text-white mb-3"
                >
                  {t("contactusclient.title")}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/80 text-lg"
                >
                  {t("contactusclient.subtitle")}
                </motion.p>
              </div>

              {/* Status message */}
              <AnimatePresence>
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-6 p-4 rounded-xl flex items-start ${
                      submitStatus.success
                        ? "bg-[#008830]/20 text-green-100 border border-[#008830]/50"
                        : "bg-red-500/10 text-red-100 border border-red-500/30"
                    }`}
                  >
                    {submitStatus.success ? (
                      <FiCheckCircle className="text-[#008830] text-xl mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <FiXCircle className="text-red-400 text-xl mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{submitStatus.message}</p>
                      {submitStatus.success && (
                        <p className="text-sm mt-1 text-[#008830]">
                          {t("contactusclient.successNote")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative">
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/10 border border-white/30 rounded-xl py-4 px-5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#ffca40] focus:border-[#ffca40] transition-all duration-300 pl-14"
                      placeholder={t("contactusclient.namePlaceholder")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <FiUser className="text-white/70" />
                    </div>
                  </div>
                </motion.div>

                {/* Contact Field */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative">
                    <input
                      type="text"
                      id="contactInfo"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/10 border border-white/30 rounded-xl py-4 px-5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#ffca40] focus:border-[#ffca40] transition-all duration-300 pl-14"
                      placeholder={t("contactusclient.contactPlaceholder")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <FiMail className="text-white/70" />
                    </div>
                  </div>
                </motion.div>

                {/* Message Field */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/10 border border-white/30 rounded-xl py-4 px-5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#ffca40] focus:border-[#ffca40] transition-all duration-300 pl-14"
                      placeholder={t("contactusclient.messagePlaceholder")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-5 pt-4 pointer-events-none">
                      <FiMessageSquare className="text-white/70" />
                    </div>
                  </div>
                </motion.div>

                {/* File Upload */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {fileName ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/30"
                    >
                      <div className="flex items-center">
                        {getFileIcon()}
                        <span className="ml-3 text-sm text-white truncate max-w-xs">
                          {fileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-white/80 hover:text-white text-sm font-medium px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        {t("contactusclient.removeButton")}
                      </button>
                    </motion.div>
                  ) : (
                    <div
                      className={`flex items-center justify-center w-full transition-all duration-300 ${
                        isDragging
                          ? "border-[#ffca40] bg-white/10"
                          : "border-white/30 bg-white/10"
                      } border-2 border-dashed rounded-xl`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <label className="flex flex-col items-center justify-center w-full h-40 cursor-pointer">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="text-3xl mb-3 text-white/70" />
                          <p className="mb-2 text-sm text-white/80">
                            <span className="font-semibold">
                              {t("contactusclient.uploadClickText")}
                            </span>{" "}
                            {t("contactusclient.uploadDragText")}
                          </p>
                          <p className="text-xs text-white/50">
                            {t("contactusclient.uploadFormats")}
                          </p>
                        </div>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-lg text-lg font-semibold text-white bg-[#ffca40] hover:bg-[#e6b63a] focus:outline-none focus:ring-4 focus:ring-[#ffca40]/50 transition-all duration-300 ${
                      isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("contactusclient.sendingButton")}
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-3 text-xl" />{" "}
                        {t("contactusclient.submitButton")}
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactForm;
