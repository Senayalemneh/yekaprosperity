// src/components/DataTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Button, Modal, Table, Form, Input, InputNumber, Select } from 'antd';
import { getApiUrl } from "../../utils/getApiUrl"; // Get API URL

const { Option } = Select;

const DataTable = () => {
  let apiUrl = getApiUrl();
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [form] = Form.useForm();

  const categories = [
    'House Data',
    'Health Facilities',
    'Government and Personal Buildings',
    'Buildings',
    'Gender Distribution',
    'Area'
  ];

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Fetch data from backend
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const headers = { Authorization: `Bearer ${token}` }; // Add Authorization header
    
        const response = await axios.get(`${apiUrl}/api/data`, { headers });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.post(`${apiUrl}/api/data`, values, { headers });
      setData([...data, response.data]);
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };
  
  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.put(`${apiUrl}/api/data/${currentData._id}`, values, { headers });
      setData(data.map(item => (item._id === currentData._id ? response.data : item)));
      form.resetFields();
      setIsModalVisible(false);
      setCurrentData(null);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
  
      await axios.delete(`${apiUrl}/api/data/${id}`, { headers });
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const showModal = (record = null) => {
    setCurrentData(record);
    form.setFieldsValue(record || {});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentData(null);
  };

  const columns = [
    {
      title: t('dataTable.columns.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('dataTable.columns.value'),
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: t('dataTable.columns.category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: t('dataTable.columns.actions'),
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => showModal(record)} style={{ marginRight: 8 }}>
            {t('dataTable.actions.edit')}
          </Button>
          <Button type="danger" onClick={() => handleDelete(record._id)}>
            {t('dataTable.actions.delete')}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className=" p-4 bg-[#00CAFF]">
      <h1 className="text-3xl font-bold mb-8 text-center text-white" data-aos="fade-up">
        {t('dataTable.title')}
      </h1>

      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        {t('dataTable.actions.addNewData')}
      </Button>

      <Table columns={columns} dataSource={data} rowKey="_id" />

      <Modal
        title={currentData ? t('dataTable.modal.editTitle') : t('dataTable.modal.addTitle')}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={currentData || {}}
          onFinish={currentData ? handleUpdate : handleCreate}
        >
          <Form.Item
            name="name"
            label={t('dataTable.form.name')}
            rules={[{ required: true, message: t('dataTable.form.nameRequired') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="value"
            label={t('dataTable.form.value')}
            rules={[{ required: true, message: t('dataTable.form.valueRequired') }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="category"
            label={t('dataTable.form.category')}
            rules={[{ required: true, message: t('dataTable.form.categoryRequired') }]}
          >
            <Select>
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentData ? t('dataTable.actions.update') : t('dataTable.actions.create')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTable;