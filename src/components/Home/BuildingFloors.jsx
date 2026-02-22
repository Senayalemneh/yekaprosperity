import React, { useState, useEffect } from 'react';
import { getApiUrl } from "../../utils/getApiUrl";
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp, FaBuilding, FaDoorOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const BuildingFloors = () => {
  let apiUrl = getApiUrl();
  const { t } = useTranslation();
  const [floors, setFloors] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedFloor, setExpandedFloor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/offices`);
      const floorsData = response.data.reduce((acc, floorData) => {
        const floor = floorData.floor;
        const offices = floorData.offices[0].split(',').map(office => office.trim());
        acc[floor] = offices;
        return acc;
      }, {});
      setFloors(floorsData);
    } catch (error) {
      console.error('Error fetching office data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFloor = (floor) => {
    setExpandedFloor(expandedFloor === floor ? null : floor);
  };

  const filteredFloors = Object.entries(floors).filter(([floor, offices]) => {
    return (
      floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offices.some(office => office.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center bg-white p-4 rounded-full shadow-lg mb-4">
            <FaBuilding className="text-indigo-600 text-3xl mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              {t('Building Offices')}
            </h1>
          </div>
        
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search floors or offices..."
              className="w-full p-4 pl-12 rounded-xl border-0 shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFloors.length > 0 ? (
              filteredFloors.map(([floor, offices]) => (
                <motion.div
                  key={floor}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                    expandedFloor === floor ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <div
                    className={`p-6 cursor-pointer flex justify-between items-center ${
                      expandedFloor === floor ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'
                    }`}
                    onClick={() => toggleFloor(floor)}
                  >
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg mr-4 ${
                        expandedFloor === floor ? 'bg-indigo-700' : 'bg-indigo-100'
                      }`}>
                        <FaBuilding className={`text-lg ${
                          expandedFloor === floor ? 'text-white' : 'text-indigo-600'
                        }`} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{floor}</h2>
                        {/* <p className="text-sm opacity-80">
                          {offices.length} {offices.length === 1 ? 'office' : 'offices'}
                        </p> */}
                      </div>
                    </div>
                    {expandedFloor === floor ? (
                      <FaChevronUp className="text-lg" />
                    ) : (
                      <FaChevronDown className="text-lg" />
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedFloor === floor && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0">
                          <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                              <FaDoorOpen className="mr-2 text-indigo-500" />
                             {t('Available Departemtnes')}
                            </h3>
                            <ul className="space-y-2">
                              {offices.map((office, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center py-2 px-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                >
                                  <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mr-3 text-sm font-medium">
                                    {index + 1}
                                  </span>
                                  <span>{office}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="inline-block p-6 bg-white rounded-2xl shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingFloors;