import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
import {
  FiSearch,
  FiTrash2,
  FiEdit,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiFile,
  FiDownload,
  FiImage,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ComplaintDashboard = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_URL}api/complaints?status=${statusFilter}&search=${searchTerm}`
      );

      if (Array.isArray(response.data.data)) {
        setComplaints(response.data.data);
      } else {
        setComplaints([]);
        setError(t("complaintdashboard.errors.invalidData"));
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError(t("complaintdashboard.errors.fetchFailed"));
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}api/complaints/${id}/status`, {
        status: newStatus,
      });
      fetchComplaints();
      if (selectedComplaint?.id === id) {
        setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(t("complaintdashboard.errors.updateFailed"));
    }
  };

  const handleAdminResponse = async (id) => {
    if (!adminResponse.trim()) return;

    try {
      await axios.patch(`${API_URL}api/complaints/${id}/response`, {
        admin_response: adminResponse,
      });
      fetchComplaints();
      if (selectedComplaint?.id === id) {
        setSelectedComplaint({
          ...selectedComplaint,
          admin_response: adminResponse,
        });
      }
      setAdminResponse("");
    } catch (error) {
      console.error("Error submitting response:", error);
      setError(t("complaintdashboard.errors.responseFailed"));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("complaintdashboard.deleteConfirm"))) {
      try {
        await axios.delete(`${API_URL}api/complaints/${id}`);
        fetchComplaints();
        if (selectedComplaint?.id === id) {
          setSelectedComplaint(null);
        }
      } catch (error) {
        console.error("Error deleting complaint:", error);
        setError(t("complaintdashboard.errors.deleteFailed"));
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      in_review: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    const statusIcons = {
      pending: <FiClock className="mr-1" />,
      in_review: <FiRefreshCw className="mr-1" />,
      resolved: <FiCheckCircle className="mr-1" />,
      rejected: <FiXCircle className="mr-1" />,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusIcons[status] || <FiClock className="mr-1" />}
        {t(`complaintdashboard.status.${status}`) ||
          t("complaintdashboard.status.unknown")}
      </span>
    );
  };

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return <FiImage className="mr-1" />;
    }
    return <FiFile className="mr-1" />;
  };

  const getFullFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    const normalizedPath = filePath.replace(/\\/g, "/");
    return `${API_URL}${normalizedPath}`;
  };

  const complaintsToDisplay = Array.isArray(complaints) ? complaints : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("complaintdashboard.title")}
          </h1>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder={t("complaintdashboard.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchComplaints()}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="pending">
                {t("complaintdashboard.status.pending")}
              </option>
              <option value="in_review">
                {t("complaintdashboard.status.in_review")}
              </option>
              <option value="resolved">
                {t("complaintdashboard.status.resolved")}
              </option>
              <option value="rejected">
                {t("complaintdashboard.status.rejected")}
              </option>
              <option value="">{t("complaintdashboard.status.all")}</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiXCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Complaint List */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t("complaintdashboard.complaints")}
                </h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : complaintsToDisplay.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {t("complaintdashboard.noComplaints")}
                  </div>
                ) : (
                  complaintsToDisplay.map((complaint) => (
                    <div
                      key={complaint.id}
                      onClick={() => setSelectedComplaint(complaint)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedComplaint?.id === complaint.id
                          ? "bg-blue-50"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {complaint.institution_name ||
                            t("complaintdashboard.noInstitution")}
                        </h4>
                        {getStatusBadge(complaint.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {complaint.complaint_content
                          ? complaint.complaint_content.substring(0, 60) + "..."
                          : t("complaintdashboard.noContent")}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          {complaint.created_at
                            ? new Date(
                                complaint.created_at
                              ).toLocaleDateString()
                            : t("complaintdashboard.noDate")}
                        </span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {complaint.tracking_id ||
                            t("complaintdashboard.noTrackingId")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div className="lg:w-2/3">
            {selectedComplaint ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {t("complaintdashboard.complaintDetails")}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {t("complaintdashboard.trackingId")}:{" "}
                      {selectedComplaint.tracking_id ||
                        t("complaintdashboard.noTrackingId")}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={selectedComplaint.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(selectedComplaint.id, e.target.value)
                      }
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="pending">
                        {t("complaintdashboard.status.pending")}
                      </option>
                      <option value="in_review">
                        {t("complaintdashboard.status.in_review")}
                      </option>
                      <option value="resolved">
                        {t("complaintdashboard.status.resolved")}
                      </option>
                      <option value="rejected">
                        {t("complaintdashboard.status.rejected")}
                      </option>
                    </select>
                    <button
                      onClick={() => handleDelete(selectedComplaint.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FiTrash2 className="mr-1" />{" "}
                      {t("complaintdashboard.delete")}
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    {/* Personal Information */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        {t("complaintdashboard.personalInfo")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.fullName")}
                            </p>
                            <p>{selectedComplaint.full_name || "-"}</p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.age")}
                            </p>
                            <p>{selectedComplaint.age || "-"}</p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.gender")}
                            </p>
                            <p>
                              {selectedComplaint.gender
                                ? selectedComplaint.gender
                                    .charAt(0)
                                    .toUpperCase() +
                                  selectedComplaint.gender.slice(1)
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.submissionType")}
                            </p>
                            <p>
                              {selectedComplaint.submission_type ===
                              "individual"
                                ? t("complaintdashboard.individual")
                                : selectedComplaint.submission_type === "group"
                                ? t("complaintdashboard.group", {
                                    members:
                                      selectedComplaint.group_members || 0,
                                  })
                                : "-"}
                            </p>
                          </div>
                          {selectedComplaint.submission_type ===
                            "individual" && (
                            <div>
                              <p className="font-medium">
                                {t("complaintdashboard.physicalCondition")}
                              </p>
                              <p>
                                {selectedComplaint.physical_condition
                                  ? selectedComplaint.physical_condition
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")
                                  : "-"}
                              </p>
                            </div>
                          )}
                        </div>
                      </dd>
                    </div>

                    {/* Contact Information */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        {t("complaintdashboard.contactInfo")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.phoneNumber")}
                            </p>
                            <p>
                              {selectedComplaint.phone_number ? (
                                <a
                                  href={`tel:${selectedComplaint.phone_number}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {selectedComplaint.phone_number}
                                </a>
                              ) : (
                                "-"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.email")}
                            </p>
                            <p>
                              {selectedComplaint.email ? (
                                <a
                                  href={`mailto:${selectedComplaint.email}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {selectedComplaint.email}
                                </a>
                              ) : (
                                "-"
                              )}
                            </p>
                          </div>
                        </div>
                      </dd>
                    </div>

                    {/* Address Information */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        {t("complaintdashboard.addressInfo")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.city")}
                            </p>
                            <p>{selectedComplaint.city || "-"}</p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.subCity")}
                            </p>
                            <p>{selectedComplaint.sub_city || "-"}</p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.woreda")}
                            </p>
                            <p>{selectedComplaint.woreda || "-"}</p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.houseNumber")}
                            </p>
                            <p>{selectedComplaint.house_number || "-"}</p>
                          </div>
                        </div>
                      </dd>
                    </div>

                    {/* Complaint Details */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        {t("complaintdashboard.complaintDetails")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.institution")}
                            </p>
                            <p>{selectedComplaint.institution_name || "-"}</p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.complaintContent")}
                            </p>
                            <p className="whitespace-pre-line">
                              {selectedComplaint.complaint_content ||
                                t("complaintdashboard.noContent")}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("complaintdashboard.desiredSolution")}
                            </p>
                            <p className="whitespace-pre-line">
                              {selectedComplaint.desired_solution ||
                                t("complaintdashboard.noSolution")}
                            </p>
                          </div>
                        </div>
                      </dd>
                    </div>

                    {/* Evidence */}
                    {selectedComplaint.evidence_files && (
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          {t("complaintdashboard.evidenceFiles")}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(selectedComplaint.evidence_files) ? (
                              selectedComplaint.evidence_files.map(
                                (file, index) => {
                                  const fileUrl = getFullFileUrl(file);
                                  return (
                                    <a
                                      key={index}
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                      {getFileIcon(file)}
                                      {t("complaintdashboard.file")} {index + 1}
                                      <FiDownload className="ml-1" />
                                    </a>
                                  );
                                }
                              )
                            ) : (
                              <p className="text-gray-500">
                                {t("complaintdashboard.noEvidence")}
                              </p>
                            )}
                          </div>
                        </dd>
                      </div>
                    )}

                    {/* Admin Response */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        {t("complaintdashboard.adminResponse")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedComplaint.admin_response ? (
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="whitespace-pre-line">
                              {selectedComplaint.admin_response}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {t("complaintdashboard.lastUpdated")}:{" "}
                              {selectedComplaint.updated_at
                                ? new Date(
                                    selectedComplaint.updated_at
                                  ).toLocaleString()
                                : t("complaintdashboard.unknownDate")}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            {t("complaintdashboard.noResponse")}
                          </p>
                        )}
                        <div className="mt-4">
                          <label
                            htmlFor="admin-response"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("complaintdashboard.addUpdateResponse")}
                          </label>
                          <textarea
                            id="admin-response"
                            rows={4}
                            className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md"
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            placeholder={t(
                              "complaintdashboard.responsePlaceholder"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleAdminResponse(selectedComplaint.id)
                            }
                            disabled={!adminResponse.trim()}
                            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiEdit className="mr-2" />
                            {t("complaintdashboard.submitResponse")}
                          </button>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg flex items-center justify-center h-64">
                <div className="text-center">
                  <FiEye className=" h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {t("complaintdashboard.noComplaintSelected")}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {t("complaintdashboard.selectComplaint")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDashboard;
