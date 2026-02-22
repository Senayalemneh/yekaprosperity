import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Sample data
const categories = {
  ceoPool: [
    { name: "Administration Finance Office" },
    { name: "Council Office" },
    { name: "Peace and Security Office" },
    { name: "Prosecutor's Office" },
    { name: "Office of Regulation Enforcement" },
    { name: "Planning Commission Office" },
    { name: "Trade Office" },
    { name: "Cooperative Office" },
    { name: "Good Governance Complaints and Appeals Office" },
    { name: "Farmers and Urban Agriculture Office" },
    { name: "Renaissance Dam Construction Coordination Office" },
  ],
  publicPool: [
    { name: "Health Office" },
    { name: "Women, Children and Social Affairs Office" },
    { name: "Culture, Arts and Tourism Office" },
    { name: "Public Service and Human Resources Development Office" },
    { name: "Government Property Management Office" },
    { name: "Communication Office" },
    { name: "Administration Finance Office" },
  ],
  managerPool: [
    { name: "Administration and Green Development Office" },
    { name: "Sanitation Management Office" },
    { name: "Local Safety Office" },
    { name: "Civil Registration and Resident Service Office" },
    { name: "Employment Pool Coordination Office" },
    { name: "Administration Finance Office" },
    { name: "Job Skills Office" },
    { name: "Industrial Development Office" },
    { name: "Jobs Office" },
    { name: "Community Participation and Good Will Coordination Office" },
    { name: "Innovation and Technology Development Office" },
    { name: "Housing Office" },
    { name: "Construction Office" },
  ],
  designPool: [
    { name: "Building Permit Office" },
    { name: "Construction Office" },
    { name: "Housing Office" },
    { name: "Job Skills Office" },
    { name: "Industrial Development Office" },
    { name: "Jobs Office" },
    { name: "Community Participation and Good Will Coordination Office" },
    { name: "Innovation and Technology Development Office" },
    { name: "Administration Finance Office" },
  ],
};

const OrganizationStructure = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-4 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-blue-800">
          {t("Organizational Structure")}
        </h1>

        {/* Chief Executive Manager Section */}
        <div className="flex flex-col items-center mb-12">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
          >
            <h2 className="text-2xl font-bold mb-4 bg-blue-800 text-white p-4 rounded-lg shadow-lg">
              {t("Chief Executive Manager")}
            </h2>
          </motion.div>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* CEO Pool */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 bg-blue-800 text-white p-4 rounded-lg shadow-lg">
              {t("CEO Pool")}
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {categories.ceoPool.map((office, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center bg-white text-blue-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-center">
                    {t(office.name)}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Public Pool */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-4 bg-blue-800 text-white p-4 rounded-lg shadow-lg">
              {t("Public Pool")}
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {categories.publicPool.map((office, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center bg-white text-blue-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-center">
                    {t(office.name)}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Manager Pool */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-xl font-bold mb-4 bg-blue-800 text-white p-4 rounded-lg shadow-lg">
              {t("Manager Pool")}
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {categories.managerPool.map((office, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center bg-white text-blue-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-center">
                    {t(office.name)}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Design and Construction Pool */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-xl font-bold mb-4 bg-blue-800 text-white p-4 rounded-lg shadow-lg">
              {t("Design and Construction Pool")}
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {categories.designPool.map((office, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center bg-white text-blue-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-center">
                    {t(office.name)}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationStructure;