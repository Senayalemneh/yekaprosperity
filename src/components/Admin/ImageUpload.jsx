import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  Tag,
  Avatar,
  Divider,
  Tooltip,
  Spin,
  Popconfirm,
  Button,
  Row,
  Col,
  Tabs,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Table,
  Space,
  Select,
} from "antd";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiCheck,
  FiGlobe,
  FiImage,
} from "react-icons/fi";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { BsGrid } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const GalleryAdmin = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [form] = Form.useForm();
  const [categories, setCategories] = useState(["general"]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}api/add-gallery`);
      setGalleryItems(res.data.data || []);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(res.data.data.map((item) => item.category)),
      ];
      setCategories(uniqueCategories.length ? uniqueCategories : ["general"]);
    } catch (err) {
      message.error(t("galleryadmin.messages.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleImageUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess(res.data, file);

      // Add to preview images
      setPreviewImages((prev) => [...prev, res.data.path]);

      // Update form field
      const currentImages = form.getFieldValue("images") || [];
      form.setFieldsValue({ images: [...currentImages, res.data.path] });

      message.success(t("galleryadmin.messages.uploadSuccess"));
    } catch (err) {
      onError(err);
      message.error(t("galleryadmin.messages.uploadError"));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (file) => {
    const currentImages = form.getFieldValue("images") || [];
    const newImages = currentImages.filter((img) => {
      if (typeof img === "string") {
        return img !== file.response?.path;
      }
      return img.uid !== file.uid;
    });
    form.setFieldsValue({ images: newImages });
    setPreviewImages(newImages);
    return true;
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    try {
      const values = await form.validateFields();

      const data = {
        title: {
          en: values.title_en || "",
          am: values.title_am || "",
          or: values.title_or || "",
        },
        description: {
          en: values.description_en || "",
          am: values.description_am || "",
          or: values.description_or || "",
        },
        images: values.images || [],
        order: values.order || 0,
        category: values.category || "general",
      };

      if (editingItem) {
        await axios.put(`${API_URL}api/add-gallery/${editingItem.id}`, data);
        message.success(t("galleryadmin.messages.updateSuccess"));
      } else {
        await axios.post(`${API_URL}api/add-gallery`, data);
        message.success(t("galleryadmin.messages.createSuccess"));
      }
      fetchGalleryItems();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      setPreviewImages([]);
    } catch (err) {
      message.error(t("galleryadmin.messages.operationFailed"));
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}api/add-gallery/${id}`);
      message.success(t("galleryadmin.messages.deleteSuccess"));
      fetchGalleryItems();
    } catch (err) {
      message.error(t("galleryadmin.messages.deleteError"));
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    const images = record.images.map((img) => {
      if (typeof img === "string") {
        return img;
      }
      return {
        ...img,
        url: `${API_URL}uploads/${img.response?.path}`,
      };
    });

    form.setFieldsValue({
      title_en: record.title?.en || "",
      title_am: record.title?.am || "",
      title_or: record.title?.or || "",
      description_en: record.description?.en || "",
      description_am: record.description?.am || "",
      description_or: record.description?.or || "",
      images: images,
      order: record.order || 0,
      category: record.category || "general",
    });
    setPreviewImages(images);
    setIsModalOpen(true);
  };

  const getImageUrl = (img) => {
    if (typeof img === "string") {
      return `${API_URL}uploads/${img}`;
    }
    return img.url || `${API_URL}uploads/${img.response?.path}`;
  };

  const columns = [
    {
      title: t("galleryadmin.table.images"),
      dataIndex: "images",
      render: (images) => (
        <div className="flex justify-center">
          {images?.length > 0 ? (
            <Avatar
              shape="square"
              src={getImageUrl(images[0])}
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
          {images?.length > 1 && (
            <div className="ml-1 bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
              +{images.length - 1}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("galleryadmin.table.title"),
      dataIndex: "title",
      render: (title) => (
        <div>
          <div className="font-medium">
            {title?.en || t("galleryadmin.table.noTitle")}
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
      title: t("galleryadmin.table.category"),
      dataIndex: "category",
      render: (category) => (
        <Tag color={category ? "blue" : "default"}>
          {category || t("galleryadmin.table.uncategorized")}
        </Tag>
      ),
      filters: categories.map((cat) => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: t("galleryadmin.table.order"),
      dataIndex: "order",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: t("galleryadmin.table.createdAt"),
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: t("galleryadmin.table.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("galleryadmin.actions.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("galleryadmin.deleteConfirm.title")}
            description={t("galleryadmin.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("galleryadmin.deleteConfirm.okText")}
            cancelText={t("galleryadmin.deleteConfirm.cancelText")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("galleryadmin.actions.delete")}>
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
      {galleryItems.map((item) => (
        <Card
          key={item.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow"
          cover={
            item.images?.length > 0 ? (
              <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-50 relative">
                <Image
                  src={getImageUrl(item.images[0])}
                  alt={item.title?.en || t("galleryadmin.grid.galleryItem")}
                  className="object-cover h-full w-full"
                  preview={{
                    src: getImageUrl(item.images[0]),
                    toolbarRender: () => (
                      <div className="flex justify-end p-2">
                        <Button
                          type="text"
                          icon={<FiX />}
                          onClick={() =>
                            document
                              .querySelector(".ant-image-preview-wrap")
                              .click()
                          }
                          className="text-white"
                        />
                      </div>
                    ),
                  }}
                />
                {item.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white rounded-full px-2 py-1 text-xs">
                    {t("galleryadmin.grid.moreImages", {
                      count: item.images.length - 1,
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <MdOutlineImageNotSupported className="text-gray-400 text-4xl" />
              </div>
            )
          }
          actions={[
            <Tooltip title={t("galleryadmin.actions.edit")}>
              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => openEditModal(item)}
              />
            </Tooltip>,
            <Popconfirm
              title={t("galleryadmin.deleteConfirm.title")}
              description={t("galleryadmin.deleteConfirm.description")}
              onConfirm={() => handleDelete(item.id)}
              okText={t("galleryadmin.deleteConfirm.okText")}
              cancelText={t("galleryadmin.deleteConfirm.cancelText")}
              okButtonProps={{ loading: actionLoading }}
            >
              <Tooltip title={t("galleryadmin.actions.delete")}>
                <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
              </Tooltip>
            </Popconfirm>,
          ]}
        >
          <Card.Meta
            title={
              <div>
                <div className="font-medium">
                  {item.title?.en || t("galleryadmin.table.noTitle")}
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
                  <Tag color={item.category ? "blue" : "default"}>
                    {item.category || t("galleryadmin.table.uncategorized")}
                  </Tag>
                  <span className="text-xs text-gray-500">
                    {t("galleryadmin.grid.order")}: {item.order}
                  </span>
                </div>
                <Divider className="my-2" />
                <div>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {item.description?.en ||
                      t("galleryadmin.grid.noDescription")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.description?.am && (
                      <span className="mr-2">🇪🇹 {item.description.am}</span>
                    )}
                    {item.description?.or && (
                      <span>🇪🇹 {item.description.or}</span>
                    )}
                  </div>
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
              {t("galleryadmin.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title={t("galleryadmin.view.table")}>
                <Button
                  shape="circle"
                  icon={<AiOutlineUnorderedList />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title={t("galleryadmin.view.grid")}>
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
                  setPreviewImages([]);
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                {t("galleryadmin.actions.addItem")}
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
            dataSource={galleryItems}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) =>
                t("galleryadmin.table.totalItems", { total }),
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
                <span>{t("galleryadmin.modal.editTitle")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("galleryadmin.modal.addTitle")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImages([]);
        }}
        onOk={handleFormSubmit}
        okText={
          editingItem
            ? t("galleryadmin.actions.update")
            : t("galleryadmin.actions.create")
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
        <Form form={form} layout="vertical">
          <div className="mb-4">
            <Tabs
              defaultActiveKey="en"
              onChange={setActiveLanguage}
              tabBarExtraContent={
                <div className="flex items-center text-sm text-gray-500">
                  <FiGlobe className="mr-1" />
                  <span>
                    {t("galleryadmin.modal.language")}:{" "}
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
                </React.Fragment>
              )
          )}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`title_${activeLanguage}`}
                label={t("galleryadmin.form.title", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("galleryadmin.form.titleRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  size="large"
                  placeholder={t("galleryadmin.form.titlePlaceholder", {
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
                label={t("galleryadmin.form.description", {
                  language: languages.find((l) => l.code === activeLanguage)
                    ?.name,
                })}
              >
                <TextArea
                  rows={4}
                  placeholder={t("galleryadmin.form.descriptionPlaceholder", {
                    language: languages.find((l) => l.code === activeLanguage)
                      ?.name,
                  })}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="order"
                label={t("galleryadmin.form.order")}
                rules={[
                  {
                    required: true,
                    message: t("galleryadmin.form.orderRequired"),
                  },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label={t("galleryadmin.form.category")}
                rules={[
                  {
                    required: true,
                    message: t("galleryadmin.form.categoryRequired"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t("galleryadmin.form.categoryPlaceholder")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {categories.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="images"
            label={t("galleryadmin.form.images")}
            rules={[
              {
                required: true,
                message: t("galleryadmin.form.imagesRequired"),
              },
            ]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload
              multiple
              listType="picture-card"
              customRequest={handleImageUpload}
              onRemove={handleRemoveImage}
              accept="image/*"
              disabled={uploading}
              fileList={previewImages.map((img) => {
                if (typeof img === "string") {
                  return {
                    uid: img,
                    name: img.split("/").pop(),
                    status: "done",
                    url: `${API_URL}uploads/${img}`,
                  };
                }
                return {
                  ...img,
                  url: img.url || `${API_URL}uploads/${img.response?.path}`,
                };
              })}
            >
              {previewImages.length >= 10 ? null : (
                <div>
                  {uploading ? <Spin /> : <FiPlus />}
                  <div style={{ marginTop: 8 }}>
                    {t("galleryadmin.form.upload")}
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {previewImages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">
                {t("galleryadmin.form.imagePreview")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getImageUrl(img)}
                      alt={t("galleryadmin.form.previewAlt", {
                        index: index + 1,
                      })}
                      className="h-20 w-20 object-cover rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const newImages = [...previewImages];
                        newImages.splice(index, 1);
                        setPreviewImages(newImages);
                        form.setFieldsValue({ images: newImages });
                      }}
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default GalleryAdmin;
