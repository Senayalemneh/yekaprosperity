import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaBuilding,
  FaImages,
  FaUserTie,
  FaBriefcase,
  FaNewspaper,
  FaFileAlt,
  FaHandshake,
  FaBullhorn,
  FaCalendarAlt,
  FaCommentDots,
  FaChartLine,
  FaComments,
  FaEnvelope,
  FaUsers
} from "react-icons/fa";

const featureCards = [
  // Content Management
  {
    icon: <FaBuilding className="text-3xl" />,
    key: "officeData",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: <FaImages className="text-3xl" />,
    key: "carouselImages",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: <FaUserTie className="text-3xl" />,
    key: "directorMessage",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: <FaBriefcase className="text-3xl" />,
    key: "cabinetMembers",
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    icon: <FaNewspaper className="text-3xl" />,
    key: "news",
    color: "bg-red-100 text-red-600"
  },
  {
    icon: <FaImages className="text-3xl" />,
    key: "gallery",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    icon: <FaUserTie className="text-3xl" />,
    key: "ceoProfile",
    color: "bg-pink-100 text-pink-600"
  },
  {
    icon: <FaFileAlt className="text-3xl" />,
    key: "documents",
    color: "bg-teal-100 text-teal-600"
  },
  {
    icon: <FaHandshake className="text-3xl" />,
    key: "partners",
    color: "bg-orange-100 text-orange-600"
  },
  
  // Announcements
  {
    icon: <FaBullhorn className="text-3xl" />,
    key: "tenders",
    color: "bg-cyan-100 text-cyan-600"
  },
  {
    icon: <FaBriefcase className="text-3xl" />,
    key: "vacancies",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: <FaCalendarAlt className="text-3xl" />,
    key: "events",
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    icon: <FaCommentDots className="text-3xl" />,
    key: "quickMessages",
    color: "bg-violet-100 text-violet-600"
  },
  
  // User Management
  {
    icon: <FaChartLine className="text-3xl" />,
    key: "topPerformers",
    color: "bg-fuchsia-100 text-fuchsia-600"
  },
  {
    icon: <FaComments className="text-3xl" />,
    key: "feedback",
    color: "bg-rose-100 text-rose-600"
  },
  {
    icon: <FaEnvelope className="text-3xl" />,
    key: "complaints",
    color: "bg-sky-100 text-sky-600"
  },
  {
    icon: <FaUsers className="text-3xl" />,
    key: "userManagement",
    color: "bg-lime-100 text-lime-600"
  }
];

const AdminWelcomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl ">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("adminDashboard.welcomeTitle")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl ">
            {t("adminDashboard.welcomeSubtitle")}
          </p>
        </div>

        {/* Content Management Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            {t("adminDashboard.contentManagement")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featureCards.slice(0, 9).map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1"
              >
                <div className={`p-4 flex justify-center ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t(`adminDashboard.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`adminDashboard.features.${feature.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            {t("adminDashboard.announcements")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featureCards.slice(9, 13).map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1"
              >
                <div className={`p-4 flex justify-center ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t(`adminDashboard.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`adminDashboard.features.${feature.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            {t("adminDashboard.userManagement")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featureCards.slice(13).map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1"
              >
                <div className={`p-4 flex justify-center ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t(`adminDashboard.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`adminDashboard.features.${feature.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcomePage;