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
  FiDownload,
  FiLink,
} from "react-icons/fi";
import {
  MdOutlineImageNotSupported,
  MdOutlineDescription,
} from "react-icons/md";
import { BsGrid, BsFileEarmarkPdf, BsFileZip } from "react-icons/bs";
import { FaFileArchive } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../../utils/getApiUrl";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const BACKEND_URL = getApiUrl();

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const statusOptions = [
  { value: "active", label: "Active", color: "green" },
  { value: "archived", label: "Archived", color: "gray" },
];

const ResourceFileAdmin = () => {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterStatus, setFilterStatus] = useState("active");
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BACKEND_URL}api/resource-files`;
      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }
      const res = await axios.get(url);
      setResources(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          t("resourceadmin.messages.fetchError")
      );
      message.error(t("resourceadmin.messages.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
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
      message.success(t("resourceadmin.messages.coverUploadSuccess"));
    } catch (err) {
      console.error("Upload error:", err);
      message.error(t("resourceadmin.messages.coverUploadError"));
    } finally {
      setUploadingCover(false);
    }
  };

  const handleFileUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploadingFile(true);
    try {
      const res = await axios.post(`${BACKEND_URL}api/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldsValue({ file: res.data.path });
      setFileUrl(res.data.path);
      message.success(t("resourceadmin.messages.fileUploadSuccess"));
    } catch (err) {
      console.error("Upload error:", err);
      message.error(t("resourceadmin.messages.fileUploadError"));
    } finally {
      setUploadingFile(false);
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
      case "zip":
        return <BsFileZip className="text-purple-500" />;
      case "rar":
        return <FaFileArchive className="text-yellow-500" />;
      case "txt":
        return <FiFileText className="text-gray-500" />;
      default:
        return <FiFileText />;
    }
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const values = await form.validateFields();

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
        coverImage: values.coverImage,
        file: values.file,
        category: {
          en: values.category_en || t("resourceadmin.form.general"),
          am:
            values.category_am ||
            values.category_en ||
            t("resourceadmin.form.generalAm"),
          or:
            values.category_or ||
            values.category_en ||
            t("resourceadmin.form.generalOr"),
        },
        status: values.status || "active",
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let response;
      if (editingItem) {
        response = await axios.put(
          `${BACKEND_URL}api/resource-files/${editingItem.id}`,
          data,
          config
        );
        message.success(t("resourceadmin.messages.updateSuccess"));
      } else {
        response = await axios.post(
          `${BACKEND_URL}api/resource-files`,
          data,
          config
        );
        message.success(t("resourceadmin.messages.createSuccess"));
      }

      fetchResources();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      setPreviewImage(null);
      setFileUrl(null);
    } catch (err) {
      console.error("Form submission error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          t("resourceadmin.messages.operationFailed")
      );
      message.error(t("resourceadmin.messages.operationFailed"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/resource-files/${id}`);
      message.success(t("resourceadmin.messages.deleteSuccess"));
      fetchResources();
    } catch (err) {
      console.error("Delete error:", err);
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("resourceadmin.messages.deleteError")
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
      coverImage: record.cover_image,
      file: record.file,
      status: record.status || "active",
    });
    setPreviewImage(record.cover_image);
    setFileUrl(record.file);
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
      title: t("resourceadmin.table.cover"),
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
      title: t("resourceadmin.table.title"),
      dataIndex: "title",
      render: (title) => (
        <div>
          <div className="font-medium">
            {title?.en || t("resourceadmin.table.noTitle")}
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
      title: t("resourceadmin.table.file"),
      dataIndex: "file",
      render: (file) => (
        <div className="flex items-center">
          {getFileIcon(file)}
          <span className="ml-2 truncate" style={{ maxWidth: "200px" }}>
            {file ? file.split("/").pop() : t("resourceadmin.table.noFile")}
          </span>
        </div>
      ),
    },
    {
      title: t("resourceadmin.table.category"),
      dataIndex: "category",
      render: (category) => (
        <Tag color="blue">
          {category?.en || t("resourceadmin.form.general")}
        </Tag>
      ),
    },
    {
      title: t("resourceadmin.table.status"),
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
      title: t("resourceadmin.table.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("resourceadmin.actions.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("resourceadmin.deleteConfirm.title")}
            description={t("resourceadmin.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("resourceadmin.deleteConfirm.okText")}
            cancelText={t("resourceadmin.deleteConfirm.cancelText")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("resourceadmin.actions.delete")}>
              <Button
                shape="circle"
                icon={<FiTrash2 className="text-red-500" />}
                className="hover:bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
          {record.file && (
            <Tooltip title={t("resourceadmin.actions.download")}>
              <a href={getFileUrl(record.file)} download>
                <Button
                  shape="circle"
                  icon={<FiDownload className="text-green-500" />}
                  className="hover:bg-green-50"
                />
              </a>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const gridView = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <Card
          key={resource.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow"
          cover={
            resource.cover_image ? (
              <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-50">
                <img
                  src={getFullImageUrl(resource.cover_image)}
                  alt={resource.title?.en || t("resourceadmin.grid.resource")}
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
            <Tooltip title={t("resourceadmin.actions.edit")}>
              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => openEditModal(resource)}
              />
            </Tooltip>,
            <Popconfirm
              title={t("resourceadmin.deleteConfirm.title")}
              description={t("resourceadmin.deleteConfirm.description")}
              onConfirm={() => handleDelete(resource.id)}
              okText={t("resourceadmin.deleteConfirm.okText")}
              cancelText={t("resourceadmin.deleteConfirm.cancelText")}
              okButtonProps={{ loading: actionLoading }}
            >
              <Tooltip title={t("resourceadmin.actions.delete")}>
                <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
              </Tooltip>
            </Popconfirm>,
            resource.file && (
              <a href={getFileUrl(resource.file)} download>
                <Tooltip title={t("resourceadmin.actions.download")}>
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
                  {resource.title?.en || t("resourceadmin.table.noTitle")}
                </div>
                <div className="text-xs text-gray-500">
                  {resource.title?.am && (
                    <span className="mr-2">🇪🇹 {resource.title.am}</span>
                  )}
                  {resource.title?.or && <span>🇪🇹 {resource.title.or}</span>}
                </div>
              </div>
            }
            description={
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Tag color="blue">
                    {resource.category?.en || t("resourceadmin.form.general")}
                  </Tag>
                  <Badge
                    status={
                      resource.status === "active" ? "success" : "default"
                    }
                    text={resource.status}
                  />
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  {getFileIcon(resource.file)}
                  <span className="ml-2 truncate">
                    {resource.file
                      ? resource.file.split("/").pop()
                      : t("resourceadmin.table.noFile")}
                  </span>
                </div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {resource.description?.en ||
                    t("resourceadmin.grid.noDescription")}
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
              {t("resourceadmin.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title={t("resourceadmin.view.table")}>
                <Button
                  shape="circle"
                  icon={<AiOutlineUnorderedList />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title={t("resourceadmin.view.grid")}>
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
                  setFileUrl(null);
                  setError(null);
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                {t("resourceadmin.actions.addResource")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          <Select
            placeholder={t("resourceadmin.filter.statusPlaceholder")}
            allowClear
            onChange={setFilterStatus}
            defaultValue="active"
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
            dataSource={resources}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) =>
                t("resourceadmin.table.totalResources", { total }),
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
                <span>{t("resourceadmin.modal.editTitle")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("resourceadmin.modal.addTitle")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setFileUrl(null);
          setError(null);
        }}
        onOk={handleFormSubmit}
        okText={
          editingItem
            ? t("resourceadmin.actions.update")
            : t("resourceadmin.actions.create")
        }
        okButtonProps={{
          icon: editingItem ? <FiCheck /> : <FiPlus />,
          className: "flex items-center",
          loading: actionLoading,
        }}
        cancelButtonProps={{
          icon: <FiX />,
          className: "flex items-center",
        }}
        width={800}
        destroyOnClose
      >
        <Divider />
        {error && (
          <Alert
            message={t("resourceadmin.error.title")}
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
                label={t("resourceadmin.form.status")}
                initialValue="active"
                rules={[
                  {
                    required: true,
                    message: t("resourceadmin.form.statusRequired"),
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
                label={t("resourceadmin.form.categoryEnglish")}
                rules={[
                  {
                    required: true,
                    message: t("resourceadmin.form.categoryRequired"),
                  },
                ]}
              >
                <Input
                  placeholder={t("resourceadmin.form.categoryPlaceholder")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="coverImage"
                label={t("resourceadmin.form.coverImage")}
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
                        ? t("resourceadmin.form.uploading")
                        : t("resourceadmin.form.uploadCover")}
                    </Button>
                  </Upload>

                  {previewImage && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={getFullImageUrl(previewImage)}
                        alt={t("resourceadmin.form.previewAlt")}
                        className="max-h-40 rounded-lg border border-gray-200 p-1"
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="file"
                label={t("resourceadmin.form.resourceFile")}
                rules={[
                  {
                    required: true,
                    message: t("resourceadmin.form.fileRequired"),
                  },
                ]}
              >
                <div className="space-y-4">
                  <Upload
                    name="file"
                    showUploadList={false}
                    customRequest={handleFileUpload}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
                    disabled={uploadingFile}
                    className="w-full"
                  >
                    <Button
                      icon={<FiUpload />}
                      loading={uploadingFile}
                      block
                      className="h-12"
                    >
                      {uploadingFile
                        ? t("resourceadmin.form.uploading")
                        : t("resourceadmin.form.uploadFile")}
                    </Button>
                  </Upload>

                  {fileUrl && (
                    <div className="mt-4 flex items-center justify-center space-x-2">
                      {getFileIcon(fileUrl)}
                      <span className="truncate">
                        {fileUrl.split("/").pop()}
                      </span>
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
                    {t("resourceadmin.modal.language")}:{" "}
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
                label={t("resourceadmin.form.title", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("resourceadmin.form.titleRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={t("resourceadmin.form.titlePlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                  prefix={<FiLink className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`description_${activeLanguage}`}
                label={t("resourceadmin.form.description", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("resourceadmin.form.descriptionRequired"),
                        },
                      ]
                    : []
                }
              >
                <TextArea
                  rows={4}
                  placeholder={t("resourceadmin.form.descriptionPlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ResourceFileAdmin;
