import React, { useState } from "react";
import { Form, Input, Button, Select, message, Card } from "antd";
// import { UserAddOutlined } from 'react-icons/ai';
import axios from "axios";

const { Option } = Select;

const UserRegisterForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post("https://yekawebapi.yekasubcity.com/api/users", values); // change port if needed
      message.success("User registered successfully!");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to register user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-xl shadow-2xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-blue-600">
          Register New User
        </h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="User Name"
            name="user_name"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input placeholder="johndoe123" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Choose a role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="moderator">Moderator</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserRegisterForm;
