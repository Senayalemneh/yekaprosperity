import React, { useEffect, useState } from "react";
import {
  Tree,
  Card,
  Button,
  Input,
  Select,
  Upload,
  message,
  Form,
  Spin,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

export default function OrgStructureAdmin() {
  const [treeData, setTreeData] = useState([]);
  const [flatData, setFlatData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch tree data
  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/org-structure");
      setTreeData(formatTreeForAntd(res.data.data));
      setFlatData(flatten(res.data.data));
    } catch (err) {
      message.error("Failed to fetch organization structure");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTree();
  }, []);

  // Convert backend tree to AntD tree format
  const formatTreeForAntd = (nodes) =>
    nodes.map((node) => ({
      title: `${node.position} — ${node.name}`,
      key: node.id,
      children: node.children ? formatTreeForAntd(node.children) : [],
    }));

  // Convert tree to flat list
  const flatten = (nodes) => {
    let arr = [];
    nodes.forEach((n) => {
      arr.push(n);
      if (n.children && n.children.length) {
        arr = arr.concat(flatten(n.children));
      }
    });
    return arr;
  };

  // When selecting a node
  const onSelectNode = async (keys) => {
    if (!keys.length) return;
    const id = keys[0];

    try {
      const res = await axios.get(`/api/org-structure/${id}`);
      setSelectedNode(res.data.data);
      form.setFieldsValue(res.data.data);
      setImagePreview(res.data.data.image || null);
    } catch {
      message.error("Failed to load node details");
    }
  };

  // Save changes
  const updateNode = async () => {
    try {
      const values = await form.validateFields();

      await axios.put(`/api/org-structure/${selectedNode.id}`, values);

      message.success("Updated successfully");
      fetchTree();
    } catch (err) {
      message.error("Update failed");
    }
  };

  // Add new child node
  const addChild = async () => {
    if (!selectedNode) return message.warning("Select a parent first");

    try {
      const newNode = {
        name: "New Person",
        position: "New Position",
        parent_id: selectedNode.id,
        image: null,
      };

      await axios.post("/api/org-structure", newNode);

      message.success("Child added");
      fetchTree();
    } catch {
      message.error("Failed to add child");
    }
  };

  // Delete node
  const deleteNode = async () => {
    try {
      await axios.delete(`/api/org-structure/${selectedNode.id}`);
      message.success("Deleted");
      setSelectedNode(null);
      form.resetFields();
      fetchTree();
    } catch {
      message.error("Delete failed");
    }
  };

  // Upload image to your API server
  const uploadProps = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      form.setFieldValue("image", `/uploads/${file.name}`);

      return false; // prevent auto upload
    },
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 20 }}>
      {/* Tree Panel */}
      <Card
        title="Organization Tree"
        style={{ width: "30%", overflowY: "auto", borderRadius: 12 }}
        extra={
          <Button type="primary" onClick={addChild} icon={<PlusOutlined />}>
            Add Child
          </Button>
        }
      >
        {loading ? (
          <Spin />
        ) : (
          <Tree treeData={treeData} onSelect={onSelectNode} defaultExpandAll />
        )}
      </Card>

      {/* Details Panel */}
      <Card title="Details" style={{ flex: 1, borderRadius: 12 }}>
        {selectedNode ? (
          <Form layout="vertical" form={form}>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="Full name" />
            </Form.Item>

            <Form.Item
              label="Position"
              name="position"
              rules={[{ required: true }]}
            >
              <Input placeholder="Work position" />
            </Form.Item>

            <Form.Item label="Parent" name="parent_id">
              <Select allowClear placeholder="Select parent">
                <Option value={null}>No Parent (Top Level)</Option>
                {flatData
                  .filter((n) => n.id !== selectedNode.id)
                  .map((n) => (
                    <Option key={n.id} value={n.id}>
                      {n.position} — {n.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item label="Image" name="image">
              <Upload {...uploadProps} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{ width: 120, marginTop: 10, borderRadius: 10 }}
                />
              )}
            </Form.Item>

            <div style={{ display: "flex", gap: 10 }}>
              <Button type="primary" onClick={updateNode}>
                Save Changes
              </Button>

              <Popconfirm title="Are you sure?" onConfirm={deleteNode}>
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </Form>
        ) : (
          <p>Select a node from the tree to view details</p>
        )}
      </Card>
    </div>
  );
}
