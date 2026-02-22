import React, { useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiAlertCircle,
  FiFile,
  FiUser,
  FiHome,
  FiPhone,
  FiMail,
  FiInfo,
  FiShield,
  FiDownload,
  FiEye,
  FiCalendar,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ComplaintTracker = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}api/complaints/track/${trackingId.trim()}`
      );

      if (response.data.success && response.data.data) {
        setComplaint(response.data.data);
      } else {
        setError(t("complaintTracker.errors.notFound"));
        setComplaint(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || t("complaintTracker.errors.notFound")
      );
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-[#ffca40]/20",
        text: "text-[#ffca40]",
        border: "border-[#ffca40]/30",
        icon: <FiClock className="mr-1" />,
      },
      in_review: {
        bg: "bg-[#136094]/20",
        text: "text-[#136094]",
        border: "border-[#136094]/30",
        icon: <FiRefreshCw className="mr-1" />,
      },
      resolved: {
        bg: "bg-[#008830]/20",
        text: "text-[#008830]",
        border: "border-[#008830]/30",
        icon: <FiCheckCircle className="mr-1" />,
      },
      rejected: {
        bg: "bg-red-100/20",
        text: "text-red-600",
        border: "border-red-300",
        icon: <FiXCircle className="mr-1" />,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {t(`complaintTracker.status.${status}`) ||
          t("complaintTracker.status.unknown")}
      </motion.span>
    );
  };

  const parseEvidenceFiles = (files) => {
    try {
      if (!files || files === "[]") return [];
      if (Array.isArray(files)) return files;
      const parsed = JSON.parse(files);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error parsing evidence files:", e);
      return [];
    }
  };

  const getFileTypeIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return <FiEye className="mr-2" />;
    } else if (["pdf"].includes(ext)) {
      return <FiFile className="mr-2" />;
    }
    return <FiDownload className="mr-2" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#136094]/5 to-[#008830]/5 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#008830]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#136094]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-6 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl mb-8">
            <div className="bg-gradient-to-r from-[#ffca40] to-[#e6b63a] p-4 rounded-2xl mr-4">
              <FiShield className="text-3xl  text-[#136094]" />
            </div>
            <div className="bg-blue-900 p-4 rounded-lg ">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 bg-gradient-to-r from-white to-[#ffca40] bg-clip-text text-transparent">
                {t("complaintTracker.title")}
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                {t("complaintTracker.subtitle")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8"
        >
          <div className="p-8">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-[#136094] text-xl" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 border-2 border-[#136094]/20 bg-white/90 text-[#136094] placeholder-[#136094]/60 rounded-2xl shadow-lg focus:outline-none focus:border-[#ffca40] focus:ring-2 focus:ring-[#ffca40]/30 transition-all duration-300 text-lg font-medium"
                  placeholder={t("complaintTracker.searchPlaceholder")}
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading || !trackingId.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center justify-center px-8 py-4 border-0 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300 ${
                  loading || !trackingId.trim()
                    ? "opacity-70 cursor-not-allowed bg-gray-400 text-gray-600"
                    : "bg-gradient-to-r from-[#ffca40] to-[#e6b63a] text-[#136094] hover:from-[#e6b63a] hover:to-[#ffca40]"
                }`}
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-3 text-xl" />
                    {t("complaintTracker.searching")}
                  </>
                ) : (
                  <>
                    <FiSearch className="mr-3 text-xl" />
                    {t("complaintTracker.search")}
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/20 border-t border-red-500/30 p-4 mx-6 mb-6 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-100 font-medium">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Complaint Details */}
        <AnimatePresence>
          {complaint && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
            >
              {/* Header with Status */}
              <div className="p-8 border-b border-white/20">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {complaint.institution_name ||
                        t("complaintTracker.noInstitution")}
                    </h3>
                    <div className="flex items-center text-blue-100">
                      <FiCalendar className="mr-2" />
                      <span className="text-sm">
                        {t("complaintTracker.submittedOn")}{" "}
                        {complaint.created_at
                          ? new Date(complaint.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : t("complaintTracker.unknownDate")}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(complaint.status)}
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Personal & Address Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
                  >
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                      <div className="bg-[#136094] p-2 rounded-xl mr-3">
                        <FiUser className="text-[#ffca40] text-lg" />
                      </div>
                      {t("complaintTracker.complainantInfo")}
                    </h4>
                    <div className="space-y-3 text-white">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.fullName")}:
                        </span>
                        <span>{complaint.full_name || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.age")}:
                        </span>
                        <span>{complaint.age || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.gender")}:
                        </span>
                        <span>
                          {complaint.gender
                            ? complaint.gender.charAt(0).toUpperCase() +
                              complaint.gender.slice(1)
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.physicalCondition")}:
                        </span>
                        <span>
                          {complaint.physical_condition
                            ? complaint.physical_condition
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Address Information */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
                  >
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                      <div className="bg-[#136094] p-2 rounded-xl mr-3">
                        <FiHome className="text-[#ffca40] text-lg" />
                      </div>
                      {t("complaintTracker.addressInfo")}
                    </h4>
                    <div className="space-y-3 text-white">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.city")}:
                        </span>
                        <span>{complaint.city || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.subCity")}:
                        </span>
                        <span>{complaint.sub_city || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.woreda")}:
                        </span>
                        <span>{complaint.woreda || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.houseNumber")}:
                        </span>
                        <span>{complaint.house_number || "-"}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Contact & Submission Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Information */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
                  >
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                      <div className="bg-[#136094] p-2 rounded-xl mr-3">
                        <FiPhone className="text-[#ffca40] text-lg" />
                      </div>
                      {t("complaintTracker.contactInfo")}
                    </h4>
                    <div className="space-y-3 text-white">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {t("complaintTracker.phone")}:
                        </span>
                        {complaint.phone_number ? (
                          <a
                            href={`tel:${complaint.phone_number}`}
                            className="text-[#ffca40] hover:text-[#e6b63a] transition-colors font-medium"
                          >
                            {complaint.phone_number}
                          </a>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {t("complaintTracker.email")}:
                        </span>
                        {complaint.email ? (
                          <a
                            href={`mailto:${complaint.email}`}
                            className="text-[#ffca40] hover:text-[#e6b63a] transition-colors font-medium"
                          >
                            {complaint.email}
                          </a>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Submission Details */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
                  >
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                      <div className="bg-[#136094] p-2 rounded-xl mr-3">
                        <FiInfo className="text-[#ffca40] text-lg" />
                      </div>
                      {t("complaintTracker.submissionDetails")}
                    </h4>
                    <div className="space-y-3 text-white">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.submissionType")}:
                        </span>
                        <span>
                          {complaint.submission_type === "individual"
                            ? t("complaintTracker.individual")
                            : t("complaintTracker.group", {
                                members: complaint.group_members || 0,
                              })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {t("complaintTracker.trackingId")}:
                        </span>
                        <span className="font-mono text-[#ffca40] font-bold">
                          {complaint.tracking_id || "-"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Complaint Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
                >
                  <h4 className="text-lg font-bold text-white mb-4">
                    {t("complaintTracker.complaintDetails")}
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <h5 className="text-sm font-semibold text-[#ffca40] mb-2">
                        {t("complaintTracker.complaintContent")}
                      </h5>
                      <p className="text-white bg-white/10 p-4 rounded-xl border border-white/20 whitespace-pre-line">
                        {complaint.complaint_content ||
                          t("complaintTracker.noContent")}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-[#ffca40] mb-2">
                        {t("complaintTracker.desiredSolution")}
                      </h5>
                      <p className="text-white bg-white/10 p-4 rounded-xl border border-white/20 whitespace-pre-line">
                        {complaint.desired_solution ||
                          t("complaintTracker.noSolution")}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Admin Response */}
                {complaint.admin_response && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#008830]/20 backdrop-blur-sm p-6 rounded-2xl border border-[#008830]/30"
                  >
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                      <FiCheckCircle className="text-[#008830] mr-3 text-xl" />
                      {t("complaintTracker.adminResponse")}
                    </h4>
                    <p className="text-white whitespace-pre-line">
                      {complaint.admin_response}
                    </p>
                    {complaint.updated_at && (
                      <p className="mt-3 text-sm text-[#008830] font-medium">
                        {t("complaintTracker.lastUpdated")}:{" "}
                        {new Date(complaint.updated_at).toLocaleString()}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Evidence Files */}
                {(() => {
                  const evidenceFiles = parseEvidenceFiles(
                    complaint.evidence_files
                  );
                  if (evidenceFiles.length > 0) {
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
                      >
                        <h4 className="text-lg font-bold text-white mb-4">
                          {t("complaintTracker.submittedEvidence")}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {evidenceFiles.map((file, index) => (
                            <motion.a
                              key={index}
                              href={`${API_URL}${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                            >
                              <div className="flex items-center">
                                {getFileTypeIcon(file)}
                                <span className="text-sm font-medium">
                                  {t("complaintTracker.file")} {index + 1}
                                </span>
                              </div>
                              <FiDownload className="text-[#ffca40]" />
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })()}

                {/* Footer Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-6 border-t border-white/20"
                >
                  <p className="text-sm text-blue-100 text-center">
                    {t("complaintTracker.footerNote")}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComplaintTracker;
