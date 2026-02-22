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
  Card,
  Row,
  Col,
  Badge,
  Spin,
  Alert,
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
  FiMapPin,
  FiClock,
  FiGrid,
  FiList,
  FiEye,
} from "react-icons/fi";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { MdOutlineEvent, MdOutlineCategory } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const { Search } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const EventsList = () => {
  const apiUrl = getApiUrl();
  const { t, i18n } = useTranslation();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}api/events`);
      if (response.data.success) {
        const eventsData = response.data.data || [];
        setEvents(eventsData);
        setFilteredEvents(eventsData);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            eventsData.map((event) => getLocalizedValue(event.category))
          ),
        ];
        setCategories(uniqueCategories);
      } else {
        setError(t("eventfe.fetchError"));
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message || t("eventfe.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = events.filter((event) => {
      const title = getLocalizedValue(event.title);
      const category = getLocalizedValue(event.category);
      const location = getLocalizedValue(event.location);
      const searchTerm = value.toLowerCase();

      return (
        title.toLowerCase().includes(searchTerm) ||
        category.toLowerCase().includes(searchTerm) ||
        location.toLowerCase().includes(searchTerm) ||
        getLocalizedValue(event.description).toLowerCase().includes(searchTerm)
      );
    });

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) => getLocalizedValue(event.category) === category
      );
      setFilteredEvents(filtered);
    }
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

  const getStatusBadge = (status, date) => {
    const now = new Date();
    const eventDate = new Date(date);

    if (status === "completed") {
      return (
        <Badge
          status="default"
          text={t("eventfe.completed")}
          className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
        />
      );
    }

    if (eventDate < now) {
      return (
        <Badge
          status="error"
          text={t("eventfe.expired")}
          className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium"
        />
      );
    }

    if (status === "upcoming") {
      return (
        <Badge
          status="processing"
          text={t("eventfe.upcoming")}
          className="bg-blue-100 text-[#136094] px-3 py-1 rounded-full text-xs font-medium"
        />
      );
    }

    if (status === "ongoing") {
      return (
        <Badge
          status="success"
          text={t("eventfe.ongoing")}
          className="bg-green-100 text-[#008830] px-3 py-1 rounded-full text-xs font-medium"
        />
      );
    }

    return (
      <Badge
        status="default"
        text={t("eventfe.scheduled")}
        className="bg-[#ffca40] bg-opacity-20 text-[#136094] px-3 py-1 rounded-full text-xs font-medium"
      />
    );
  };

  const columns = [
    {
      title: t("eventfe.title"),
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <Text strong className="text-[#136094]">
          {getLocalizedValue(title)}
        </Text>
      ),
    },
    {
      title: t("eventfe.category"),
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3">
          {getLocalizedValue(category)}
        </Tag>
      ),
    },
    {
      title: t("eventfe.date"),
      dataIndex: "start_date",
      key: "date",
      render: (date, record) => (
        <div className="space-y-1">
          <div className="flex items-center text-[#136094] font-medium">
            <FiCalendar className="mr-2" />
            {new Date(date).toLocaleDateString()}
          </div>
          {record.end_date && record.end_date !== record.start_date && (
            <Text type="secondary" className="text-xs">
              {t("eventfe.to")} {new Date(record.end_date).toLocaleDateString()}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: t("eventfe.location"),
      dataIndex: "location",
      key: "location",
      render: (location) => (
        <div className="flex items-center text-[#136094]">
          <FiMapPin className="mr-2" />
          {getLocalizedValue(location)}
        </div>
      ),
    },
    {
      title: t("eventfe.status"),
      dataIndex: "status",
      key: "status",
      render: (status, record) =>
        getStatusBadge(status, record.end_date || record.start_date),
    },
    {
      title: t("eventfe.actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              icon={<FiEye />}
              onClick={() => {
                setSelectedEvent(record);
                setIsModalVisible(true);
              }}
              className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
            >
              {t("eventfe.details")}
            </Button>
          </motion.div>
        </Space>
      ),
    },
  ];

  const renderEventCard = (event, index) => {
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;

    return (
      <Col key={event.id} xs={24} sm={12} lg={8} className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card
            hoverable
            className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden"
            cover={
              event.cover_image ? (
                <div className="h-full text-center overflow-hidden relative">
                  <Image
                    src={getFullUrl(event.cover_image)}
                    alt={getLocalizedValue(event.title)}
                    preview={false}
                    className="object-fill w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(
                      event.status,
                      event.end_date || event.start_date
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-[#136094]/10 to-[#008830]/10 flex items-center justify-center">
                  <MdOutlineEvent className="text-[#136094] text-4xl opacity-50" />
                </div>
              )
            }
            onClick={() => {
              setSelectedEvent(event);
              setIsModalVisible(true);
            }}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3 py-1 text-xs font-medium">
                    {getLocalizedValue(event.category)}
                  </Tag>
                </div>

                <Title level={5} className="!mb-3 !text-[#136094] line-clamp-2">
                  {getLocalizedValue(event.title)}
                </Title>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 text-[#136094]" />
                    <Text className="text-sm">
                      {startDate.toLocaleDateString()}
                      {endDate && ` - ${endDate.toLocaleDateString()}`}
                    </Text>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 text-[#136094]" />
                    <Text className="text-sm">
                      {getLocalizedValue(event.location)}
                    </Text>
                  </div>
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
                      setSelectedEvent(event);
                      setIsModalVisible(true);
                    }}
                  >
                    {t("eventfe.viewDetails")}
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
            {t("eventfe.events")}
          </Title>
          <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("eventfe.subtitle")}
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
                  placeholder={t("eventfe.searchPlaceholder")}
                  allowClear
                  enterButton={
                    <Button
                      type="primary"
                      icon={<FiSearch />}
                      className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
                    >
                      {t("eventfe.search")}
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
                    {t("eventfe.listView")}
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
                    {t("eventfe.gridView")}
                  </Button>
                </motion.div>
              </Space>
            </div>

            {/* Category Filters */}
            {categories.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center mb-3">
                  <MdOutlineCategory className="text-[#136094] mr-2" />
                  <Text strong className="text-[#136094]">
                    Filter by Category:
                  </Text>
                </div>
                <div className="flex flex-wrap gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type={activeCategory === "all" ? "primary" : "default"}
                      size="small"
                      onClick={() => handleCategoryFilter("all")}
                      className={
                        activeCategory === "all"
                          ? "bg-[#ffca40] border-[#ffca40] text-[#136094]"
                          : "border-[#136094] text-[#136094]"
                      }
                    >
                      All Categories
                    </Button>
                  </motion.div>
                  {categories.map((category) => (
                    <motion.div
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type={
                          activeCategory === category ? "primary" : "default"
                        }
                        size="small"
                        onClick={() => handleCategoryFilter(category)}
                        className={
                          activeCategory === category
                            ? "bg-[#ffca40] border-[#ffca40] text-[#136094]"
                            : "border-[#136094] text-[#136094]"
                        }
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

        {/* Events Content */}
        {loading ? (
          <div className="text-center py-16">
            <Spin size="large" className="text-[#136094]" />
          </div>
        ) : error ? (
          <Alert
            message={t("eventfe.error")}
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="rounded-2xl"
          />
        ) : filteredEvents.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <Row gutter={[24, 24]}>
                  {filteredEvents
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((event, index) => renderEventCard(event, index))}
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
                      dataSource={filteredEvents}
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
                {t("eventfe.showing")} {(currentPage - 1) * pageSize + 1}{" "}
                {t("eventfe.to")}{" "}
                {Math.min(currentPage * pageSize, filteredEvents.length)}{" "}
                {t("eventfe.of")} {filteredEvents.length} {t("eventfe.entries")}
              </Text>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredEvents.length}
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
                  {t("eventfe.noEvents")}
                </Text>
              }
              imageStyle={{ height: 120 }}
            />
          </Card>
        )}

        {/* Event Details Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <MdOutlineEvent className="text-[#136094] text-xl mr-2" />
              <span className="text-[#136094] font-bold">
                {t("eventfe.eventDetails")}
              </span>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={900}
          destroyOnClose
          className="event-details-modal"
        >
          {selectedEvent && (
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
                    {getLocalizedValue(selectedEvent.title)}
                  </Title>
                  <div className="flex flex-wrap gap-2">
                    <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3 py-1">
                      {getLocalizedValue(selectedEvent.category)}
                    </Tag>
                    {getStatusBadge(
                      selectedEvent.status,
                      selectedEvent.end_date || selectedEvent.start_date
                    )}
                  </div>
                </div>
              </div>

              <Divider className="my-4 border-[#136094]/20" />

              {/* Event Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <FiCalendar className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("eventfe.startDate")}
                    </Text>
                    <Text className="text-gray-700">
                      {new Date(selectedEvent.start_date).toLocaleString()}
                    </Text>
                  </div>
                </div>

                {selectedEvent.end_date && (
                  <div className="flex items-start">
                    <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                      <FiClock className="text-[#136094] text-xl" />
                    </div>
                    <div>
                      <Text strong className="block text-[#136094] mb-1">
                        {t("eventfe.endDate")}
                      </Text>
                      <Text className="text-gray-700">
                        {new Date(selectedEvent.end_date).toLocaleString()}
                      </Text>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <FiMapPin className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("eventfe.location")}
                    </Text>
                    <Text className="text-gray-700">
                      {getLocalizedValue(selectedEvent.location)}
                    </Text>
                  </div>
                </div>
              </div>

              <Divider className="my-4 border-[#136094]/20" />

              {/* Description */}
              <div>
                <Text strong className="block text-[#136094] mb-3 text-lg">
                  {t("eventfe.description")}
                </Text>
                <div className="p-4 bg-gradient-to-r from-[#136094]/5 to-[#008830]/5 rounded-xl whitespace-pre-line border border-[#136094]/10">
                  {getLocalizedValue(selectedEvent.description) ||
                    t("eventfe.noDescription")}
                </div>
              </div>

              {/* Cover Image */}
              {selectedEvent.cover_image && (
                <div className="mt-6">
                  <Text strong className="block text-[#136094] mb-3 text-lg">
                    {t("eventfe.coverImage")}
                  </Text>
                  <Image
                    src={getFullUrl(selectedEvent.cover_image)}
                    alt={getLocalizedValue(selectedEvent.title)}
                    className="rounded-xl shadow-lg"
                    preview={false}
                  />
                </div>
              )}

              {/* Event Program */}
              {selectedEvent.event_program && (
                <div className="mt-6">
                  <Text strong className="block text-[#136094] mb-3 text-lg">
                    {t("eventfe.eventProgram")}
                  </Text>
                  <div className="p-4 border border-[#136094]/20 rounded-xl flex items-center justify-between bg-white">
                    <div className="flex items-center">
                      <BsFileEarmarkPdf className="text-red-500 text-3xl" />
                      <div className="ml-4">
                        <Text strong className="block text-[#136094]">
                          {selectedEvent.event_program.split("/").pop()}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Event Program Document
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
                        href={getFullUrl(selectedEvent.event_program)}
                        download
                        className="bg-gradient-to-r from-[#136094] to-[#008830] hover:from-[#0f4a7a] hover:to-[#007a2a] border-none"
                      >
                        {t("eventfe.downloadProgram")}
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

export default EventsList;
