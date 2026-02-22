// routes.js
import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// Layout and Pages
import MainLayout from "../pages/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import About from "../pages/About";
import News from "../pages/News";
import Gallery from "../pages/Gallery";
import Management from "../pages/Management";
import ChiefExecutive from "../pages/ManDropdown/ChiefExecutive";
import Cabinets from "../pages/ManDropdown/Cabinets";
import OrgStructure from "../components/OrgStructure/orgstructure";
import Structure from "../pages/ManDropdown/Structure";
import Woredas from "../pages/ManDropdown/Woredas";
import Offices from "../pages/ManDropdown/Offices";
import Announcement from "../pages/Announcement";
import Tender from "../pages/AnnDropdown/Tender";
import Vacancy from "../pages/AnnDropdown/Vacancy";
import Event from "../pages/AnnDropdown/Event";
import Contact from "../pages/Contact";
import Compliant from "../pages/Compliant";
import CompliantTracker from "../components/Compliant/ComplaintTracker";
import ComplaintSubmitted from "../components/Compliant/ComplaintSubmitted";
import NewsDetail from "../components/News/NewsDesc";
import WoredaDetail from "../components/ManagementDD/Woredas/WoredasDetail";
import OfficeDetail from "../components/ManagementDD/Offices/OfficeDetail";
import DetailedGallery from "../components/Gallery/DetailedGallery";
import TopPerformers from "../pages/TopPerformers";
import Resource from "../components/Document/Document";
import AddCarousel from "../components/Admin/AddCarouselImages";
import WelcomePage from "../components/Admin/NavbarA";
import UserRegistration from "../components/Admin/UserRegistrationForm";
import Login from "../components/Admin/LoginPage";
import ProtectedRoute from "../components/Admin/ProtectedRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "news", element: <News /> },
      { path: "news/:id", element: <NewsDetail /> },
      { path: "gallery", element: <Gallery /> },
      { path: "gallery/:id", element: <DetailedGallery /> },
      { path: "management", element: <Management /> },
      { path: "management/chief-executive", element: <ChiefExecutive /> },
      { path: "management/cabinets", element: <Cabinets /> },
      { path: "management/orgstructure", element: <OrgStructure /> },
      { path: "structure", element: <Structure /> },
      { path: "woredas", element: <Woredas /> },
      { path: "woredas/:id", element: <WoredaDetail /> },
      { path: "offices", element: <Offices /> },
      { path: "offices/:id", element: <OfficeDetail /> },
      { path: "announcement", element: <Announcement /> },
      { path: "announcement/tender", element: <Tender /> },
      { path: "announcement/vacancy", element: <Vacancy /> },
      { path: "announcement/event", element: <Event /> },
      { path: "contact", element: <Contact /> },
      { path: "compliant", element: <Compliant /> },
      { path: "complianttracker", element: <CompliantTracker /> },
      { path: "complaint-submitted", element: <ComplaintSubmitted /> },

      { path: "topperformers", element: <TopPerformers /> },
      { path: "resources", element: <Resource /> },
      {
        path: "adminpage",
        element: <WelcomePage />,
      },
      // Admin-only (protected) routes
      {
        path: "add-carousel",
        element: (
          <ProtectedRoute>
            <AddCarousel />
          </ProtectedRoute>
        ),
      },

      {
        path: "register-user",
        element: (
          <ProtectedRoute>
            <UserRegistration />
          </ProtectedRoute>
        ),
      },

      // Auth
      { path: "login", element: <Login /> },
    ],
  },
]);

export default routes;
