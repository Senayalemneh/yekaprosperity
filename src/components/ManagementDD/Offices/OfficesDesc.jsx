import React, { useState, useEffect } from "react";
import { Card, Pagination } from "antd";
import { getApiUrl } from "../../../utils/getApiUrl";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import Loader from "../../common/Loader";

const OfficesList = () => {
  let apiUrl = getApiUrl();
  const { t } = useTranslation();
  const [offices, setOffices] = useState([]); // Ensures offices is an array
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await fetch(`${apiUrl}api/addoffice`);
        const data = await response.json();

        console.log("Fetched Data:", data); // Debugging
        console.log("Type of data:", typeof data);
        console.log("Is data an array?", Array.isArray(data));

        if (Array.isArray(data)) {
          setOffices(data);
        } else {
          console.error("Expected an array but got:", data);
          setOffices([]); // Ensures no error occurs if API response is invalid
        }
      } catch (error) {
        console.error("Error fetching offices:", error);
        setOffices([]); // Prevents breaking by setting an empty array on failure
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(offices)
    ? offices.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white text-[#0a4275] py-16 px-4 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-[#f5a623]">
        {t("Addis Ababa Transport Bureau Bole Branch Administration Offices")}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentItems.map((office, index) => (
              <motion.div
                key={office._id}
                className="w-full p-8"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  hoverable
                  cover={
                    <div className="flex items-center justify-center h-56 overflow-hidden">
                      <img
                        alt={office.name}
                        src={`${apiUrl}uploads/Offices/${office.logo}`}
                        className="w-full h-full object-fill rounded-t-lg"
                      />
                    </div>
                  }
                  className="bg-blue-900 text-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                >
                  <Card.Meta
                    title={
                      <h2 className="text-xl font-semibold text-center text-white mb-4">
                        {office.name}
                      </h2>
                    }
                    description={
                      <div className="text-center">
                        <Link
                          to={`/management/offices/${office._id}`}
                          className="inline-block bg-[#f5a623] text-white py-2 px-6 rounded-full hover:bg-white transition-colors"
                        >
                          {t("READ MORE")}
                        </Link>
                      </div>
                    }
                  />
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Pagination
              current={currentPage}
              total={offices.length}
              pageSize={itemsPerPage}
              onChange={onPageChange}
              showSizeChanger={false}
              className="bg-white rounded-lg p-2 shadow-md"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OfficesList;
