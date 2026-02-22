import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  Button,
  Form,
  Input,
  message,
  Table,
  Modal,
  Image,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getApiUrl } from "../../utils/getApiUrl";
import { useTranslation } from "react-i18next"; // Import useTranslation

const OfficeManager = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  let apiUrl = getApiUrl();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [offices, setOffices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOffice, setCurrentOffice] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${apiUrl}api/addworeda`, { headers });
      setOffices(response.data);
    } catch (error) {
      console.error(t("officeManagerworeda.fetchError"), error);
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList.slice(-1));

  const handleUpdateFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("vision", values.vision);
    formData.append("mission", values.mission);
    formData.append("coreValues", values.coreValues);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("email", values.email);
    formData.append("address", values.address);
    formData.append("floor", values.floor);
    formData.append("location", values.location);
    if (fileList.length > 0) {
      formData.append("logo", fileList[0].originFileObj);
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      if (editId) {
        await axios.put(`${apiUrl}api/addworeda/${editId}`, formData, {
          headers,
        });
        message.success(t("officeManagerworeda.updateSuccess"));
        setEditId(null);
      } else {
        await axios.post(`${apiUrl}api/addworeda`, formData, { headers });
        message.success(t("officeManagerworeda.addSuccess"));
      }
      form.resetFields();
      setFileList([]);
      fetchOffices();
    } catch (error) {
      console.error(t("officeManagerworeda.submitError"), error);
      message.error(
        editId
          ? t("officeManagerworeda.updateFailed")
          : t("officeManagerworeda.addFailed")
      );
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const values = await updateForm.validateFields();
      const updatedData = { ...values };
      if (imageFile) updatedData.logo = imageFile;

      const formData = new FormData();
      formData.append("name", updatedData.name);
      formData.append("vision", updatedData.vision);
      formData.append("mission", updatedData.mission);
      formData.append("coreValues", updatedData.coreValues);
      formData.append("phoneNumber", updatedData.phoneNumber);
      formData.append("email", updatedData.email);
      formData.append("address", updatedData.address);
      formData.append("floor", updatedData.floor);
      formData.append("location", updatedData.location);
      if (imageFile) formData.append("logo", updatedData.logo);

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      await axios.put(
        `${apiUrl}api/addworeda/${currentOffice._id}`,
        formData,
        { headers }
      );

      message.success(t("officeManagerworeda.updateSuccess"));
      setIsModalVisible(false);
      fetchOffices();
    } catch (error) {
      console.error(t("officeManagerworeda.validationFailed"), error);
    }
  };

  const handleUpdate = (record) => {
    updateForm.setFieldsValue({
      name: record.name,
      vision: record.vision,
      mission: record.mission,
      coreValues: record.coreValues,
      phoneNumber: record.phoneNumber,
      email: record.email,
      address: record.address,
      floor: record.floor,
      location: record.location,
    });
    setCurrentOffice(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(`${apiUrl}api/addworeda/${id}`, { headers });

      message.success(t("officeManagerworeda.deleteSuccess"));
      fetchOffices();
    } catch (error) {
      console.error(t("officeManagerworeda.deleteError"), error);
      message.error(t("officeManagerworeda.deleteFailed"));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentOffice(null);
    setImageFile(null);
  };

  const viewOffice = (record) => {
    Modal.info({
      title: t("officeManagerworeda.viewOfficeTitle"),
      content: (
        <div>
          <p>
            <strong>{t("officeManagerworeda.nameLabel")}:</strong> {record.name}
          </p>
          <p>
            <strong>{t("officeManagerworeda.visionLabel")}:</strong> {record.vision}
          </p>
          <p>
            <strong>{t("officeManagerworeda.missionLabel")}:</strong> {record.mission}
          </p>
          <p>
            <strong>{t("officeManagerworeda.coreValuesLabel")}:</strong> {record.coreValues}
          </p>
          <p>
            <strong>{t("officeManagerworeda.phoneNumberLabel")}:</strong> {record.phoneNumber}
          </p>
          <p>
            <strong>{t("officeManagerworeda.emailLabel")}:</strong> {record.email}
          </p>
          <p>
            <strong>{t("officeManagerworeda.addressLabel")}:</strong> {record.address}
          </p>
          <p>
            <strong>{t("officeManagerworeda.floorLabel")}:</strong> {record.floor}
          </p>
          <p>
            <strong>{t("officeManagerworeda.locationLabel")}:</strong> {record.location}
          </p>
          {record.logo && (
            <Image
              src={`${apiUrl}uploads/Woredas/${record.logo}`}
              alt="Logo"
              style={{ width: "100%", maxHeight: "400px" }}
            />
          )}
        </div>
      ),
      width: 800,
      onOk() {},
    });
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: t("officeManagerworeda.confirmDeleteTitle"),
      content: t("officeManagerworeda.confirmDeleteContent"),
      okText: t("officeManagerworeda.deleteButton"),
      okType: "danger",
      cancelText: t("officeManagerworeda.cancelButton"),
      onOk() {
        handleDelete(id);
      },
    });
  };

  const columns = [
    {
      title: t("officeManagerworeda.nameLabel"),
      dataIndex: "name",
      key: "name",
      render: (text) => text.substring(0, 20) + (text.length > 20 ? "..." : ""),
    },
    {
      title: t("officeManagerworeda.floorLabel"),
      dataIndex: "floor",
      key: "floor",
    },
    {
      title: t("officeManagerworeda.logoLabel"),
      dataIndex: "logo",
      key: "logo",
      render: (logo) =>
        logo ? (
          <Image
            width={100}
            src={`${apiUrl}uploads/Woredas/${logo}`}
            alt="Office Logo"
          />
        ) : (
          t("officeManagerworeda.noLogo")
        ),
    },
    {
      title: t("officeManagerworeda.actionsLabel"),
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="default"
            className="bg-blue-600 p-2 text-white"
            onClick={() => viewOffice(record)}
            style={{ marginRight: 8 }}
          >
            <EyeOutlined />
          </Button>
          <Button
            type="default"
            className="bg-green-700 p-2 text-white"
            onClick={() => handleUpdate(record)}
            style={{ marginRight: 8 }}
          >
            <EditOutlined />
          </Button>
          <Button
            type="default"
            className="bg-red-600 p-2 text-white"
            onClick={() => confirmDelete(record._id)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label={t("officeManagerworeda.nameLabel")}
          rules={[{ required: true, message: t("officeManagerworeda.nameRequired") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="vision"
          label={t("officeManagerworeda.visionLabel")}
          rules={[{ required: true, message: t("officeManagerworeda.visionRequired") }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item
          name="mission"
          label={t("officeManagerworeda.missionLabel")}
          rules={[{ required: true, message: t("officeManagerworeda.missionRequired") }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item
          name="coreValues"
          label={t("officeManagerworeda.coreValuesLabel")}
          rules={[{ required: true, message: t("officeManagerworeda.coreValuesRequired") }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label={t("officeManagerworeda.phoneNumberLabel")}
          rules={[{ required: true, message: t("officeManagerworeda.phoneNumberRequired") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label={t("officeManagerworeda.emailLabel")}
          rules={[{ required: true, message: t("officeManagerworeda.emailRequired") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label={t("officeManagerworeda.addressLabel")}
          rules={[{ required: true, message: t("officeManagerworeda.addressRequired") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="floor"
          label={t("officeManagerworeda.floorLabel")}
          rules={[{ required: true, message: t("officeManagerworeda.floorRequired") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="location"
          label={t("officeManagerworeda.locationLabel")}
          rules={[{ required: true, message: t("officeManagerworeda.locationRequired") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t("officeManagerworeda.logoLabel")}>
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>{t("officeManagerworeda.uploadButton")}</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("officeManagerworeda.submitButton")}
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
        title={t("officeManagerworeda.updateOfficeTitle")}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleUpdateSubmit}
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item
            name="name"
            label={t("officeManagerworeda.nameLabel")}
            rules={[{ required: true, message: t("officeManagerworeda.nameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vision"
            label={t("officeManagerworeda.visionLabel")}
            rules={[{ required: true, message: t("officeManagerworeda.visionRequired") }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="mission"
            label={t("officeManagerworeda.missionLabel")}
            rules={[{ required: true, message: t("officeManagerworeda.missionRequired") }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="coreValues"
            label={t("officeManagerworeda.coreValuesLabel")}
            rules={[{ required: true, message: t("officeManagerworeda.coreValuesRequired") }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={t("officeManagerworeda.phoneNumberLabel")}
            rules={[{ required: true, message: t("officeManagerworeda.phoneNumberRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label={t("officeManagerworeda.emailLabel")}
            rules={[{ required: true, message: t("officeManagerworeda.emailRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label={t("officeManagerworeda.addressLabel")}
            rules={[{ required: true, message: t("officeManagerworeda.addressRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="floor"
            label={t("officeManagerworeda.floorLabel")}
            rules={[{ required: true, message: t("officeManagerworeda.floorRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label={t("officeManagerworeda.locationLabel")}
            rules={[{ required: true, message: t("officeManagerworeda.locationRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={t("officeManagerworeda.logoLabel")}>
            <input type="file" onChange={handleUpdateFileChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficeManager;