import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../../utils/getApiUrl"; // Get API URL
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../common/Loader"; // Import the Loader component
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkedAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaArrowLeft,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const OfficeDetail = () => {
  let apiUrl = getApiUrl();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS for animations

    const fetchOffice = async () => {
      try {
        const response = await fetch(`${apiUrl}api/addoffice/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOffice(data);
        } else {
          setError("Office details not found.");
        }
      } catch (error) {
        setError("An error occurred while fetching the office details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
        <Loader /> {/* Show loader while data is being fetched */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-red-600 mb-6">{error}</h1>
          <button
            onClick={() => navigate("/management/offices")}
            className="text-white hover:text-gray-200 transition-colors"
          >
            Go back to offices list
          </button>
        </div>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-red-600 mb-6">
            Office Details Not Found
          </h1>
          <button
            onClick={() => navigate("/management/offices")}
            className="text-white hover:text-gray-200 transition-colors"
          >
            Go back to offices list
          </button>
        </div>
      </div>
    );
  }

  const {
    name,
    vision,
    mission,
    coreValues,
    phoneNumber,
    email,
    address,
    floor,
    logo,
  } = office;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-16 px-4 lg:px-8 min-h-screen">
      <div className="container mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-white hover:text-gray-200 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> <span>{t("Back")}</span>
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          data-aos="fade-up"
        >
          <div className="bg-white text-[#0a4275] p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <img
                alt={name}
                src={`${apiUrl}uploads/Offices/${logo}`}
                className="w-72 h-72  object-fill" // Increased logo size
              />
            </div>
            <h1 className="text-4xl font-extrabold text-center mb-6">{name}</h1>

            <h2 className="text-2xl font-bold mb-4">{t("Vision")}</h2>
            <p className="text-lg mb-6">{vision}</p>

            <h2 className="text-2xl font-bold mb-4">{t("Mission")}</h2>
            <p className="text-lg mb-6">{mission}</p>

            <h2 className="text-2xl font-bold mb-4">{t("Core Values")}</h2>
            <p className="text-lg whitespace-pre-line mb-6">{coreValues}</p>

            <h2 className="text-2xl font-bold mb-4">
              {t("Contact Information")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {phoneNumber && (
                <div className="flex items-center space-x-4">
                  <FaPhone className="text-2xl text-[#0a4275] min-w-[24px]" />{" "}
                  {/* Increased icon size */}
                  <p className="text-lg">{phoneNumber}</p>
                </div>
              )}
              {email && (
                <div className="flex items-center space-x-4">
                  <FaEnvelope className="text-2xl text-red-600 min-w-[24px]" />{" "}
                  {/* Increased icon size */}
                  <p className="text-lg">{email}</p>
                </div>
              )}
              {address && (
                <div className="flex items-center space-x-4">
                  <FaMapMarkedAlt className="text-2xl text-gray-700 min-w-[24px]" />{" "}
                  {/* Increased icon size */}
                  <p className="text-lg">{address}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center space-x-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl text-blue-400 hover:text-blue-600 transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl text-pink-500 hover:text-pink-700 transition-colors"
              >
                <FaInstagram />
              </a>
            </div>

            <div className="text-center mt-8">
              <h2 className="text-2xl font-semibold">{t("Floor")}</h2>
              <p className="text-lg">{floor}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OfficeDetail;
