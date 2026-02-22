import React, { useEffect, useState, useCallback } from "react";
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
  Avatar,
  Divider,
  Tooltip,
  Spin,
  Popconfirm,
  Tabs,
  Row,
  Col,
  Collapse,
  Typography,
  Empty,
} from "antd";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiX,
  FiCheck,
  FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiInstagram,
} from "react-icons/fi";
import { MdOutlineImageNotSupported } from "react-icons/md";
import axios from "axios";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Panel } = Collapse;

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://yekawebapi.yekasubcity.com";

const OfficeAdmin = () => {
  const { t } = useTranslation();
  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [form] = Form.useForm();
  const [editingOffice, setEditingOffice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    instagram: "",
    website: "",
  });
  const [contacts, setContacts] = useState({
    emails: [],
    contact_numbers: [],
  });

  const languages = [
    { code: "en", name: t("officedata.english") },
    { code: "am", name: t("officedata.amharic") },
    { code: "or", name: t("officedata.oromiffa") },
  ];

  // Fetch all offices with error handling
  const fetchOffices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/officedata`);
      setOffices(res.data.data || []);
      setFilteredOffices(res.data.data || []);
    } catch (err) {
      console.error("Fetch offices error:", err);
      message.error(t("officedata.fetchFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  // Debounced search
  const handleSearch = useCallback(
    debounce((value) => {
      if (!value.trim()) {
        setFilteredOffices(offices);
        return;
      }

      const filtered = offices.filter(
        (office) =>
          office.officename?.en?.toLowerCase().includes(value.toLowerCase()) ||
          office.officename?.am?.toLowerCase().includes(value.toLowerCase()) ||
          office.officename?.or?.toLowerCase().includes(value.toLowerCase()) ||
          office.specification?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOffices(filtered);
    }, 300),
    [offices]
  );

  // Upload image with better error handling
  const handleImageUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      message.error(t("officedata.invalidFileType"));
      return;
    }

    if (file.size > maxSize) {
      message.error(t("officedata.fileTooLarge"));
      return;
    }

    setUploading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldsValue({ officelogo: res.data.path });
      setPreviewImage(res.data.path);
      message.success(t("officedata.uploadSuccess"));
    } catch (err) {
      console.error("Upload error:", err);
      message.error(t("officedata.uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission with validation
  const handleFormSubmit = async (values) => {
    try {
      setActionLoading(true);
      const payload = {
        ...values,
        officename: {
          en: values.officename_en || "",
          am: values.officename_am || "",
          or: values.officename_or || "",
        },
        missions: {
          en: values.missions_en || "",
          am: values.missions_am || "",
          or: values.missions_or || "",
        },
        vissions: {
          en: values.vissions_en || "",
          am: values.vissions_am || "",
          or: values.vissions_or || "",
        },
        values: {
          en: values.values_en || "",
          am: values.values_am || "",
          or: values.values_or || "",
        },
        aboutoffice: {
          en: values.aboutoffice_en || "",
          am: values.aboutoffice_am || "",
          or: values.aboutoffice_or || "",
        },
        locationstring: {
          en: values.locationstring_en || "",
          am: values.locationstring_am || "",
          or: values.locationstring_or || "",
        },
        social_links: socialLinks,
        emails: contacts.emails,
        contact_numbers: contacts.contact_numbers,
        specification: values.specification,
      };

      if (editingOffice) {
        await axios.put(
          `${BACKEND_URL}/api/officedata/${editingOffice.id}`,
          payload
        );
        message.success(t("officedata.updateSuccess"));
      } else {
        await axios.post(`${BACKEND_URL}/api/officedata`, payload);
        message.success(t("officedata.createSuccess"));
      }

      fetchOffices();
      resetForm();
    } catch (err) {
      console.error("Submission error:", err);
      message.error(
        err.response?.data?.error || t("officedata.operationFailed")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingOffice(null);
    setPreviewImage(null);
    setSocialLinks({
      facebook: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      website: "",
    });
    setContacts({
      emails: [],
      contact_numbers: [],
    });
    setActiveTab("1");
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/officedata/${id}`);
      message.success(t("officedata.deleteSuccess"));
      fetchOffices();
    } catch (err) {
      console.error("Delete error:", err);
      message.error(
        err.response?.data?.error || t("officedata.operationFailed")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingOffice(record);
    form.setFieldsValue({
      ...record,
      officename_en: record.officename?.en,
      officename_am: record.officename?.am,
      officename_or: record.officename?.or,
      missions_en: record.missions?.en,
      missions_am: record.missions?.am,
      missions_or: record.missions?.or,
      vissions_en: record.vissions?.en,
      vissions_am: record.vissions?.am,
      vissions_or: record.vissions?.or,
      values_en: record.values?.en,
      values_am: record.values?.am,
      values_or: record.values?.or,
      aboutoffice_en: record.aboutoffice?.en,
      aboutoffice_am: record.aboutoffice?.am,
      aboutoffice_or: record.aboutoffice?.or,
      locationstring_en: record.locationstring?.en,
      locationstring_am: record.locationstring?.am,
      locationstring_or: record.locationstring?.or,
      specification: record.specification,
    });
    setSocialLinks(
      record.social_links || {
        facebook: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        instagram: "",
        website: "",
      }
    );
    setContacts({
      emails: record.emails || [],
      contact_numbers: record.contact_numbers || [],
    });
    setPreviewImage(record.officelogo);
    setIsModalOpen(true);
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleContactAdd = (type, value) => {
    if (!value || value.trim() === "") return;

    if (type === "emails" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      message.warning(t("officedata.invalidEmail"));
      return;
    }

    if (type === "contact_numbers" && !/^[0-9+\- ]+$/.test(value.trim())) {
      message.warning(t("officedata.invalidPhone"));
      return;
    }

    setContacts((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }));
  };

  const handleContactRemove = (type, index) => {
    setContacts((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const columns = [
    {
      title: t("officedata.logo"),
      dataIndex: "officelogo",
      width: 100,
      responsive: ["md"],
      render: (text) => (
        <div className="flex justify-center">
          {text ? (
            <Avatar
              shape="square"
              src={`${BACKEND_URL}/uploads/${text}`}
              size={64}
              className="rounded-lg shadow-sm border border-gray-200"
            />
          ) : (
            <Avatar
              shape="square"
              size={64}
              icon={<MdOutlineImageNotSupported />}
              className="bg-gray-100 rounded-lg border border-gray-200"
            />
          )}
        </div>
      ),
    },
    {
      title: t("officedata.officeName"),
      dataIndex: "officename",
      responsive: ["xs"],
      render: (text, record) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            {record.officelogo ? (
              <Avatar
                shape="square"
                src={`${BACKEND_URL}/uploads/${record.officelogo}`}
                size={48}
                className="rounded-lg border border-gray-200"
              />
            ) : (
              <Avatar
                shape="square"
                size={48}
                icon={<MdOutlineImageNotSupported />}
                className="bg-gray-100 rounded-lg border border-gray-200"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {text?.en || "No name"}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {record.specification}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            {record.emails?.slice(0, 1).map((email, i) => (
              <div key={i} className="flex items-center">
                <FiMail className="mr-1 flex-shrink-0" />
                <span className="truncate">{email}</span>
              </div>
            ))}
            {record.contact_numbers?.slice(0, 1).map((num, i) => (
              <div key={i} className="flex items-center">
                <FiPhone className="mr-1 flex-shrink-0" />
                <span className="truncate">{num}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: t("officedata.officeName"),
      dataIndex: "officename",
      responsive: ["md"],
      render: (text) => (
        <div>
          <div className="font-semibold text-gray-900">
            {text?.en || "No name"}
          </div>
          <div className="text-sm text-gray-600">{text?.am}</div>
          <div className="text-sm text-gray-600">{text?.or}</div>
        </div>
      ),
      sorter: (a, b) =>
        (a.officename?.en || "").localeCompare(b.officename?.en || ""),
    },
    {
      title: t("officedata.specification"),
      dataIndex: "specification",
      responsive: ["md"],
      render: (text) => (
        <div className="max-w-xs">
          <Text className="text-gray-700 line-clamp-2">{text}</Text>
        </div>
      ),
    },
    {
      title: t("officedata.contactsColumn"),
      dataIndex: "contact_numbers",
      width: 200,
      responsive: ["lg"],
      render: (_, record) => (
        <div className="space-y-2">
          {record.emails?.slice(0, 2).map((email, i) => (
            <div key={i} className="flex items-center text-sm">
              <FiMail className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="truncate text-gray-700">{email}</span>
            </div>
          ))}
          {record.contact_numbers?.slice(0, 2).map((num, i) => (
            <div key={i} className="flex items-center text-sm">
              <FiPhone className="mr-2 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{num}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t("officedata.locationColumn"),
      dataIndex: "locationstring",
      width: 200,
      responsive: ["lg"],
      render: (text) => (
        <div className="flex items-center">
          <FiMapPin className="mr-2 text-red-500 flex-shrink-0" />
          <span className="truncate text-gray-700">
            {text?.en || "No location"}
          </span>
        </div>
      ),
    },
    {
      title: t("officedata.actions"),
      width: 120,
      fixed: "right",
      responsive: ["sm"],
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-600" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50 border-blue-200"
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title={t("officedata.deleteConfirm")}
            description={t("officedata.deleteDescription")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("officedata.deleteText")}
            cancelText={t("officedata.cancelText")}
            okButtonProps={{
              loading: actionLoading,
              danger: true,
            }}
          >
            <Tooltip title="Delete">
              <Button
                shape="circle"
                icon={<FiTrash2 className="text-red-600" />}
                className="hover:bg-red-50 border-red-200"
                danger
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderLanguageFields = (fieldName, label) => {
    return (
      <Collapse ghost defaultActiveKey={fieldName} className="mb-4">
        <Panel
          header={
            <Text strong className="text-gray-800">
              {label}
            </Text>
          }
          key={fieldName}
          className="bg-white rounded-lg border border-gray-200"
        >
          <Row gutter={[16, 16]}>
            {languages.map((lang) => (
              <Col xs={24} sm={12} md={8} key={lang.code}>
                <Form.Item
                  name={`${fieldName}_${lang.code}`}
                  label={
                    <Text className="text-gray-600 font-medium">
                      {lang.name}
                    </Text>
                  }
                  rules={[
                    {
                      required: lang.code === "en",
                      message: t("officedata.nameRequired"),
                    },
                  ]}
                >
                  {fieldName.includes("aboutoffice") ||
                  fieldName.includes("missions") ||
                  fieldName.includes("vissions") ||
                  fieldName.includes("values") ? (
                    <TextArea
                      rows={6}
                      placeholder={`${label} in ${lang.name}...`}
                      className="resize-y min-h-[120px]"
                    />
                  ) : (
                    <Input
                      placeholder={`${label} in ${lang.name}...`}
                      className="h-11"
                    />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Panel>
      </Collapse>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl ">
      <Card
        title={
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0">
            <Title level={3} className="mb-0 text-gray-800">
              {t("officedata.title")}
            </Title>
            <div className="flex flex-col sm:flex-row lg:ml-auto space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              <Input.Search
                placeholder={t("officedata.searchPlaceholder")}
                allowClear
                enterButton
                size="large"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="w-full sm:w-64"
              />
              <Button
                type="primary"
                icon={<FiPlus />}
                size="large"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                {t("officedata.addOffice")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-lg rounded-xl border-0 bg-gradient-to-br from-white to-gray-50/50"
        bodyStyle={{ padding: 0 }}
      >
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Spin size="large" tip={t("officedata.loading")} />
          </div>
        ) : filteredOffices.length === 0 ? (
          <Empty
            description={
              searchTerm
                ? t("officedata.noSearchResults")
                : t("officedata.noOffices")
            }
            className="p-12"
            imageStyle={{ height: 120 }}
          >
            {!searchTerm && (
              <Button
                type="primary"
                icon={<FiPlus />}
                size="large"
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("officedata.addOffice")}
              </Button>
            )}
          </Empty>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <Table
              columns={columns}
              dataSource={filteredOffices}
              rowKey="id"
              loading={loading}
              className="border-none"
              scroll={{ x: true }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => t("officedata.total", { total }),
                position: ["bottomRight"],
                pageSizeOptions: ["10", "20", "50"],
                showQuickJumper: true,
                size: "default",
              }}
              rowClassName="hover:bg-gray-50/80 transition-colors duration-200"
            />
          </div>
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            {editingOffice ? (
              <>
                <FiEdit className="text-blue-600 mr-3 text-lg" />
                <span className="text-lg font-semibold text-gray-800">
                  {t("officedata.editOffice")}
                </span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-600 mr-3 text-lg" />
                <span className="text-lg font-semibold text-gray-800">
                  {t("officedata.addOffice")}
                </span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={resetForm}
        onOk={() => form.submit()}
        okText={editingOffice ? t("officedata.update") : t("officedata.create")}
        okButtonProps={{
          icon: editingOffice ? <FiCheck /> : <FiPlus />,
          className: "flex items-center bg-blue-600 hover:bg-blue-700",
          loading: actionLoading,
          size: "large",
        }}
        cancelButtonProps={{
          icon: <FiX />,
          className: "flex items-center",
          size: "large",
        }}
        width={1000}
        destroyOnClose
        style={{ top: 20 }}
        footer={[
          <Button key="back" onClick={resetForm} size="large">
            {t("officedata.cancelText")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={actionLoading}
            onClick={() => form.submit()}
            size="large"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {editingOffice ? t("officedata.update") : t("officedata.create")}
          </Button>,
        ]}
        className="rounded-lg"
      >
        <Divider className="my-4" />
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabPosition="left"
            className="min-h-[600px]"
            size="large"
          >
            <TabPane tab={t("officedata.basicInfo")} key="1">
              <div className="space-y-6">
                <Card
                  title={t("officedata.logoBasicDetails")}
                  size="default"
                  className="shadow-sm border-gray-200"
                >
                  <div className="space-y-6">
                    <Form.Item
                      name="officelogo"
                      label={
                        <Text strong className="text-gray-700">
                          {t("officedata.logo")}
                        </Text>
                      }
                      rules={[
                        {
                          required: true,
                          message: t("officedata.logoRequired"),
                        },
                      ]}
                    >
                      <div className="space-y-4">
                        <Upload
                          name="officelogo"
                          showUploadList={false}
                          customRequest={handleImageUpload}
                          accept="image/*"
                          disabled={uploading}
                          className="w-full"
                          beforeUpload={(file) => {
                            const isImage = file.type.startsWith("image/");
                            if (!isImage) {
                              message.error(t("officedata.invalidFileType"));
                            }
                            const isLt2M = file.size / 1024 / 1024 < 2;
                            if (!isLt2M) {
                              message.error(t("officedata.fileTooLarge"));
                            }
                            return isImage && isLt2M;
                          }}
                        >
                          <Button
                            icon={<FiUpload />}
                            loading={uploading}
                            block
                            size="large"
                            className="h-14 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
                          >
                            {uploading
                              ? t("officedata.uploading")
                              : t("officedata.uploadLogo")}
                          </Button>
                        </Upload>

                        {previewImage && (
                          <div className="mt-4 flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                            <img
                              src={`${BACKEND_URL}/uploads/${previewImage}`}
                              alt="preview"
                              className="max-h-48 rounded-lg border-2 border-gray-200 p-1"
                            />
                            <Button
                              danger
                              size="middle"
                              icon={<FiX />}
                              onClick={() => {
                                setPreviewImage(null);
                                form.setFieldsValue({ officelogo: null });
                              }}
                              className="mt-3"
                            >
                              {t("officedata.remove")}
                            </Button>
                          </div>
                        )}
                      </div>
                    </Form.Item>

                    {renderLanguageFields(
                      "officename",
                      t("officedata.officeName")
                    )}

                    <Form.Item
                      name="specification"
                      label={
                        <Text strong className="text-gray-700">
                          {t("officedata.specification")}
                        </Text>
                      }
                      rules={[
                        {
                          required: true,
                          message: t("officedata.specificationRequired"),
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder={t("officedata.specificationPlaceholder")}
                        className="resize-y min-h-[100px]"
                      />
                    </Form.Item>
                  </div>
                </Card>
              </div>
            </TabPane>

            <TabPane tab={t("officedata.missionValues")} key="2">
              <div className="space-y-6">
                <Card
                  title={t("officedata.missionVisionValues")}
                  size="default"
                  className="shadow-sm border-gray-200"
                >
                  <div className="space-y-6">
                    {renderLanguageFields(
                      "missions",
                      t("officedata.missionStatement")
                    )}
                    {renderLanguageFields(
                      "vissions",
                      t("officedata.visionStatement")
                    )}
                    {renderLanguageFields("values", t("officedata.coreValues"))}
                    {renderLanguageFields(
                      "aboutoffice",
                      t("officedata.aboutOffice")
                    )}
                  </div>
                </Card>
              </div>
            </TabPane>

            <TabPane tab={t("officedata.location")} key="3">
              <Card
                title={t("officedata.locationInfo")}
                size="default"
                className="shadow-sm border-gray-200"
              >
                {renderLanguageFields(
                  "locationstring",
                  t("officedata.locationDescription")
                )}
              </Card>
            </TabPane>

            <TabPane tab={t("officedata.contacts")} key="4">
              <div className="space-y-6">
                <Card
                  title={t("officedata.socialMedia")}
                  size="default"
                  className="shadow-sm border-gray-200"
                >
                  <div className="space-y-4">
                    <Form.Item
                      label={
                        <Text strong className="text-gray-700">
                          Facebook
                        </Text>
                      }
                    >
                      <Input
                        value={socialLinks.facebook}
                        onChange={(e) =>
                          handleSocialLinkChange("facebook", e.target.value)
                        }
                        placeholder="https://facebook.com/yourpage"
                        prefix={<FiFacebook className="text-blue-600" />}
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <Text strong className="text-gray-700">
                          Twitter
                        </Text>
                      }
                    >
                      <Input
                        value={socialLinks.twitter}
                        onChange={(e) =>
                          handleSocialLinkChange("twitter", e.target.value)
                        }
                        placeholder="https://twitter.com/yourhandle"
                        prefix={<FiTwitter className="text-blue-400" />}
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <Text strong className="text-gray-700">
                          LinkedIn
                        </Text>
                      }
                    >
                      <Input
                        value={socialLinks.linkedin}
                        onChange={(e) =>
                          handleSocialLinkChange("linkedin", e.target.value)
                        }
                        placeholder="https://linkedin.com/company/yourcompany"
                        prefix={<FiLinkedin className="text-blue-700" />}
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <Text strong className="text-gray-700">
                          Instagram
                        </Text>
                      }
                    >
                      <Input
                        value={socialLinks.instagram}
                        onChange={(e) =>
                          handleSocialLinkChange("instagram", e.target.value)
                        }
                        placeholder="https://instagram.com/yourprofile"
                        prefix={<FiInstagram className="text-pink-600" />}
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <Text strong className="text-gray-700">
                          YouTube
                        </Text>
                      }
                    >
                      <Input
                        value={socialLinks.youtube}
                        onChange={(e) =>
                          handleSocialLinkChange("youtube", e.target.value)
                        }
                        placeholder="https://youtube.com/yourchannel"
                        prefix={<FiYoutube className="text-red-600" />}
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <Text strong className="text-gray-700">
                          Website
                        </Text>
                      }
                    >
                      <Input
                        value={socialLinks.website}
                        onChange={(e) =>
                          handleSocialLinkChange("website", e.target.value)
                        }
                        placeholder="https://yourwebsite.com"
                        prefix={<FiGlobe className="text-green-500" />}
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </Card>

                <Card
                  title={t("officedata.contactInfo")}
                  size="default"
                  className="shadow-sm border-gray-200"
                >
                  <div className="space-y-6">
                    <Form.Item
                      label={
                        <Text strong className="text-gray-700">
                          {t("officedata.emailAddresses")}
                        </Text>
                      }
                    >
                      <div className="space-y-3">
                        {contacts.emails.map((email, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              value={email}
                              readOnly
                              prefix={<FiMail className="text-gray-400" />}
                              suffix={
                                <Button
                                  danger
                                  type="text"
                                  icon={<FiX />}
                                  onClick={() =>
                                    handleContactRemove("emails", index)
                                  }
                                  size="small"
                                  className="text-red-500 hover:text-red-700"
                                />
                              }
                              size="large"
                              className="flex-1"
                            />
                          </div>
                        ))}
                        <div className="flex space-x-2">
                          <Input
                            placeholder={t("officedata.enterEmail")}
                            prefix={<FiMail className="text-gray-400" />}
                            onPressEnter={(e) => {
                              handleContactAdd("emails", e.target.value);
                              e.target.value = "";
                            }}
                            size="large"
                            className="flex-1"
                          />
                          <Button
                            type="primary"
                            onClick={() => {
                              const input = document.querySelector(
                                'input[placeholder="Enter email address"]'
                              );
                              handleContactAdd("emails", input.value);
                              input.value = "";
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                            size="large"
                          >
                            {t("officedata.add")}
                          </Button>
                        </div>
                      </div>
                    </Form.Item>

                    <Form.Item
                      label={
                        <Text strong className="text-gray-700">
                          {t("officedata.phoneNumbers")}
                        </Text>
                      }
                    >
                      <div className="space-y-3">
                        {contacts.contact_numbers.map((number, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              value={number}
                              readOnly
                              prefix={<FiPhone className="text-gray-400" />}
                              suffix={
                                <Button
                                  danger
                                  type="text"
                                  icon={<FiX />}
                                  onClick={() =>
                                    handleContactRemove(
                                      "contact_numbers",
                                      index
                                    )
                                  }
                                  size="small"
                                  className="text-red-500 hover:text-red-700"
                                />
                              }
                              size="large"
                              className="flex-1"
                            />
                          </div>
                        ))}
                        <div className="flex space-x-2">
                          <Input
                            placeholder={t("officedata.enterPhone")}
                            prefix={<FiPhone className="text-gray-400" />}
                            onPressEnter={(e) => {
                              handleContactAdd(
                                "contact_numbers",
                                e.target.value
                              );
                              e.target.value = "";
                            }}
                            size="large"
                            className="flex-1"
                          />
                          <Button
                            type="primary"
                            onClick={() => {
                              const input = document.querySelector(
                                'input[placeholder="Enter phone number"]'
                              );
                              handleContactAdd("contact_numbers", input.value);
                              input.value = "";
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                            size="large"
                          >
                            {t("officedata.add")}
                          </Button>
                        </div>
                      </div>
                    </Form.Item>
                  </div>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficeAdmin;
