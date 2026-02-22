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
  Grid,
  Badge,
  Image
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
  FiSearch,
  FiFilter
} from "react-icons/fi";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { BsGrid } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'or', name: 'Oromo', flag: '🇪🇹' }
];

const DirectorMessageAdmin = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl()
  const [messages, setMessages] = useState([]);
  const [form] = Form.useForm();
  const [editingMessage, setEditingMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [searchText, setSearchText] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = !screens.lg;

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}api/directormessage`);
      setMessages(res.data.data || []);
    } catch (err) {
      message.error(t("director.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages based on search text
  const filteredMessages = messages.filter(message => 
    message.name?.en?.toLowerCase().includes(searchText.toLowerCase()) ||
    message.name?.am?.toLowerCase().includes(searchText.toLowerCase()) ||
    message.name?.or?.toLowerCase().includes(searchText.toLowerCase()) ||
    message.position?.en?.toLowerCase().includes(searchText.toLowerCase()) ||
    message.position?.am?.toLowerCase().includes(searchText.toLowerCase()) ||
    message.position?.or?.toLowerCase().includes(searchText.toLowerCase()) ||
    message.title?.en?.toLowerCase().includes(searchText.toLowerCase()) ||
    message.message?.en?.toLowerCase().includes(searchText.toLowerCase())
  );

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
      message.success(t("director.uploadSuccess"));
    } catch (err) {
      message.error(t("director.uploadFailed"));
    }
    setUploading(false);
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    try {
      const values = await form.validateFields();
      
      const data = {
        image: values.image,
        name: {
          en: values.name_en || '',
          am: values.name_am || '',
          or: values.name_or || ''
        },
        position: {
          en: values.position_en || '',
          am: values.position_am || '',
          or: values.position_or || ''
        },
        title: {
          en: values.title_en || '',
          am: values.title_am || '',
          or: values.title_or || ''
        },
        message: {
          en: values.message_en || '',
          am: values.message_am || '',
          or: values.message_or || ''
        }
      };

      if (editingMessage) {
        await axios.put(`${API_URL}api/directormessage/${editingMessage.id}`, data);
        message.success(t("director.updateSuccess"));
      } else {
        await axios.post(`${API_URL}api/directormessage`, data);
        message.success(t("director.createSuccess"));
      }
      fetchMessages();
      setIsModalOpen(false);
      form.resetFields();
      setEditingMessage(null);
      setPreviewImage(null);
    } catch (err) {
      message.error(t("director.operationFailed"));
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}api/directormessage/${id}`);
      message.success(t("director.deleteSuccess"));
      fetchMessages();
    } catch (err) {
      message.error(t("director.operationFailed"));
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingMessage(record);
    form.setFieldsValue({
      name_en: record.name?.en || '',
      name_am: record.name?.am || '',
      name_or: record.name?.or || '',
      position_en: record.position?.en || '',
      position_am: record.position?.am || '',
      position_or: record.position?.or || '',
      title_en: record.title?.en || '',
      title_am: record.title?.am || '',
      title_or: record.title?.or || '',
      message_en: record.message?.en || '',
      message_am: record.message?.am || '',
      message_or: record.message?.or || '',
      image: record.image
    });
    setPreviewImage(record.image);
    setIsModalOpen(true);
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_URL}uploads/${path}`;
  };

  const columns = [
    {
      title: t("director.image"),
      dataIndex: "image",
      width: 80,
      responsive: ['md'],
      render: (text) => (
        <div className="flex justify-center">
          {text ? (
            <Avatar
              shape="square"
              src={getFullImageUrl(text)}
              size={isMobile ? 48 : 64}
              className="rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                setPreviewImage(text);
                setPreviewVisible(true);
              }}
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
      title: t("director.directorName"),
      dataIndex: "name",
      responsive: ['sm'],
      render: (name) => (
        <div>
          <div className="font-medium text-sm md:text-base">{name?.en || t("director.noName")}</div>
          <div className="text-xs text-gray-500 mt-1">
            {name?.am && <span className="mr-2">🇪🇹 {name.am}</span>}
            {name?.or && <span>🇪🇹 {name.or}</span>}
          </div>
        </div>
      ),
      sorter: (a, b) => (a.name?.en || '').localeCompare(b.name?.en || ''),
    },
    {
      title: t("director.position"),
      dataIndex: "position",
      responsive: ['lg'],
      render: (position) => (
        <div>
          <div className="font-medium text-sm">{position?.en || t("director.noPosition")}</div>
          <div className="text-xs text-gray-500 mt-1">
            {position?.am && <span className="mr-2">🇪🇹 {position.am}</span>}
            {position?.or && <span>🇪🇹 {position.or}</span>}
          </div>
        </div>
      ),
    },
    {
      title: t("director.messageTitle"),
      dataIndex: "title",
      responsive: ['xl'],
      render: (title) => (
        <div className="line-clamp-2">
          <div className="font-medium text-sm">{title?.en || t("director.noTitle")}</div>
          <div className="text-xs text-gray-500">
            {title?.am && <span className="mr-2">🇪🇹 {title.am}</span>}
            {title?.or && <span>🇪🇹 {title.or}</span>}
          </div>
        </div>
      ),
    },
    {
      title: t("director.actions"),
      width: 120,
      render: (_, record) => (
        <Space size="small" direction={isMobile ? "vertical" : "horizontal"}>
          <Tooltip title={t("director.edit")}>
            <Button
              size={isMobile ? "small" : "middle"}
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50 border-blue-200"
            >
              {isMobile ? null : t("director.edit")}
            </Button>
          </Tooltip>
          <Popconfirm
            title={t("director.deleteConfirm")}
            description={t("director.deleteDescription")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("director.yes")}
            cancelText={t("director.no")}
            okButtonProps={{ loading: actionLoading, danger: true }}
          >
            <Tooltip title={t("director.delete")}>
              <Button
                size={isMobile ? "small" : "middle"}
                icon={<FiTrash2 className="text-red-500" />}
                className="hover:bg-red-50 border-red-200"
                danger
              >
                {isMobile ? null : t("director.delete")}
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const gridView = (
    <div className={`grid grid-cols-1 ${isTablet ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 md:gap-6`}>
      {filteredMessages.map((message) => (
        <Card
          key={message.id}
          hoverable
          className="shadow-sm hover:shadow-lg transition-all duration-300 border-0"
          bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
          cover={
            message.image ? (
              <div 
                className={`${isMobile ? 'h-40' : 'h-48'} overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer relative group`}
                onClick={() => {
                  setPreviewImage(message.image);
                  setPreviewVisible(true);
                }}
              >
                <img
                  src={getFullImageUrl(message.image)}
                  alt={message.name?.en || t("director.director")}
                  className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <FiImage className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl" />
                </div>
              </div>
            ) : (
              <div className={`${isMobile ? 'h-40' : 'h-48'} bg-gray-100 flex items-center justify-center`}>
                <MdOutlineImageNotSupported className="text-gray-400 text-2xl md:text-4xl" />
              </div>
            )
          }
          actions={[
            <Tooltip title={t("director.edit")} key="edit">
              <div 
                className="flex items-center justify-center p-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => openEditModal(message)}
              >
                <FiEdit className="text-blue-500 mr-1" />
                {!isMobile && <span className="text-sm">{t("director.edit")}</span>}
              </div>
            </Tooltip>,
            <Popconfirm
              key="delete"
              title={t("director.deleteConfirm")}
              description={t("director.deleteDescription")}
              onConfirm={() => handleDelete(message.id)}
              okText={t("director.yes")}
              cancelText={t("director.no")}
              okButtonProps={{ loading: actionLoading, danger: true }}
            >
              <Tooltip title={t("director.delete")}>
                <div className="flex items-center justify-center p-2 cursor-pointer hover:text-red-600 transition-colors">
                  <FiTrash2 className="text-red-500 mr-1" />
                  {!isMobile && <span className="text-sm">{t("director.delete")}</span>}
                </div>
              </Tooltip>
            </Popconfirm>,
          ]}
        >
          <Card.Meta
            title={
              <div className="mb-2">
                <div className="font-medium text-sm md:text-base">
                  {message.name?.en || t("director.noName")}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.name?.am && <span className="mr-2">🇪🇹 {message.name.am}</span>}
                  {message.name?.or && <span>🇪🇹 {message.name.or}</span>}
                </div>
              </div>
            }
            description={
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">{message.position?.en || t("director.noPosition")}</div>
                  <div className="text-xs mt-1">
                    {message.position?.am && <span className="mr-2">🇪🇹 {message.position.am}</span>}
                    {message.position?.or && <span>🇪🇹 {message.position.or}</span>}
                  </div>
                </div>
                <Divider className="my-2" />
                <div>
                  <div className="font-medium text-sm mb-1">{message.title?.en || t("director.noTitle")}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {message.title?.am && <span className="mr-2">🇪🇹 {message.title.am}</span>}
                    {message.title?.or && <span>🇪🇹 {message.title.or}</span>}
                  </div>
                  <div className="text-gray-600 text-xs md:text-sm line-clamp-3 leading-relaxed">
                    {message.message?.en || t("director.noMessage")}
                  </div>
                </div>
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );

  const emptyState = (
    <div className="text-center py-12 md:py-16">
      <FiMessageSquare className="text-gray-400 text-4xl md:text-6xl mx-auto mb-4" />
      <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
        {t("director.noMessages")}
      </h3>
      <p className="text-gray-500 text-sm md:text-base mb-6">
        {t("director.noSearchResults")}
      </p>
      <Button
        type="primary"
        icon={<FiPlus />}
        onClick={() => {
          form.resetFields();
          setEditingMessage(null);
          setPreviewImage(null);
          setIsModalOpen(true);
        }}
        size="large"
      >
        {t("director.addMessage")}
      </Button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl ">
      <Card
        title={
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
              {t("director.title")}
            </h2>
            <div className="flex flex-1 flex-col md:flex-row md:items-center md:justify-end gap-2">
              <div className="flex items-center space-x-1 md:space-x-2 order-2 md:order-1">
                <Tooltip title={t("director.tableView")}>
                  <Button
                    size={isMobile ? "small" : "middle"}
                    icon={<AiOutlineUnorderedList />}
                    onClick={() => setViewMode("table")}
                    type={viewMode === "table" ? "primary" : "default"}
                    className="flex items-center"
                  >
                    {!isMobile && t("director.tableView")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("director.gridView")}>
                  <Button
                    size={isMobile ? "small" : "middle"}
                    icon={<BsGrid />}
                    onClick={() => setViewMode("grid")}
                    type={viewMode === "grid" ? "primary" : "default"}
                    className="flex items-center"
                  >
                    {!isMobile && t("director.gridView")}
                  </Button>
                </Tooltip>
              </div>
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingMessage(null);
                  setPreviewImage(null);
                  setIsModalOpen(true);
                }}
                size={isMobile ? "small" : "middle"}
                className="order-1 md:order-2 md:ml-2"
              >
                {t("director.addMessage")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-sm md:shadow-md rounded-lg border-0 md:border"
        bodyStyle={{ padding: isMobile ? '12px' : '24px' }}
        extra={
          <div className="mt-3 md:mt-0">
            <Input
              placeholder={t("director.searchPlaceholder")}
              prefix={<FiSearch className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: isMobile ? '100%' : 300 }}
              size={isMobile ? "small" : "middle"}
            />
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center p-8 md:p-12">
            <Spin size="large" tip={t("director.loading")} />
          </div>
        ) : filteredMessages.length === 0 ? (
          emptyState
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredMessages}
            rowKey="id"
            loading={loading}
            className="border-none"
            scroll={{ x: 800 }}
            size={isMobile ? "small" : "middle"}
            pagination={{
              pageSize: isMobile ? 5 : 10,
              showSizeChanger: true,
              showQuickJumper: !isMobile,
              showTotal: (total) => t("director.total", { total }),
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
            {editingMessage ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("director.editMessage")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("director.addNewMessage")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
        }}
        onOk={handleFormSubmit}
        okText={editingMessage ? t("director.update") : t("director.create")}
        cancelText={t("director.cancel")}
        okButtonProps={{
          icon: editingMessage ? <FiCheck /> : <FiPlus />,
          className: "flex items-center",
          loading: actionLoading,
          size: isMobile ? "small" : "middle",
        }}
        cancelButtonProps={{
          icon: <FiX />,
          className: "flex items-center",
          size: isMobile ? "small" : "middle",
        }}
        width={isMobile ? "95%" : isTablet ? 700 : 900}
        destroyOnClose
        centered
        style={{ top: 20 }}
      >
        <Divider />
        <Form form={form} layout="vertical" size={isMobile ? "small" : "middle"}>
          <Form.Item
            name="image"
            label={t("director.directorPhoto")}
            rules={[{ required: true, message: t("director.imageRequired") }]}
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
                  className={`${isMobile ? 'h-10' : 'h-12'} border-dashed`}
                  type="dashed"
                >
                  {uploading ? t("director.uploading") : t("director.uploadPhoto")}
                </Button>
              </Upload>

              {previewImage && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={getFullImageUrl(previewImage)}
                    alt="preview"
                    className={`${isMobile ? 'max-h-32' : 'max-h-48'} rounded-lg border border-gray-200 p-1 cursor-pointer object-contain`}
                    onClick={() => {
                      setPreviewImage(previewImage);
                      setPreviewVisible(true);
                    }}
                  />
                </div>
              )}
            </div>
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
                    <span>{t("director.language")}: {languages.find(l => l.code === activeLanguage)?.name}</span>
                  </div>
                )
              }
            >
              {languages.map(lang => (
                <TabPane 
                  tab={
                    <span>
                      {lang.flag} {t(`director.${lang.code}`)}
                    </span>
                  } 
                  key={lang.code} 
                />
              ))}
            </Tabs>
          </div>

          {/* Hidden fields for non-active languages */}
          {languages.map(lang => (
            lang.code !== activeLanguage && (
              <React.Fragment key={lang.code}>
                <Form.Item name={`name_${lang.code}`} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={`position_${lang.code}`} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={`title_${lang.code}`} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={`message_${lang.code}`} hidden>
                  <TextArea rows={1} />
                </Form.Item>
              </React.Fragment>
            )
          ))}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`name_${activeLanguage}`}
                label={`${t("director.directorNameLabel")} (${t(`director.${activeLanguage}`)})`}
                rules={activeLanguage === 'en' ? [
                  { required: true, message: t("director.nameRequired") }
                ] : []}
              >
                <Input
                  placeholder={t("director.namePlaceholder")}
                  prefix={<FiUser className="text-gray-400" />}
                  // No maxLength for unlimited text
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`position_${activeLanguage}`}
                label={`${t("director.positionLabel")} (${t(`director.${activeLanguage}`)})`}
                rules={activeLanguage === 'en' ? [
                  { required: true, message: t("director.positionRequired") }
                ] : []}
              >
                <Input
                  placeholder={t("director.positionPlaceholder")}
                  prefix={<FiBriefcase className="text-gray-400" />}
                  // No maxLength for unlimited text
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`title_${activeLanguage}`}
                label={`${t("director.messageTitleLabel")} (${t(`director.${activeLanguage}`)})`}
                rules={activeLanguage === 'en' ? [
                  { required: true, message: t("director.titleRequired") }
                ] : []}
              >
                <Input
                  placeholder={t("director.titlePlaceholder")}
                  prefix={<FiAward className="text-gray-400" />}
                  // No maxLength for unlimited text
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`message_${activeLanguage}`}
                label={`${t("director.messageLabel")} (${t(`director.${activeLanguage}`)})`}
                rules={activeLanguage === 'en' ? [
                  { required: true, message: t("director.messageRequired") }
                ] : []}
              >
                <TextArea
                  rows={8}
                  placeholder={t("director.messagePlaceholder")}
                  // Remove showCount and maxLength for unlimited text
                  style={{ resize: 'vertical' }}
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
        width="60vw"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
        centered
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center bg-black bg-opacity-90 min-h-[60vh]">
            <Image
              src={getFullImageUrl(previewImage)}
              className="max-h-[70vh] object-contain"
              preview={false}
            />
          </div>
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <div className="text-sm">
              {t("director.directorPhoto")}
            </div>
            <div className="flex space-x-2">
              <Button
                icon={<FiX />}
                onClick={() => setPreviewVisible(false)}
                size={isMobile ? "small" : "middle"}
              >
                {t("director.close")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DirectorMessageAdmin;