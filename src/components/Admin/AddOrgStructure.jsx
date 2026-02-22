import React, { useEffect, useState } from "react";
import {
  Card,
  Tree,
  Avatar,
  Divider,
  Tooltip,
  Spin,
  Popconfirm,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Table,
  Space,
  Select,
  Empty,
} from "antd";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiCheck,
  FiUser,
  FiUsers,
  FiUpload,
} from "react-icons/fi";
import { MdOutlinePersonOff } from "react-icons/md";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { TextArea } = Input;

const OrgAdmin = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();
  const [orgData, setOrgData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [viewMode, setViewMode] = useState("tree");
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Build tree structure from flat data
  const buildTree = (data, parentId = null) => {
    return data
      .filter((item) => item.parent_id === parentId)
      .map((item) => ({
        key: item.id,
        title: (
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div className="flex items-center">
              <Avatar
                src={item.image ? `${API_URL}uploads/${item.image}` : null}
                icon={!item.image && <FiUser />}
                className="mr-3"
              />
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.position}</div>
              </div>
            </div>
            <Space size="small">
              <Tooltip title={t("orgadmin.actions.edit")}>
                <Button
                  size="small"
                  type="text"
                  icon={<FiEdit className="text-blue-500" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(item);
                  }}
                />
              </Tooltip>
              <Tooltip title={t("orgadmin.actions.delete")}>
                <Popconfirm
                  title={t("orgadmin.deleteConfirm.title")}
                  description={t("orgadmin.deleteConfirm.description")}
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDelete(item.id);
                  }}
                  okText={t("orgadmin.deleteConfirm.okText")}
                  cancelText={t("orgadmin.deleteConfirm.cancelText")}
                  okButtonProps={{ loading: actionLoading }}
                >
                  <Button
                    size="small"
                    type="text"
                    icon={<FiTrash2 className="text-red-500" />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              </Tooltip>
            </Space>
          </div>
        ),
        children: buildTree(data, item.id),
      }));
  };

  const fetchOrgData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}api/org-structures`);
      setOrgData(res.data.data || []);

      // Build tree structure
      const tree = buildTree(res.data.data || []);
      setTreeData(tree);
    } catch (err) {
      message.error(t("orgadmin.messages.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Set preview image
      setPreviewImage(res.data.path);

      // Update form field
      form.setFieldsValue({ image: res.data.path });

      // Update file list
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: `${API_URL}uploads/${res.data.path}`,
        },
      ]);

      message.success(t("orgadmin.messages.uploadSuccess"));
    } catch (err) {
      message.error(t("orgadmin.messages.uploadError"));
      setFileList([]);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFileList([]);
    form.setFieldsValue({ image: "" });
    return true;
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
    }

    return isImage && isLt5M;
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    try {
      const values = await form.validateFields();

      const data = {
        name: values.name,
        position: values.position,
        parent_id: values.parent_id || null,
        image: values.image || "",
      };

      if (editingNode) {
        await axios.put(`${API_URL}api/org-structures/${editingNode.id}`, data);
        message.success(t("orgadmin.messages.updateSuccess"));
      } else {
        await axios.post(`${API_URL}api/org-structures`, data);
        message.success(t("orgadmin.messages.createSuccess"));
      }

      fetchOrgData();
      setIsModalOpen(false);
      form.resetFields();
      setEditingNode(null);
      setPreviewImage(null);
      setFileList([]);
    } catch (err) {
      message.error(t("orgadmin.messages.operationFailed"));
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}api/org-structures/${id}`);
      message.success(t("orgadmin.messages.deleteSuccess"));
      fetchOrgData();
    } catch (err) {
      message.error(t("orgadmin.messages.deleteError"));
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (node) => {
    setEditingNode(node);
    form.setFieldsValue({
      name: node.name,
      position: node.position,
      parent_id: node.parent_id || null,
      image: node.image || "",
    });

    if (node.image) {
      setPreviewImage(node.image);
      setFileList([
        {
          uid: "-1",
          name: "current-image",
          status: "done",
          url: `${API_URL}uploads/${node.image}`,
        },
      ]);
    } else {
      setFileList([]);
    }

    setIsModalOpen(true);
  };

  const getParentOptions = () => {
    return orgData
      .filter((item) => !editingNode || item.id !== editingNode.id)
      .map((item) => ({
        value: item.id,
        label: `${item.name} - ${item.position}`,
      }));
  };

  const columns = [
    {
      title: t("orgadmin.table.photo"),
      dataIndex: "image",
      render: (image) => (
        <Avatar
          src={image ? `${API_URL}uploads/${image}` : null}
          icon={!image && <FiUser />}
          size={64}
          className="rounded-lg"
        />
      ),
    },
    {
      title: t("orgadmin.table.name"),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("orgadmin.table.position"),
      dataIndex: "position",
      sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
      title: t("orgadmin.table.parent"),
      dataIndex: "parent_id",
      render: (parentId) => {
        const parent = orgData.find((item) => item.id === parentId);
        return parent
          ? `${parent.name} - ${parent.position}`
          : t("orgadmin.table.root");
      },
    },
    {
      title: t("orgadmin.table.createdAt"),
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: t("orgadmin.table.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("orgadmin.actions.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("orgadmin.deleteConfirm.title")}
            description={t("orgadmin.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("orgadmin.deleteConfirm.okText")}
            cancelText={t("orgadmin.deleteConfirm.cancelText")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("orgadmin.actions.delete")}>
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
    <div className="p-6 max-w-7xl mx-auto">
      <Card
        title={
          <div className="flex items-center">
            <FiUsers className="text-blue-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">
              {t("orgadmin.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title={t("orgadmin.view.tree")}>
                <Button
                  shape="circle"
                  icon={<FiUsers />}
                  onClick={() => setViewMode("tree")}
                  type={viewMode === "tree" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title={t("orgadmin.view.table")}>
                <Button
                  shape="circle"
                  icon={<FiEdit />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingNode(null);
                  setPreviewImage(null);
                  setFileList([]);
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                {t("orgadmin.actions.addNode")}
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
        ) : viewMode === "tree" ? (
          treeData.length > 0 ? (
            <div className="p-4 border rounded-lg">
              <Tree
                showLine
                defaultExpandAll
                treeData={treeData}
                className="org-tree"
              />
            </div>
          ) : (
            <Empty
              description={t("orgadmin.messages.noData")}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        ) : (
          <Table
            columns={columns}
            dataSource={orgData}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => t("orgadmin.table.totalNodes", { total }),
            }}
          />
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            {editingNode ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("orgadmin.modal.editTitle")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("orgadmin.modal.addTitle")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setFileList([]);
        }}
        onOk={handleFormSubmit}
        okText={
          editingNode
            ? t("orgadmin.actions.update")
            : t("orgadmin.actions.create")
        }
        okButtonProps={{
          icon: editingNode ? <FiCheck /> : <FiPlus />,
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
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={t("orgadmin.form.name")}
                rules={[
                  {
                    required: true,
                    message: t("orgadmin.form.nameRequired"),
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={t("orgadmin.form.namePlaceholder")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label={t("orgadmin.form.position")}
                rules={[
                  {
                    required: true,
                    message: t("orgadmin.form.positionRequired"),
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={t("orgadmin.form.positionPlaceholder")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="parent_id" label={t("orgadmin.form.parent")}>
            <Select
              showSearch
              placeholder={t("orgadmin.form.parentPlaceholder")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            >
              {getParentOptions().map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="image" label={t("orgadmin.form.photo")}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              customRequest={({ file }) => handleImageUpload(file)}
              onRemove={handleRemoveImage}
              accept="image/*"
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  {uploading ? <Spin /> : <FiUpload />}
                  <div style={{ marginTop: 8 }}>
                    {t("orgadmin.form.upload")}
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {previewImage && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">
                {t("orgadmin.form.photoPreview")}
              </h4>
              <div className="flex items-center space-x-4">
                <img
                  src={`${API_URL}uploads/${previewImage}`}
                  alt={t("orgadmin.form.previewAlt")}
                  className="h-20 w-20 object-cover rounded border border-gray-200"
                />
                <Button
                  type="text"
                  danger
                  icon={<FiX />}
                  onClick={handleRemoveImage}
                >
                  {t("orgadmin.form.removePhoto")}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default OrgAdmin;
