import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaNewspaper,
  FaBullhorn,
  FaImages,
  FaFileAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaCommentDots,
  FaEnvelope,
  FaSignOutAlt,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaCog,
  FaChartLine,
  FaUsers,
  FaBuilding,
  FaBell,
  FaSearch,
  FaUserCog,
  FaLayerGroup,
  FaHandshake,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Import your components
import AddNews from "./AddNews";
import AddDirectorMessage from "./AddDirectorMessage";
import ImageUpload from "./ImageUpload";
import AddTenders from "./AddTenders";
import AddVacancy from "./AddVacancy";
import AddEvent from "./AddEvent";
import ComplaintsList from "./ComplaintsList";
import ViewFeedback from "./ViewFeedback";
import AdminWelcomePage from "./AdminWelcomePage";
import QuickMessage from "./QuickMessage";
import AddCabinet from "./AddCabinet";
import UserManager from "./UserManager";
import OfficeManager from "./OfficeManager";
import AddData from "./addData";
import AddCEO from "./AddCEO";
import AddOrgStruct from "./AddOrgStructure";
import Welcomepage from "./Welcompage";
import TopPerfomer from "./topPerformer";
import AddDocument from "./addDocument";
import AddOfficeData from "./addOfficeData";
import AddCarouselImg from "./AddCarouselImages";
import AddPartners from "./AddPartners";

import AddFAQ from "./AddFAQ";

//DMS
import DMS from "./DMS";

