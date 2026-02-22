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
  Alert,
} from "antd";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiX,
  FiCheck,
  FiGlobe,
  FiFileText,
  FiCalendar,
  FiMapPin,
  FiList,
  FiDownload,
  FiFolder,
  FiLink,
} from "react-icons/fi";
import {
  MdOutlineImageNotSupported,
  MdOutlineDescription,
} from "react-icons/md";
import { BsGrid, BsFileEarmarkPdf } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const BACKEND_URL = "https://yekawebapi.yekasubcity.com/";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const statusOptions = [
  { value: "upcoming", label: "Upcoming", color: "blue" },
  { value: "ongoing", label: "Ongoing", color: "green" },
  { value: "completed", label: "Completed", color: "gray" },
  { value: "cancelled", label: "Cancelled", color: "red" },
];

const EventAdmin = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProgram, setUploadingProgram] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [programUrl, setProgramUrl] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterStatus, setFilterStatus] = useState(null);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BACKEND_URL}api/events`;
      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }
      const res = await axios.get(url);
      setEvents(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.error || err.message || t("eventadmin.fetchError")
      );
      message.error(t("eventadmin.fetchErrorMessage"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filterStatus]);

  const handleCoverImageUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploadingCover(true);
    try {
      const res = await axios.post(`${BACKEND_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldsValue({ coverImage: res.data.path });
      setPreviewImage(res.data.path);
      message.success(t("eventadmin.coverImageSuccess"));
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        t("eventadmin.imageUploadFailed");
      message.error(errorMsg);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleProgramUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploadingProgram(true);
    try {
      const res = await axios.post(`${BACKEND_URL}api/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldsValue({ eventProgram: res.data.path });
      setProgramUrl(res.data.path);
      message.success(t("eventadmin.programSuccess"));
    } catch (err) {
      console.error("Upload error:", err);
      message.error(t("eventadmin.programUploadFailed"));
    } finally {
      setUploadingProgram(false);
    }
  };

  const getFileIcon = (filename) => {
    if (!filename) return <FiFileText />;
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return <BsFileEarmarkPdf className="text-red-500" />;
      case "doc":
      case "docx":
        return <FiFileText className="text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FiFileText className="text-orange-500" />;
      default:
        return <FiFileText />;
    }
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const values = await form.validateFields();

      const formatDateForBackend = (date) => {
        if (!date) return null;
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      };

      const data = {
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
        location: {
          en: values.location_en || "",
          am: values.location_am || values.location_en || "",
          or: values.location_or || values.location_en || "",
        },
        startDate: formatDateForBackend(values.startDate),
        endDate: formatDateForBackend(values.endDate),
        coverImage: values.coverImage,
        eventProgram: values.eventProgram,
        category: {
          en: values.category_en || "General",
          am: values.category_am || values.category_en || "አጠቃላይ",
          or: values.category_or || values.category_en || "Waliigalaa",
        },
        status: values.status || "upcoming",
      };

      console.log("Submitting event data:", data);

      let response;
      if (editingItem) {
        response = await axios.put(
          `${BACKEND_URL}api/events/${editingItem.id}`,
          data
        );
        message.success(t("eventadmin.updateSuccess"));
      } else {
        response = await axios.post(`${BACKEND_URL}api/events`, data, {
          headers: { "Content-Type": "application/json" },
        });
        message.success(t("eventadmin.createSuccess"));
      }

      console.log("Server response:", response.data);
      fetchEvents();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      setPreviewImage(null);
      setProgramUrl(null);
    } catch (err) {
      console.error("Form submission error:", {
        error: err,
        response: err.response,
      });
      setError(
        err.response?.data?.error ||
          err.message ||
          t("eventadmin.operationFailed")
      );
      message.error(t("eventadmin.operationFailedMessage"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/events/${id}`);
      message.success(t("eventadmin.deleteSuccess"));
      fetchEvents();
    } catch (err) {
      console.error("Delete error:", err);
      message.error(
        err.response?.data?.error || err.message || t("eventadmin.deleteFailed")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      title_en: record.title?.en || "",
      title_am: record.title?.am || "",
      title_or: record.title?.or || "",
      description_en: record.description?.en || "",
      description_am: record.description?.am || "",
      description_or: record.description?.or || "",
      location_en: record.location?.en || "",
      location_am: record.location?.am || "",
      location_or: record.location?.or || "",
      category_en: record.category?.en || "",
      category_am: record.category?.am || "",
      category_or: record.category?.or || "",
      startDate: record.start_date ? moment(record.start_date) : null,
      endDate: record.end_date ? moment(record.end_date) : null,
      coverImage: record.cover_image,
      eventProgram: record.event_program,
      status: record.status || "upcoming",
    });
    setPreviewImage(record.cover_image);
    setProgramUrl(record.event_program);
    setIsModalOpen(true);
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BACKEND_URL}uploads/${path}`;
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
  };

  const columns = [
    {
      title: t("eventadmin.columns.coverImage"),
      dataIndex: "cover_image",
      render: (text) => (
        <div className="flex justify-center">
          {text ? (
            <Avatar
              shape="square"
              src={getFullImageUrl(text)}
              size={64}
              className="rounded-lg shadow-sm"
            />
          ) : (
            <Avatar
              shape="square"
              size={64}
              icon={<MdOutlineImageNotSupported />}
              className="bg-gray-100 rounded-lg"
            />
          )}
        </div>
      ),
    },
    {
      title: t("eventadmin.columns.title"),
      dataIndex: "title",
      render: (title) => (
        <div>
          <div className="font-medium">
            {title?.en || t("eventadmin.noTitle")}
          </div>
          <div className="text-xs text-gray-500">
            {title?.am && <span className="mr-2">🇪🇹 {title.am}</span>}
            {title?.or && <span>🇪🇹 {title.or}</span>}
          </div>
        </div>
      ),
      sorter: (a, b) => (a.title?.en || "").localeCompare(b.title?.en || ""),
    },
    {
      title: t("eventadmin.columns.location"),
      dataIndex: "location",
      render: (location) => (
        <div className="flex items-center">
          <FiMapPin className="mr-1 text-gray-400" />
          <span>{location?.en || t("eventadmin.noLocation")}</span>
        </div>
      ),
    },
    {
      title: t("eventadmin.columns.dates"),
      render: (record) => (
        <div className="text-xs">
          <div>
            {t("eventadmin.start")}:{" "}
            {moment(record.start_date).format("MMM D, YYYY")}
          </div>
          <div>
            {t("eventadmin.end")}:{" "}
            {moment(record.end_date).format("MMM D, YYYY")}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date),
    },
    {
      title: t("eventadmin.columns.status"),
      dataIndex: "status",
      render: (status) => {
        const statusObj = statusOptions.find((opt) => opt.value === status);
        return (
          <Badge
            color={statusObj?.color || "gray"}
            text={statusObj?.label || status}
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
      title: t("eventadmin.columns.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("eventadmin.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("eventadmin.deleteConfirm.title")}
            description={t("eventadmin.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("eventadmin.yes")}
            cancelText={t("eventadmin.no")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("eventadmin.delete")}>
              <Button
                shape="circle"
                icon={<FiTrash2 className="text-red-500" />}
                className="hover:bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const gridView = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card
          key={event.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow"
          cover={
            event.cover_image ? (
              <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-50">
                <img
                  src={getFullImageUrl(event.cover_image)}
                  alt={event.title?.en || t("eventadmin.event")}
                  className="object-cover h-full w-full"
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <MdOutlineDescription className="text-gray-400 text-4xl" />
              </div>
            )
          }
          actions={[
            <Tooltip title={t("eventadmin.edit")}>
              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => openEditModal(event)}
              />
            </Tooltip>,
            <Popconfirm
              title={t("eventadmin.deleteConfirm.title")}
              description={t("eventadmin.deleteConfirm.description")}
              onConfirm={() => handleDelete(event.id)}
              okText={t("eventadmin.yes")}
              cancelText={t("eventadmin.no")}
              okButtonProps={{ loading: actionLoading }}
            >
              <Tooltip title={t("eventadmin.delete")}>
                <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
              </Tooltip>
            </Popconfirm>,
            event.event_program && (
              <a
                href={getFileUrl(event.event_program)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Tooltip title={t("eventadmin.downloadProgram")}>
                  <FiDownload className="text-green-500 cursor-pointer hover:text-green-700" />
                </Tooltip>
              </a>
            ),
          ]}
        >
          <Card.Meta
            title={
              <div className="truncate">
                <div className="font-medium">
                  {event.title?.en || t("eventadmin.noTitle")}
                </div>
                <div className="text-xs text-gray-500">
                  {event.title?.am && (
                    <span className="mr-2">🇪🇹 {event.title.am}</span>
                  )}
                  {event.title?.or && <span>🇪🇹 {event.title.or}</span>}
                </div>
              </div>
            }
            description={
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Tag color="blue">
                    {event.category?.en || t("eventadmin.general")}
                  </Tag>
                  <Badge
                    status={
                      event.status === "upcoming"
                        ? "processing"
                        : event.status === "ongoing"
                        ? "success"
                        : "default"
                    }
                    text={event.status}
                  />
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <FiMapPin className="mr-1" />
                  <span className="truncate">
                    {event.location?.en || t("eventadmin.noLocation")}
                  </span>
                </div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {event.description?.en || t("eventadmin.noDescription")}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {moment(event.start_date).format("MMM D")} -{" "}
                    {moment(event.end_date).format("MMM D, YYYY")}
                  </span>
                  {event.event_program && (
                    <a
                      href={getFileUrl(event.event_program)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      {t("eventadmin.program")}
                    </a>
                  )}
                </div>
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl ">
      <Card
        title={
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {t("eventadmin.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title={t("eventadmin.tableView")}>
                <Button
                  shape="circle"
                  icon={<AiOutlineUnorderedList />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title={t("eventadmin.gridView")}>
                <Button
                  shape="circle"
                  icon={<BsGrid />}
                  onClick={() => setViewMode("grid")}
                  type={viewMode === "grid" ? "primary" : "default"}
                />
              </Tooltip>
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingItem(null);
                  setPreviewImage(null);
                  setProgramUrl(null);
                  setError(null);
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                {t("eventadmin.addEvent")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          <Select
            placeholder={t("eventadmin.filterStatus")}
            allowClear
            onChange={setFilterStatus}
            style={{ width: 150 }}
          >
            {statusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                <Badge color={opt.color} text={opt.label} />
              </Option>
            ))}
          </Select>
        }
      >
        {loading ? (
          <div className="flex justify-center p-8">
            <Spin size="large" />
          </div>
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={events}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => t("eventadmin.totalEvents", { total }),
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
                <span>{t("eventadmin.editEvent")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("eventadmin.addEvent")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setProgramUrl(null);
          setError(null);
        }}
        onOk={handleFormSubmit}
        okText={editingItem ? t("eventadmin.update") : t("eventadmin.create")}
        okButtonProps={{
          icon: editingItem ? <FiCheck /> : <FiPlus />,
          className: "flex items-center",
          loading: actionLoading,
        }}
        cancelButtonProps={{
          icon: <FiX />,
          className: "flex items-center",
        }}
        width={900}
        destroyOnClose
      >
        <Divider />
        {error && (
          <Alert
            message={t("eventadmin.error")}
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={t("eventadmin.form.status")}
                initialValue="upcoming"
                rules={[
                  {
                    required: true,
                    message: t("eventadmin.form.statusRequired"),
                  },
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
            <Col span={12}>
              <Form.Item
                name="category_en"
                label={t("eventadmin.form.categoryEnglish")}
                rules={[
                  {
                    required: true,
                    message: t("eventadmin.form.categoryRequired"),
                  },
                ]}
              >
                <Input
                  placeholder={t("eventadmin.form.enterCategoryEnglish")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label={t("eventadmin.form.startDate")}
                rules={[
                  {
                    required: true,
                    message: t("eventadmin.form.startDateRequired"),
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  suffixIcon={<FiCalendar />}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label={t("eventadmin.form.endDate")}
                rules={[
                  {
                    required: true,
                    message: t("eventadmin.form.endDateRequired"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue("startDate")) {
                        return Promise.resolve();
                      }
                      const endDate = moment(value);
                      const startDate = moment(getFieldValue("startDate"));

                      if (endDate.isSameOrAfter(startDate)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t("eventadmin.form.endDateAfterStart"))
                      );
                    },
                  }),
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  suffixIcon={<FiCalendar />}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="coverImage"
                label={t("eventadmin.form.coverImage")}
                rules={[
                  {
                    required: true,
                    message: t("eventadmin.form.coverImageRequired"),
                  },
                ]}
              >
                <div className="space-y-4">
                  <Upload
                    name="coverImage"
                    showUploadList={false}
                    customRequest={handleCoverImageUpload}
                    accept="image/*"
                    disabled={uploadingCover}
                    className="w-full"
                  >
                    <Button
                      icon={<FiUpload />}
                      loading={uploadingCover}
                      block
                      className="h-12"
                    >
                      {uploadingCover
                        ? t("eventadmin.uploading")
                        : t("eventadmin.form.uploadCoverImage")}
                    </Button>
                  </Upload>

                  {previewImage && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={getFullImageUrl(previewImage)}
                        alt="preview"
                        className="max-h-40 rounded-lg border border-gray-200 p-1"
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="eventProgram"
                label={t("eventadmin.form.eventProgram")}
                rules={[
                  {
                    required: true,
                    message: t("eventadmin.form.eventProgramRequired"),
                  },
                ]}
              >
                <div className="space-y-4">
                  <Upload
                    name="eventProgram"
                    showUploadList={false}
                    customRequest={handleProgramUpload}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    disabled={uploadingProgram}
                    className="w-full"
                  >
                    <Button
                      icon={<FiUpload />}
                      loading={uploadingProgram}
                      block
                      className="h-12"
                    >
                      {uploadingProgram
                        ? t("eventadmin.uploading")
                        : t("eventadmin.form.uploadEventProgram")}
                    </Button>
                  </Upload>

                  {programUrl && (
                    <div className="mt-4 flex items-center justify-center space-x-2">
                      {getFileIcon(programUrl)}
                      <a
                        href={getFileUrl(programUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {t("eventadmin.viewUploadedProgram")}
                      </a>
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <div className="mb-4">
            <Tabs
              defaultActiveKey="en"
              onChange={setActiveLanguage}
              tabBarExtraContent={
                <div className="flex items-center text-sm text-gray-500">
                  <FiGlobe className="mr-1" />
                  <span>
                    {t("eventadmin.language")}:{" "}
                    {languages.find((l) => l.code === activeLanguage)?.name}
                  </span>
                </div>
              }
            >
              {languages.map((lang) => (
                <TabPane
                  tab={
                    <span>
                      {lang.flag} {lang.name}
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
                    <Input />
                  </Form.Item>
                  <Form.Item name={`location_${lang.code}`} hidden>
                    <Input />
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
                label={`${t("eventadmin.form.title")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("eventadmin.form.englishTitleRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("eventadmin.form.enterTitle")} ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                  prefix={<FiLink className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`description_${activeLanguage}`}
                label={`${t("eventadmin.form.description")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t(
                            "eventadmin.form.englishDescriptionRequired"
                          ),
                        },
                      ]
                    : []
                }
              >
                <TextArea
                  rows={4}
                  placeholder={`${t("eventadmin.form.enterDescription")} ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`location_${activeLanguage}`}
                label={`${t("eventadmin.form.location")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("eventadmin.form.englishLocationRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("eventadmin.form.enterLocation")} ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                  prefix={<FiMapPin className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EventAdmin;
