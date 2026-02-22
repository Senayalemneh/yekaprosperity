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
  Card,
  Row,
  Col,
  Badge,
  Spin,
  Alert,
  Divider,
  Typography,
  Image,
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
  FiFileText,
  FiDollarSign,
  FiClock,
  FiGrid,
  FiList,
  FiEye
} from "react-icons/fi";
import { BsFileEarmarkPdf, BsClockHistory } from "react-icons/bs";
import { MdOutlineAttachMoney, MdOutlineCategory } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const { Search } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const TenderList = () => {
  let apiUrl = getApiUrl();
  const { t, i18n } = useTranslation();
  
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [selectedTender, setSelectedTender] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [activeStatus, setActiveStatus] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}api/tenders`);
      if (response.data.success) {
        const tendersData = response.data.data || [];
        setData(tendersData);
        setFilteredData(tendersData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(tendersData.map(tender => 
          getLocalizedValue(tender.category)
        ))];
        setCategories(uniqueCategories);
      } else {
        setError(t("tenderf.fetchError"));
      }
    } catch (error) {
      console.error("Error fetching tenders:", error);
      setError(error.message || t("tenderf.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = data.filter((item) => {
      const title = getLocalizedValue(item.title);
      const category = getLocalizedValue(item.category);
      const reference = item.reference_number || "";
      const searchTerm = value.toLowerCase();
      
      return (
        title.toLowerCase().includes(searchTerm) ||
        category.toLowerCase().includes(searchTerm) ||
        reference.toLowerCase().includes(searchTerm) ||
        getLocalizedValue(item.description).toLowerCase().includes(searchTerm)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    if (status === "all") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(tender => tender.status === status);
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    const filtered = data.filter(tender => 
      getLocalizedValue(tender.category) === category
    );
    setFilteredData(filtered);
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

  const getStatusBadge = (status, closingDate) => {
    const now = new Date();
    const closing = new Date(closingDate);
    
    if (status === "active") {
      if (closing < now) {
        return (
          <Badge 
            status="error" 
            text={t("tenderf.expired")}
            className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium"
          />
        );
      }
      return (
        <Badge 
          status="success" 
          text={t("tenderf.active")}
          className="bg-green-100 text-[#008830] px-3 py-1 rounded-full text-xs font-medium"
        />
      );
    }
    
    return (
      <Badge 
        status="default" 
        text={t("tenderf.closed")}
        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
      />
    );
  };

  const getDaysRemaining = (closingDate) => {
    const now = new Date();
    const closing = new Date(closingDate);
    const diffTime = closing - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { days: 0, text: t("tenderf.expired") };
    if (diffDays === 0) return { days: 0, text: t("tenderf.endsToday") };
    if (diffDays === 1) return { days: 1, text: t("tenderf.endsTomorrow") };
    return { days: diffDays, text: t("tenderf.daysRemaining", { days: diffDays }) };
  };

  const columns = [
    {
      title: t("tenderf.title"),
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <Text strong className="text-[#136094]">
          {getLocalizedValue(title)}
        </Text>
      ),
    },
    {
      title: t("tenderf.referenceNumber"),
      dataIndex: "reference_number",
      key: "reference_number",
      render: (ref) => (
        <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3">
          {ref}
        </Tag>
      ),
    },
    {
      title: t("tenderf.category"),
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <div className="flex items-center text-[#136094]">
          <MdOutlineCategory className="mr-2" />
          {getLocalizedValue(category)}
        </div>
      ),
    },
    {
      title: t("tenderf.openingDate"),
      dataIndex: "opening_date",
      key: "opening_date",
      render: (date) => (
        <div className="flex items-center text-[#136094]">
          <FiCalendar className="mr-2" />
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: t("tenderf.closingDate"),
      dataIndex: "closing_date",
      key: "closing_date",
      render: (date) => (
        <div className="flex items-center text-[#136094]">
          <FiClock className="mr-2" />
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: t("tenderf.status"),
      dataIndex: "status",
      key: "status",
      render: (status, record) => getStatusBadge(status, record.closing_date),
    },
    {
      title: t("tenderf.actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              icon={<FiEye />}
              onClick={() => handleView(record)}
              className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
            >
              {t("tenderf.view")}
            </Button>
          </motion.div>
        </Space>
      ),
    },
  ];

  const renderTenderCard = (tender, index) => {
    const daysRemaining = getDaysRemaining(tender.closing_date);
    const isUrgent = daysRemaining.days > 0 && daysRemaining.days <= 3;

    return (
      <Col key={tender.id} xs={24} sm={12} lg={8} className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card
            hoverable
            className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden"
            cover={
              tender.cover_image ? (
                <div className="h-full text-center overflow-hidden relative">
                  <Image
                    src={getFullUrl(tender.cover_image)}
                    alt={getLocalizedValue(tender.title)}
                    preview={false}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(tender.status, tender.closing_date)}
                  </div>
                  {isUrgent && tender.status === "active" && (
                    <div className="absolute top-3 right-3">
                      <Badge 
                        count={t("tenderf.urgent")}
                        className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-[#136094]/10 to-[#008830]/10 flex items-center justify-center">
                  <FiFileText className="text-[#136094] text-4xl opacity-50" />
                </div>
              )
            }
            onClick={() => handleView(tender)}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3 py-1 text-xs font-medium">
                    {tender.reference_number}
                  </Tag>
                  {daysRemaining.days > 0 && tender.status === "active" && (
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isUrgent 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-blue-100 text-[#136094]'
                    }`}>
                      {daysRemaining.text}
                    </div>
                  )}
                </div>
                
                <Title level={5} className="!mb-3 !text-[#136094] line-clamp-2">
                  {getLocalizedValue(tender.title)}
                </Title>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MdOutlineCategory className="mr-2 text-[#136094]" />
                    <Text className="text-sm">{getLocalizedValue(tender.category)}</Text>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 text-[#136094]" />
                    <Text className="text-sm">
                      {new Date(tender.opening_date).toLocaleDateString()} - {new Date(tender.closing_date).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="primary"
                    block
                    className="bg-gradient-to-r from-[#136094] to-[#008830] hover:from-[#0f4a7a] hover:to-[#007a2a] border-none h-10 font-semibold rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(tender);
                    }}
                  >
                    {t("tenderf.viewDetails")}
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Col>
    );
  };

  const handleView = (record) => {
    setSelectedTender(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTender(null);
  };

  return (
    <div className="bg-gradient-to-br from-[#136094]/5 to-[#008830]/5 py-16 px-4 lg:px-8" data-aos="fade-up">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title level={1} className="!text-4xl !font-bold !text-[#136094] mb-4">
            {t("tenderf.tenders")}
          </Title>
          
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
                  placeholder={t("tenderf.searchPlaceholder")}
                  allowClear
                  enterButton={
                    <Button 
                      type="primary" 
                      icon={<FiSearch />}
                      className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
                    >
                      {t("tenderf.search")}
                    </Button>
                  }
                  size="large"
                  onSearch={handleSearch}
                  className="max-w-md"
                />
              </div>

              <Space size="middle">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type={viewMode === "list" ? "primary" : "default"}
                    icon={<FiList />}
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-[#136094] border-[#136094]" : "border-[#136094] text-[#136094]"}
                  >
                    {t("tenderf.listView")}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type={viewMode === "grid" ? "primary" : "default"}
                    icon={<FiGrid />}
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-[#136094] border-[#136094]" : "border-[#136094] text-[#136094]"}
                  >
                    {t("tenderf.gridView")}
                  </Button>
                </motion.div>
              </Space>
            </div>

            {/* Status Filters */}
            <div className="mt-6">
              <div className="flex items-center mb-3">
                <BsClockHistory className="text-[#136094] mr-2" />
                <Text strong className="text-[#136094]">Filter by Status:</Text>
              </div>
              <div className="flex flex-wrap gap-2">
                {["all", "active", "closed"].map(status => (
                  <motion.div key={status} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type={activeStatus === status ? "primary" : "default"}
                      size="small"
                      onClick={() => handleStatusFilter(status)}
                      className={activeStatus === status ? "bg-[#ffca40] border-[#ffca40] text-[#136094]" : "border-[#136094] text-[#136094]"}
                    >
                      {status === "all" ? "All Tenders" : 
                       status === "active" ? "Active" : "Closed"}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            {categories.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center mb-3">
                  <MdOutlineCategory className="text-[#136094] mr-2" />
                  <Text strong className="text-[#136094]">Filter by Category:</Text>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

        {/* Tenders Content */}
        {loading ? (
          <div className="text-center py-16">
            <Spin size="large" className="text-[#136094]" />
          </div>
        ) : error ? (
          <Alert
            message={t("tenderf.error")}
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="rounded-2xl"
          />
        ) : filteredData.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <Row gutter={[24, 24]}>
                  {filteredData
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((tender, index) => renderTenderCard(tender, index))}
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
                      dataSource={filteredData}
                      pagination={false}
                      rowKey="id"
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
                {t("tenderf.showing")} {(currentPage - 1) * pageSize + 1} {t("tenderf.to")}{" "}
                {Math.min(currentPage * pageSize, filteredData.length)}{" "}
                {t("tenderf.of")} {filteredData.length} {t("tenderf.entries")}
              </Text>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
                className="custom-pagination"
                itemRender={(current, type, originalElement) => {
                  if (type === 'page') {
                    return (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button 
                          type={current === currentPage ? "primary" : "default"}
                          className={current === currentPage ? "bg-[#136094] border-[#136094]" : "border-[#136094] text-[#136094]"}
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
                <Text className="text-gray-600 text-lg">{t("tenderf.noTenders")}</Text>
              }
              imageStyle={{ height: 120 }}
            />
          </Card>
        )}

        {/* Tender Details Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <FiFileText className="text-[#136094] text-xl mr-2" />
              <span className="text-[#136094] font-bold">{t("tenderf.tenderDetails")}</span>
            </div>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
          destroyOnClose
          className="tender-details-modal"
        >
          {selectedTender && (
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
                    {getLocalizedValue(selectedTender.title)}
                  </Title>
                  <div className="flex flex-wrap gap-2">
                    <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3 py-1">
                      {selectedTender.reference_number}
                    </Tag>
                    {getStatusBadge(selectedTender.status, selectedTender.closing_date)}
                    {getDaysRemaining(selectedTender.closing_date).days > 0 && selectedTender.status === "active" && (
                      <Badge 
                        className="bg-blue-100 text-[#136094] px-3 py-1 rounded-full text-xs font-medium"
                        text={getDaysRemaining(selectedTender.closing_date).text}
                      />
                    )}
                  </div>
                </div>
              </div>

              <Divider className="my-4 border-[#136094]/20" />

              {/* Tender Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <MdOutlineCategory className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("tenderf.category")}
                    </Text>
                    <Text className="text-gray-700">
                      {getLocalizedValue(selectedTender.category)}
                    </Text>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <FiCalendar className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("tenderf.openingDate")}
                    </Text>
                    <Text className="text-gray-700">
                      {new Date(selectedTender.opening_date).toLocaleString()}
                    </Text>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <FiClock className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("tenderf.closingDate")}
                    </Text>
                    <Text className="text-gray-700">
                      {new Date(selectedTender.closing_date).toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              <Divider className="my-4 border-[#136094]/20" />

              {/* Description */}
              <div>
                <Text strong className="block text-[#136094] mb-3 text-lg">
                  {t("tenderf.description")}
                </Text>
                <div className="p-4 bg-gradient-to-r from-[#136094]/5 to-[#008830]/5 rounded-xl whitespace-pre-line border border-[#136094]/10">
                  {getLocalizedValue(selectedTender.description) || t("tenderf.noDescription")}
                </div>
              </div>

              {/* Cover Image */}
              {selectedTender.cover_image && (
                <div className="mt-6">
                  <Text strong className="block text-[#136094] mb-3 text-lg">
                    {t("tenderf.coverImage")}
                  </Text>
                  <Image
                    src={getFullUrl(selectedTender.cover_image)}
                    alt={getLocalizedValue(selectedTender.title)}
                    className="rounded-xl shadow-lg"
                    preview={false}
                  />
                </div>
              )}

              {/* Tender Document */}
              {selectedTender.tender_document && (
                <div className="mt-6">
                  <Text strong className="block text-[#136094] mb-3 text-lg">
                    {t("tenderf.tenderDocument")}
                  </Text>
                  <div className="p-4 border border-[#136094]/20 rounded-xl flex items-center justify-between bg-white">
                    <div className="flex items-center">
                      <BsFileEarmarkPdf className="text-red-500 text-3xl" />
                      <div className="ml-4">
                        <Text strong className="block text-[#136094]">
                          {selectedTender.tender_document.split("/").pop()}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Tender Document
                        </Text>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="primary"
                        icon={<FiDownload />}
                        href={getFullUrl(selectedTender.tender_document)}
                        download
                        className="bg-gradient-to-r from-[#136094] to-[#008830] hover:from-[#0f4a7a] hover:to-[#007a2a] border-none"
                      >
                        {t("tenderf.downloadDocument")}
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

export default TenderList;