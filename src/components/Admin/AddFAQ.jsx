import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
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
  Alert,
  Collapse,
  Empty,
  Input as AntInput,
} from "antd";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiGlobe,
  FiFileText,
  FiList,
  FiEye,
  FiFolder,
  FiHelpCircle,
  FiMessageSquare,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import {
  MdOutlineQuestionAnswer,
  MdOutlineCategory,
  MdOutlineExpandMore,
  MdOutlineExpandLess,
} from "react-icons/md";
import { BsGrid, BsQuestionCircle } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const BACKEND_URL = "https://yekawebapi.yekasubcity.com/";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const categoryOptions = [
  { value: "general", label: "General", color: "blue" },
  { value: "technical", label: "Technical", color: "green" },
  { value: "billing", label: "Billing", color: "orange" },
  { value: "account", label: "Account", color: "purple" },
  { value: "shipping", label: "Shipping", color: "cyan" },
  { value: "support", label: "Support", color: "red" },
  { value: "product", label: "Product", color: "geekblue" },
];

const FaqAdmin = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [previewModal, setPreviewModal] = useState({
    visible: false,
    data: null,
  });

  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BACKEND_URL}api/faq`;
      const res = await axios.get(url);

      // Handle different response formats
      const data = res.data.data || res.data || [];
      setFaqs(data);
      setFilteredFaqs(data);

      if (data.length === 0) {
        message.info("No FAQs found. Create your first FAQ!");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to fetch FAQs";
      setError(errorMsg);
      message.error(`Failed to load FAQs: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Filter FAQs based on search and category
  useEffect(() => {
    let filtered = faqs;

    if (searchText) {
      filtered = filtered.filter((faq) => {
        const question = getSafeData(faq, "question", "en").toLowerCase();
        const answer = getSafeData(faq, "answer", "en").toLowerCase();
        const search = searchText.toLowerCase();
        return question.includes(search) || answer.includes(search);
      });
    }

    if (filterCategory) {
      filtered = filtered.filter((faq) => {
        const category = getSafeCategory(faq.category).text.toLowerCase();
        return category === filterCategory.toLowerCase();
      });
    }

    setFilteredFaqs(filtered);
  }, [faqs, searchText, filterCategory]);

  // Safe data extraction helper
  const getSafeData = (data, field, lang = "en") => {
    if (!data || !data[field]) return "Not available";

    try {
      if (typeof data[field] === "string") {
        const parsed = JSON.parse(data[field]);
        return parsed[lang] || parsed.en || data[field];
      }
      return data[field][lang] || data[field].en || "Not available";
    } catch (error) {
      return data[field] || "Not available";
    }
  };

  const getSafeCategory = (category) => {
    if (!category) return { text: "General", color: "blue" };

    try {
      let categoryText = category;
      if (typeof category === "string") {
        const parsed = JSON.parse(category);
        categoryText = parsed.en || category;
      } else if (typeof category === "object") {
        categoryText = category.en || "General";
      }

      const categoryOption = categoryOptions.find(
        (opt) =>
          opt.value === categoryText.toLowerCase() ||
          opt.label.toLowerCase() === categoryText.toLowerCase()
      );

      return {
        text: categoryOption?.label || categoryText,
        color: categoryOption?.color || "blue",
      };
    } catch (error) {
      return {
        text: category || "General",
        color: "blue",
      };
    }
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const values = await form.validateFields();

      // Prepare multi-language data
      const questionData = {};
      const answerData = {};
      const categoryData = {};

      languages.forEach((lang) => {
        questionData[lang.code] =
          values[`question_${lang.code}`] || values.question_en || "";
        answerData[lang.code] =
          values[`answer_${lang.code}`] || values.answer_en || "";
        categoryData[lang.code] =
          values[`category_${lang.code}`] || values.category || "general";
      });

      const data = {
        question: questionData,
        answer: answerData,
        category: categoryData,
      };

      console.log("Submitting FAQ data:", data);

      let response;
      if (editingItem) {
        response = await axios.put(
          `${BACKEND_URL}api/faq/${editingItem.id}`,
          data
        );
        message.success("FAQ updated successfully");
      } else {
        response = await axios.post(`${BACKEND_URL}api/faq`, data);
        message.success("FAQ created successfully");
      }

      fetchFaqs();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
    } catch (err) {
      console.error("Form submission error:", err);
      const errorMsg =
        err.response?.data?.error || err.message || "Operation failed";
      setError(errorMsg);
      message.error(`Operation failed: ${errorMsg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/faq/${id}`);
      message.success("FAQ deleted successfully");
      fetchFaqs();
    } catch (err) {
      console.error("Delete error:", err);
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to delete FAQ";
      message.error(`Delete failed: ${errorMsg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingItem(record);

    const initialValues = {
      category: "general",
    };

    try {
      // Try to extract category from the record
      if (record.category) {
        if (typeof record.category === "string") {
          const parsedCat = JSON.parse(record.category);
          initialValues.category = parsedCat.en || record.category;
        } else {
          initialValues.category = record.category.en || "general";
        }
      }

      languages.forEach((lang) => {
        initialValues[`question_${lang.code}`] = getSafeData(
          record,
          "question",
          lang.code
        );
        initialValues[`answer_${lang.code}`] = getSafeData(
          record,
          "answer",
          lang.code
        );
        initialValues[`category_${lang.code}`] = getSafeData(
          record,
          "category",
          lang.code
        );
      });
    } catch (error) {
      console.error("Error parsing record data:", error);
      // Set default values if parsing fails
      languages.forEach((lang) => {
        initialValues[`question_${lang.code}`] = record.question || "";
        initialValues[`answer_${lang.code}`] = record.answer || "";
        initialValues[`category_${lang.code}`] = record.category || "general";
      });
    }

    form.setFieldsValue(initialValues);
    setIsModalOpen(true);
  };

  const toggleExpand = (id) => {
    setExpandedKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]
    );
  };

  const showPreview = (record) => {
    setPreviewModal({ visible: true, data: record });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Question",
      dataIndex: "question",
      render: (question, record) => (
        <div
          className="cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => showPreview(record)}
        >
          <div className="font-medium">
            {getSafeData(record, "question", "en")}
          </div>
          <div className="text-xs text-gray-500">
            {getSafeData(record, "question", "am") && (
              <span className="mr-2">
                🇪🇹 {getSafeData(record, "question", "am")}
              </span>
            )}
            {getSafeData(record, "question", "or") && (
              <span>🇪🇹 {getSafeData(record, "question", "or")}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Answer Preview",
      dataIndex: "answer",
      render: (answer, record) => (
        <div
          className="max-w-xs cursor-pointer"
          onClick={() => showPreview(record)}
        >
          <div className="truncate text-gray-600">
            {getSafeData(record, "answer", "en").substring(0, 100)}
            {getSafeData(record, "answer", "en").length > 100 ? "..." : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => {
        const categoryInfo = getSafeCategory(category);
        return <Tag color={categoryInfo.color}>{categoryInfo.text}</Tag>;
      },
      filters: categoryOptions.map((opt) => ({
        text: <Tag color={opt.color}>{opt.label}</Tag>,
        value: opt.value,
      })),
      onFilter: (value, record) => {
        const recordCategory = getSafeCategory(
          record.category
        ).text.toLowerCase();
        return recordCategory === value.toLowerCase();
      },
    },
    {
      title: "Created",
      dataIndex: "created_at",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
    },
    {
      title: "Actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="Preview">
            <Button
              shape="circle"
              icon={<FiEye className="text-green-500" />}
              onClick={() => showPreview(record)}
              className="hover:bg-green-50"
            />
          </Tooltip>
          <Tooltip title="Expand">
            <Button
              shape="circle"
              icon={
                expandedKeys.includes(record.id) ? (
                  <MdOutlineExpandLess />
                ) : (
                  <MdOutlineExpandMore />
                )
              }
              onClick={() => toggleExpand(record.id)}
              className="hover:bg-gray-50"
            />
          </Tooltip>
          <Popconfirm
            title="Delete FAQ"
            description="Are you sure you want to delete this FAQ? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              loading: actionLoading,
              danger: true,
            }}
          >
            <Tooltip title="Delete">
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
      {filteredFaqs.map((faq) => (
        <Card
          key={faq.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
          cover={
            <div
              className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer"
              onClick={() => showPreview(faq)}
            >
              <div className="flex items-center justify-center h-20">
                <BsQuestionCircle className="text-4xl text-blue-500" />
              </div>
            </div>
          }
          actions={[
            <Tooltip title="Edit">
              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                onClick={() => openEditModal(faq)}
              />
            </Tooltip>,
            <Tooltip title="Preview">
              <FiEye
                className="text-green-500 cursor-pointer hover:text-green-700 transition-colors"
                onClick={() => showPreview(faq)}
              />
            </Tooltip>,
            <Popconfirm
              title="Delete FAQ"
              description="Are you sure you want to delete this FAQ?"
              onConfirm={() => handleDelete(faq.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: actionLoading }}
            >
              <Tooltip title="Delete">
                <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700 transition-colors" />
              </Tooltip>
            </Popconfirm>,
          ]}
        >
          <Card.Meta
            title={
              <div
                className="truncate cursor-pointer hover:text-blue-600"
                onClick={() => showPreview(faq)}
              >
                {getSafeData(faq, "question", "en")}
              </div>
            }
            description={
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Tag color={getSafeCategory(faq.category).color}>
                    {getSafeCategory(faq.category).text}
                  </Tag>
                  <Badge
                    count={`#${faq.id}`}
                    style={{ backgroundColor: "#87d068" }}
                  />
                </div>
                <div className="text-gray-600 text-sm line-clamp-3">
                  {getSafeData(faq, "answer", "en")}
                </div>
                <div className="text-xs text-gray-400 mt-2 flex justify-between">
                  <span>
                    Created: {new Date(faq.created_at).toLocaleDateString()}
                  </span>
                  {faq.updated_at && faq.updated_at !== faq.created_at && (
                    <span>
                      Updated: {new Date(faq.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );

  const expandedRowRender = (record) => {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <Card
              key={lang.code}
              size="small"
              title={
                <span className="flex items-center">
                  <span className="text-lg mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
              }
              className="h-full border border-gray-300"
            >
              <div className="space-y-3">
                <div>
                  <strong className="text-gray-700 text-sm">Question:</strong>
                  <p className="mt-1 text-sm bg-white p-2 rounded border">
                    {getSafeData(record, "question", lang.code) ||
                      "Not available"}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-700 text-sm">Answer:</strong>
                  <p className="mt-1 text-sm bg-white p-2 rounded border whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {getSafeData(record, "answer", lang.code) ||
                      "Not available"}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-700 text-sm">Category:</strong>
                  <p className="mt-1 text-sm bg-white p-2 rounded border">
                    {getSafeData(record, "category", lang.code) || "General"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const PreviewModal = ({ visible, data, onClose }) => {
    if (!data) return null;

    return (
      <Modal
        title={
          <div className="flex items-center">
            <BsQuestionCircle className="text-blue-500 mr-2" />
            <span>FAQ Preview</span>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={[
          <Button
            key="edit"
            icon={<FiEdit />}
            onClick={() => {
              onClose();
              openEditModal(data);
            }}
          >
            Edit
          </Button>,
          <Button key="close" onClick={onClose}>
            Close
          </Button>,
        ]}
        width={700}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Question</h3>
              <p className="text-gray-600 mt-1">
                {getSafeData(data, "question", "en")}
              </p>
            </div>
            <Tag color={getSafeCategory(data.category).color}>
              {getSafeCategory(data.category).text}
            </Tag>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Answer</h3>
            <p className="text-gray-600 mt-1 whitespace-pre-wrap">
              {getSafeData(data, "answer", "en")}
            </p>
          </div>

          <Divider />

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              All Languages
            </h3>
            <Collapse>
              {languages.map((lang) => (
                <Panel
                  header={
                    <span className="flex items-center">
                      <span className="text-lg mr-2">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  }
                  key={lang.code}
                >
                  <div className="space-y-3">
                    <div>
                      <strong>Question:</strong>
                      <p className="mt-1">
                        {getSafeData(data, "question", lang.code) ||
                          "Not available"}
                      </p>
                    </div>
                    <div>
                      <strong>Answer:</strong>
                      <p className="mt-1 whitespace-pre-wrap">
                        {getSafeData(data, "answer", lang.code) ||
                          "Not available"}
                      </p>
                    </div>
                    <div>
                      <strong>Category:</strong>
                      <p>
                        {getSafeData(data, "category", lang.code) || "General"}
                      </p>
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Created: {new Date(data.created_at).toLocaleString()}</span>
            {data.updated_at && data.updated_at !== data.created_at && (
              <span>Updated: {new Date(data.updated_at).toLocaleString()}</span>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card
        title={
          <div className="flex items-center">
            <MdOutlineQuestionAnswer className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">FAQ Management</h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title="Table View">
                <Button
                  shape="circle"
                  icon={<AiOutlineUnorderedList />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title="Grid View">
                <Button
                  shape="circle"
                  icon={<BsGrid />}
                  onClick={() => setViewMode("grid")}
                  type={viewMode === "grid" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title="Refresh">
                <Button
                  shape="circle"
                  icon={<FiRefreshCw />}
                  onClick={fetchFaqs}
                  loading={loading}
                />
              </Tooltip>
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingItem(null);
                  setError(null);
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                Add FAQ
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-lg rounded-lg border-0"
        extra={
          <div className="flex space-x-4">
            <AntInput
              placeholder="Search FAQs..."
              prefix={<FiSearch className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="Filter by Category"
              allowClear
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: 200 }}
            >
              {categoryOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  <Tag color={opt.color}>{opt.label}</Tag>
                </Option>
              ))}
            </Select>
          </div>
        }
      >
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {filteredFaqs.length} of {faqs.length} FAQs
            {searchText && ` for "${searchText}"`}
            {filterCategory &&
              ` in ${
                categoryOptions.find((opt) => opt.value === filterCategory)
                  ?.label
              }`}
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Spin size="large" tip="Loading FAQs..." />
          </div>
        ) : filteredFaqs.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              faqs.length === 0
                ? "No FAQs found. Create your first FAQ!"
                : "No FAQs match your search criteria"
            }
          >
            {faqs.length === 0 && (
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => setIsModalOpen(true)}
              >
                Create First FAQ
              </Button>
            )}
          </Empty>
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredFaqs}
            rowKey="id"
            loading={loading}
            className="border-none"
            expandable={{
              expandedRowRender,
              expandedRowKeys: expandedKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedKeys((prev) => [...prev, record.id]);
                } else {
                  setExpandedKeys((prev) =>
                    prev.filter((key) => key !== record.id)
                  );
                }
              },
            }}
            scroll={{ x: 1000 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        ) : (
          gridView
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center">
            {editingItem ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>Edit FAQ</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>Add New FAQ</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setError(null);
        }}
        onOk={handleFormSubmit}
        okText={editingItem ? "Update FAQ" : "Create FAQ"}
        okButtonProps={{
          icon: editingItem ? <FiEdit /> : <FiPlus />,
          className: "flex items-center",
          loading: actionLoading,
        }}
        cancelText="Cancel"
        width={800}
        destroyOnClose
        maskClosable={false}
      >
        <Divider />
        {error && (
          <Alert
            message="Error"
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
            <Col span={24}>
              <Form.Item
                name="category"
                label="Default Category"
                initialValue="general"
                rules={[
                  {
                    required: true,
                    message: "Please select a category",
                  },
                ]}
              >
                <Select>
                  {categoryOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      <Tag color={opt.color}>{opt.label}</Tag>
                    </Option>
                  ))}
                </Select>
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
                    Language:{" "}
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
                  <Form.Item name={`question_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={`answer_${lang.code}`} hidden>
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
                name={`question_${activeLanguage}`}
                label={`Question (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: "English question is required",
                        },
                        {
                          min: 10,
                          message: "Question should be at least 10 characters",
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`Enter question in ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                  prefix={<FiHelpCircle className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`answer_${activeLanguage}`}
                label={`Answer (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: "English answer is required",
                        },
                        {
                          min: 20,
                          message: "Answer should be at least 20 characters",
                        },
                      ]
                    : []
                }
              >
                <TextArea
                  rows={6}
                  placeholder={`Enter answer in ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                  showCount
                  maxLength={2000}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`category_${activeLanguage}`}
                label={`Category (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: "English category is required",
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`Enter category in ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                  prefix={<MdOutlineCategory className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Alert
            message="Language Note"
            description="English is required. Other languages will fall back to English if left empty."
            type="info"
            showIcon
            className="mt-4"
          />
        </Form>
      </Modal>

      {/* Preview Modal */}
      <PreviewModal
        visible={previewModal.visible}
        data={previewModal.data}
        onClose={() => setPreviewModal({ visible: false, data: null })}
      />
    </div>
  );
};

export default FaqAdmin;
