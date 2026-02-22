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
  FiLink,
  FiExternalLink,
  FiEyeOff,
  FiRefreshCw,
} from "react-icons/fi";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { BsGrid } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../../utils/getApiUrl";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const BACKEND_URL = getApiUrl();

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const statusOptions = [
  { value: "published", label: "Published", color: "green" },
  { value: "unpublished", label: "Unpublished", color: "gray" },
];

const PartnersAdmin = () => {
  const { t } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [form] = Form.useForm();
  const [editingPartner, setEditingPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterFeatured, setFilterFeatured] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  // CRITICAL FIX: Track the final image path that will be sent to server
  const [imageToSubmit, setImageToSubmit] = useState(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      let url = `${BACKEND_URL}api/partners`;
      const params = new URLSearchParams();

      if (filterStatus) params.append("status", filterStatus);
      if (filterFeatured !== null) params.append("featured", filterFeatured);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await axios.get(url);
      setPartners(res.data.data || []);
    } catch (err) {
      message.error(t("partnersadmin.messages.fetchError"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [filterStatus, filterFeatured]);

  const handleLogoUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success && res.data.path) {
        const newImagePath = res.data.path;

        // CRITICAL: Set the image that will be submitted to the server
        setImageToSubmit(newImagePath);
        setPreviewImage(newImagePath);

        // Also update form field for validation
        form.setFieldsValue({ logo: newImagePath });

        message.success(t("partnersadmin.messages.logoUploadSuccess"));
        console.log(
          "✅ NEW IMAGE UPLOADED AND READY FOR SUBMISSION:",
          newImagePath
        );
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      message.error(t("partnersadmin.messages.logoUploadError"));
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/partners/${id}`);
      message.success(t("partnersadmin.messages.deleteSuccess"));
      fetchPartners();
    } catch (err) {
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("partnersadmin.messages.deleteError")
      );
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    try {
      const values = await form.validateFields();
      console.log("📝 FORM VALUES:", values);
      console.log("🖼️ IMAGE TO SUBMIT:", imageToSubmit);

      // Prepare the data object
      const data = {
        website: values.website || "",
        status: values.status || "published",
        featured: values.featured || false,
        name: {
          en: values.name_en || "",
          am: values.name_am || values.name_en || "",
          or: values.name_or || values.name_en || "",
        },
        description: {
          en: values.description_en || "",
          am: values.description_am || values.description_en || "",
          or: values.description_or || values.description_en || "",
        },
      };

      // CRITICAL FIX: Use imageToSubmit which contains the uploaded image
      // This completely bypasses the form value for the image field
      if (imageToSubmit) {
        data.logo = imageToSubmit;
        console.log("🚀 SUBMITTING WITH UPLOADED IMAGE:", imageToSubmit);
      } else if (values.logo) {
        // Only use form value if no new image was uploaded during this session
        data.logo = values.logo;
        console.log("📋 SUBMITTING WITH EXISTING IMAGE:", values.logo);
      } else {
        console.log("⚠️ NO IMAGE PROVIDED");
      }

      console.log("📤 FINAL PAYLOAD TO SERVER:", data);

      let response;
      if (editingPartner) {
        response = await axios.put(
          `${BACKEND_URL}api/partners/${editingPartner.id}`,
          data
        );
        message.success(t("partnersadmin.messages.updateSuccess"));
      } else {
        response = await axios.post(`${BACKEND_URL}api/partners`, data);
        message.success(t("partnersadmin.messages.createSuccess"));
      }

      console.log("📥 SERVER RESPONSE:", response.data);

      // Refresh the partners list
      await fetchPartners();

      // Reset form and state
      setIsModalOpen(false);
      form.resetFields();
      setEditingPartner(null);
      setPreviewImage(null);
      setImageToSubmit(null); // Reset the image to submit
    } catch (err) {
      console.error("❌ FORM SUBMISSION ERROR:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        t("partnersadmin.messages.operationFailed");
      message.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingPartner(record);
    const formValues = {
      name_en: record.name?.en || "",
      name_am: record.name?.am || "",
      name_or: record.name?.or || "",
      description_en: record.description?.en || "",
      description_am: record.description?.am || "",
      description_or: record.description?.or || "",
      logo: record.logo,
      website: record.website || "",
      status: record.status,
      featured: record.featured || false,
    };

    console.log("📝 OPENING EDIT MODAL WITH:", formValues);
    form.setFieldsValue(formValues);
    setPreviewImage(record.logo);
    setImageToSubmit(null); // Reset image to submit when opening modal
    setIsModalOpen(true);
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    if (path.startsWith("uploads/")) {
      return `${BACKEND_URL}${path}`;
    }
    return `${BACKEND_URL}uploads/${path}`;
  };

  const handleRemoveImage = () => {
    form.setFieldsValue({ logo: undefined });
    setPreviewImage(null);
    setImageToSubmit(null); // Also clear the image to submit
  };

  const refreshPartner = async (partnerId) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}api/partners/${partnerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error refreshing partner:", error);
      return null;
    }
  };

  const columns = [
    {
      title: t("partnersadmin.table.logo"),
      dataIndex: "logo",
      render: (text, record) => (
        <div className="flex justify-center">
          {text ? (
            <Avatar
              shape="square"
              src={getFullImageUrl(text)}
              size={64}
              className="rounded-lg shadow-sm"
              onError={() => {
                refreshPartner(record.id).then((updatedPartner) => {
                  if (updatedPartner && updatedPartner.logo !== text) {
                    setPartners((prev) =>
                      prev.map((p) =>
                        p.id === record.id
                          ? { ...p, logo: updatedPartner.logo }
                          : p
                      )
                    );
                  }
                });
              }}
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
      title: t("partnersadmin.table.name"),
      dataIndex: "name",
      render: (name) => (
        <div>
          <div className="font-medium">
            {name?.en || t("partnersadmin.table.noName")}
          </div>
          <div className="text-xs text-gray-500">
            {name?.am && <span className="mr-2">🇪🇹 {name.am}</span>}
            {name?.or && <span>🇪🇹 {name.or}</span>}
          </div>
        </div>
      ),
      sorter: (a, b) => (a.name?.en || "").localeCompare(b.name?.en || ""),
    },
    {
      title: t("partnersadmin.table.website"),
      dataIndex: "website",
      render: (website) =>
        website ? (
          <a
            href={website.startsWith("http") ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500"
          >
            <FiExternalLink className="mr-1" />
            {website.replace(/(^\w+:|^)\/\//, "")}
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: t("partnersadmin.table.status"),
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
      title: t("partnersadmin.table.featured"),
      dataIndex: "featured",
      render: (featured) => (
        <Tag color={featured ? "green" : "gray"}>
          {featured
            ? t("partnersadmin.table.yes")
            : t("partnersadmin.table.no")}
        </Tag>
      ),
      filters: [
        { text: t("partnersadmin.table.featured"), value: true },
        { text: t("partnersadmin.table.notFeatured"), value: false },
      ],
      onFilter: (value, record) => record.featured === value,
    },
    {
      title: t("partnersadmin.table.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("partnersadmin.actions.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("partnersadmin.deleteConfirm.title")}
            description={t("partnersadmin.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("partnersadmin.deleteConfirm.okText")}
            cancelText={t("partnersadmin.deleteConfirm.cancelText")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("partnersadmin.actions.delete")}>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {partners.map((item) => (
        <Card
          key={item.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow"
          cover={
            item.logo ? (
              <div
                className="h-48 overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer"
                onClick={() => {
                  setPreviewImage(item.logo);
                  setPreviewVisible(true);
                }}
              >
                <img
                  src={getFullImageUrl(item.logo)}
                  alt={item.name?.en || t("partnersadmin.grid.partner")}
                  className="object-contain h-full w-full p-4"
                  onError={(e) => {
                    refreshPartner(item.id).then((updatedPartner) => {
                      if (updatedPartner && updatedPartner.logo !== item.logo) {
                        e.target.src = getFullImageUrl(updatedPartner.logo);
                      }
                    });
                  }}
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <MdOutlineImageNotSupported className="text-gray-400 text-4xl" />
              </div>
            )
          }
          actions={[
            <Tooltip key="edit" title={t("partnersadmin.actions.edit")}>
              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => openEditModal(item)}
              />
            </Tooltip>,
            <Popconfirm
              key="delete"
              title={t("partnersadmin.deleteConfirm.title")}
              description={t("partnersadmin.deleteConfirm.description")}
              onConfirm={() => handleDelete(item.id)}
              okText={t("partnersadmin.deleteConfirm.okText")}
              cancelText={t("partnersadmin.deleteConfirm.cancelText")}
              okButtonProps={{ loading: actionLoading }}
            >
              <Tooltip title={t("partnersadmin.actions.delete")}>
                <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
              </Tooltip>
            </Popconfirm>,
          ]}
        >
          <Card.Meta
            title={
              <div className="truncate">
                <div className="font-medium">
                  {item.name?.en || t("partnersadmin.table.noName")}
                </div>
                <div className="text-xs text-gray-500">
                  {item.name?.am && (
                    <span className="mr-2">🇪🇹 {item.name.am}</span>
                  )}
                  {item.name?.or && <span>🇪🇹 {item.name.or}</span>}
                </div>
              </div>
            }
            description={
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Tag color={item.featured ? "green" : "gray"}>
                    {item.featured
                      ? t("partnersadmin.grid.featured")
                      : t("partnersadmin.grid.regular")}
                  </Tag>
                  <Badge
                    status={item.status === "published" ? "success" : "default"}
                    text={item.status}
                  />
                </div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {item.description?.en ||
                    t("partnersadmin.grid.noDescription")}
                </div>
                {item.website && (
                  <div className="mt-2">
                    <a
                      href={
                        item.website.startsWith("http")
                          ? item.website
                          : `https://${item.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-xs flex items-center"
                    >
                      <FiExternalLink className="mr-1" />
                      {item.website.replace(/(^\w+:|^)\/\//, "")}
                    </a>
                  </div>
                )}
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
              {t("partnersadmin.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title={t("partnersadmin.view.table")}>
                <Button
                  shape="circle"
                  icon={<AiOutlineUnorderedList />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title={t("partnersadmin.view.grid")}>
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
                  setEditingPartner(null);
                  setPreviewImage(null);
                  setImageToSubmit(null);
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                {t("partnersadmin.actions.addPartner")}
              </Button>
              <Button
                icon={<FiRefreshCw />}
                onClick={fetchPartners}
                loading={loading}
              >
                {t("partnersadmin.actions.refresh")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          <div className="flex space-x-4">
            <Select
              placeholder={t("partnersadmin.filter.statusPlaceholder")}
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
            <Select
              placeholder={t("partnersadmin.filter.featuredPlaceholder")}
              allowClear
              onChange={setFilterFeatured}
              style={{ width: 150 }}
            >
              <Option value={true}>{t("partnersadmin.table.featured")}</Option>
              <Option value={false}>
                {t("partnersadmin.table.notFeatured")}
              </Option>
            </Select>
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center p-8">
            <Spin size="large" />
          </div>
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={partners}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) =>
                t("partnersadmin.table.totalPartners", { total }),
            }}
          />
        ) : (
          gridView
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            {editingPartner ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("partnersadmin.modal.editTitle")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("partnersadmin.modal.addTitle")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setImageToSubmit(null);
        }}
        onOk={handleFormSubmit}
        okText={
          editingPartner
            ? t("partnersadmin.actions.update")
            : t("partnersadmin.actions.create")
        }
        okButtonProps={{
          icon: editingPartner ? <FiCheck /> : <FiPlus />,
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
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={t("partnersadmin.form.status")}
                initialValue="published"
                rules={[
                  {
                    required: true,
                    message: t("partnersadmin.form.statusRequired"),
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
                name="featured"
                label={t("partnersadmin.form.featured")}
                valuePropName="checked"
                initialValue={false}
              >
                <Switch
                  checkedChildren={t("partnersadmin.form.yes")}
                  unCheckedChildren={t("partnersadmin.form.no")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="logo"
            label={t("partnersadmin.form.logo")}
            rules={[
              { required: true, message: t("partnersadmin.form.logoRequired") },
            ]}
          >
            <div className="space-y-4">
              <Upload
                name="logo"
                showUploadList={false}
                customRequest={handleLogoUpload}
                accept="image/*"
                disabled={uploading}
                className="w-full"
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error(t("partnersadmin.messages.imageOnly"));
                    return false;
                  }
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isLt2M) {
                    message.error(t("partnersadmin.messages.imageSize"));
                    return false;
                  }
                  return isImage && isLt2M;
                }}
              >
                <Button
                  icon={<FiUpload />}
                  loading={uploading}
                  block
                  className="h-12"
                >
                  {uploading
                    ? t("partnersadmin.form.uploading")
                    : t("partnersadmin.form.uploadLogo")}
                </Button>
              </Upload>

              {previewImage && (
                <div className="mt-4 flex flex-col items-center space-y-2">
                  <img
                    src={getFullImageUrl(previewImage)}
                    alt={t("partnersadmin.form.previewAlt")}
                    className="max-h-40 rounded-lg border border-gray-200 p-1 cursor-pointer"
                    onClick={() => {
                      setPreviewVisible(true);
                    }}
                  />
                  <div className="text-xs text-gray-500">
                    {imageToSubmit
                      ? "🆕 NEW IMAGE UPLOADED - This will be saved when you click Update"
                      : "📷 CURRENT IMAGE - No changes made"}
                  </div>
                  <Button
                    type="link"
                    danger
                    size="small"
                    onClick={handleRemoveImage}
                  >
                    {t("partnersadmin.form.removeImage")}
                  </Button>
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item
            name="website"
            label={t("partnersadmin.form.website")}
            rules={[
              {
                type: "url",
                message: t("partnersadmin.form.websiteValidation"),
              },
            ]}
          >
            <Input
              prefix={<FiLink className="text-gray-400" />}
              placeholder={t("partnersadmin.form.websitePlaceholder")}
            />
          </Form.Item>

          <div className="mb-4">
            <Tabs
              defaultActiveKey="en"
              onChange={setActiveLanguage}
              tabBarExtraContent={
                <div className="flex items-center text-sm text-gray-500">
                  <FiGlobe className="mr-1" />
                  <span>
                    {t("partnersadmin.modal.language")}:{" "}
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
                  <Form.Item name={`name_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={`description_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                </React.Fragment>
              )
          )}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`name_${activeLanguage}`}
                label={t("partnersadmin.form.name", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("partnersadmin.form.nameRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={t("partnersadmin.form.namePlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`description_${activeLanguage}`}
                label={t("partnersadmin.form.description", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("partnersadmin.form.descriptionRequired"),
                        },
                      ]
                    : []
                }
              >
                <TextArea
                  rows={4}
                  placeholder={t("partnersadmin.form.descriptionPlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                  showCount
                  maxLength={500}
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
        bodyStyle={{ padding: 0 }}
        centered
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center bg-black bg-opacity-90">
            <Image
              src={getFullImageUrl(previewImage)}
              className="max-h-[70vh] object-contain"
              preview={false}
            />
          </div>
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <div>{t("partnersadmin.preview.logo")}</div>
            <div className="flex space-x-2">
              <Button
                icon={<FiEyeOff />}
                onClick={() => setPreviewVisible(false)}
              >
                {t("partnersadmin.preview.close")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PartnersAdmin;
