// src/components/DataTable.js
import React, { useEffect, useState } from 'react';
import { getApiUrl } from "../../utils/getApiUrl"; // Get API URL
import axios from 'axios';
import { useTranslation } from "react-i18next";
import AOS from 'aos';
import 'aos/dist/aos.css';

const DataTable = () => {
  let apiUrl = getApiUrl();
  const { t } = useTranslation();
  const [data, setData] = useState({
    area: [],
    gender: [],
    building: [],
    govBuilding: [],
    healthFacility: [],
    house: [],
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Fetch data from backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/data`);
        const allData = response.data;

        setData({
          area: allData.filter(item => item.category === 'Area'),
          gender: allData.filter(item => item.category === 'Gender Distribution'),
          building: allData.filter(item => item.category === 'Buildings'),
          govBuilding: allData.filter(item => item.category === 'Government and Personal Buildings'),
          healthFacility: allData.filter(item => item.category === 'Health Facilities'),
          house: allData.filter(item => item.category === 'House Data'),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mx-auto p-4 bg-[#00CAFF]">
      <h1 className="text-3xl font-bold mb-8 text-center text-white" data-aos="fade-up">
        {t('Area and Population Data')}
      </h1>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Area Data */}
        <div className="mb-8 p-4 shadow-lg rounded-lg bg-white" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-xl font-semibold mb-4">{t('Area')}</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="w-full bg-gray-100">
                <th className="p-2 border-b text-left">{t('Name')}</th>
                <th className="p-2 border-b text-left">{t('Value')}</th>
              </tr>
            </thead>
            <tbody>
              {data.area.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{item.name}</td>
                  <td className="p-2 border-b">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gender Distribution */}
        <div className="mb-8 p-4 shadow-lg rounded-lg bg-white" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-xl font-semibold mb-4">{t('Gender Distribution')}</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="w-full bg-gray-100">
                <th className="p-2 border-b text-left">{t('Name')}</th>
                <th className="p-2 border-b text-left">{t('Value')}</th>
              </tr>
            </thead>
            <tbody>
              {data.gender.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{item.name}</td>
                  <td className="p-2 border-b">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buildings */}
        <div className="mb-8 p-4 shadow-lg rounded-lg bg-white" data-aos="fade-up" data-aos-delay="400">
          <h2 className="text-xl font-semibold mb-4">{t('Buildings')}</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="w-full bg-gray-100">
                <th className="p-2 border-b text-left">{t('Name')}</th>
                <th className="p-2 border-b text-left">{t('Value')}</th>
              </tr>
            </thead>
            <tbody>
              {data.building.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{item.name}</td>
                  <td className="p-2 border-b">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Government and Personal Buildings */}
        <div className="mb-8 p-4 shadow-lg rounded-lg bg-white" data-aos="fade-up" data-aos-delay="500">
          <h2 className="text-xl font-semibold mb-4">{t('Government and Private Education')}</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="w-full bg-gray-100">
                <th className="p-2 border-b text-left">{t('Name')}</th>
                <th className="p-2 border-b text-left">{t('Value')}</th>
              </tr>
            </thead>
            <tbody>
              {data.govBuilding.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{item.name}</td>
                  <td className="p-2 border-b">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Health Facilities */}
        <div className="mb-8 p-4 shadow-lg rounded-lg bg-white" data-aos="fade-up" data-aos-delay="600">
          <h2 className="text-xl font-semibold mb-4">{t('Health Facilities')}</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="w-full bg-gray-100">
                <th className="p-2 border-b text-left">{t('Name')}</th>
                <th className="p-2 border-b text-left">{t('Value')}</th>
              </tr>
            </thead>
            <tbody>
              {data.healthFacility.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{item.name}</td>
                  <td className="p-2 border-b">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* House Data */}
        <div className="mb-8 p-4 shadow-lg rounded-lg bg-white" data-aos="fade-up" data-aos-delay="700">
          <h2 className="text-xl font-semibold mb-4">{t('House Data')}</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="w-full bg-gray-100">
                <th className="p-2 border-b text-left">{t('Name')}</th>
                <th className="p-2 border-b text-left">{t('Value')}</th>
              </tr>
            </thead>
            <tbody>
              {data.house.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{item.name}</td>
                  <td className="p-2 border-b">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