const NavbarA = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserName = localStorage.getItem("username");

    if (token && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
      setUserName(storedUserName || "Admin");
    } else {
      setIsAuthenticated(false);
      setRole(null);
      navigate("/login");
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const navigateToPage = (page) => {
    setCurrentPage(page);
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(false);
    }
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const toggleCategory = (categoryTitle) => {
    setActiveCategory(activeCategory === categoryTitle ? null : categoryTitle);
  };

  const renderNavLinks = (isMobile = false) => {
    if (!isAuthenticated) return null;

    const linkCategories = [
      {
        title: t("adminnavigation.dashboard"),
        icon: <FaHome />,
        links: [
          {
            page: "home",
            icon: <FaHome />,
            text: t("adminnavigation.dashboard"),
            roles: ["admin", "communication", "compliant"],
          },
          {
            page: "dms",
            icon: <FaHome />,
            text: t("adminnavigation.DMS"),
            roles: ["admin", "communication", "compliant"],
          },
        ],
      },

      {
        title: t("adminnavigation.contentManagement"),
        icon: <FaNewspaper />,
        links: [
          {
            page: "addofficedata",
            icon: <FaBuilding />,
            text: t("adminnavigation.addofficeData"),
            roles: ["admin", "communication"],
          },
          {
            page: "addcarouselimages",
            icon: <FaImages />,
            text: t("adminnavigation.addcarouselimages"),
            roles: ["admin", "communication"],
          },
          {
            page: "adddirector",
            icon: <FaUserCog />,
            text: t("adminnavigation.addDirectorMessage"),
            roles: ["admin", "communication"],
          },
          {
            page: "addcabinet",
            icon: <FaBriefcase />,
            text: t("adminnavigation.addCabinet"),
            roles: ["admin", "communication"],
          },
          {
            page: "addnews",
            icon: <FaNewspaper />,
            text: t("adminnavigation.addNews"),
            roles: ["admin", "communication"],
          },
          {
            page: "addgallery",
            icon: <FaImages />,
            text: t("adminnavigation.addGallery"),
            roles: ["admin", "communication"],
          },
          {
            page: "addCEO",
            icon: <FaUser />,
            text: t("adminnavigation.addCEO"),
            roles: ["admin", "communication"],
          },
          {
            page: "addDocument",
            icon: <FaFileAlt />,
            text: t("adminnavigation.addDocument"),
            roles: ["admin", "communication"],
          },
          {
            page: "addPartners",
            icon: <FaHandshake />,
            text: t("adminnavigation.addPartners"),
            roles: ["admin", "communication"],
          },
          {
            page: "addorgstructure",
            icon: <FaHandshake />,
            text: t("adminnavigation.addOrgStructure"),
            roles: ["admin", "communication"],
          },
          {
            page: "addFAQ",
            icon: <FaHandshake />,
            text: t("adminnavigation.addFAQ"),
            roles: ["admin", "communication"],
          },
        ],
      },
      {
        title: t("adminnavigation.announcements"),
        icon: <FaBullhorn />,
        links: [
          {
            page: "addtenders",
            icon: <FaBullhorn />,
            text: t("adminnavigation.addTenders"),
            roles: ["admin", "communication"],
          },
          {
            page: "addvacancy",
            icon: <FaBriefcase />,
            text: t("adminnavigation.addVacancy"),
            roles: ["admin", "communication"],
          },
          {
            page: "addevent",
            icon: <FaCalendarAlt />,
            text: t("adminnavigation.addEvent"),
            roles: ["admin", "communication"],
          },
          {
            page: "addquickmessage",
            icon: <FaCommentDots />,
            text: t("adminnavigation.addQuickMessage"),
            roles: ["admin"],
          },
        ],
      },
      {
        title: t("adminnavigation.userManagement"),
        icon: <FaUsers />,
        links: [
          {
            page: "topPerformer",
            icon: <FaChartLine />,
            text: t("adminnavigation.topPerformer"),
            roles: ["admin", "communication"],
          },
          {
            page: "viewfeedback",
            icon: <FaCommentDots />,
            text: t("adminnavigation.viewFeedback"),
            roles: ["admin", "compliant"],
          },
          {
            page: "viewcomplaints",
            icon: <FaEnvelope />,
            text: t("adminnavigation.viewComplaints"),
            roles: ["admin", "compliant"],
          },
          {
            page: "usermanager",
            icon: <FaUsers />,
            text: t("adminnavigation.userManagertwo"),
            roles: ["admin"],
          },
        ],
      },
      {
        title: t("adminnavigation.settings"),
        icon: <FaCog />,
        links: [
          {
            page: "addData",
            icon: <FaLayerGroup />,
            text: t("adminnavigation.addData"),
            roles: ["communication"],
          },
        ],
      },
    ];

    return linkCategories.map((category, catIndex) => {
      const visibleLinks = category.links.filter((link) =>
        link.roles.includes(role)
      );

      if (visibleLinks.length === 0) return null;

      const isCategoryActive = activeCategory === category.title;

      return (
        <div key={catIndex} className="mb-2">
          {/* Category Header */}
          <motion.button
            onClick={() => toggleCategory(category.title)}
            className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group mb-1 ${
              isCategoryActive
                ? "bg-[#ffca40] text-[#136094]"
                : "text-white hover:bg-[#136094]"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span
              className={`flex items-center justify-center ${
                sidebarOpen && !isMobile ? "mr-3" : "mx-auto"
              }`}
            >
              {React.cloneElement(category.icon, {
                className: `text-lg ${
                  isCategoryActive ? "text-[#136094]" : "text-[#ffca40]"
                }`,
              })}
            </span>
            <span
              className={`${
                !sidebarOpen && !isMobile ? "hidden" : "block"
              } flex-1 text-left font-semibold`}
            >
              {category.title}
            </span>
            {sidebarOpen && !isMobile && visibleLinks.length > 1 && (
              <motion.span
                animate={{ rotate: isCategoryActive ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm"
              >
                <FaChevronRight />
              </motion.span>
            )}
          </motion.button>

          {/* Category Links */}
          <AnimatePresence>
            {(isCategoryActive || visibleLinks.length === 1) && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 ml-2 border-l-2 border-[#ffca40] border-opacity-30 pl-2"
              >
                {visibleLinks.map((link, index) => (
                  <motion.li
                    key={`${catIndex}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => navigateToPage(link.page)}
                      className={`flex items-center w-full p-2 rounded-lg transition-all duration-200 group ${
                        currentPage === link.page
                          ? "bg-gradient-to-r from-[#008830] to-[#136094] text-white shadow-md"
                          : "text-gray-300 hover:bg-[#136094] hover:text-white hover:translate-x-1"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center ${
                          sidebarOpen && !isMobile ? "mr-2" : "mx-auto"
                        }`}
                      >
                        {React.cloneElement(link.icon, {
                          className: `text-sm transition-transform group-hover:scale-110 ${
                            currentPage === link.page
                              ? "text-white"
                              : "text-[#ffca40]"
                          }`,
                        })}
                      </span>
                      <span
                        className={`${
                          !sidebarOpen && !isMobile ? "hidden" : "block"
                        } transition-all duration-200 text-xs font-medium text-left`}
                      >
                        {link.text}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  const getPageTitle = () => {
    const titles = {
      addnews: t("adminnavigation.addNews"),
      addofficedata: t("adminnavigation.addofficeData"),
      addcarouselimages: t("adminnavigation.addcarouselimages"),
      adddirector: t("adminnavigation.addDirectorMessage"),
      addgallery: t("adminnavigation.addGallery"),
      addtenders: t("adminnavigation.addTenders"),
      addvacancy: t("adminnavigation.addVacancy"),
      addevent: t("adminnavigation.addEvent"),
      viewcomplaints: t("adminnavigation.viewComplaints"),
      viewfeedback: t("adminnavigation.viewFeedback"),
      addquickmessage: t("adminnavigation.addQuickMessage"),
      addcabinet: t("adminnavigation.addCabinet"),
      addData: t("adminnavigation.addData"),
      addCEO: t("adminnavigation.addCEO"),
      addOrgStruct: t("adminnavigation.addorgstructure"),
      welcomePage: t("adminnavigation.welcomePage"),
      topPerformer: t("adminnavigation.topPerformer"),
      addDocument: t("adminnavigation.addDocument"),
      addPartners: t("adminnavigation.addPartners"),
      home: t("adminnavigation.dashboard"),
      usermanager: t("adminnavigation.userManagertwo"),
    };
    return titles[currentPage] || t("adminnavigation.dashboard");
  };

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: t("adminnavigation.notifications.newMessage"),
      content: t("adminnavigation.notifications.unreadMessages", { count: 3 }),
      time: t("adminnavigation.notifications.timeAgo", { minutes: 2 }),
    },
    {
      id: 2,
      title: t("adminnavigation.notifications.systemUpdate"),
      content: t("adminnavigation.notifications.maintenance"),
      time: t("adminnavigation.notifications.timeAgo", { hours: 1 }),
    },
    {
      id: 3,
      title: t("adminnavigation.notifications.newUser"),
      content: t("adminnavigation.notifications.userRegistered"),
      time: t("adminnavigation.notifications.timeAgo", { hours: 3 }),
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#136094] to-[#008830] overflow-hidden">
      {/* Mobile sidebar toggle */}
      <motion.button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-[#136094] to-[#008830] text-white shadow-lg hover:shadow-xl transition-all border-2 border-white border-opacity-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {mobileSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        className={`hidden lg:flex flex-col bg-gradient-to-b from-[#136094] to-[#008830] text-white transition-all duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white border-opacity-20 bg-white bg-opacity-10 backdrop-blur-lg">
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="bg-[#ffca40] text-[#136094] rounded-xl p-2">
                <FaCog className="text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {t("adminnavigation.title")}
                </h1>
              </div>
            </motion.div>
          ) : (
            <div className="mx-auto">
              <div className="bg-[#ffca40] text-[#136094] rounded-xl p-2">
                <FaCog className="text-xl" />
              </div>
            </div>
          )}
          <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-colors border border-white border-opacity-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#ffca40] scrollbar-track-[#136094]">
          {renderNavLinks()}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white border-opacity-20 bg-white bg-opacity-5 backdrop-blur-lg">
          <div
            className={`flex items-center ${
              sidebarOpen ? "justify-between" : "justify-center"
            }`}
          >
            {sidebarOpen && (
              <motion.div
                className="text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="font-semibold text-white">{userName}</p>
                <p className="text-[#ffca40] capitalize text-xs">{role}</p>
              </motion.div>
            )}
            <motion.button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? (
                <span className="text-sm font-medium flex items-center">
                  <FaSignOutAlt className="mr-2" />
                  {t("adminnavigation.logout")}
                </span>
              ) : (
                <FaSignOutAlt />
              )}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40"
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={toggleMobileSidebar}
            ></div>
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-50 w-80 h-full bg-gradient-to-b from-[#136094] to-[#008830] text-white overflow-y-auto shadow-2xl"
            >
              <div className="p-4 flex items-center justify-between border-b border-white border-opacity-20 bg-white bg-opacity-10 backdrop-blur-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#ffca40] text-[#136094] rounded-xl p-2">
                    <FaCog className="text-xl" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">
                      {t("adminnavigation.title")}
                    </h1>
                    <p className="text-xs text-[#ffca40] opacity-80">
                      {t("adminnavigation.subtitle")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleMobileSidebar}
                  className="p-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <nav className="p-4">{renderNavLinks(true)}</nav>

              <div className="p-4 border-t border-white border-opacity-20 bg-white bg-opacity-5 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-semibold text-white">{userName}</p>
                    <p className="text-[#ffca40] capitalize">{role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span className="ml-2 font-medium">
                      {t("adminnavigation.logout")}
                    </span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 bg-gray-50 ${
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        }`}
      >
        {/* Content Area */}
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            {/* Content Header */}
            <div className="bg-gradient-to-r from-[#136094] to-[#008830] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-3 border border-white border-opacity-30"
                  >
                    <span className="text-sm font-medium capitalize">
                      {role}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
              {currentPage === "addnews" && <AddNews />}
              {currentPage === "addofficedata" && <AddOfficeData />}
              {currentPage === "addcarouselimages" && <AddCarouselImg />}
              {currentPage === "adddirector" && <AddDirectorMessage />}
              {currentPage === "addgallery" && <ImageUpload />}
              {currentPage === "addtenders" && <AddTenders />}
              {currentPage === "addvacancy" && <AddVacancy />}
              {currentPage === "addevent" && <AddEvent />}
              {currentPage === "viewcomplaints" && <ComplaintsList />}
              {currentPage === "viewfeedback" && <ViewFeedback />}
              {currentPage === "addquickmessage" && <QuickMessage />}
              {currentPage === "addcabinet" && <AddCabinet />}
              {currentPage === "officemanager" && <OfficeManager />}
              {currentPage === "addData" && <AddData />}
              {currentPage === "addCEO" && <AddCEO />}
              {currentPage === "addorgstructure" && <AddOrgStruct />}
              {currentPage === "welcomePage" && <Welcomepage />}
              {currentPage === "topPerformer" && <TopPerfomer />}
              {currentPage === "addDocument" && <AddDocument />}
              {currentPage === "addPartners" && <AddPartners />}
              {currentPage === "home" && <AdminWelcomePage />}
              {currentPage === "usermanager" && <UserManager />}
              {currentPage === "addorgstructure" && <addOrgStruct />}
              {currentPage === "addFAQ" && <AddFAQ />}
              {currentPage === "dms" && <DMS />}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NavbarA;
