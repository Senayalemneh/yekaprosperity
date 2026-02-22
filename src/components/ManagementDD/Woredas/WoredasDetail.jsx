import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../../utils/getApiUrl"; // Get API URL
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../../common/Loader";

const WoredaDetail = () => {
  let apiUrl = getApiUrl();
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS for animations

    const fetchWoredaDetail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/addworeda/${id}`);
        setDetail(response.data);
      } catch (error) {
        console.error("Error fetching woreda details:", error);
      }
    };

    fetchWoredaDetail();
  }, [id]);

  if (!detail) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
        <Loader />
      </div>
    );
  }

  // Split coreValues string into an array
  const coreValuesList = detail.coreValues
    .split(",")
    .map((value) => value.trim());

  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-16 px-4 lg:px-8 min-h-screen">
      <div className="container mx-auto">
        <Link
          to="/management/woredas"
          className="text-white mb-4 inline-block hover:text-gray-200 transition-colors"
        >
          &larr; {t("Back")}
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          data-aos="fade-up"
        >
          <h1 className="text-4xl font-extrabold text-center mb-8">
            {detail.name}
          </h1>
          <div className="bg-white text-[#0a4275] p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">
              {t("About Addis Ababa Transport Bureau Bole Branch")}
            </h2>
            <p className="text-lg mb-8">{detail.floor}</p>

            <h2 className="text-2xl font-bold mb-6">{t("Vision")}</h2>
            <p className="text-lg mb-8">{detail.vision}</p>

            <h2 className="text-2xl font-bold mb-6">{t("Mission")}</h2>
            <p className="text-lg mb-8">{detail.mission}</p>

            <h2 className="text-2xl font-bold mb-6">{t("Core Values")}</h2>
            <ul className="list-disc list-inside space-y-2 mb-8">
              {coreValuesList.map((value, index) => (
                <li key={index} className="text-lg">
                  {value}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold mb-6">
              {t("Contact Information")}
            </h2>
            <div className="space-y-4">
              <p className="flex items-center text-lg">
                <FaPhone className="mr-2 text-[#f5a623]" /> {detail.phoneNumber}
              </p>
              <p className="flex items-center text-lg">
                <FaEnvelope className="mr-2 text-[#f5a623]" /> {detail.email}
              </p>
              <p className="flex items-center text-lg">
                <FaMapMarkerAlt className="mr-2 text-[#f5a623]" />{" "}
                {detail.address}
              </p>
            </div>
          </div>

          <div className="relative w-full h-96 sm:h-[450px] mt-12 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={detail.location}
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WoredaDetail;
