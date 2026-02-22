import React, { useState, useEffect } from "react";
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
  FiBriefcase,
  FiMessageSquare,
  FiAward,
  FiLink,
  FiExternalLink,
} from "react-icons/fi";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { BsGrid } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const API_URL = getApiUrl();

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const CEOAdmin = () => {
  const { t } = useTranslation();
  const [ceos, setCEOs] = useState([]);
  const [form] = Form.useForm();
  const [editingCEO, setEditingCEO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [socialLinks, setSocialLinks] = useState([]);

  const fetchCEOs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}api/add-ceo`);
      setCEOs(res.data.data || []);
    } catch (err) {
      message.error(t("ceoadmin.messages.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCEOs();
  }, []);

  const handleImageUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldsValue({ image: res.data.path });
      setPreviewImage(res.data.path);
      message.success(t("ceoadmin.messages.uploadSuccess"));
    } catch (err) {
      message.error(t("ceoadmin.messages.uploadError"));
    }
    setUploading(false);
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const handleRemoveSocialLink = (index) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const handleSocialLinkChange = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    try {
      const values = await form.validateFields();

      const data = {
        image: values.image,
        fullName: {
          en: values.name_en || "",
          am: values.name_am || "",
          or: values.name_or || "",
        },
        position: {
          en: values.position_en || "",
          am: values.position_am || "",
          or: values.position_or || "",
        },
        socialMediaLinks: socialLinks,
        order: values.order || 0,
        message: {
          en: values.message_en || "",
          am: values.message_am || "",
          or: values.message_or || "",
        },
        workExperience: {
          en: values.work_experience_en || "",
          am: values.work_experience_am || "",
          or: values.work_experience_or || "",
        },
        educationalQualification: {
          en: values.education_en || "",
          am: values.education_am || "",
          or: values.education_or || "",
        },
      };

      if (editingCEO) {
        await axios.put(`${API_URL}api/add-ceo/${editingCEO.id}`, data);
        message.success(t("ceoadmin.messages.updateSuccess"));
      } else {
        await axios.post(`${API_URL}api/add-ceo`, data);
        message.success(t("ceoadmin.messages.createSuccess"));
      }
      fetchCEOs();
      setIsModalOpen(false);
      form.resetFields();
      setEditingCEO(null);
      setPreviewImage(null);
      setSocialLinks([]);
    } catch (err) {
      message.error(t("ceoadmin.messages.operationFailed"));
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}api/add-ceo/${id}`);
      message.success(t("ceoadmin.messages.deleteSuccess"));
      fetchCEOs();
    } catch (err) {
      message.error(t("ceoadmin.messages.deleteError"));
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingCEO(record);
    const links = record.socialMediaLinks || [];
    setSocialLinks(links);

    form.setFieldsValue({
      name_en: record.fullName?.en || "",
      name_am: record.fullName?.am || "",
      name_or: record.fullName?.or || "",
      position_en: record.position?.en || "",
      position_am: record.position?.am || "",
      position_or: record.position?.or || "",
      message_en: record.message?.en || "",
      message_am: record.message?.am || "",
      message_or: record.message?.or || "",
      work_experience_en: record.workExperience?.en || "",
      work_experience_am: record.workExperience?.am || "",
      work_experience_or: record.workExperience?.or || "",
      education_en: record.educationalQualification?.en || "",
      education_am: record.educationalQualification?.am || "",
      education_or: record.educationalQualification?.or || "",
      order: record.order || 0,
      image: record.image,
    });
    setPreviewImage(record.image);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: t("ceoadmin.table.image"),
      dataIndex: "image",
      render: (text) => (
        <div className="flex justify-center">
          {text ? (
            <Avatar
              shape="square"
              src={`${API_URL}uploads/${text}`}
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
      title: t("ceoadmin.table.ceoName"),
      dataIndex: "fullName",
      render: (name) => (
        <div>
          <div className="font-medium">
            {name?.en || t("ceoadmin.table.noName")}
          </div>
          <div className="text-xs text-gray-500">
            {name?.am && <span className="mr-2">🇪🇹 {name.am}</span>}
            {name?.or && <span>🇪🇹 {name.or}</span>}
          </div>
        </div>
      ),
      sorter: (a, b) =>
        (a.fullName?.en || "").localeCompare(b.fullName?.en || ""),
    },
    {
      title: t("ceoadmin.table.position"),
      dataIndex: "position",
      render: (position) => (
        <div>
          <div className="font-medium">
            {position?.en || t("ceoadmin.table.noPosition")}
          </div>
          <div className="text-xs text-gray-500">
            {position?.am && <span className="mr-2">🇪🇹 {position.am}</span>}
            {position?.or && <span>🇪🇹 {position.or}</span>}
          </div>
        </div>
      ),
    },
    {
      title: t("ceoadmin.table.order"),
      dataIndex: "order",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: t("ceoadmin.table.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("ceoadmin.actions.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("ceoadmin.deleteConfirm.title")}
            description={t("ceoadmin.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("ceoadmin.deleteConfirm.okText")}
            cancelText={t("ceoadmin.deleteConfirm.cancelText")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("ceoadmin.actions.delete")}>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ceos.map((ceo) => (
        <Card
          key={ceo.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow"
          cover={
            ceo.image ? (
              <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-50">
                <img
                  src={`${API_URL}${ceo.image}`}
                  alt={ceo.fullName?.en || t("ceoadmin.grid.ceo")}
                  className="object-cover h-full w-full"
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <MdOutlineImageNotSupported className="text-gray-400 text-4xl" />
              </div>
            )
          }
          actions={[
            <Tooltip title={t("ceoadmin.actions.edit")}>
              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => openEditModal(ceo)}
              />
            </Tooltip>,
            <Popconfirm
              title={t("ceoadmin.deleteConfirm.title")}
              description={t("ceoadmin.deleteConfirm.description")}
              onConfirm={() => handleDelete(ceo.id)}
              okText={t("ceoadmin.deleteConfirm.okText")}
              cancelText={t("ceoadmin.deleteConfirm.cancelText")}
              okButtonProps={{ loading: actionLoading }}
            >
              <Tooltip title={t("ceoadmin.actions.delete")}>
                <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
              </Tooltip>
            </Popconfirm>,
          ]}
        >
          <Card.Meta
            title={
              <div>
                <div className="font-medium">
                  {ceo.fullName?.en || t("ceoadmin.table.noName")}
                </div>
                <div className="text-xs text-gray-500">
                  {ceo.fullName?.am && (
                    <span className="mr-2">🇪🇹 {ceo.fullName.am}</span>
                  )}
                  {ceo.fullName?.or && <span>🇪🇹 {ceo.fullName.or}</span>}
                </div>
              </div>
            }
            description={
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">
                    {ceo.position?.en || t("ceoadmin.table.noPosition")}
                  </div>
                  <div className="text-xs">
                    {ceo.position?.am && (
                      <span className="mr-2">🇪🇹 {ceo.position.am}</span>
                    )}
                    {ceo.position?.or && <span>🇪🇹 {ceo.position.or}</span>}
                  </div>
                </div>
                <Divider className="my-2" />
                <div>
                  <div className="text-xs text-gray-500 mb-2">
                    {t("ceoadmin.grid.order")}: {ceo.order || 0}
                  </div>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {ceo.message?.en || t("ceoadmin.grid.noMessage")}
                  </div>
                </div>
                {ceo.socialMediaLinks?.length > 0 && (
                  <>
                    <Divider className="my-2" />
                    <div className="flex flex-wrap gap-2">
                      {ceo.socialMediaLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FiExternalLink className="inline mr-1" />
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  </>
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
              {t("ceoadmin.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title={t("ceoadmin.view.table")}>
                <Button
                  shape="circle"
                  icon={<AiOutlineUnorderedList />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title={t("ceoadmin.view.grid")}>
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
                  setEditingCEO(null);
                  setPreviewImage(null);
                  setSocialLinks([]);
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                {t("ceoadmin.actions.addCEO")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-md rounded-lg"
      >
        {loading ? (
          <div className="flex justify-center p-8">
            <Spin size="large" />
          </div>
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={ceos}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => t("ceoadmin.table.totalCEOs", { total }),
            }}
          />
        ) : (
          gridView
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            {editingCEO ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("ceoadmin.modal.editTitle")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("ceoadmin.modal.addTitle")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setSocialLinks([]);
        }}
        onOk={handleFormSubmit}
        okText={
          editingCEO
            ? t("ceoadmin.actions.update")
            : t("ceoadmin.actions.create")
        }
        okButtonProps={{
          icon: editingCEO ? <FiCheck /> : <FiPlus />,
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
          <Form.Item
            name="image"
            label={t("ceoadmin.form.ceoPhoto")}
            rules={[
              { required: true, message: t("ceoadmin.form.imageRequired") },
            ]}
          >
            <div className="space-y-4">
              <Upload
                name="image"
                showUploadList={false}
                customRequest={handleImageUpload}
                accept="image/*"
                disabled={uploading}
                className="w-full"
              >
                <Button
                  icon={<FiUpload />}
                  loading={uploading}
                  block
                  className="h-12"
                >
                  {uploading
                    ? t("ceoadmin.form.uploading")
                    : t("ceoadmin.form.uploadPhoto")}
                </Button>
              </Upload>

              {previewImage && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={`${API_URL}uploads/${previewImage}`}
                    alt={t("ceoadmin.form.previewAlt")}
                    className="max-h-64 rounded-lg border border-gray-200 p-1"
                  />
                </div>
              )}
            </div>
          </Form.Item>

          <div className="mb-4">
            <Tabs
              defaultActiveKey="en"
              onChange={setActiveLanguage}
              tabBarExtraContent={
                <div className="flex items-center text-sm text-gray-500">
                  <FiGlobe className="mr-1" />
                  <span>
                    {t("ceoadmin.modal.language")}:{" "}
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
                  <Form.Item name={`position_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={`message_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={`work_experience_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={`education_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                </React.Fragment>
              )
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={`name_${activeLanguage}`}
                label={t("ceoadmin.form.fullName", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("ceoadmin.form.nameRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  size="large"
                  placeholder={t("ceoadmin.form.namePlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                  prefix={<FiUser className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="order"
                label={t("ceoadmin.form.displayOrder")}
                rules={[
                  { required: true, message: t("ceoadmin.form.orderRequired") },
                ]}
              >
                <Input type="number" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`position_${activeLanguage}`}
                label={t("ceoadmin.form.position", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("ceoadmin.form.positionRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  size="large"
                  placeholder={t("ceoadmin.form.positionPlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                  prefix={<FiBriefcase className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            {t("ceoadmin.form.socialMediaLinks")}
          </Divider>

          {socialLinks.map((link, index) => (
            <Row gutter={16} key={index} className="mb-4">
              <Col span={8}>
                <Select
                  value={link.platform}
                  onChange={(value) =>
                    handleSocialLinkChange(index, "platform", value)
                  }
                  placeholder={t("ceoadmin.form.selectPlatform")}
                  className="w-full"
                  size="large"
                >
                  <Option value="facebook">Facebook</Option>
                  <Option value="twitter">Twitter</Option>
                  <Option value="linkedin">LinkedIn</Option>
                  <Option value="instagram">Instagram</Option>
                  <Option value="telegram">Telegram</Option>
                </Select>
              </Col>
              <Col span={14}>
                <Input
                  prefix={<FiLink className="text-gray-400" />}
                  value={link.url}
                  onChange={(e) =>
                    handleSocialLinkChange(index, "url", e.target.value)
                  }
                  placeholder={t("ceoadmin.form.urlPlaceholder")}
                  size="large"
                />
              </Col>
              <Col span={2}>
                <Button
                  danger
                  onClick={() => handleRemoveSocialLink(index)}
                  className="w-full"
                  size="large"
                >
                  ×
                </Button>
              </Col>
            </Row>
          ))}

          <Button
            type="dashed"
            onClick={handleAddSocialLink}
            icon={<FiPlus />}
            className="mb-6"
            size="large"
          >
            {t("ceoadmin.form.addSocialLink")}
          </Button>

          <Divider orientation="left">
            {t("ceoadmin.form.additionalInfo")}
          </Divider>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`message_${activeLanguage}`}
                label={t("ceoadmin.form.message", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
              >
                <TextArea
                  rows={4}
                  placeholder={t("ceoadmin.form.messagePlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`work_experience_${activeLanguage}`}
                label={t("ceoadmin.form.workExperience", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
              >
                <TextArea
                  rows={4}
                  placeholder={t("ceoadmin.form.workExperiencePlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`education_${activeLanguage}`}
                label={t("ceoadmin.form.education", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
              >
                <TextArea
                  rows={4}
                  placeholder={t("ceoadmin.form.educationPlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CEOAdmin;
