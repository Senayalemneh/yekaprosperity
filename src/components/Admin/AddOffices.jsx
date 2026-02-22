import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Button, Form, Input, message, Table, Modal, Image } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getApiUrl } from "../../utils/getApiUrl";
import { useTranslation } from 'react-i18next'; // Import useTranslation

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
      const response = await axios.get(`${apiUrl}api/addoffice`, { headers });
      setOffices(response.data);
    } catch (error) {
      console.error(t('officeManager.fetchError'), error);
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList.slice(-1));

  const handleUpdateFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('vision', values.vision);
    formData.append('mission', values.mission);
    formData.append('coreValues', values.coreValues);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('email', values.email);
    formData.append('address', values.address);
    formData.append('floor', values.floor);
    if (fileList.length > 0) {
      formData.append('logo', fileList[0].originFileObj);
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      if (editId) {
        await axios.put(`${apiUrl}api/addoffice/${editId}`, formData, { headers });
        message.success(t('officeManager.updateSuccess'));
        setEditId(null);
      } else {
        await axios.post(`${apiUrl}api/addoffice`, formData, { headers });
        message.success(t('officeManager.addSuccess'));
      }
      form.resetFields();
      setFileList([]);
      fetchOffices();
    } catch (error) {
      console.error(t('officeManager.submitError'), error);
      message.error(editId ? t('officeManager.updateFailed') : t('officeManager.addFailed'));
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const values = await updateForm.validateFields();
      const updatedData = { ...values };
      if (imageFile) updatedData.logo = imageFile;

      const formData = new FormData();
      formData.append('name', updatedData.name);
      formData.append('vision', updatedData.vision);
      formData.append('mission', updatedData.mission);
      formData.append('coreValues', updatedData.coreValues);
      formData.append('phoneNumber', updatedData.phoneNumber);
      formData.append('email', updatedData.email);
      formData.append('address', updatedData.address);
      formData.append('floor', updatedData.floor);
      if (imageFile) formData.append('logo', updatedData.logo);

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      await axios.put(`${apiUrl}api/addoffice/${currentOffice._id}`, formData, { headers });

      message.success(t('officeManager.updateSuccess'));
      setIsModalVisible(false);
      fetchOffices();
    } catch (error) {
      console.error(t('officeManager.validationFailed'), error);
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

      await axios.delete(`${apiUrl}api/addoffice/${id}`, { headers });

      message.success(t('officeManager.deleteSuccess'));
      fetchOffices();
    } catch (error) {
      console.error(t('officeManager.deleteError'), error);
      message.error(t('officeManager.deleteFailed'));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentOffice(null);
    setImageFile(null);
  };

  const viewOffice = (record) => {
    Modal.info({
      title: t('officeManager.viewModal.title'),
      content: (
        <div>
          <p><strong>{t('officeManager.viewModal.name')}:</strong> {record.name}</p>
          <p><strong>{t('officeManager.viewModal.vision')}:</strong> {record.vision}</p>
          <p><strong>{t('officeManager.viewModal.mission')}:</strong> {record.mission}</p>
          <p><strong>{t('officeManager.viewModal.coreValues')}:</strong> {record.coreValues}</p>
          <p><strong>{t('officeManager.viewModal.phoneNumber')}:</strong> {record.phoneNumber}</p>
          <p><strong>{t('officeManager.viewModal.email')}:</strong> {record.email}</p>
          <p><strong>{t('officeManager.viewModal.address')}:</strong> {record.address}</p>
          <p><strong>{t('officeManager.viewModal.floor')}:</strong> {record.floor}</p>
          {record.logo && <Image src={`${apiUrl}/uploads/Offices/${record.logo}`} alt="Logo" style={{ width: '100%', maxHeight: '400px' }} />}
        </div>
      ),
      width: 800,
      onOk() {},
    });
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: t('officeManager.deleteModal.title'),
      content: t('officeManager.deleteModal.content'),
      okText: t('officeManager.deleteModal.okText'),
      okType: 'danger',
      cancelText: t('officeManager.deleteModal.cancelText'),
      onOk() {
        handleDelete(id);
      },
    });
  };

  const columns = [
    {
      title: t('officeManager.columns.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => text.substring(0, 20) + (text.length > 20 ? '...' : ''),
    },
    {
      title: t('officeManager.columns.floor'),
      dataIndex: 'floor',
      key: 'floor',
    },
    {
      title: t('officeManager.columns.logo'),
      dataIndex: 'logo',
      key: 'logo',
      render: (logo) => (
        logo ? <Image width={100} src={`${apiUrl}/uploads/Offices/${logo}`} alt="Office Logo" /> : t('officeManager.columns.noLogo')
      ),
    },
    {
      title: t('officeManager.columns.actions'),
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button type="default" className='bg-blue-600 p-2 text-white' onClick={() => viewOffice(record)} style={{ marginRight: 8 }}>
            <EyeOutlined />
          </Button>
          <Button type="default" className='bg-green-700 p-2 text-white' onClick={() => handleUpdate(record)} style={{ marginRight: 8 }}>
            <EditOutlined />
          </Button>
          <Button type="default" className='bg-red-600 p-2 text-white' onClick={() => confirmDelete(record._id)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label={t('officeManager.form.nameLabel')} rules={[{ required: true, message: t('officeManager.form.nameRequired') }]}>
          <Input />
        </Form.Item>
        <Form.Item name="vision" label={t('officeManager.form.visionLabel')} rules={[{ required: true, message: t('officeManager.form.visionRequired') }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="mission" label={t('officeManager.form.missionLabel')} rules={[{ required: true, message: t('officeManager.form.missionRequired') }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="coreValues" label={t('officeManager.form.coreValuesLabel')} rules={[{ required: true, message: t('officeManager.form.coreValuesRequired') }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="phoneNumber" label={t('officeManager.form.phoneNumberLabel')} rules={[{ required: true, message: t('officeManager.form.phoneNumberRequired') }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label={t('officeManager.form.emailLabel')} rules={[{ required: true, message: t('officeManager.form.emailRequired') }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label={t('officeManager.form.addressLabel')} rules={[{ required: true, message: t('officeManager.form.addressRequired') }]}>
          <Input />
        </Form.Item>
        <Form.Item name="floor" label={t('officeManager.form.floorLabel')} rules={[{ required: true, message: t('officeManager.form.floorRequired') }]}>
          <Input />
        </Form.Item>
        <Form.Item label={t('officeManager.form.logoLabel')}>
          <Upload fileList={fileList} onChange={handleFileChange} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>{t('officeManager.form.uploadButton')}</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">{t('officeManager.form.submitButton')}</Button>
        </Form.Item>
      </Form>

      <Table columns={columns} dataSource={offices} rowKey="_id" style={{ marginTop: 20 }} />

      <Modal
        title={t('officeManager.updateModal.title')}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleUpdateSubmit}
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item name="name" label={t('officeManager.form.nameLabel')} rules={[{ required: true, message: t('officeManager.form.nameRequired') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="vision" label={t('officeManager.form.visionLabel')} rules={[{ required: true, message: t('officeManager.form.visionRequired') }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="mission" label={t('officeManager.form.missionLabel')} rules={[{ required: true, message: t('officeManager.form.missionRequired') }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="coreValues" label={t('officeManager.form.coreValuesLabel')} rules={[{ required: true, message: t('officeManager.form.coreValuesRequired') }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="phoneNumber" label={t('officeManager.form.phoneNumberLabel')} rules={[{ required: true, message: t('officeManager.form.phoneNumberRequired') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label={t('officeManager.form.emailLabel')} rules={[{ required: true, message: t('officeManager.form.emailRequired') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label={t('officeManager.form.addressLabel')} rules={[{ required: true, message: t('officeManager.form.addressRequired') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="floor" label={t('officeManager.form.floorLabel')} rules={[{ required: true, message: t('officeManager.form.floorRequired') }]}>
            <Input />
          </Form.Item>
          <Form.Item label={t('officeManager.form.logoLabel')}>
            <input type="file" onChange={handleUpdateFileChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficeManager;