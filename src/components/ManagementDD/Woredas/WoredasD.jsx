import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../../utils/getApiUrl"; // Get API URL
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Loader from "../../common/Loader"; // Import the Loader component

const Woredas = () => {
  let apiUrl = getApiUrl();
  const { t } = useTranslation();
  const [woredas, setWoredas] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchWoredas = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/addworeda`);
        setWoredas(response.data);
      } catch (error) {
        console.error("Error fetching woredas:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchWoredas();
  }, []);

  return (
    <div className="bg-white text-[#0a4275] py-16 px-4 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#f5a623]">
          {t("Yeka Sub City Woredas")}
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader /> {/* Show loader while data is being fetched */}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {woredas.map((woreda) => (
              <motion.div
                key={woreda._id}
                className="bg-blue-900 text-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold mb-4">{t(woreda.name)}</h2>
                <Link
                  to={`/management/woredas/${woreda._id}`}
                  className="bg-[#f5a623] text-white py-2 px-4 rounded hover:bg-[#e68a1f]"
                >
                  {t("READ MORE")}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Woredas;
