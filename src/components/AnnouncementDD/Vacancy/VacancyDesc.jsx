import React, { useEffect, useState } from "react";
import { getApiUrl } from "../../../utils/getApiUrl";
import axios from "axios";
import {
  Table,
  Pagination,
  Input,
  Empty,
  Modal,
  Tag,
  Button,
  Space,
  Divider,
  Typography,
  Image,
  Spin,
  Alert,
  Card,
  Row,
  Col,
  Badge,
  Tabs,
} from "antd";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import {
  FiDownload,
  FiExternalLink,
  FiSearch,
  FiCalendar,
  FiBriefcase,
  FiGrid,
  FiList,
  FiEye,
  FiClock,
} from "react-icons/fi";
import { BsFileEarmarkWord, BsFileEarmarkPdf } from "react-icons/bs";
import { MdOutlineDescription, MdOutlineWorkOutline } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const { Search } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const VacanciesList = () => {
  const apiUrl = getApiUrl();
  const { t, i18n } = useTranslation();

  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [activeStatus, setActiveStatus] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}api/vacancies`);
      if (response.data.success) {
        const vacanciesData = response.data.data || [];
        setVacancies(vacanciesData);
        setFilteredVacancies(vacanciesData);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            vacanciesData.map((vacancy) => getLocalizedValue(vacancy.category))
          ),
        ];
        setCategories(uniqueCategories);
      } else {
        setError(t("vacancyfe.fetchError"));
      }
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      setError(error.message || t("vacancyfe.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = vacancies.filter((vacancy) => {
      const title = getLocalizedValue(vacancy.title);
      const category = getLocalizedValue(vacancy.category);
      const description = getLocalizedValue(vacancy.description);
      const searchTerm = value.toLowerCase();

      return (
        title.toLowerCase().includes(searchTerm) ||
        category.toLowerCase().includes(searchTerm) ||
        description.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredVacancies(filtered);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    if (status === "all") {
      setFilteredVacancies(vacancies);
    } else {
      const filtered = vacancies.filter((vacancy) => vacancy.status === status);
      setFilteredVacancies(filtered);
    }
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    const filtered = vacancies.filter(
      (vacancy) => getLocalizedValue(vacancy.category) === category
    );
    setFilteredVacancies(filtered);
    setCurrentPage(1);
  };

  const getLocalizedValue = (obj) => {
    if (!obj) return "";
    return obj[i18n.language] || obj.en || "";
  };

  const getFullUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${apiUrl}uploads/${path}`;
  };

  const getFileIcon = (filename) => {
    if (!filename)
      return <MdOutlineDescription className="text-gray-400 text-2xl" />;
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "doc":
      case "docx":
        return <BsFileEarmarkWord className="text-blue-500 text-2xl" />;
      case "pdf":
        return <BsFileEarmarkPdf className="text-red-500 text-2xl" />;
      default:
        return <MdOutlineDescription className="text-gray-400 text-2xl" />;
    }
  };

  const getStatusBadge = (status) => {
    if (status === "open") {
      return (
        <Badge
          status="success"
          text={t("vacancyfe.open")}
          className="bg-green-100 text-[#008830] px-3 py-1 rounded-full text-xs font-medium"
        />
      );
    }

    return (
      <Badge
        status="error"
        text={t("vacancyfe.closed")}
        className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium"
      />
    );
  };

  const columns = [
    {
      title: t("vacancyfe.title"),
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <Text strong className="text-[#136094]">
          {getLocalizedValue(title)}
        </Text>
      ),
    },
    {
      title: t("vacancyfe.category"),
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3">
          {getLocalizedValue(category)}
        </Tag>
      ),
    },
    {
      title: t("vacancyfe.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
    {
      title: t("vacancyfe.postedDate"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <div className="flex items-center text-[#136094]">
          <FiCalendar className="mr-2" />
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: t("vacancyfe.actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              icon={<FiEye />}
              onClick={() => {
                setSelectedVacancy(record);
                setIsModalVisible(true);
              }}
              className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
            >
              {t("vacancyfe.view")}
            </Button>
          </motion.div>
        </Space>
      ),
    },
  ];

  const renderVacancyCard = (vacancy, index) => {
    return (
      <Col key={vacancy.id} xs={24} sm={12} lg={8} className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card
            hoverable
            className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden"
            cover={
              vacancy.coverimage ? (
                <div className="h-full text-center overflow-hidden relative">
                  <Image
                    src={getFullUrl(vacancy.coverimage)}
                    alt={getLocalizedValue(vacancy.title)}
                    preview={false}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(vacancy.status)}
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-[#136094]/10 to-[#008830]/10 flex items-center justify-center">
                  <MdOutlineWorkOutline className="text-[#136094] text-4xl opacity-50" />
                </div>
              )
            }
            onClick={() => {
              setSelectedVacancy(vacancy);
              setIsModalVisible(true);
            }}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3 py-1 text-xs font-medium">
                    {getLocalizedValue(vacancy.category)}
                  </Tag>
                </div>

                <Title level={5} className="!mb-3 !text-[#136094] line-clamp-2">
                  {getLocalizedValue(vacancy.title)}
                </Title>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 text-[#136094]" />
                    <Text className="text-sm">
                      {new Date(vacancy.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiBriefcase className="mr-2 text-[#136094]" />
                    <Text className="text-sm">
                      {getLocalizedValue(vacancy.category)}
                    </Text>
                  </div>
                </div>

                <div className="mt-3">
                  <Text className="text-gray-600 text-sm line-clamp-2">
                    {getLocalizedValue(vacancy.description)}
                  </Text>
                </div>
              </div>

              <div className="mt-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="primary"
                    block
                    className="bg-gradient-to-r from-[#136094] to-[#008830] hover:from-[#0f4a7a] hover:to-[#007a2a] border-none h-10 font-semibold rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVacancy(vacancy);
                      setIsModalVisible(true);
                    }}
                  >
                    {t("vacancyfe.viewDetails")}
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Col>
    );
  };

  return (
    <div
      className="bg-gradient-to-br from-[#136094]/5 to-[#008830]/5 py-16 px-4 lg:px-8"
      data-aos="fade-up"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            level={1}
            className="!text-4xl !font-bold !text-[#136094] mb-4"
          >
            {t("vacancyfe.jobVacancies")}
          </Title>
          <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("vacancyfe.subtitle")}
          </Text>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="rounded-2xl shadow-lg border border-[#136094]/10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <Search
                  placeholder={t("vacancyfe.searchPlaceholder")}
                  allowClear
                  enterButton={
                    <Button
                      type="primary"
                      icon={<FiSearch />}
                      className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
                    >
                      {t("vacancyfe.search")}
                    </Button>
                  }
                  size="large"
                  onSearch={handleSearch}
                  className="max-w-md"
                />
              </div>

              <Space size="middle">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type={viewMode === "list" ? "primary" : "default"}
                    icon={<FiList />}
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list"
                        ? "bg-[#136094] border-[#136094]"
                        : "border-[#136094] text-[#136094]"
                    }
                  >
                    {t("vacancyfe.listView")}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type={viewMode === "grid" ? "primary" : "default"}
                    icon={<FiGrid />}
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-[#136094] border-[#136094]"
                        : "border-[#136094] text-[#136094]"
                    }
                  >
                    {t("vacancyfe.gridView")}
                  </Button>
                </motion.div>
              </Space>
            </div>

            {/* Status Filters */}
            <div className="mt-6">
              <div className="flex items-center mb-3">
                <FiClock className="text-[#136094] mr-2" />
                <Text strong className="text-[#136094]">
                  Filter by Status:
                </Text>
              </div>
              <div className="flex flex-wrap gap-2">
                {["all", "open", "closed"].map((status) => (
                  <motion.div
                    key={status}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type={activeStatus === status ? "primary" : "default"}
                      size="small"
                      onClick={() => handleStatusFilter(status)}
                      className={
                        activeStatus === status
                          ? "bg-[#ffca40] border-[#ffca40] text-[#136094]"
                          : "border-[#136094] text-[#136094]"
                      }
                    >
                      {status === "all"
                        ? "All Vacancies"
                        : status === "open"
                        ? "Open"
                        : "Closed"}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            {categories.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center mb-3">
                  <FiBriefcase className="text-[#136094] mr-2" />
                  <Text strong className="text-[#136094]">
                    Filter by Category:
                  </Text>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.div
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="default"
                        size="small"
                        onClick={() => handleCategoryFilter(category)}
                        className="border-[#136094] text-[#136094] hover:bg-[#136094] hover:text-white"
                      >
                        {category}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Vacancies Content */}
        {loading ? (
          <div className="text-center py-16">
            <Spin size="large" className="text-[#136094]" />
          </div>
        ) : error ? (
          <Alert
            message={t("vacancyfe.error")}
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="rounded-2xl"
          />
        ) : filteredVacancies.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <Row gutter={[24, 24]}>
                  {filteredVacancies
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((vacancy, index) => renderVacancyCard(vacancy, index))}
                </Row>
              ) : (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="rounded-2xl shadow-lg border border-[#136094]/10">
                    <Table
                      columns={columns}
                      dataSource={filteredVacancies}
                      rowKey="id"
                      pagination={false}
                      loading={loading}
                      className="custom-table"
                    />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <Text type="secondary" className="text-[#136094]">
                {t("vacancyfe.showing")} {(currentPage - 1) * pageSize + 1}{" "}
                {t("vacancyfe.to")}{" "}
                {Math.min(currentPage * pageSize, filteredVacancies.length)}{" "}
                {t("vacancyfe.of")} {filteredVacancies.length}{" "}
                {t("vacancyfe.entries")}
              </Text>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredVacancies.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
                className="custom-pagination"
                itemRender={(current, type, originalElement) => {
                  if (type === "page") {
                    return (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          type={current === currentPage ? "primary" : "default"}
                          className={
                            current === currentPage
                              ? "bg-[#136094] border-[#136094]"
                              : "border-[#136094] text-[#136094]"
                          }
                        >
                          {current}
                        </Button>
                      </motion.div>
                    );
                  }
                  return originalElement;
                }}
              />
            </div>
          </>
        ) : (
          <Card className="shadow-lg rounded-2xl border border-[#136094]/10">
            <Empty
              description={
                <Text className="text-gray-600 text-lg">
                  {t("vacancyfe.noVacancies")}
                </Text>
              }
              imageStyle={{ height: 120 }}
            />
          </Card>
        )}

        {/* Vacancy Details Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <MdOutlineWorkOutline className="text-[#136094] text-xl mr-2" />
              <span className="text-[#136094] font-bold">
                {t("vacancyfe.vacancyDetails")}
              </span>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={900}
          destroyOnClose
          className="vacancy-details-modal"
        >
          {selectedVacancy && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <Title level={3} className="!mb-2 !text-[#136094]">
                    {getLocalizedValue(selectedVacancy.title)}
                  </Title>
                  <div className="flex flex-wrap gap-2">
                    <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3 py-1">
                      {getLocalizedValue(selectedVacancy.category)}
                    </Tag>
                    {getStatusBadge(selectedVacancy.status)}
                  </div>
                </div>
              </div>

              <Divider className="my-4 border-[#136094]/20" />

              {/* Vacancy Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <FiBriefcase className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("vacancyfe.category")}
                    </Text>
                    <Text className="text-gray-700">
                      {getLocalizedValue(selectedVacancy.category)}
                    </Text>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <FiCalendar className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("vacancyfe.postedDate")}
                    </Text>
                    <Text className="text-gray-700">
                      {new Date(selectedVacancy.created_at).toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              <Divider className="my-4 border-[#136094]/20" />

              {/* Description */}
              <div>
                <Text strong className="block text-[#136094] mb-3 text-lg">
                  {t("vacancyfe.description")}
                </Text>
                <div className="p-4 bg-gradient-to-r from-[#136094]/5 to-[#008830]/5 rounded-xl whitespace-pre-line border border-[#136094]/10">
                  {getLocalizedValue(selectedVacancy.description) ||
                    t("vacancyfe.noDescription")}
                </div>
              </div>

              {/* Cover Image */}
              {selectedVacancy.coverimage && (
                <div className="mt-6">
                  <Text strong className="block text-[#136094] mb-3 text-lg">
                    {t("vacancyfe.coverImage")}
                  </Text>
                  <Image
                    src={getFullUrl(selectedVacancy.coverimage)}
                    alt={getLocalizedValue(selectedVacancy.title)}
                    className="rounded-xl shadow-lg"
                    preview={false}
                  />
                </div>
              )}

              {/* Attached File */}
              {selectedVacancy.file && (
                <div className="mt-6">
                  <Text strong className="block text-[#136094] mb-3 text-lg">
                    {t("vacancyfe.attachedFile")}
                  </Text>
                  <div className="p-4 border border-[#136094]/20 rounded-xl flex items-center justify-between bg-white">
                    <div className="flex items-center">
                      {getFileIcon(selectedVacancy.file)}
                      <div className="ml-4">
                        <Text strong className="block text-[#136094]">
                          {selectedVacancy.file.split("/").pop()}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Job Description Document
                        </Text>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="primary"
                        icon={<FiDownload />}
                        href={getFullUrl(selectedVacancy.file)}
                        download
                        className="bg-gradient-to-r from-[#136094] to-[#008830] hover:from-[#0f4a7a] hover:to-[#007a2a] border-none"
                      >
                        {t("vacancyfe.download")}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default VacanciesList;
