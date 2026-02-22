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
  Switch,
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
  FiBriefcase,
  FiList,
  FiEye,
  FiEyeOff,
  FiLink,
  FiFolder,
} from "react-icons/fi";
import {
  MdOutlineImageNotSupported,
  MdOutlineWorkOutline,
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
  { value: "open", label: "Open", color: "green" },
  { value: "closed", label: "Closed", color: "red" },
];

const VacancyAdmin = () => {
  const { t } = useTranslation();
  const [vacancies, setVacancies] = useState([]);
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
  const [filterStatus, setFilterStatus] = useState(null);

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      let url = `${BACKEND_URL}api/vacancies`;
      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }
      const res = await axios.get(url);
      setVacancies(res.data.data || []);
    } catch (err) {
      message.error(t("vacancyadmin.fetchErrorMessage"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [filterStatus]);

  const handleCoverImageUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploadingCover(true);
    try {
      const res = await axios.post(`${BACKEND_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldsValue({ coverimage: res.data.path });
      setPreviewImage(res.data.path);
      message.success(t("vacancyadmin.coverImageSuccess"));
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        t("vacancyadmin.imageUploadFailed");
      message.error(errorMsg);
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
      message.success(t("vacancyadmin.fileSuccess"));
    } catch (err) {
      message.error(t("vacancyadmin.fileUploadFailed"));
      console.error(err);
    }
    setUploadingFile(false);
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
    try {
      const values = await form.validateFields();

      const data = {
        coverimage: values.coverimage,
        file: values.file,
        order: values.order || 0,
        status: values.status || "open",
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
        await axios.put(`${BACKEND_URL}api/vacancies/${editingItem.id}`, data);
        message.success(t("vacancyadmin.updateSuccess"));
      } else {
        await axios.post(`${BACKEND_URL}api/vacancies`, data);
        message.success(t("vacancyadmin.createSuccess"));
      }

      fetchVacancies();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      setPreviewImage(null);
      setFileUrl(null);
    } catch (err) {
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("vacancyadmin.operationFailed")
      );
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/vacancies/${id}`);
      message.success(t("vacancyadmin.deleteSuccess"));
      fetchVacancies();
    } catch (err) {
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("vacancyadmin.deleteFailed")
      );
      console.error(err);
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
      coverimage: record.coverimage,
      file: record.file,
      order: record.order || 0,
      status: record.status || "open",
    });
    setPreviewImage(record.coverimage);
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
      title: t("vacancyadmin.columns.coverImage"),
      dataIndex: "coverimage",
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
      title: t("vacancyadmin.columns.title"),
      dataIndex: "title",
      render: (title) => (
        <div>
          <div className="font-medium">
            {title?.en || t("vacancyadmin.noTitle")}
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
      title: t("vacancyadmin.columns.category"),
      dataIndex: "category",
      render: (category) => (
        <div>
          <Tag color="blue">
            {category?.en || t("vacancyadmin.uncategorized")}
          </Tag>
          <div className="text-xs text-gray-500 mt-1">
            {category?.am && <span className="mr-2">🇪🇹 {category.am}</span>}
            {category?.or && <span>🇪🇹 {category.or}</span>}
          </div>
        </div>
      ),
      filters: [
        { text: "General", value: "General" },
        { text: "Technical", value: "Technical" },
        { text: "Administrative", value: "Administrative" },
      ],
      onFilter: (value, record) => record.category?.en?.includes(value),
    },
    {
      title: t("vacancyadmin.columns.status"),
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
      title: t("vacancyadmin.columns.order"),
      dataIndex: "order",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: t("vacancyadmin.columns.file"),
      dataIndex: "file",
      render: (file) =>
        file ? (
          <a href={getFileUrl(file)} target="_blank" rel="noopener noreferrer">
            <Button icon={getFileIcon(file)} size="small">
              {t("vacancyadmin.viewFile")}
            </Button>
          </a>
        ) : (
          <span className="text-gray-400">{t("vacancyadmin.noFile")}</span>
        ),
    },
    {
      title: t("vacancyadmin.columns.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("vacancyadmin.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("vacancyadmin.deleteConfirm.title")}
            description={t("vacancyadmin.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("vacancyadmin.yes")}
            cancelText={t("vacancyadmin.no")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("vacancyadmin.delete")}>
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
      {vacancies.map((item) => (
        <Card
          key={item.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow"
          cover={
            item.coverimage ? (
              <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-50">
                <img
                  src={getFullImageUrl(item.coverimage)}
                  alt={item.title?.en || t("vacancyadmin.vacancy")}
                  className="object-cover h-full w-full"
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <MdOutlineWorkOutline className="text-gray-400 text-4xl" />
              </div>
            )
          }
          actions={[
            <Tooltip title={t("vacancyadmin.edit")}>
              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => openEditModal(item)}
              />
            </Tooltip>,
            <Popconfirm
              title={t("vacancyadmin.deleteConfirm.title")}
              description={t("vacancyadmin.deleteConfirm.description")}
              onConfirm={() => handleDelete(item.id)}
              okText={t("vacancyadmin.yes")}
              cancelText={t("vacancyadmin.no")}
              okButtonProps={{ loading: actionLoading }}
            >
              <Tooltip title={t("vacancyadmin.delete")}>
                <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
              </Tooltip>
            </Popconfirm>,
            item.file && (
              <a
                href={getFileUrl(item.file)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Tooltip title={t("vacancyadmin.viewFile")}>
                  <FiFileText className="text-green-500 cursor-pointer hover:text-green-700" />
                </Tooltip>
              </a>
            ),
          ]}
        >
          <Card.Meta
            title={
              <div className="truncate">
                <div className="font-medium">
                  {item.title?.en || t("vacancyadmin.noTitle")}
                </div>
                <div className="text-xs text-gray-500">
                  {item.title?.am && (
                    <span className="mr-2">🇪🇹 {item.title.am}</span>
                  )}
                  {item.title?.or && <span>🇪🇹 {item.title.or}</span>}
                </div>
              </div>
            }
            description={
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Tag color="blue">
                    {item.category?.en || t("vacancyadmin.uncategorized")}
                  </Tag>
                  <Badge
                    status={item.status === "open" ? "success" : "error"}
                    text={item.status}
                  />
                </div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {item.description?.en || t("vacancyadmin.noDescription")}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {t("vacancyadmin.order")}: {item.order || 0}
                  </span>
                  {item.file && (
                    <a
                      href={getFileUrl(item.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      {t("vacancyadmin.downloadFile")}
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
              {t("vacancyadmin.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title={t("vacancyadmin.tableView")}>
                <Button
                  shape="circle"
                  icon={<AiOutlineUnorderedList />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title={t("vacancyadmin.gridView")}>
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
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                {t("vacancyadmin.addVacancy")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          <Select
            placeholder={t("vacancyadmin.filterStatus")}
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
            dataSource={vacancies}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => t("vacancyadmin.totalVacancies", { total }),
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
                <span>{t("vacancyadmin.editVacancy")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("vacancyadmin.addVacancy")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setFileUrl(null);
        }}
        onOk={handleFormSubmit}
        okText={
          editingItem ? t("vacancyadmin.update") : t("vacancyadmin.create")
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
        width={900}
        destroyOnClose
      >
        <Divider />
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={t("vacancyadmin.form.status")}
                initialValue="open"
                rules={[
                  {
                    required: true,
                    message: t("vacancyadmin.form.statusRequired"),
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
                name="order"
                label={t("vacancyadmin.form.displayOrder")}
                initialValue={0}
                rules={[
                  {
                    required: true,
                    message: t("vacancyadmin.form.orderRequired"),
                  },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="coverimage"
                label={t("vacancyadmin.form.coverImage")}
                rules={[
                  {
                    required: true,
                    message: t("vacancyadmin.form.coverImageRequired"),
                  },
                ]}
              >
                <div className="space-y-4">
                  <Upload
                    name="coverimage"
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
                        ? t("vacancyadmin.uploading")
                        : t("vacancyadmin.form.uploadCoverImage")}
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
                name="file"
                label={t("vacancyadmin.form.vacancyFile")}
                rules={[
                  {
                    required: true,
                    message: t("vacancyadmin.form.fileRequired"),
                  },
                ]}
              >
                <div className="space-y-4">
                  <Upload
                    name="file"
                    showUploadList={false}
                    customRequest={handleFileUpload}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
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
                        ? t("vacancyadmin.uploading")
                        : t("vacancyadmin.form.uploadVacancyFile")}
                    </Button>
                  </Upload>

                  {fileUrl && (
                    <div className="mt-4 flex items-center justify-center space-x-2">
                      {getFileIcon(fileUrl)}
                      <a
                        href={getFileUrl(fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {t("vacancyadmin.viewUploadedFile")}
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
                    {t("vacancyadmin.language")}:{" "}
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
                label={`${t("vacancyadmin.form.title")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("vacancyadmin.form.englishTitleRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("vacancyadmin.form.enterTitle")} ${
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
                label={`${t("vacancyadmin.form.description")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t(
                            "vacancyadmin.form.englishDescriptionRequired"
                          ),
                        },
                      ]
                    : []
                }
              >
                <TextArea
                  rows={4}
                  placeholder={`${t("vacancyadmin.form.enterDescription")} ${
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
                label={`${t("vacancyadmin.form.category")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t(
                            "vacancyadmin.form.englishCategoryRequired"
                          ),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("vacancyadmin.form.enterCategory")} ${
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

export default VacancyAdmin;
