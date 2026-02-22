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
  FiList,
  FiEye,
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
  { value: "active", label: "Active", color: "green" },
  { value: "closed", label: "Closed", color: "red" },
  { value: "cancelled", label: "Cancelled", color: "gray" },
];

const TenderAdmin = () => {
  const { t } = useTranslation();
  const [tenders, setTenders] = useState([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [docUrl, setDocUrl] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterStatus, setFilterStatus] = useState(null);
  const [error, setError] = useState(null);

  const fetchTenders = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BACKEND_URL}api/tenders`;
      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }
      const res = await axios.get(url);
      setTenders(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.error || err.message || t("tenderadmin.fetchError")
      );
      message.error(t("tenderadmin.fetchErrorMessage"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
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
      message.success(t("tenderadmin.coverImageSuccess"));
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        t("tenderadmin.imageUploadFailed");
      message.error(errorMsg);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleDocUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploadingDoc(true);
    try {
      const res = await axios.post(`${BACKEND_URL}api/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldsValue({ tenderDocument: res.data.path });
      setDocUrl(res.data.path);
      message.success(t("tenderadmin.documentSuccess"));
    } catch (err) {
      console.error("Upload error:", err);
      message.error(t("tenderadmin.documentUploadFailed"));
    } finally {
      setUploadingDoc(false);
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
        referenceNumber: values.referenceNumber,
        openingDate: formatDateForBackend(values.openingDate),
        closingDate: formatDateForBackend(values.closingDate),
        coverImage: values.coverImage,
        tenderDocument: values.tenderDocument,
        category: {
          en: values.category_en || "General",
          am: values.category_am || values.category_en || "አጠቃላይ",
          or: values.category_or || values.category_en || "Waliigalaa",
        },
        status: values.status || "active",
      };

      console.log("Submitting tender data:", data);

      let response;
      if (editingItem) {
        response = await axios.put(
          `${BACKEND_URL}api/tenders/${editingItem.id}`,
          data
        );
        message.success(t("tenderadmin.updateSuccess"));
      } else {
        response = await axios.post(`${BACKEND_URL}api/tenders`, data, {
          headers: { "Content-Type": "application/json" },
        });
        message.success(t("tenderadmin.createSuccess"));
      }

      console.log("Server response:", response.data);
      fetchTenders();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      setPreviewImage(null);
      setDocUrl(null);
    } catch (err) {
      console.error("Form submission error:", {
        error: err,
        response: err.response,
      });
      setError(
        err.response?.data?.error ||
          err.message ||
          t("tenderadmin.operationFailed")
      );
      message.error(t("tenderadmin.operationFailedMessage"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/tenders/${id}`);
      message.success(t("tenderadmin.deleteSuccess"));
      fetchTenders();
    } catch (err) {
      console.error("Delete error:", err);
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("tenderadmin.deleteFailed")
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
      category_en: record.category?.en || "",
      category_am: record.category?.am || "",
      category_or: record.category?.or || "",
      referenceNumber: record.reference_number,
      openingDate: record.opening_date ? moment(record.opening_date) : null,
      closingDate: record.closing_date ? moment(record.closing_date) : null,
      coverImage: record.cover_image,
      tenderDocument: record.tender_document,
      status: record.status || "active",
    });
    setPreviewImage(record.cover_image);
    setDocUrl(record.tender_document);
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
      title: t("tenderadmin.columns.coverImage"),
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
      title: t("tenderadmin.columns.title"),
      dataIndex: "title",
      render: (title) => (
        <div>
          <div className="font-medium">
            {title?.en || t("tenderadmin.noTitle")}
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
      title: t("tenderadmin.columns.reference"),
      dataIndex: "reference_number",
      sorter: (a, b) => a.reference_number.localeCompare(b.reference_number),
    },
    {
      title: t("tenderadmin.columns.dates"),
      render: (record) => (
        <div className="text-xs">
          <div>
            {t("tenderadmin.open")}:{" "}
            {moment(record.opening_date).format("MMM D, YYYY")}
          </div>
          <div>
            {t("tenderadmin.close")}:{" "}
            {moment(record.closing_date).format("MMM D, YYYY")}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.closing_date) - new Date(b.closing_date),
    },
    {
      title: t("tenderadmin.columns.status"),
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
      title: t("tenderadmin.columns.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("tenderadmin.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("tenderadmin.deleteConfirm.title")}
            description={t("tenderadmin.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("tenderadmin.yes")}
            cancelText={t("tenderadmin.no")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("tenderadmin.delete")}>
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
      {tenders.map((tender) => (
        <Card
          key={tender.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow"
          cover={
            tender.cover_image ? (
              <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-50">
                <img
                  src={getFullImageUrl(tender.cover_image)}
                  alt={tender.title?.en || t("tenderadmin.tender")}
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
            <Tooltip title={t("tenderadmin.edit")}>
              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => openEditModal(tender)}
              />
            </Tooltip>,
            <Popconfirm
              title={t("tenderadmin.deleteConfirm.title")}
              description={t("tenderadmin.deleteConfirm.description")}
              onConfirm={() => handleDelete(tender.id)}
              okText={t("tenderadmin.yes")}
              cancelText={t("tenderadmin.no")}
              okButtonProps={{ loading: actionLoading }}
            >
              <Tooltip title={t("tenderadmin.delete")}>
                <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
              </Tooltip>
            </Popconfirm>,
            tender.tender_document && (
              <a
                href={getFileUrl(tender.tender_document)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Tooltip title={t("tenderadmin.downloadDocument")}>
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
                  {tender.title?.en || t("tenderadmin.noTitle")}
                </div>
                <div className="text-xs text-gray-500">
                  {tender.title?.am && (
                    <span className="mr-2">🇪🇹 {tender.title.am}</span>
                  )}
                  {tender.title?.or && <span>🇪🇹 {tender.title.or}</span>}
                </div>
              </div>
            }
            description={
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Tag color="blue">
                    {tender.category?.en || t("tenderadmin.general")}
                  </Tag>
                  <Badge
                    status={tender.status === "active" ? "success" : "error"}
                    text={tender.status}
                  />
                </div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {tender.description?.en || t("tenderadmin.noDescription")}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {t("tenderadmin.ref")}: {tender.reference_number}
                  </span>
                  {tender.tender_document && (
                    <a
                      href={getFileUrl(tender.tender_document)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      {t("tenderadmin.download")}
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
              {t("tenderadmin.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title={t("tenderadmin.tableView")}>
                <Button
                  shape="circle"
                  icon={<AiOutlineUnorderedList />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title={t("tenderadmin.gridView")}>
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
                  setDocUrl(null);
                  setError(null);
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                {t("tenderadmin.addTender")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          <Select
            placeholder={t("tenderadmin.filterStatus")}
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
            dataSource={tenders}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => t("tenderadmin.totalTenders", { total }),
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
                <span>{t("tenderadmin.editTender")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("tenderadmin.addTender")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setDocUrl(null);
          setError(null);
        }}
        onOk={handleFormSubmit}
        okText={editingItem ? t("tenderadmin.update") : t("tenderadmin.create")}
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
            message={t("tenderadmin.error")}
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
                label={t("tenderadmin.form.status")}
                initialValue="active"
                rules={[
                  {
                    required: true,
                    message: t("tenderadmin.form.statusRequired"),
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
                name="referenceNumber"
                label={t("tenderadmin.form.referenceNumber")}
                rules={[
                  {
                    required: true,
                    message: t("tenderadmin.form.referenceRequired"),
                  },
                ]}
              >
                <Input
                  placeholder={t("tenderadmin.form.referencePlaceholder")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="openingDate"
                label={t("tenderadmin.form.openingDate")}
                rules={[
                  {
                    required: true,
                    message: t("tenderadmin.form.openingDateRequired"),
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
                name="closingDate"
                label={t("tenderadmin.form.closingDate")}
                rules={[
                  {
                    required: true,
                    message: t("tenderadmin.form.closingDateRequired"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue("openingDate")) {
                        return Promise.resolve();
                      }
                      const closingDate = moment(value);
                      const openingDate = moment(getFieldValue("openingDate"));

                      if (closingDate.isSameOrAfter(openingDate)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t("tenderadmin.form.closingDateAfterOpening"))
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
                label={t("tenderadmin.form.coverImage")}
                rules={[
                  {
                    required: true,
                    message: t("tenderadmin.form.coverImageRequired"),
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
                        ? t("tenderadmin.uploading")
                        : t("tenderadmin.form.uploadCoverImage")}
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
                name="tenderDocument"
                label={t("tenderadmin.form.tenderDocument")}
                rules={[
                  {
                    required: true,
                    message: t("tenderadmin.form.tenderDocumentRequired"),
                  },
                ]}
              >
                <div className="space-y-4">
                  <Upload
                    name="tenderDocument"
                    showUploadList={false}
                    customRequest={handleDocUpload}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    disabled={uploadingDoc}
                    className="w-full"
                  >
                    <Button
                      icon={<FiUpload />}
                      loading={uploadingDoc}
                      block
                      className="h-12"
                    >
                      {uploadingDoc
                        ? t("tenderadmin.uploading")
                        : t("tenderadmin.form.uploadTenderDocument")}
                    </Button>
                  </Upload>

                  {docUrl && (
                    <div className="mt-4 flex items-center justify-center space-x-2">
                      {getFileIcon(docUrl)}
                      <a
                        href={getFileUrl(docUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {t("tenderadmin.viewUploadedDocument")}
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
                    {t("tenderadmin.language")}:{" "}
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
                label={`${t("tenderadmin.form.title")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("tenderadmin.form.englishTitleRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("tenderadmin.form.enterTitle")} ${
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
                label={`${t("tenderadmin.form.description")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t(
                            "tenderadmin.form.englishDescriptionRequired"
                          ),
                        },
                      ]
                    : []
                }
              >
                <TextArea
                  rows={4}
                  placeholder={`${t("tenderadmin.form.enterDescription")} ${
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
                name={`category_${activeLanguage}`}
                label={`${t("tenderadmin.form.category")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t(
                            "tenderadmin.form.englishCategoryRequired"
                          ),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("tenderadmin.form.enterCategory")} ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                  prefix={<FiFolder className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default TenderAdmin;
