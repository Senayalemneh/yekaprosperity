import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Input, message, Table, Modal } from "antd";
import { getApiUrl } from "../../utils/getApiUrl";
import { useTranslation } from "react-i18next"; // Import useTranslation

const OfficeManager = () => {
  const { t } = useTranslation(); // Hook for translation
  let apiUrl = getApiUrl();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [offices, setOffices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOffice, setCurrentOffice] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${apiUrl}api/offices`, { headers });
      setOffices(response.data);
    } catch (error) {
      console.error(t("officeManagertwo.fetchError"), error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (editId) {
        await axios.patch(`${apiUrl}api/offices/${editId}`, values, { headers });
        message.success(t("officeManagertwo.updateSuccess"));
        setEditId(null);
      } else {
        await axios.post(`${apiUrl}api/offices`, values, { headers });
        message.success(t("officeManagertwo.addSuccess"));
      }
      form.resetFields();
      fetchOffices();
    } catch (error) {
      console.error(t("officeManagertwo.submitError"), error);
      message.error(
        editId
          ? t("officeManagertwo.updateFailed")
          : t("officeManagertwo.addFailed")
      );
    }
  };

  const handleUpdate = (record) => {
    updateForm.setFieldsValue({
      floor: record.floor,
      offices: record.offices.join(", "),
    });
    setCurrentOffice(record);
    setEditId(record._id);
    setIsModalVisible(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const values = await updateForm.validateFields();
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.patch(`${apiUrl}api/offices/${currentOffice._id}`, values, {
        headers,
      });
      message.success(t("officeManagertwo.updateSuccess"));
      setIsModalVisible(false);
      fetchOffices();
    } catch (error) {
      console.error(t("officeManagertwo.validationFailed"), error);
      message.error(t("officeManagertwo.updateFailed"));
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${apiUrl}api/offices/${id}`, { headers });
      message.success(t("officeManagertwo.deleteSuccess"));
      fetchOffices();
    } catch (error) {
      console.error(t("officeManagertwo.deleteError"), error);
      message.error(t("officeManagertwo.deleteFailed"));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentOffice(null);
    setEditId(null);
  };

  const columns = [
    {
      title: t("officeManagertwo.floorLabel"),
      dataIndex: "floor",
      key: "floor",
    },
    {
      title: t("officeManagertwo.officesLabel"),
      dataIndex: "offices",
      key: "offices",
      render: (offices) => offices.join(", "),
    },
    {
      title: t("officeManagertwo.actionsLabel"),
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="default"
            className="bg-blue-600 p-2 text-white"
            onClick={() => handleUpdate(record)}
            style={{ marginRight: 8 }}
          >
            {t("officeManagertwo.updateButton")}
          </Button>
          <Button
            type="default"
            className="bg-red-600 p-2 text-white"
            onClick={() => handleDelete(record._id)}
          >
            {t("officeManagertwo.deleteButton")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="floor"
          label={t("officeManagertwo.floorLabel")}
          rules={[{ required: true, message: t("officeManagertwo.floorRequired") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="offices"
          label={t("officeManagertwo.officesLabel")}
          rules={[{ required: true, message: t("officeManagertwo.officesRequired") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("officeManagertwo.submitButton")}
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={offices}
        rowKey="_id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title={t("officeManagerworeda.updateModalTitle")}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleUpdateSubmit}
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item
            name="floor"
            label={t("officeManagertwo.floorLabel")}
            rules={[{ required: true, message: t("officeManagertwo.floorRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="offices"
            label={t("officeManagertwo.officesLabel")}
            rules={[{ required: true, message: t("officeManagertwo.officesRequired") }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficeManager;