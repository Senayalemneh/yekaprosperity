import React, { useState, useEffect } from "react";
import { Statistic, Row, Col, Card } from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

const AnimatedStatistics = () => {
  const [area, setArea] = useState(0);
  const [population, setPopulation] = useState(0);
  const [elevation, setElevation] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const areaInterval = setInterval(() => {
      setArea((prev) => {
        if (prev >= 1476) clearInterval(areaInterval);
        return Math.min(prev + 12, 1476);
      });
    }, 30);

    const populationInterval = setInterval(() => {
      setPopulation((prev) => {
        if (prev >= 304099) clearInterval(populationInterval);
        return Math.min(prev + 2500, 304099);
      });
    }, 30);

    const elevationInterval = setInterval(() => {
      setElevation((prev) => {
        if (prev >= 2400) clearInterval(elevationInterval);
        return Math.min(prev + 20, 2400);
      });
    }, 30);

    return () => {
      clearInterval(areaInterval);
      clearInterval(populationInterval);
      clearInterval(elevationInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] bg-gradient-to-r from-blue-500 to-purple-600 ">
      <Row gutter={[16, 16]} className="w-full max-w-4xl">
        <Col xs={24} sm={12} md={8} data-aos="fade-up">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg rounded-lg overflow-hidden bg-white">
              <Statistic
                title={
                  <span className="text-sm sm:text-base md:text-lg font-semibold">
                    {t("Area (Km²)")}
                  </span>
                }
                value={area}
                valueStyle={{
                  color: "#3f8600",
                  fontWeight: "bold",
                  fontSize: "24px",
                  sm: "30px",
                  md: "36px",
                }}
                prefix={<EnvironmentOutlined />}
                suffix="Km²"
                className="text-xl sm:text-2xl md:text-3xl"
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} md={8} data-aos="fade-up" data-aos-delay="200">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg rounded-lg overflow-hidden bg-white">
              <Statistic
                title={
                  <span className="text-sm sm:text-base md:text-lg font-semibold">
                    {t("Population")}
                  </span>
                }
                value={population}
                valueStyle={{
                  color: "#cf1322",
                  fontWeight: "bold",
                  fontSize: "24px",
                  sm: "30px",
                  md: "36px",
                }}
                prefix={<UserOutlined />}
                className="text-xl sm:text-2xl md:text-3xl"
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} md={8} data-aos="fade-up" data-aos-delay="400">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg rounded-lg overflow-hidden bg-white">
              <Statistic
                title={
                  <span className="text-sm sm:text-base md:text-lg font-semibold">
                    {t("Elevation (m)")}
                  </span>
                }
                value={elevation}
                valueStyle={{
                  color: "#237804",
                  fontWeight: "bold",
                  fontSize: "24px",
                  sm: "30px",
                  md: "36px",
                }}
                prefix={<RiseOutlined />}
                suffix="m"
                className="text-xl sm:text-2xl md:text-3xl"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default AnimatedStatistics;
