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
} from "antd";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiCheck,
  FiGlobe,
} from "react-icons/fi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const BACKEND_URL = "https://yekawebapi.yekasubcity.com/";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const statusOptions = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "gray" },
];

const QuickMessageAdmin = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterStatus, setFilterStatus] = useState("active");
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BACKEND_URL}api/quick-messages`;
      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }
      const res = await axios.get(url);
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.error || err.message || t("quickmessage.fetchError")
      );
      message.error(t("quickmessage.fetchErrorMessage"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

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
        content: values.content,
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
          `${BACKEND_URL}api/quick-messages/${editingItem.id}`,
          data,
          config
        );
        message.success(t("quickmessage.updateSuccess"));
      } else {
        response = await axios.post(
          `${BACKEND_URL}api/quick-messages`,
          data,
          config
        );
        message.success(t("quickmessage.createSuccess"));
      }

      fetchMessages();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
    } catch (err) {
      console.error("Form submission error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          t("quickmessage.operationFailed")
      );
      message.error(t("quickmessage.operationFailedMessage"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/quick-messages/${id}`);
      message.success(t("quickmessage.deleteSuccess"));
      fetchMessages();
    } catch (err) {
      console.error("Delete error:", err);
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("quickmessage.deleteFailed")
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
      content: record.content,
      status: record.status || "active",
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: t("quickmessage.columns.title"),
      dataIndex: "title",
      render: (title) => (
        <div>
          <div className="font-medium">
            {title?.en || t("quickmessage.noTitle")}
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
      title: t("quickmessage.columns.content"),
      dataIndex: "content",
      render: (text) => (
        <div className="truncate" style={{ maxWidth: "200px" }}>
          {text || t("quickmessage.noContent")}
        </div>
      ),
    },
    {
      title: t("quickmessage.columns.status"),
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
      title: t("quickmessage.columns.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("quickmessage.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("quickmessage.deleteConfirm.title")}
            description={t("quickmessage.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("quickmessage.yes")}
            cancelText={t("quickmessage.no")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("quickmessage.delete")}>
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

  return (
    <div className="p-6 max-w-7xl ">
      <Card
        title={
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {t("quickmessage.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingItem(null);
                  setError(null);
                  setIsModalOpen(true);
                }}
              >
                {t("quickmessage.addMessage")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          <Select
            placeholder={t("quickmessage.filterStatus")}
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
        ) : (
          <Table
            columns={columns}
            dataSource={messages}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => t("quickmessage.totalMessages", { total }),
            }}
          />
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            {editingItem ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("quickmessage.editMessage")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("quickmessage.addMessage")}</span>
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
        okText={
          editingItem ? t("quickmessage.update") : t("quickmessage.create")
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
        width={700}
        destroyOnClose
      >
        <Divider />
        {error && (
          <Alert
            message={t("quickmessage.error")}
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
                label={t("quickmessage.form.status")}
                initialValue="active"
                rules={[
                  {
                    required: true,
                    message: t("quickmessage.form.statusRequired"),
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
          </Row>

          <div className="mb-4">
            <Tabs
              defaultActiveKey="en"
              onChange={setActiveLanguage}
              tabBarExtraContent={
                <div className="flex items-center text-sm text-gray-500">
                  <FiGlobe className="mr-1" />
                  <span>
                    {t("quickmessage.language")}:{" "}
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
                </React.Fragment>
              )
          )}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`title_${activeLanguage}`}
                label={`${t("quickmessage.form.title")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("quickmessage.form.englishTitleRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("quickmessage.form.enterTitle")} ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="content"
                label={t("quickmessage.form.content")}
                rules={[
                  {
                    required: true,
                    message: t("quickmessage.form.contentRequired"),
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder={t("quickmessage.form.enterContent")}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default QuickMessageAdmin;
