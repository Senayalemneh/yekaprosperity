import React, { useState, useEffect } from "react";
import { Card, Button, Pagination } from "antd";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";
import { Link } from "react-router-dom";
import Img from "../../assets/4334.png"; // Replace with the actual path to the logo
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS
import { useTranslation } from "react-i18next";

const OfficesList = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Mock data for office information
  const offices = [
    { name: t("Farmers & Urban Agriculture Development Office"), logo: Img },
    { name: t("Environmental Protection Office"), logo: Img },
    { name: t("Education Office"), logo: Img },
    { name: t("Innovation and Technology Development Office"), logo: Img },
    { name: t("Trade Office"), logo: Img },
    { name: t("Executive Manager"), logo: Img },
    { name: t("Employment and Skills Office"), logo: Img },
    { name: t("Urban Beauty and Green Development Office"), logo: Img },
    { name: t("Office of Justice"), logo: Img },
    { name: t("Public Service Pool Management Finance Office"), logo: Img },
    { name: t("Manager Pool Coordinator Office"), logo: Img },
    { name: t("General Manager's Office"), logo: Img },
    {
      name: t("Chief Executive Pool Administration and Finance Office"),
      logo: Img,
    },
    { name: t("Cleaning Management Office"), logo: Img },
    { name: t("Food, Drug and Health Care Management and Control"), logo: Img },
    {
      name: t("Design and Construction Management and Finance Office"),
      logo: Img,
    },
    { name: t("Planning and Development Commission Office"), logo: Img },
    {
      name: t("Community Participation and Goodwill Coordination Office"),
      logo: Img,
    },
    { name: t("Government Property Management Office"), logo: Img },
    { name: t("Health Office"), logo: Img },
    { name: t("Cooperative Office"), logo: Img },
    { name: t("Yeka Sub City Housing Administration Office"), logo: Img },
    { name: t("Administration Communication Office"), logo: Img },
    {
      name: t("Public Service and Human Resources Development Office"),
      logo: Img,
    },
    { name: t("Women, Children and Social Affairs Office"), logo: Img },
    { name: t("Culture, Arts and Tourism Office"), logo: Img },
    { name: t("Peace and Security Office"), logo: Img },
    { name: t("Building Permit and Inspection Office"), logo: Img },
    { name: t("Council Office"), logo: Img },
    { name: t("Industrial Development Office"), logo: Img },
  ];

  // Calculate the indexes of the items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = offices.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-[#0a4275]">
        {t("Addis Ababa Transport Bureau Bole Branch Administration Offices")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {currentItems.map((office, index) => (
          <motion.div
            key={index}
            className="w-full"
            data-aos="fade-up"
            data-aos-delay={`${index * 100}`}
          >
            <Card
              hoverable
              cover={
                <div className="flex items-center justify-center h-48">
                  <img
                    alt={office.name}
                    src={office.logo}
                    className="object-contain w-full h-full rounded-t-lg"
                  />
                </div>
              }
              className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-transform duration-500 hover:scale-105"
            >
              <Card.Meta
                title={
                  <h2 className="text-xl mx-auto text-center font-semibold text-gray-800">
                    {office.name}
                  </h2>
                }
                description={
                  <div className="text-center mt-4">
                    <Link to="/management/offices">
                      <Button
                        type="primary"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out"
                      >
                        {t("READ MORE")}
                      </Button>
                    </Link>
                  </div>
                }
              />
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          total={offices.length}
          pageSize={itemsPerPage}
          onChange={onPageChange}
          showSizeChanger={false}
          className="text-center"
        />
      </div>
    </div>
  );
};

export default OfficesList;
