import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiMapPin,
  FiFileText,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiUpload,
  FiFile,
  FiImage,
  FiUsers,
  FiUserCheck,
  FiPaperclip,
  FiSend,
  FiCopy,
  FiShield,
} from "react-icons/fi";
import { getApiUrl } from "../../utils/getApiUrl";
import { useTranslation } from "react-i18next";

const SubmitComplaintPage = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    submission_type: "individual",
    group_members: "",
    city: "",
    sub_city: "",
    woreda: "",
    house_number: "",
    phone_number: "",
    email: "",
    physical_condition: "",
    institution_name: "",
    government_response: "",
    complaint_content: "",
    desired_solution: "",
    status: "pending",
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [trackingId, setTrackingId] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setTrackingId(null);

    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Append all files
      files.forEach((file) => {
        formDataToSend.append("evidence_files", file);
      });

      const response = await axios.post(
        `${API_URL}api/complaints`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success && response.data.data) {
        const newTrackingId = response.data.data.tracking_id;
        setTrackingId(newTrackingId);

        setSubmitStatus({
          success: true,
          message: t("complaint.messages.submitSuccess"),
        });

        // Reset form
        setFormData({
          full_name: "",
          age: "",
          gender: "",
          submission_type: "individual",
          group_members: "",
          city: "",
          sub_city: "",
          woreda: "",
          house_number: "",
          phone_number: "",
          email: "",
          physical_condition: "",
          institution_name: "",
          government_response: "",
          complaint_content: "",
          desired_solution: "",
          status: "pending",
        });
        setFiles([]);
      } else {
        throw new Error(t("complaint.messages.trackingIdError"));
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          t("complaint.messages.submitError"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return <FiImage className="text-[#136094] mr-2" />;
    } else if (["pdf"].includes(ext)) {
      return <FiFileText className="text-[#136094] mr-2" />;
    } else if (["mp3", "wav"].includes(ext)) {
      return <FiFile className="text-[#136094] mr-2" />;
    }
    return <FiFile className="text-[#136094] mr-2" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#136094]/5 to-[#008830]/5 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#ffca40]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#008830]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#136094]/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-[#ffca40] to-[#e6b63a] p-3 rounded-2xl">
                <FiShield className="text-3xl text-[#136094]" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#136094] mb-4">
              {t("complaint.title")}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t("complaint.subtitle")}
            </p>
          </motion.div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <AnimatePresence>
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 flex flex-col ${
                  submitStatus.success
                    ? "bg-[#008830]/10 text-[#008830] border-b border-[#008830]/20"
                    : "bg-red-50 text-red-800 border-b border-red-200"
                }`}
              >
                <div className="flex items-start">
                  {submitStatus.success ? (
                    <FiCheckCircle className="text-[#008830] text-xl mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <FiXCircle className="text-red-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">{submitStatus.message}</p>
                    {submitStatus.success && (
                      <p className="text-sm mt-1 text-[#008830]">
                        {t("complaint.messages.reviewMessage")}
                      </p>
                    )}
                  </div>
                </div>

                {trackingId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 bg-white p-4 rounded-xl border border-[#136094]/20 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {t("complaint.trackingId.label")}
                        </p>
                        <p className="font-mono text-lg font-bold text-[#136094]">
                          {trackingId}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className="flex items-center px-4 py-2 bg-[#ffca40] text-[#136094] rounded-xl font-semibold hover:bg-[#e6b63a] transition-all duration-300 shadow-md"
                      >
                        <FiCopy className="mr-2" />
                        {copied
                          ? t("complaint.trackingId.copied")
                          : t("complaint.trackingId.copy")}
                      </motion.button>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      {t("complaint.trackingId.saveMessage")}
                    </p>
                    <p className="mt-1 text-xs text-[#136094] font-semibold">
                      {t("complaint.trackingId.followUpMessage")}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Personal Information Section */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
            >
              <h3 className="text-xl font-bold text-[#136094] mb-6 flex items-center">
                <div className="bg-[#136094] p-2 rounded-xl mr-3">
                  <FiUser className="text-white text-lg" />
                </div>
                {t("complaint.sections.personalInfo")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.fullName.label")} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300 pl-12"
                      placeholder={t("complaint.form.fullName.placeholder")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.age.label")}
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                    placeholder={t("complaint.form.age.placeholder")}
                    min="1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.gender.label")} *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                  >
                    <option value="" className="text-gray-500">
                      {t("complaint.form.gender.placeholder")}
                    </option>
                    <option value="male" className="text-gray-900">
                      {t("complaint.form.gender.options.male")}
                    </option>
                    <option value="female" className="text-gray-900">
                      {t("complaint.form.gender.options.female")}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="submission_type"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.submissionType.label")} *
                  </label>
                  <select
                    id="submission_type"
                    name="submission_type"
                    value={formData.submission_type}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                  >
                    <option value="individual" className="text-gray-900">
                      {t("complaint.form.submissionType.options.individual")}
                    </option>
                    <option value="group" className="text-gray-900">
                      {t("complaint.form.submissionType.options.group")}
                    </option>
                  </select>
                </div>

                {formData.submission_type === "group" && (
                  <div>
                    <label
                      htmlFor="group_members"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      {t("complaint.form.groupMembers.label")} *
                    </label>
                    <input
                      type="number"
                      id="group_members"
                      name="group_members"
                      value={formData.group_members}
                      onChange={handleChange}
                      required={formData.submission_type === "group"}
                      className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                      placeholder={t("complaint.form.groupMembers.placeholder")}
                      min="1"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="physical_condition"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.physicalCondition.label")}
                  </label>
                  <select
                    id="physical_condition"
                    name="physical_condition"
                    value={formData.physical_condition}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                  >
                    <option value="" className="text-gray-500">
                      {t("complaint.form.physicalCondition.placeholder")}
                    </option>
                    <option value="hearing_impaired" className="text-gray-900">
                      {t(
                        "complaint.form.physicalCondition.options.hearingImpaired"
                      )}
                    </option>
                    <option value="visually_impaired" className="text-gray-900">
                      {t(
                        "complaint.form.physicalCondition.options.visuallyImpaired"
                      )}
                    </option>
                    <option
                      value="physically_disabled"
                      className="text-gray-900"
                    >
                      {t(
                        "complaint.form.physicalCondition.options.physicallyDisabled"
                      )}
                    </option>
                    <option value="not_disabled" className="text-gray-900">
                      {t(
                        "complaint.form.physicalCondition.options.notDisabled"
                      )}
                    </option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Contact Information Section */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
            >
              <h3 className="text-xl font-bold text-[#136094] mb-6 flex items-center">
                <div className="bg-[#136094] p-2 rounded-xl mr-3">
                  <FiPhone className="text-white text-lg" />
                </div>
                {t("complaint.sections.contactInfo")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.phoneNumber.label")} *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300 pl-12"
                      placeholder={t("complaint.form.phoneNumber.placeholder")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.email.label")}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300 pl-12"
                      placeholder={t("complaint.form.email.placeholder")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Address Information Section */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
            >
              <h3 className="text-xl font-bold text-[#136094] mb-6 flex items-center">
                <div className="bg-[#136094] p-2 rounded-xl mr-3">
                  <FiMapPin className="text-white text-lg" />
                </div>
                {t("complaint.sections.addressInfo")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.city.label")} *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                    placeholder={t("complaint.form.city.placeholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="sub_city"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.subCity.label")} *
                  </label>
                  <input
                    type="text"
                    id="sub_city"
                    name="sub_city"
                    value={formData.sub_city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                    placeholder={t("complaint.form.subCity.placeholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="woreda"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.woreda.label")} *
                  </label>
                  <input
                    type="text"
                    id="woreda"
                    name="woreda"
                    value={formData.woreda}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                    placeholder={t("complaint.form.woreda.placeholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="house_number"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.houseNumber.label")}
                  </label>
                  <input
                    type="text"
                    id="house_number"
                    name="house_number"
                    value={formData.house_number}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                    placeholder={t("complaint.form.houseNumber.placeholder")}
                  />
                </div>
              </div>
            </motion.div>

            {/* Complaint Details Section */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
            >
              <h3 className="text-xl font-bold text-[#136094] mb-6 flex items-center">
                <div className="bg-[#136094] p-2 rounded-xl mr-3">
                  <FiFileText className="text-white text-lg" />
                </div>
                {t("complaint.sections.complaintDetails")}
              </h3>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="institution_name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.institutionName.label")} *
                  </label>
                  <input
                    type="text"
                    id="institution_name"
                    name="institution_name"
                    value={formData.institution_name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                    placeholder={t(
                      "complaint.form.institutionName.placeholder"
                    )}
                  />
                </div>

                <div>
                  <label
                    htmlFor="complaint_content"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.complaintContent.label")} *
                  </label>
                  <textarea
                    id="complaint_content"
                    name="complaint_content"
                    rows="5"
                    value={formData.complaint_content}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                    placeholder={t(
                      "complaint.form.complaintContent.placeholder"
                    )}
                  />
                </div>

                <div>
                  <label
                    htmlFor="desired_solution"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.desiredSolution.label")} *
                  </label>
                  <textarea
                    id="desired_solution"
                    name="desired_solution"
                    rows="3"
                    value={formData.desired_solution}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                    placeholder={t(
                      "complaint.form.desiredSolution.placeholder"
                    )}
                  />
                </div>

                <div>
                  <label
                    htmlFor="government_response"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t("complaint.form.governmentResponse.label")}
                  </label>
                  <textarea
                    id="government_response"
                    name="government_response"
                    rows="3"
                    value={formData.government_response}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#136094] focus:ring-2 focus:ring-[#136094]/30 p-3 transition-all duration-300"
                    placeholder={t(
                      "complaint.form.governmentResponse.placeholder"
                    )}
                  />
                </div>
              </div>
            </motion.div>

            {/* Evidence Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
            >
              <h3 className="text-xl font-bold text-[#136094] mb-6 flex items-center">
                <div className="bg-[#136094] p-2 rounded-xl mr-3">
                  <FiPaperclip className="text-white text-lg" />
                </div>
                {t("complaint.sections.evidence")}
              </h3>

              {files.length > 0 ? (
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-300"
                    >
                      <div className="flex items-center">
                        {getFileIcon(file)}
                        <span className="text-gray-700 text-sm truncate max-w-xs">
                          {file.name}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        {t("complaint.form.removeFile")}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className={`flex items-center justify-center w-full transition-all duration-300 ${
                    isDragging
                      ? "border-[#136094] bg-[#136094]/5"
                      : "border-gray-300 bg-white"
                  } border-2 border-dashed rounded-xl`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <label className="flex flex-col items-center justify-center w-full h-40 cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="text-3xl mb-3 text-[#136094]" />
                      <p className="mb-2 text-sm text-gray-600">
                        <span className="font-semibold">
                          {t("complaint.form.upload.click")}
                        </span>{" "}
                        {t("complaint.form.upload.or")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t("complaint.form.upload.formats")}
                      </p>
                    </div>
                    <input
                      id="evidence_files"
                      name="evidence_files"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                  </label>
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-2xl text-lg font-bold text-[#136094] bg-gradient-to-r from-[#ffca40] to-[#e6b63a] hover:from-[#e6b63a] hover:to-[#ffca40] focus:outline-none focus:ring-4 focus:ring-[#ffca40]/50 transition-all duration-300 ${
                  isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-[#136094]"
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
                    {t("complaint.form.submitting")}
                  </>
                ) : (
                  <>
                    <FiSend className="mr-3 text-xl" />{" "}
                    {t("complaint.form.submitButton")}
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmitComplaintPage;
