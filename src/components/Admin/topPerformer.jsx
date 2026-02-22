import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
  Upload,
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
  Image,
  Alert,
  Statistic,
  Descriptions,
  Progress,
} from "antd";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiX,
  FiCheck,
  FiGlobe,
  FiBarChart2,
  FiCalendar,
  FiAward,
} from "react-icons/fi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../../utils/getApiUrl";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Countdown } = Statistic;

const BACKEND_URL = getApiUrl();

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

const statusOptions = [
  { value: "active", label: "Active", color: "green" },
  { value: "archived", label: "Archived", color: "gray" },
];

const periodOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half-yearly", label: "Half-Yearly" },
  { value: "yearly", label: "Yearly" },
];

const TopPerformerAdmin = () => {
  const { t } = useTranslation();
  const [performers, setPerformers] = useState([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterStatus, setFilterStatus] = useState("active");
  const [filterPeriod, setFilterPeriod] = useState(null);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("performers");

  const fetchPerformers = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BACKEND_URL}api/top-performers`;
      const params = new URLSearchParams();

      if (filterStatus) params.append("status", filterStatus);
      if (filterPeriod) params.append("period", filterPeriod);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await axios.get(url);
      setPerformers(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.error || err.message || t("topperformer.fetchError")
      );
      message.error(t("topperformer.fetchErrorMessage"));
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceReport = async () => {
    setReportLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}api/top-performers/reports/performance`,
        {
          params: { periodType: "monthly" },
        }
      );
      setReportData(res.data.data);
    } catch (err) {
      console.error("Report error:", err);
      message.error(t("topperformer.reportError"));
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "performers") {
      fetchPerformers();
    } else if (activeTab === "reports") {
      fetchPerformanceReport();
    }
  }, [filterStatus, filterPeriod, activeTab]);

  const handleImageUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    setUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${BACKEND_URL}upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const fullImageUrl = getFullImageUrl(res.data.path);
        form.setFieldsValue({ image: res.data.path });
        setPreviewImage(fullImageUrl);
        onSuccess("Upload successful", file);
        message.success(t("topperformer.imageSuccess"));
      } else {
        throw new Error(res.data.message || t("topperformer.uploadFailed"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        t("topperformer.imageUploadFailed");
      onError(new Error(errorMsg));
      message.error(errorMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const values = await form.validateFields();

      const data = {
        name: {
          en: values.name_en || "",
          am: values.name_am || values.name_en || "",
          or: values.name_or || values.name_en || "",
        },
        position: {
          en: values.position_en || "",
          am: values.position_am || values.position_en || "",
          or: values.position_or || values.position_en || "",
        },
        image: values.image,
        result: Number(values.result),
        performance_period: values.performance_period || "monthly",
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
          `${BACKEND_URL}api/top-performers/${editingItem.id}`,
          data,
          config
        );
        message.success(t("topperformer.updateSuccess"));
      } else {
        response = await axios.post(
          `${BACKEND_URL}api/top-performers`,
          data,
          config
        );
        message.success(t("topperformer.createSuccess"));
      }

      fetchPerformers();
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      setPreviewImage(null);
    } catch (err) {
      console.error("Form submission error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        t("topperformer.operationFailed");
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/top-performers/${id}`);
      message.success(t("topperformer.deleteSuccess"));
      fetchPerformers();
    } catch (err) {
      console.error("Delete error:", err);
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("topperformer.deleteFailed")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchivePastPerformers = async () => {
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}api/top-performers/actions/archive-past`
      );
      message.success(
        t("topperformer.archiveSuccess", { count: res.data.count })
      );
      fetchPerformers();
    } catch (err) {
      console.error("Archive error:", err);
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("topperformer.archiveFailed")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      name_en: record.name?.en || "",
      name_am: record.name?.am || "",
      name_or: record.name?.or || "",
      position_en: record.position?.en || "",
      position_am: record.position?.am || "",
      position_or: record.position?.or || "",
      image: record.image,
      result: record.result,
      performance_period: record.performance_period || "monthly",
      status: record.status || "active",
    });
    setPreviewImage(record.image);
    setIsModalOpen(true);
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BACKEND_URL}uploads/${path}`;
  };

  const getTimeRemaining = (endDate) => {
    if (!endDate) return null;
    const end = moment(endDate);
    const now = moment();
    return end.diff(now);
  };

  const columns = [
    {
      title: t("topperformer.columns.image"),
      dataIndex: "image",
      render: (text, record) => (
        <div className="flex justify-center">
          {text ? (
            <Avatar
              shape="square"
              src={getFullImageUrl(text)}
              size={64}
              className="rounded-lg shadow-sm"
            />
          ) : (
            <Avatar
              shape="square"
              size={64}
              icon={<FiAward />}
              className="bg-gray-100 rounded-lg"
            />
          )}
        </div>
      ),
    },
    {
      title: t("topperformer.columns.name"),
      dataIndex: "name",
      render: (name) => (
        <div>
          <div className="font-medium">
            {name?.en || t("topperformer.noName")}
          </div>
          <div className="text-xs text-gray-500">
            {name?.am && <span className="mr-2">🇪🇹 {name.am}</span>}
            {name?.or && <span>🇪🇹 {name.or}</span>}
          </div>
        </div>
      ),
      sorter: (a, b) => (a.name?.en || "").localeCompare(b.name?.en || ""),
    },
    {
      title: t("topperformer.columns.position"),
      dataIndex: "position",
      render: (position) => (
        <div>
          <div>{position?.en || t("topperformer.noPosition")}</div>
          <div className="text-xs text-gray-500">
            {position?.am && <span className="mr-2">🇪🇹 {position.am}</span>}
            {position?.or && <span>🇪🇹 {position.or}</span>}
          </div>
        </div>
      ),
    },
    {
      title: t("topperformer.columns.result"),
      dataIndex: "result",
      render: (result) => (
        <Progress
          percent={result}
          status="active"
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
          format={(percent) => `${percent}%`}
        />
      ),
      sorter: (a, b) => a.result - b.result,
    },
    {
      title: t("topperformer.columns.period"),
      dataIndex: "performance_period",
      render: (period) => (
        <Tag color="blue" className="capitalize">
          {period}
        </Tag>
      ),
      filters: periodOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.performance_period === value,
    },
    {
      title: t("topperformer.columns.status"),
      dataIndex: "status",
      render: (status, record) => {
        const statusObj = statusOptions.find((opt) => opt.value === status);
        return (
          <div>
            <Badge
              color={statusObj?.color || "gray"}
              text={statusObj?.label || status}
            />
            {status === "active" && record.end_date && (
              <div className="text-xs text-gray-500">
                <Countdown
                  value={Date.now() + getTimeRemaining(record.end_date)}
                  format="D [days] H [hours]"
                />
              </div>
            )}
          </div>
        );
      },
      filters: statusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t("topperformer.columns.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("topperformer.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("topperformer.deleteConfirm.title")}
            description={t("topperformer.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("topperformer.yes")}
            cancelText={t("topperformer.no")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("topperformer.delete")}>
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

  const renderReport = () => {
    if (reportLoading) {
      return <Spin size="large" />;
    }

    if (!reportData || reportData.length === 0) {
      return <Alert message={t("topperformer.noReportData")} type="info" />;
    }

    return (
      <div className="space-y-6">
        {reportData.map((report, index) => (
          <Card
            key={index}
            title={`${report.performance_period} ${t(
              "topperformer.report"
            )} - ${report.year}`}
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label={t("topperformer.totalPerformers")}>
                {report.total_performers}
              </Descriptions.Item>
              <Descriptions.Item label={t("topperformer.averageResult")}>
                {Math.round(report.average_result)}%
              </Descriptions.Item>
              <Descriptions.Item label={t("topperformer.highestResult")}>
                {report.max_result}%
              </Descriptions.Item>
              <Descriptions.Item label={t("topperformer.lowestResult")}>
                {report.min_result}%
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <h3 className="text-lg font-medium mb-4">
              {t("topperformer.topPerformers")}
            </h3>
            <Table
              columns={columns.filter((col) =>
                ["name", "position", "result"].includes(col.dataIndex)
              )}
              dataSource={performers
                .filter(
                  (p) =>
                    p.performance_period === report.performance_period &&
                    p.status === "active"
                )
                .slice(0, 5)}
              rowKey="id"
              pagination={false}
            />
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl ">
      <Card
        title={
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {t("topperformer.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingItem(null);
                  setPreviewImage(null);
                  setError(null);
                  setIsModalOpen(true);
                }}
              >
                {t("topperformer.addPerformer")}
              </Button>
              <Button
                type="default"
                icon={<FiBarChart2 />}
                onClick={() =>
                  setActiveTab(
                    activeTab === "performers" ? "reports" : "performers"
                  )
                }
              >
                {activeTab === "performers"
                  ? t("topperformer.viewReports")
                  : t("topperformer.viewPerformers")}
              </Button>
              {activeTab === "performers" && (
                <Button
                  type="default"
                  icon={<FiCalendar />}
                  onClick={handleArchivePastPerformers}
                  loading={actionLoading}
                >
                  {t("topperformer.archivePast")}
                </Button>
              )}
            </div>
          </div>
        }
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          activeTab === "performers" ? (
            <Space>
              <Select
                placeholder={t("topperformer.filterStatus")}
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
              <Select
                placeholder={t("topperformer.filterPeriod")}
                allowClear
                onChange={setFilterPeriod}
                style={{ width: 150 }}
              >
                {periodOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Space>
          ) : null
        }
        tabList={[
          {
            key: "performers",
            tab: (
              <span>
                <AiOutlineUnorderedList className="mr-1" />{" "}
                {t("topperformer.performers")}
              </span>
            ),
          },
          {
            key: "reports",
            tab: (
              <span>
                <FiBarChart2 className="mr-1" /> {t("topperformer.reports")}
              </span>
            ),
          },
        ]}
        activeTabKey={activeTab}
        onTabChange={setActiveTab}
      >
        {loading ? (
          <div className="flex justify-center p-8">
            <Spin size="large" />
          </div>
        ) : activeTab === "performers" ? (
          <Table
            columns={columns}
            dataSource={performers}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) =>
                t("topperformer.totalPerformersCount", { total }),
            }}
          />
        ) : (
          renderReport()
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            {editingItem ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("topperformer.editPerformer")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("topperformer.addPerformer")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setError(null);
        }}
        onOk={handleFormSubmit}
        okText={
          editingItem ? t("topperformer.update") : t("topperformer.create")
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
        width={800}
        destroyOnClose
      >
        <Divider />
        {error && (
          <Alert
            message={t("topperformer.error")}
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
                label={t("topperformer.form.status")}
                initialValue="active"
                rules={[
                  {
                    required: true,
                    message: t("topperformer.form.statusRequired"),
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
            <Col span={12}>
              <Form.Item
                name="performance_period"
                label={t("topperformer.form.performancePeriod")}
                initialValue="monthly"
                rules={[
                  {
                    required: true,
                    message: t("topperformer.form.periodRequired"),
                  },
                ]}
              >
                <Select>
                  {periodOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="image"
                label={t("topperformer.form.profileImage")}
                rules={[
                  {
                    required: true,
                    message: t("topperformer.form.imageRequired"),
                  },
                ]}
              >
                <div className="space-y-4">
                  <Upload
                    name="image"
                    showUploadList={false}
                    customRequest={handleImageUpload}
                    accept="image/*"
                    disabled={uploadingImage}
                    className="w-full"
                  >
                    <Button
                      icon={<FiUpload />}
                      loading={uploadingImage}
                      block
                      className="h-12"
                    >
                      {uploadingImage
                        ? t("topperformer.uploading")
                        : t("topperformer.form.uploadProfileImage")}
                    </Button>
                  </Upload>

                  {previewImage && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={getFullImageUrl(previewImage)}
                        alt="preview"
                        className="max-h-40 rounded-lg border border-gray-200 p-1"
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="result"
                label={t("topperformer.form.performanceResult")}
                rules={[
                  {
                    required: true,
                    message: t("topperformer.form.resultRequired"),
                  },
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    transform: (value) => Number(value),
                    message: t("topperformer.form.resultRange"),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace("%", "")}
                />
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
                    {t("topperformer.language")}:{" "}
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

          {languages.map(
            (lang) =>
              lang.code !== activeLanguage && (
                <React.Fragment key={lang.code}>
                  <Form.Item name={`name_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={`position_${lang.code}`} hidden>
                    <Input />
                  </Form.Item>
                </React.Fragment>
              )
          )}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`name_${activeLanguage}`}
                label={`${t("topperformer.form.name")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("topperformer.form.englishNameRequired"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("topperformer.form.enterName")} ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={`position_${activeLanguage}`}
                label={`${t("topperformer.form.position")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t(
                            "topperformer.form.englishPositionRequired"
                          ),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("topperformer.form.enterPosition")} ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default TopPerformerAdmin;
