import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Upload,
  Card,
  Tag,
  Avatar,
  Divider,
  Tooltip,
  Spin,
  Popconfirm,
  Tabs,
  Select,
  Row,
  Col,
  DatePicker,
  Badge,
  Image,
  Grid,
} from "antd";
import {
  FiImage,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiX,
  FiCheck,
  FiGlobe,
  FiUser,
  FiCalendar,
  FiList,
  FiEye,
  FiEyeOff,
  FiLink,
  FiFolder,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import {
  MdOutlineImageNotSupported,
  MdOutlineCollections,
} from "react-icons/md";
import { BsGrid, BsCardImage } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const BACKEND_URL = "https://yekawebapi.yekasubcity.com/";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const statusOptions = [
  { value: "published", label: "Published", color: "green" },
  { value: "unpublished", label: "Unpublished", color: "gray" },
];

// Helper function to ensure value is an array
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  if (typeof value === "string") {
    try {
      // Try to parse if it's a JSON string
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // If parsing fails, treat it as a single item array
      return [value];
    }
  }
  // For any other type, wrap in array
  return [value];
};

const NewsAdmin = () => {
  const { t } = useTranslation();
  const [newsItems, setNewsItems] = useState([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterStatus, setFilterStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [searchText, setSearchText] = useState("");

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = !screens.lg;

  const fetchNewsItems = async () => {
    setLoading(true);
    try {
      let url = `${BACKEND_URL}api/news`;
      const params = new URLSearchParams();

      if (filterStatus) params.append("status", filterStatus);
      if (dateRange) {
        params.append("startDate", dateRange[0].format("YYYY-MM-DD"));
        params.append("endDate", dateRange[1].format("YYYY-MM-DD"));
      }

      if (params.toString()) url += `?${params.toString()}`;

      const res = await axios.get(url);
      setNewsItems(res.data.data || []);
    } catch (err) {
      message.error(t("newsadmin.fetchFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsItems();
  }, [filterStatus, dateRange]);

  // Filter news items based on search text
  const filteredNewsItems = newsItems.filter(
    (item) =>
      item.title?.en?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.title?.am?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.title?.or?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.en?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.am?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.or?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category?.en?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCoverImageUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldsValue({ coverImage: res.data.path });
      setPreviewImage(res.data.path);
      message.success(t("newsadmin.uploadSuccess"));
    } catch (err) {
      message.error(t("newsadmin.uploadFailed"));
      console.error(err);
    }
    setUploading(false);
  };

  const handleAdditionalImagesUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploadingAdditional(true);
    try {
      const res = await axios.post(`${BACKEND_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newImageUrl = res.data.path;

      setAdditionalImages((prev) => {
        const updated = [...prev, newImageUrl];
        form.setFieldsValue({ additionalImages: updated });
        return updated;
      });

      onSuccess("ok");
      message.success(t("newsadmin.imageAddedSuccess"));
    } catch (err) {
      onError("Upload failed");
      message.error(t("newsadmin.uploadFailed"));
    } finally {
      setUploadingAdditional(false);
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    form.setFieldsValue({ additionalImages: newImages });
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    try {
      const values = await form.validateFields();

      const data = {
        coverImage: values.coverImage,
        additionalImages: ensureArray(values.additionalImages), // Use ensureArray here
        postedBy: values.postedBy || "Admin",
        status: values.status || "published",
        publishedDate: values.publishedDate
          ? moment(values.publishedDate).format("YYYY-MM-DD HH:mm:ss")
          : moment().format("YYYY-MM-DD HH:mm:ss"),
        title: {
          en: values.title_en || "",
          am: values.title_am || values.title_en || "",
          or: values.title_or || values.title_en || "",
        },
        description: {
          en: values.description_en || "",
          am: values.description_am || values.description_en || "",
          or: values.description_or || values.description_en || "",
        },
        category: {
          en: values.category_en || "General",
          am: values.category_am || values.category_en || "አጠቃላይ",
          or: values.category_or || values.category_en || "Waliigalaa",
        },
      };

      if (editingItem) {
        await axios.put(`${BACKEND_URL}api/news/${editingItem.id}`, data);
        message.success(t("newsadmin.updateSuccess"));
      } else {
        await axios.post(`${BACKEND_URL}api/news`, data);
        message.success(t("newsadmin.createSuccess"));
      }

      fetchNewsItems();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      setPreviewImage(null);
      setAdditionalImages([]);
    } catch (err) {
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("newsadmin.operationFailed")
      );
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/news/${id}`);
      message.success(t("newsadmin.deleteSuccess"));
      fetchNewsItems();
    } catch (err) {
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("newsadmin.operationFailed")
      );
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingItem(record);

    // Use ensureArray to handle additional_images safely
    const safeAdditionalImages = ensureArray(record.additional_images);

    form.setFieldsValue({
      title_en: record.title?.en || "",
      title_am: record.title?.am || "",
      title_or: record.title?.or || "",
      description_en: record.description?.en || "",
      description_am: record.description?.am || "",
      description_or: record.description?.or || "",
      category_en: record.category?.en || "",
      category_am: record.category?.am || "",
      category_or: record.category?.or || "",
      coverImage: record.cover_image,
      additionalImages: safeAdditionalImages, // Use the safe array
      postedBy: record.posted_by,
      status: record.status,
      publishedDate: record.published_date
        ? moment(record.published_date)
        : moment(),
    });
    setPreviewImage(record.cover_image);
    setAdditionalImages(safeAdditionalImages); // Use the safe array
    setIsModalOpen(true);
  };

  const handlePreview = (index) => {
    setPreviewImageIndex(index);
    setPreviewVisible(true);
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BACKEND_URL}uploads/${path}`;
  };

  const columns = [
    {
      title: t("newsadmin.coverImage"),
      dataIndex: "cover_image",
      width: 80,
      responsive: ["md"],
      render: (text) => (
        <div className="flex justify-center">
          {text ? (
            <Avatar
              shape="square"
              src={getFullImageUrl(text)}
              size={isMobile ? 48 : 64}
              className="rounded-lg shadow-sm"
            />
          ) : (
            <Avatar
              shape="square"
              size={isMobile ? 48 : 64}
              icon={<MdOutlineImageNotSupported />}
              className="bg-gray-100 rounded-lg"
            />
          )}
        </div>
      ),
    },
    {
      title: t("newsadmin.title"),
      dataIndex: "title",
      responsive: ["sm"],
      render: (title) => (
        <div>
          <div className="font-medium text-sm md:text-base">
            {title?.en || t("newsadmin.noTitle")}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {title?.am && <span className="mr-2">🇪🇹 {title.am}</span>}
            {title?.or && <span>🇪🇹 {title.or}</span>}
          </div>
        </div>
      ),
      sorter: (a, b) => (a.title?.en || "").localeCompare(b.title?.en || ""),
    },
    {
      title: t("newsadmin.category"),
      dataIndex: "category",
      responsive: ["lg"],
      render: (category) => (
        <div>
          <Tag color="blue" className="text-xs md:text-sm">
            {category?.en || t("newsadmin.uncategorized")}
          </Tag>
          <div className="text-xs text-gray-500 mt-1">
            {category?.am && <span className="mr-2">🇪🇹 {category.am}</span>}
            {category?.or && <span>🇪🇹 {category.or}</span>}
          </div>
        </div>
      ),
      filters: [
        { text: "General", value: "General" },
        { text: "Announcement", value: "Announcement" },
        { text: "Event", value: "Event" },
      ],
      onFilter: (value, record) => record.category?.en?.includes(value),
    },
    {
      title: t("newsadmin.status"),
      dataIndex: "status",
      width: 120,
      responsive: ["sm"],
      render: (status) => {
        const statusObj = statusOptions.find((opt) => opt.value === status);
        return (
          <Badge
            color={statusObj?.color || "gray"}
            text={statusObj?.label || status}
            className="text-xs md:text-sm"
          />
        );
      },
      filters: statusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t("newsadmin.date"),
      dataIndex: "published_date",
      width: 120,
      responsive: ["sm"],
      render: (date) => moment(date).format("MMM D, YYYY"),
      sorter: (a, b) => new Date(a.published_date) - new Date(b.published_date),
    },
    {
      title: t("newsadmin.actions"),
      width: 120,
      render: (_, record) => (
        <Space size="small" direction={isMobile ? "vertical" : "horizontal"}>
          <Tooltip title={t("newsadmin.edit")}>
            <Button
              size={isMobile ? "small" : "middle"}
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50 border-blue-200"
            >
              {isMobile ? null : t("newsadmin.edit")}
            </Button>
          </Tooltip>
          <Popconfirm
            title={t("newsadmin.deleteConfirm")}
            description={t("newsadmin.deleteDescription")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("newsadmin.yes")}
            cancelText={t("newsadmin.no")}
            okButtonProps={{ loading: actionLoading, danger: true }}
          >
            <Tooltip title={t("newsadmin.delete")}>
              <Button
                size={isMobile ? "small" : "middle"}
                icon={<FiTrash2 className="text-red-500" />}
                className="hover:bg-red-50 border-red-200"
                danger
              >
                {isMobile ? null : t("newsadmin.delete")}
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const gridView = (
    <div
      className={`grid grid-cols-1 ${
        isTablet
          ? "sm:grid-cols-2"
          : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      } gap-4 md:gap-6`}
    >
      {filteredNewsItems.map((item) => {
        // Use ensureArray for additional_images in grid view too
        const safeAdditionalImages = ensureArray(item.additional_images);

        return (
          <Card
            key={item.id}
            hoverable
            className="shadow-sm hover:shadow-lg transition-all duration-300 border-0"
            bodyStyle={{ padding: isMobile ? "12px" : "16px" }}
            cover={
              item.cover_image ? (
                <div
                  className={`${
                    isMobile ? "h-40" : "h-48"
                  } overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer relative group`}
                  onClick={() => {
                    setPreviewImage(item.cover_image);
                    setPreviewImageIndex(0);
                    setPreviewVisible(true);
                  }}
                >
                  <img
                    src={getFullImageUrl(item.cover_image)}
                    alt={item.title?.en || t("newsadmin.noTitle")}
                    className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <FiEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl" />
                  </div>
                </div>
              ) : (
                <div
                  className={`${
                    isMobile ? "h-40" : "h-48"
                  } bg-gray-100 flex items-center justify-center`}
                >
                  <MdOutlineImageNotSupported className="text-gray-400 text-2xl md:text-4xl" />
                </div>
              )
            }
            actions={[
              <Tooltip title={t("newsadmin.edit")} key="edit">
                <div
                  className="flex items-center justify-center p-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => openEditModal(item)}
                >
                  <FiEdit className="text-blue-500 mr-1" />
                  {!isMobile && (
                    <span className="text-sm">{t("newsadmin.edit")}</span>
                  )}
                </div>
              </Tooltip>,
              <Popconfirm
                key="delete"
                title={t("newsadmin.deleteConfirm")}
                description={t("newsadmin.deleteDescription")}
                onConfirm={() => handleDelete(item.id)}
                okText={t("newsadmin.yes")}
                cancelText={t("newsadmin.no")}
                okButtonProps={{ loading: actionLoading, danger: true }}
              >
                <Tooltip title={t("newsadmin.delete")}>
                  <div className="flex items-center justify-center p-2 cursor-pointer hover:text-red-600 transition-colors">
                    <FiTrash2 className="text-red-500 mr-1" />
                    {!isMobile && (
                      <span className="text-sm">{t("newsadmin.delete")}</span>
                    )}
                  </div>
                </Tooltip>
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              title={
                <div className="mb-2">
                  <div className="font-medium text-sm md:text-base line-clamp-2 leading-tight">
                    {item.title?.en || t("newsadmin.noTitle")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.title?.am && (
                      <span className="mr-2">🇪🇹 {item.title.am}</span>
                    )}
                    {item.title?.or && <span>🇪🇹 {item.title.or}</span>}
                  </div>
                </div>
              }
              description={
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Tag color="blue" className="text-xs">
                      {item.category?.en || t("newsadmin.uncategorized")}
                    </Tag>
                    <Badge
                      status={
                        item.status === "published" ? "success" : "default"
                      }
                      text={<span className="text-xs">{item.status}</span>}
                    />
                  </div>
                  <div className="text-gray-600 text-xs md:text-sm line-clamp-3 leading-relaxed">
                    {item.description?.en || t("newsadmin.noDescription")}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>
                      {moment(item.published_date).format("MMM D, YYYY")}
                    </span>
                    <span>{item.posted_by || "Admin"}</span>
                  </div>
                  {safeAdditionalImages.length > 0 && (
                    <div className="flex items-center text-xs text-blue-500">
                      <MdOutlineCollections className="mr-1" />
                      {safeAdditionalImages.length}{" "}
                      {t("newsadmin.additionalImages")}
                    </div>
                  )}
                </div>
              }
            />
          </Card>
        );
      })}
    </div>
  );

  const emptyState = (
    <div className="text-center py-12 md:py-16">
      <MdOutlineImageNotSupported className="text-gray-400 text-4xl md:text-6xl mx-auto mb-4" />
      <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
        {t("newsadmin.noItems")}
      </h3>
      <p className="text-gray-500 text-sm md:text-base mb-6">
        {t("newsadmin.noSearchResults")}
      </p>
      <Button
        type="primary"
        icon={<FiPlus />}
        onClick={() => {
          form.resetFields();
          setEditingItem(null);
          setPreviewImage(null);
          setAdditionalImages([]);
          setIsModalOpen(true);
        }}
        size="large"
      >
        {t("newsadmin.addNewsItem")}
      </Button>
    </div>
  );

  return (
    <div className="p-2 md:p-2 lg:p-2 w-full ">
      <Card
        title={
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
              {t("newsadmin.title")}
            </h2>
            <div className="flex flex-1 flex-col md:flex-row md:items-center md:justify-end gap-2">
              <div className="flex items-center space-x-1 md:space-x-2 order-2 md:order-1">
                <Tooltip title={t("newsadmin.tableView")}>
                  <Button
                    size={isMobile ? "small" : "middle"}
                    icon={<AiOutlineUnorderedList />}
                    onClick={() => setViewMode("table")}
                    type={viewMode === "table" ? "primary" : "default"}
                    className="flex items-center"
                  >
                    {!isMobile && t("newsadmin.tableView")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("newsadmin.gridView")}>
                  <Button
                    size={isMobile ? "small" : "middle"}
                    icon={<BsGrid />}
                    onClick={() => setViewMode("grid")}
                    type={viewMode === "grid" ? "primary" : "default"}
                    className="flex items-center"
                  >
                    {!isMobile && t("newsadmin.gridView")}
                  </Button>
                </Tooltip>
              </div>
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingItem(null);
                  setPreviewImage(null);
                  setAdditionalImages([]);
                  setIsModalOpen(true);
                }}
                size={isMobile ? "small" : "middle"}
                className="order-1 md:order-2 md:ml-2"
              >
                {t("newsadmin.addNewsItem")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-sm md:shadow-md rounded-lg border-0 md:border"
        bodyStyle={{ padding: isMobile ? "12px" : "24px" }}
        extra={
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-3 md:mt-0">
            <Input
              placeholder={t("newsadmin.searchPlaceholder")}
              prefix={<FiSearch className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: isMobile ? "100%" : 200 }}
              size={isMobile ? "small" : "middle"}
            />
            <Select
              placeholder={t("newsadmin.filterStatus")}
              allowClear
              onChange={setFilterStatus}
              style={{ width: isMobile ? "100%" : 150 }}
              size={isMobile ? "small" : "middle"}
              suffixIcon={<FiFilter />}
            >
              {statusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  <Badge color={opt.color} text={opt.label} />
                </Option>
              ))}
            </Select>
            <RangePicker
              onChange={setDateRange}
              placeholder={[t("newsadmin.startDate"), t("newsadmin.endDate")]}
              size={isMobile ? "small" : "middle"}
              style={{ width: isMobile ? "100%" : "auto" }}
            />
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center p-8 md:p-12">
            <Spin size="large" tip={t("newsadmin.loading")} />
          </div>
        ) : filteredNewsItems.length === 0 ? (
          emptyState
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredNewsItems}
            rowKey="id"
            loading={loading}
            className="border-none"
            scroll={{ x: 800 }}
            size={isMobile ? "small" : "middle"}
            pagination={{
              pageSize: isMobile ? 5 : 10,
              showSizeChanger: true,
              showQuickJumper: !isMobile,
              showTotal: (total) => t("newsadmin.total", { total }),
              size: isMobile ? "small" : "default",
            }}
          />
        ) : (
          gridView
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            {editingItem ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("newsadmin.editNewsItem")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("newsadmin.addNewsItem")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setAdditionalImages([]);
        }}
        onOk={handleFormSubmit}
        okText={editingItem ? t("newsadmin.update") : t("newsadmin.create")}
        cancelText={t("newsadmin.cancel")}
        okButtonProps={{
          icon: editingItem ? <FiCheck /> : <FiPlus />,
          className: "flex items-center",
          loading: actionLoading,
          size: isMobile ? "small" : "middle",
        }}
        cancelButtonProps={{
          icon: <FiX />,
          className: "flex items-center",
          size: isMobile ? "small" : "middle",
        }}
        width={isMobile ? "95%" : isTablet ? 800 : 1000}
        destroyOnClose
        centered
        style={{ top: 20 }}
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          size={isMobile ? "small" : "middle"}
        >
          <Row gutter={16}>
            <Col span={isMobile ? 24 : 12}>
              <Form.Item
                name="status"
                label={t("newsadmin.status")}
                initialValue="published"
                rules={[
                  { required: true, message: t("newsadmin.statusRequired") },
                ]}
              >
                <Select>
                  {statusOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      <Badge color={opt.color} text={opt.label} />
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={isMobile ? 24 : 12}>
              <Form.Item
                name="publishedDate"
                label={t("newsadmin.publishDate")}
                initialValue={moment()}
                rules={[
                  {
                    required: true,
                    message: t("newsadmin.publishDateRequired"),
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  suffixIcon={<FiCalendar />}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={isMobile ? 24 : 12}>
              <Form.Item
                name="postedBy"
                label={t("newsadmin.postedBy")}
                initialValue="Admin"
                rules={[
                  {
                    required: true,
                    message: t("newsadmin.postedByRequired"),
                  },
                ]}
              >
                <Input
                  prefix={<FiUser className="text-gray-400" />}
                  placeholder={t("newsadmin.postedByPlaceholder")}
                />
              </Form.Item>
            </Col>
            <Col span={isMobile ? 24 : 12}>
              <Form.Item
                name="coverImage"
                label={t("newsadmin.coverImage")}
                rules={[
                  {
                    required: true,
                    message: t("newsadmin.coverImageRequired"),
                  },
                ]}
              >
                <div className="space-y-4">
                  <Upload
                    name="coverImage"
                    showUploadList={false}
                    customRequest={handleCoverImageUpload}
                    accept="image/*"
                    disabled={uploading}
                    className="w-full"
                  >
                    <Button
                      icon={<FiUpload />}
                      loading={uploading}
                      block
                      className={`${isMobile ? "h-10" : "h-12"} border-dashed`}
                      type="dashed"
                    >
                      {uploading
                        ? t("newsadmin.uploading")
                        : t("newsadmin.uploadCoverImage")}
                    </Button>
                  </Upload>

                  {previewImage && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={getFullImageUrl(previewImage)}
                        alt="preview"
                        className={`${
                          isMobile ? "max-h-32" : "max-h-40"
                        } rounded-lg border border-gray-200 p-1 cursor-pointer object-contain`}
                        onClick={() => {
                          setPreviewImageIndex(0);
                          setPreviewVisible(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={t("newsadmin.additionalImages")}
            name="additionalImages"
            tooltip={t("newsadmin.additionalImagesTooltip")}
          >
            <Upload
              multiple
              listType="picture-card"
              customRequest={handleAdditionalImagesUpload}
              fileList={additionalImages.map((url, index) => ({
                uid: String(index),
                name: url.split("/").pop(),
                status: "done",
                url: getFullImageUrl(url),
              }))}
              onRemove={(file) => {
                const index = additionalImages.findIndex(
                  (url) => url === file.url || file.response?.path
                );
                if (index > -1) {
                  removeAdditionalImage(index);
                }
              }}
              onPreview={(file) => {
                const index = additionalImages.findIndex(
                  (url) => url === file.url || file.response?.path
                );
                if (index > -1) {
                  handlePreview(index + 1); // +1 because cover image is index 0
                }
              }}
            >
              <div>
                <FiUpload />
                <div style={{ marginTop: 8 }}>{t("newsadmin.upload")}</div>
              </div>
            </Upload>
          </Form.Item>

          <div className="mb-4">
            <Tabs
              defaultActiveKey="en"
              onChange={setActiveLanguage}
              size={isMobile ? "small" : "middle"}
              tabBarExtraContent={
                !isMobile && (
                  <div className="flex items-center text-sm text-gray-500">
                    <FiGlobe className="mr-1" />
                    <span>
                      {t("newsadmin.language")}:{" "}
                      {languages.find((l) => l.code === activeLanguage)?.name}
                    </span>
                  </div>
                )
              }
            >
              {languages.map((lang) => (
                <TabPane
                  tab={
                    <span>
                      {lang.flag} {t(`newsadmin.${lang.code}`)}
                    </span>
                  }
                  key={lang.code}
                />
              ))}
            </Tabs>
          </div>

          {/* Hidden fields for non-active languages */}
          {languages.map(
            (lang) =>
              lang.code !== activeLanguage && (
                <React.Fragment key={lang.code}>
                  <Form.Item name={`title_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={`description_${lang.code}`} hidden>
                    <TextArea rows={1} />
                  </Form.Item>
                  <Form.Item name={`category_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                </React.Fragment>
              )
          )}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`title_${activeLanguage}`}
                label={`${t("newsadmin.titleLabel")} (${t(
                  `newsadmin.${activeLanguage}`
                )})`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("newsadmin.titleRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={t("newsadmin.titlePlaceholder")}
                  prefix={<FiLink className="text-gray-400" />}
                  // Remove any maxLength restrictions for unlimited text
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`description_${activeLanguage}`}
                label={`${t("newsadmin.descriptionLabel")} (${t(
                  `newsadmin.${activeLanguage}`
                )})`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("newsadmin.descriptionRequired"),
                        },
                      ]
                    : []
                }
              >
                <TextArea
                  rows={6}
                  placeholder={t("newsadmin.descriptionPlaceholder")}
                  // Remove showCount and maxLength for unlimited text
                  style={{ resize: "vertical" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`category_${activeLanguage}`}
                label={`${t("newsadmin.categoryLabel")} (${t(
                  `newsadmin.${activeLanguage}`
                )})`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("newsadmin.categoryRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={t("newsadmin.categoryPlaceholder")}
                  prefix={<FiFolder className="text-gray-400" />}
                  // Remove any maxLength restrictions
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80vw"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
        centered
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center bg-black bg-opacity-90 min-h-[60vh]">
            <Image
              src={getFullImageUrl(
                previewImageIndex === 0
                  ? previewImage
                  : additionalImages[previewImageIndex - 1]
              )}
              className="max-h-[70vh] object-contain"
              preview={false}
            />
          </div>
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <div className="text-sm">
              {t("newsadmin.image")} {previewImageIndex + 1} {t("newsadmin.of")}{" "}
              {additionalImages.length + 1}
            </div>
            <div className="flex space-x-2">
              <Button
                icon={<FiEyeOff />}
                onClick={() => setPreviewVisible(false)}
                size={isMobile ? "small" : "middle"}
              >
                {t("newsadmin.close")}
              </Button>
              {previewImageIndex > 0 && (
                <Button
                  onClick={() => setPreviewImageIndex(previewImageIndex - 1)}
                  size={isMobile ? "small" : "middle"}
                >
                  {t("newsadmin.previous")}
                </Button>
              )}
              {previewImageIndex < additionalImages.length && (
                <Button
                  type="primary"
                  onClick={() => setPreviewImageIndex(previewImageIndex + 1)}
                  size={isMobile ? "small" : "middle"}
                >
                  {t("newsadmin.next")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewsAdmin;
