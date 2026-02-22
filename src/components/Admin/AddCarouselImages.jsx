import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
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
  FiArrowUp,
  FiArrowDown,
  FiGlobe,
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

const languages = [
  { code: "en", name: "English" },
  { code: "am", name: "Amharic" },
  { code: "or", name: "Oromo" },
];

const getDisplayText = (item, field) => {
  if (item[field] && item[field].trim() !== "") {
    return item[field];
  }
  return item[`${field}_json`]?.en || "";
};

const ItemAdmin = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();
  const [items, setItems] = useState([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = !screens.lg;

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}items`);
      setItems(res.data);
    } catch (err) {
      message.error(t("itemdata.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
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
      message.success(t("itemdata.uploadSuccess"));
    } catch (err) {
      message.error(t("itemdata.uploadFailed"));
    }
    setUploading(false);
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    try {
      const values = await form.validateFields();
      const allValues = form.getFieldsValue();

      const data = {
        image: values.image,
        order: values.order,
        title: allValues.title_en || "",
        description: allValues.description_en || "",
        title_json: {
          en: allValues.title_en || "",
          am: allValues.title_am || "",
          or: allValues.title_or || "",
        },
        description_json: {
          en: allValues.description_en || "",
          am: allValues.description_am || "",
          or: allValues.description_or || "",
        },
      };

      if (editingItem) {
        await axios.put(`${API_URL}items/${editingItem.id}`, data);
        message.success(t("itemdata.updateSuccess"));
      } else {
        await axios.post(`${API_URL}items`, data);
        message.success(t("itemdata.createSuccess"));
      }
      fetchItems();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      setPreviewImage(null);
    } catch (err) {
      message.error(t("itemdata.operationFailed"));
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}items/${id}`);
      message.success(t("itemdata.deleteSuccess"));
      fetchItems();
    } catch (err) {
      message.error(t("itemdata.operationFailed"));
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      title_en: record.title_json?.en || record.title || "",
      title_am: record.title_json?.am || "",
      title_or: record.title_json?.or || "",
      description_en: record.description_json?.en || record.description || "",
      description_am: record.description_json?.am || "",
      description_or: record.description_json?.or || "",
      image: record.image,
      order: record.order,
    });
    setPreviewImage(record.image);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: t("itemdata.image"),
      dataIndex: "image",
      width: 80,
      responsive: ["md"],
      render: (text) => (
        <div className="flex justify-center">
          {text ? (
            <Avatar
              shape="square"
              src={`${API_URL}uploads/${text}`}
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
      title: `${t("itemdata.itemTitle")} (${t("itemdata.english")})`,
      dataIndex: "title",
      responsive: ["sm"],
      render: (_, record) => (
        <span className="font-medium text-sm md:text-base">
          {getDisplayText(record, "title")}
        </span>
      ),
      sorter: (a, b) =>
        getDisplayText(a, "title").localeCompare(getDisplayText(b, "title")),
    },
    {
      title: `${t("itemdata.itemDescription")} (${t("itemdata.english")})`,
      dataIndex: "description",
      responsive: ["lg"],
      render: (_, record) => (
        <span className="text-gray-600 line-clamp-2 text-sm">
          {getDisplayText(record, "description")}
        </span>
      ),
    },
    {
      title: t("itemdata.orderLabel"),
      dataIndex: "order",
      width: 100,
      responsive: ["sm"],
      sorter: (a, b) => a.order - b.order,
      render: (text) => (
        <Tag color="blue" className="font-mono text-xs md:text-sm">
          {text}
        </Tag>
      ),
    },
    {
      title: t("itemdata.actions"),
      width: 120,
      render: (_, record) => (
        <Space size="small" direction={isMobile ? "vertical" : "horizontal"}>
          <Tooltip title={t("itemdata.edit")}>
            <Button
              size={isMobile ? "small" : "middle"}
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50 border-blue-200"
            >
              {isMobile ? null : t("itemdata.edit")}
            </Button>
          </Tooltip>
          <Popconfirm
            title={t("itemdata.deleteConfirm")}
            description={t("itemdata.deleteDescription")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("itemdata.deleteText")}
            cancelText={t("itemdata.cancelText")}
            okButtonProps={{ loading: actionLoading, danger: true }}
          >
            <Tooltip title={t("itemdata.delete")}>
              <Button
                size={isMobile ? "small" : "middle"}
                icon={<FiTrash2 className="text-red-500" />}
                className="hover:bg-red-50 border-red-200"
                danger
              >
                {isMobile ? null : t("itemdata.delete")}
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
      {items.map((item) => (
        <Card
          key={item.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow duration-300 border-0"
          bodyStyle={{ padding: isMobile ? "12px" : "16px" }}
          cover={
            item.image ? (
              <div
                className={`${
                  isMobile ? "h-32" : "h-48"
                } overflow-hidden flex items-center justify-center bg-gray-50`}
              >
                <img
                  src={`${API_URL}${item.image}`}
                  alt={getDisplayText(item, "title")}
                  className="object-cover h-full w-full transition-transform duration-300 hover:scale-105"
                />
              </div>
            ) : (
              <div
                className={`${
                  isMobile ? "h-32" : "h-48"
                } bg-gray-100 flex items-center justify-center`}
              >
                <MdOutlineImageNotSupported className="text-gray-400 text-2xl md:text-4xl" />
              </div>
            )
          }
          actions={[
            <Tooltip title={t("itemdata.edit")} key="edit">
              <div className="flex items-center justify-center p-2 cursor-pointer hover:text-blue-600 transition-colors">
                <FiEdit className="text-blue-500 mr-1" />
                {!isMobile && (
                  <span className="text-sm">{t("itemdata.edit")}</span>
                )}
              </div>
            </Tooltip>,
            <Popconfirm
              key="delete"
              title={t("itemdata.deleteConfirm")}
              description={t("itemdata.deleteDescription")}
              onConfirm={() => handleDelete(item.id)}
              okText={t("itemdata.deleteText")}
              cancelText={t("itemdata.cancelText")}
              okButtonProps={{ loading: actionLoading, danger: true }}
            >
              <Tooltip title={t("itemdata.delete")}>
                <div className="flex items-center justify-center p-2 cursor-pointer hover:text-red-600 transition-colors">
                  <FiTrash2 className="text-red-500 mr-1" />
                  {!isMobile && (
                    <span className="text-sm">{t("itemdata.delete")}</span>
                  )}
                </div>
              </Tooltip>
            </Popconfirm>,
          ].map((action, index) => (
            <div
              key={index}
              onClick={(e) => {
                if (index === 0) {
                  openEditModal(item);
                }
              }}
            >
              {action}
            </div>
          ))}
        >
          <Card.Meta
            title={
              <span className="font-medium text-sm md:text-base line-clamp-1">
                {getDisplayText(item, "title")}
              </span>
            }
            description={
              <div className="space-y-2 mt-2">
                <p className="text-gray-600 text-xs md:text-sm line-clamp-2 leading-relaxed">
                  {getDisplayText(item, "description")}
                </p>
                <div className="flex justify-between items-center">
                  <Tag color="blue" className="font-mono text-xs">
                    {t("itemdata.order")}: {item.order}
                  </Tag>
                  {!isMobile && (
                    <div className="flex space-x-1">
                      <Button
                        size="small"
                        icon={<FiArrowUp />}
                        className="text-xs"
                      />
                      <Button
                        size="small"
                        icon={<FiArrowDown />}
                        className="text-xs"
                      />
                    </div>
                  )}
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
      <MdOutlineImageNotSupported className="text-gray-400 text-4xl md:text-6xl mx-auto mb-4" />
      <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
        {t("itemdata.noItems")}
      </h3>
      <p className="text-gray-500 text-sm md:text-base mb-6">
        {t("itemdata.noSearchResults")}
      </p>
      <Button
        type="primary"
        icon={<FiPlus />}
        onClick={() => {
          form.resetFields();
          setEditingItem(null);
          setPreviewImage(null);
          setIsModalOpen(true);
        }}
        size="large"
      >
        {t("itemdata.addItem")}
      </Button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl ">
      <Card
        title={
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
              {t("itemdata.title")}
            </h2>
            <div className="flex flex-1 flex-col md:flex-row md:items-center md:justify-end gap-2">
              <div className="flex items-center space-x-1 md:space-x-2 order-2 md:order-1">
                <Tooltip title={t("itemdata.tableView")}>
                  <Button
                    size={isMobile ? "small" : "middle"}
                    icon={<AiOutlineUnorderedList />}
                    onClick={() => setViewMode("table")}
                    type={viewMode === "table" ? "primary" : "default"}
                    className="flex items-center"
                  >
                    {!isMobile && t("itemdata.tableView")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("itemdata.gridView")}>
                  <Button
                    size={isMobile ? "small" : "middle"}
                    icon={<BsGrid />}
                    onClick={() => setViewMode("grid")}
                    type={viewMode === "grid" ? "primary" : "default"}
                    className="flex items-center"
                  >
                    {!isMobile && t("itemdata.gridView")}
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
                  setIsModalOpen(true);
                }}
                size={isMobile ? "small" : "middle"}
                className="order-1 md:order-2 md:ml-2"
              >
                {t("itemdata.addItem")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-sm md:shadow-md rounded-lg border-0 md:border"
        bodyStyle={{ padding: isMobile ? "12px" : "24px" }}
      >
        {loading ? (
          <div className="flex justify-center p-8 md:p-12">
            <Spin size="large" tip={t("itemdata.loading")} />
          </div>
        ) : items.length === 0 ? (
          emptyState
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={items}
            rowKey="id"
            loading={loading}
            className="border-none"
            scroll={{ x: 800 }}
            size={isMobile ? "small" : "middle"}
            pagination={{
              pageSize: isMobile ? 5 : 10,
              showSizeChanger: true,
              showQuickJumper: !isMobile,
              showTotal: (total) => t("itemdata.total", { total }),
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
                <span>{t("itemdata.editItem")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("itemdata.addItem")}</span>
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
        okText={editingItem ? t("itemdata.update") : t("itemdata.create")}
        cancelText={t("itemdata.cancelText")}
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
        width={isMobile ? "95%" : isTablet ? 700 : 800}
        destroyOnClose
        centered
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          size={isMobile ? "small" : "middle"}
        >
          <Form.Item
            name="image"
            label={t("itemdata.image")}
            rules={[{ required: true, message: t("itemdata.imageRequired") }]}
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
                    ? t("itemdata.uploading")
                    : t("itemdata.uploadImage")}
                </Button>
              </Upload>

              {previewImage && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={`${API_URL}uploads/${previewImage}`}
                    alt="preview"
                    className={`${
                      isMobile ? "max-h-40" : "max-h-64"
                    } rounded-lg border border-gray-200 p-1 object-contain`}
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
                    <span>
                      {t("itemdata.language")}:{" "}
                      {languages.find((l) => l.code === activeLanguage)?.name}
                    </span>
                  </div>
                )
              }
            >
              {languages.map((lang) => (
                <TabPane
                  tab={t(
                    `itemdata.${
                      lang.code === "en"
                        ? "english"
                        : lang.code === "am"
                        ? "amharic"
                        : "oromo"
                    }`
                  )}
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
                </React.Fragment>
              )
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Form.Item
              name={`title_${activeLanguage}`}
              label={`${t("itemdata.titleLabel")} (${t(
                `itemdata.${
                  activeLanguage === "en"
                    ? "english"
                    : activeLanguage === "am"
                    ? "amharic"
                    : "oromo"
                }`
              )})`}
              rules={
                activeLanguage === "en"
                  ? [{ required: true, message: t("itemdata.titleRequired") }]
                  : []
              }
            >
              <Input
                size={isMobile ? "small" : "large"}
                placeholder={t("itemdata.titleLabel")}
                prefix={<FiEdit className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              name="order"
              label={t("itemdata.orderLabel")}
              rules={[{ required: true, message: t("itemdata.orderRequired") }]}
            >
              <InputNumber
                min={0}
                className="w-full"
                size={isMobile ? "small" : "large"}
                placeholder={t("itemdata.orderLabel")}
              />
            </Form.Item>
          </div>

          <Form.Item
            name={`description_${activeLanguage}`}
            label={`${t("itemdata.descriptionLabel")} (${t(
              `itemdata.${
                activeLanguage === "en"
                  ? "english"
                  : activeLanguage === "am"
                  ? "amharic"
                  : "oromo"
              }`
            )})`}
            rules={
              activeLanguage === "en"
                ? [
                    {
                      required: true,
                      message: t("itemdata.descriptionRequired"),
                    },
                  ]
                : []
            }
          >
            <TextArea
              rows={isMobile ? 3 : 4}
              placeholder={t("itemdata.descriptionLabel")}
              showCount
              maxLength={500}
              size={isMobile ? "small" : "middle"}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemAdmin;
