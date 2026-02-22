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
  Divider,
  Tooltip,
  Spin,
  Popconfirm,
  Select,
  Row,
  Col,
  Alert,
  Descriptions,
  Tag,
} from "antd";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiCheck,
  FiUser,
  FiLock,
} from "react-icons/fi";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../../utils/getApiUrl";

const { Option } = Select;

const BACKEND_URL = getApiUrl();

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const UserAdmin = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BACKEND_URL}users`);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.error || err.message || t("user.fetchError")
      );
      message.error(t("user.fetchErrorMessage"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [t]);

  const handleFormSubmit = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const values = await form.validateFields();

      let response;
      if (editingUser) {
        response = await axios.put(
          `${BACKEND_URL}users/${editingUser.id}`,
          values
        );
        message.success(t("user.updateSuccess"));
      } else {
        response = await axios.post(`${BACKEND_URL}users`, values);
        message.success(t("user.createSuccess"));
      }

      fetchUsers();
      setIsModalOpen(false);
      form.resetFields();
      setEditingUser(null);
    } catch (err) {
      console.error("Form submission error:", err);
      setError(
        err.response?.data?.error || err.message || t("user.operationFailed")
      );
      message.error(t("user.operationFailedMessage"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}users/${id}`);
      message.success(t("user.deleteSuccess"));
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
      message.error(
        err.response?.data?.error || err.message || t("user.deleteFailed")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      full_name: record.full_name,
      user_name: record.user_name,
      role: record.role,
    });
    setIsModalOpen(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "red";
      case "editor":
        return "blue";
      case "viewer":
        return "green";
      default:
        return "gray";
    }
  };

  const columns = [
    {
      title: t("user.fullName"),
      dataIndex: "full_name",
      render: (text) => (
        <div className="flex items-center">
          <FiUser className="mr-2 text-gray-400" />
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: t("user.username"),
      dataIndex: "user_name",
      render: (text) => (
        <div className="flex items-center">
          <FiUser className="mr-2 text-blue-400" />
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: t("user.role"),
      dataIndex: "role",
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {roleOptions.find((r) => r.value === role)?.label || role}
        </Tag>
      ),
      filters: roleOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.role === value,
    },
    {
      title: t("user.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("user.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("user.deleteConfirmTitle")}
            description={t("user.deleteConfirmDescription")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("user.yes")}
            cancelText={t("user.no")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("user.delete")}>
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
              {t("user.management")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingUser(null);
                  setError(null);
                  setIsModalOpen(true);
                }}
              >
                {t("user.addUser")}
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
        ) : (
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => t("user.totalUsers", { total }),
            }}
          />
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            {editingUser ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("user.editUser")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("user.addUser")}</span>
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
        okText={editingUser ? t("user.update") : t("user.create")}
        okButtonProps={{
          icon: editingUser ? <FiCheck /> : <FiPlus />,
          className: "flex items-center",
          loading: actionLoading,
        }}
        cancelButtonProps={{
          icon: <FiX />,
          className: "flex items-center",
        }}
        width={600}
        destroyOnClose
      >
        <Divider />
        {error && (
          <Alert
            message={t("user.error")}
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}
        <Form form={form} layout="vertical">
          {editingUser && (
            <Descriptions bordered column={1} size="small" className="mb-4">
              <Descriptions.Item label="ID">{editingUser.id}</Descriptions.Item>
            </Descriptions>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="full_name"
                label={t("user.fullName")}
                rules={[
                  { required: true, message: t("user.fullNameRequired") },
                ]}
              >
                <Input prefix={<FiUser className="text-gray-400" />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="user_name"
                label={t("user.username")}
                rules={[
                  { required: true, message: t("user.usernameRequired") },
                ]}
              >
                <Input prefix={<FiUser className="text-blue-400" />} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="role"
            label={t("user.role")}
            rules={[{ required: true, message: t("user.roleRequired") }]}
          >
            <Select placeholder={t("user.selectRole")}>
              {roleOptions.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label={t("user.password")}
              rules={[
                { required: true, message: t("user.passwordRequired") },
                { min: 6, message: t("user.passwordMinLength") },
              ]}
            >
              <Input.Password prefix={<FiLock className="text-gray-400" />} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserAdmin;
