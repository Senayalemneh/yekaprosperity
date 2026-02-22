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
  Grid,
  Image,
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
  FiList,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { BsGrid } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { getApiUrl } from "../../utils/getApiUrl";
import axios from "axios";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const positionLevels = [
  { value: "Federal Level", label: "Federal Level", color: "red" },
  { value: "Bureau Level", label: "Bureau Level", color: "volcano" },
  { value: "Subcity Level", label: "Subcity Level", color: "orange" },
  { value: "Office Level", label: "Office Level", color: "gold" },
  { value: "District Level", label: "District Level", color: "green" },
];

const CabinetMembersAdmin = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();
  const [members, setMembers] = useState([]);
  const [form] = Form.useForm();
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterPositionLevel, setFilterPositionLevel] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = !screens.lg;

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}api/add-cabinet`);
      setMembers(res.data.data || []);
    } catch (err) {
      message.error(t("cabinet.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members based on search text and position level
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName?.en?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.fullName?.am?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.fullName?.or?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.position?.en?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.position?.am?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.position?.or?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.message?.en?.toLowerCase().includes(searchText.toLowerCase());

    const matchesLevel =
      !filterPositionLevel || member.positionLevel === filterPositionLevel;

    return matchesSearch && matchesLevel;
  });

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
      message.success(t("cabinet.uploadSuccess"));
    } catch (err) {
      message.error(t("cabinet.uploadFailed"));
    }
    setUploading(false);
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
        positionLevel: values.positionLevel,
        order: values.order || 0,
        message: {
          en: values.message_en || "",
          am: values.message_am || "",
          or: values.message_or || "",
        },
      };

      if (editingMember) {
        await axios.put(`${API_URL}api/add-cabinet/${editingMember.id}`, data);
        message.success(t("cabinet.updateSuccess"));
      } else {
        await axios.post(`${API_URL}api/add-cabinet`, data);
        message.success(t("cabinet.createSuccess"));
      }
      fetchMembers();
      setIsModalOpen(false);
      form.resetFields();
      setEditingMember(null);
      setPreviewImage(null);
    } catch (err) {
      message.error(t("cabinet.operationFailed"));
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}api/add-cabinet/${id}`);
      message.success(t("cabinet.deleteSuccess"));
      fetchMembers();
    } catch (err) {
      message.error(t("cabinet.operationFailed"));
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingMember(record);
    form.setFieldsValue({
      name_en: record.fullName?.en || "",
      name_am: record.fullName?.am || "",
      name_or: record.fullName?.or || "",
      position_en: record.position?.en || "",
      position_am: record.position?.am || "",
      position_or: record.position?.or || "",
      positionLevel: record.positionLevel,
      order: record.order || 0,
      message_en: record.message?.en || "",
      message_am: record.message?.am || "",
      message_or: record.message?.or || "",
      image: record.image,
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
      title: t("cabinet.image"),
      dataIndex: "image",
      width: 80,
      responsive: ["md"],
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
      title: t("cabinet.fullName"),
      dataIndex: "fullName",
      responsive: ["sm"],
      render: (name) => (
        <div>
          <div className="font-medium text-sm md:text-base">
            {name?.en || t("cabinet.noName")}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {name?.am && <span className="mr-2">🇪🇹 {name.am}</span>}
            {name?.or && <span>🇪🇹 {name.or}</span>}
          </div>
        </div>
      ),
      sorter: (a, b) =>
        (a.fullName?.en || "").localeCompare(b.fullName?.en || ""),
    },
    {
      title: t("cabinet.position"),
      dataIndex: "position",
      responsive: ["lg"],
      render: (position) => (
        <div>
          <div className="font-medium text-sm">
            {position?.en || t("cabinet.noPosition")}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {position?.am && <span className="mr-2">🇪🇹 {position.am}</span>}
            {position?.or && <span>🇪🇹 {position.or}</span>}
          </div>
        </div>
      ),
    },
    {
      title: t("cabinet.level"),
      dataIndex: "positionLevel",
      width: 120,
      responsive: ["sm"],
      render: (level) => {
        const levelInfo = positionLevels.find((l) => l.value === level);
        return levelInfo ? (
          <Tag color={levelInfo.color} className="text-xs md:text-sm">
            {levelInfo.label}
          </Tag>
        ) : (
          <Tag className="text-xs">{t("cabinet.unknown")}</Tag>
        );
      },
      filters: positionLevels.map((level) => ({
        text: level.label,
        value: level.value,
      })),
      onFilter: (value, record) => record.positionLevel === value,
    },
    {
      title: t("cabinet.order"),
      dataIndex: "order",
      width: 80,
      responsive: ["sm"],
      sorter: (a, b) => a.order - b.order,
      render: (order) => <Badge count={order || 0} showZero color="blue" />,
    },
    {
      title: t("cabinet.actions"),
      width: 120,
      render: (_, record) => (
        <Space size="small" direction={isMobile ? "vertical" : "horizontal"}>
          <Tooltip title={t("cabinet.edit")}>
            <Button
              size={isMobile ? "small" : "middle"}
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50 border-blue-200"
            >
              {isMobile ? null : t("cabinet.edit")}
            </Button>
          </Tooltip>
          <Popconfirm
            title={t("cabinet.deleteConfirm")}
            description={t("cabinet.deleteDescription")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("cabinet.yes")}
            cancelText={t("cabinet.no")}
            okButtonProps={{ loading: actionLoading, danger: true }}
          >
            <Tooltip title={t("cabinet.delete")}>
              <Button
                size={isMobile ? "small" : "middle"}
                icon={<FiTrash2 className="text-red-500" />}
                className="hover:bg-red-50 border-red-200"
                danger
              >
                {isMobile ? null : t("cabinet.delete")}
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
        isTablet ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
      } gap-4 md:gap-6`}
    >
      {filteredMembers.map((member) => {
        const levelInfo = positionLevels.find(
          (l) => l.value === member.positionLevel
        );
        return (
          <Card
            key={member.id}
            hoverable
            className="shadow-sm hover:shadow-lg transition-all duration-300 border-0"
            bodyStyle={{ padding: isMobile ? "12px" : "16px" }}
            cover={
              member.image ? (
                <div
                  className={`${
                    isMobile ? "h-40" : "h-48"
                  } overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer relative group`}
                  onClick={() => {
                    setPreviewImage(member.image);
                    setPreviewVisible(true);
                  }}
                >
                  <img
                    src={getFullImageUrl(member.image)}
                    alt={member.fullName?.en || t("cabinet.cabinetMember")}
                    className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <FiImage className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl" />
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
              <Tooltip title={t("cabinet.edit")} key="edit">
                <div
                  className="flex items-center justify-center p-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => openEditModal(member)}
                >
                  <FiEdit className="text-blue-500 mr-1" />
                  {!isMobile && (
                    <span className="text-sm">{t("cabinet.edit")}</span>
                  )}
                </div>
              </Tooltip>,
              <Popconfirm
                key="delete"
                title={t("cabinet.deleteConfirm")}
                description={t("cabinet.deleteDescription")}
                onConfirm={() => handleDelete(member.id)}
                okText={t("cabinet.yes")}
                cancelText={t("cabinet.no")}
                okButtonProps={{ loading: actionLoading, danger: true }}
              >
                <Tooltip title={t("cabinet.delete")}>
                  <div className="flex items-center justify-center p-2 cursor-pointer hover:text-red-600 transition-colors">
                    <FiTrash2 className="text-red-500 mr-1" />
                    {!isMobile && (
                      <span className="text-sm">{t("cabinet.delete")}</span>
                    )}
                  </div>
                </Tooltip>
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              title={
                <div className="mb-2">
                  <div className="font-medium text-sm md:text-base">
                    {member.fullName?.en || t("cabinet.noName")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {member.fullName?.am && (
                      <span className="mr-2">🇪🇹 {member.fullName.am}</span>
                    )}
                    {member.fullName?.or && (
                      <span>🇪🇹 {member.fullName.or}</span>
                    )}
                  </div>
                </div>
              }
              description={
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-gray-600 flex-1">
                      <div className="font-medium">
                        {member.position?.en || t("cabinet.noPosition")}
                      </div>
                      <div className="text-xs mt-1">
                        {member.position?.am && (
                          <span className="mr-2">🇪🇹 {member.position.am}</span>
                        )}
                        {member.position?.or && (
                          <span>🇪🇹 {member.position.or}</span>
                        )}
                      </div>
                    </div>
                    {levelInfo && (
                      <Tag color={levelInfo.color} className="text-xs ml-2">
                        {levelInfo.label}
                      </Tag>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {t("cabinet.order")}:{" "}
                      <Badge
                        count={member.order || 0}
                        showZero
                        size="small"
                        color="blue"
                      />
                    </span>
                  </div>

                  {member.message?.en && (
                    <>
                      <Divider className="my-2" />
                      <div>
                        <div className="text-gray-600 text-xs md:text-sm line-clamp-2 leading-relaxed">
                          {member.message.en}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {member.message.am && (
                            <span className="mr-2">🇪🇹 {member.message.am}</span>
                          )}
                          {member.message.or && (
                            <span>🇪🇹 {member.message.or}</span>
                          )}
                        </div>
                      </div>
                    </>
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
      <FiUser className="text-gray-400 text-4xl md:text-6xl mx-auto mb-4" />
      <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
        {t("cabinet.noMembers")}
      </h3>
      <p className="text-gray-500 text-sm md:text-base mb-6">
        {t("cabinet.noSearchResults")}
      </p>
      <Button
        type="primary"
        icon={<FiPlus />}
        onClick={() => {
          form.resetFields();
          setEditingMember(null);
          setPreviewImage(null);
          setIsModalOpen(true);
        }}
        size="large"
      >
        {t("cabinet.addMember")}
      </Button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl ">
      <Card
        title={
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
              {t("cabinet.title")}
            </h2>
            <div className="flex flex-1 flex-col md:flex-row md:items-center md:justify-end gap-2">
              <div className="flex items-center space-x-1 md:space-x-2 order-2 md:order-1">
                <Tooltip title={t("cabinet.tableView")}>
                  <Button
                    size={isMobile ? "small" : "middle"}
                    icon={<AiOutlineUnorderedList />}
                    onClick={() => setViewMode("table")}
                    type={viewMode === "table" ? "primary" : "default"}
                    className="flex items-center"
                  >
                    {!isMobile && t("cabinet.tableView")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("cabinet.gridView")}>
                  <Button
                    size={isMobile ? "small" : "middle"}
                    icon={<BsGrid />}
                    onClick={() => setViewMode("grid")}
                    type={viewMode === "grid" ? "primary" : "default"}
                    className="flex items-center"
                  >
                    {!isMobile && t("cabinet.gridView")}
                  </Button>
                </Tooltip>
              </div>
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingMember(null);
                  setPreviewImage(null);
                  setIsModalOpen(true);
                }}
                size={isMobile ? "small" : "middle"}
                className="order-1 md:order-2 md:ml-2"
              >
                {t("cabinet.addMember")}
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
              placeholder={t("cabinet.searchPlaceholder")}
              prefix={<FiSearch className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: isMobile ? "100%" : 200 }}
              size={isMobile ? "small" : "middle"}
            />
            <Select
              placeholder={t("cabinet.filterLevel")}
              allowClear
              onChange={setFilterPositionLevel}
              style={{ width: isMobile ? "100%" : 180 }}
              size={isMobile ? "small" : "middle"}
              suffixIcon={<FiFilter />}
            >
              {positionLevels.map((level) => (
                <Option key={level.value} value={level.value}>
                  <div className="flex items-center">
                    <span className="mr-2">{level.label}</span>
                    <Tag color={level.color} size="small">
                      {level.label}
                    </Tag>
                  </div>
                </Option>
              ))}
            </Select>
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center p-8 md:p-12">
            <Spin size="large" tip={t("cabinet.loading")} />
          </div>
        ) : filteredMembers.length === 0 ? (
          emptyState
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredMembers}
            rowKey="id"
            loading={loading}
            className="border-none"
            scroll={{ x: 800 }}
            size={isMobile ? "small" : "middle"}
            pagination={{
              pageSize: isMobile ? 5 : 10,
              showSizeChanger: true,
              showQuickJumper: !isMobile,
              showTotal: (total) => t("cabinet.total", { total }),
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
            {editingMember ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("cabinet.editMember")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("cabinet.addNewMember")}</span>
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
        okText={editingMember ? t("cabinet.update") : t("cabinet.create")}
        cancelText={t("cabinet.cancel")}
        okButtonProps={{
          icon: editingMember ? <FiCheck /> : <FiPlus />,
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
        <Form
          form={form}
          layout="vertical"
          size={isMobile ? "small" : "middle"}
        >
          <Form.Item
            name="image"
            label={t("cabinet.memberPhoto")}
            rules={[{ required: true, message: t("cabinet.imageRequired") }]}
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
                  className={`${isMobile ? "h-10" : "h-12"} border-dashed`}
                  type="dashed"
                >
                  {uploading
                    ? t("cabinet.uploading")
                    : t("cabinet.uploadPhoto")}
                </Button>
              </Upload>

              {previewImage && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={getFullImageUrl(previewImage)}
                    alt="preview"
                    className={`${
                      isMobile ? "max-h-32" : "max-h-48"
                    } rounded-lg border border-gray-200 p-1 cursor-pointer object-contain`}
                    onClick={() => {
                      setPreviewImage(previewImage);
                      setPreviewVisible(true);
                    }}
                  />
                </div>
              )}
            </div>
          </Form.Item>

          <Row gutter={16}>
            <Col span={isMobile ? 24 : 12}>
              <Form.Item
                name="positionLevel"
                label={t("cabinet.positionLevel")}
                rules={[
                  {
                    required: true,
                    message: t("cabinet.positionLevelRequired"),
                  },
                ]}
              >
                <Select
                  placeholder={t("cabinet.selectLevel")}
                  options={positionLevels.map((level) => ({
                    value: level.value,
                    label: (
                      <div className="flex items-center">
                        <span className="mr-2">{level.label}</span>
                        <Tag color={level.color} size="small">
                          {level.label}
                        </Tag>
                      </div>
                    ),
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={isMobile ? 24 : 12}>
              <Form.Item
                name="order"
                label={t("cabinet.displayOrder")}
                rules={[
                  { required: true, message: t("cabinet.orderRequired") },
                ]}
              >
                <Input
                  type="number"
                  min={0}
                  placeholder={t("cabinet.orderPlaceholder")}
                  prefix={<FiList className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

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
                      {t("cabinet.language")}:{" "}
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
                      {lang.flag} {t(`cabinet.${lang.code}`)}
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
                    <TextArea rows={1} />
                  </Form.Item>
                </React.Fragment>
              )
          )}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`name_${activeLanguage}`}
                label={`${t("cabinet.fullNameLabel")} (${t(
                  `cabinet.${activeLanguage}`
                )})`}
                rules={
                  activeLanguage === "en"
                    ? [{ required: true, message: t("cabinet.nameRequired") }]
                    : []
                }
              >
                <Input
                  placeholder={t("cabinet.namePlaceholder")}
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
                label={`${t("cabinet.positionLabel")} (${t(
                  `cabinet.${activeLanguage}`
                )})`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("cabinet.positionRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={t("cabinet.positionPlaceholder")}
                  prefix={<FiBriefcase className="text-gray-400" />}
                  // No maxLength for unlimited text
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`message_${activeLanguage}`}
                label={`${t("cabinet.messageLabel")} (${t(
                  `cabinet.${activeLanguage}`
                )})`}
              >
                <TextArea
                  rows={6}
                  placeholder={t("cabinet.messagePlaceholder")}
                  // Remove showCount and maxLength for unlimited text
                  style={{ resize: "vertical" }}
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
            <div className="text-sm">{t("cabinet.memberPhoto")}</div>
            <div className="flex space-x-2">
              <Button
                icon={<FiX />}
                onClick={() => setPreviewVisible(false)}
                size={isMobile ? "small" : "middle"}
              >
                {t("cabinet.close")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CabinetMembersAdmin;
