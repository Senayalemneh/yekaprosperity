import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
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
  Alert,
  InputNumber,
} from "antd";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiX,
  FiCheck,
  FiGlobe,
  FiUser,
  FiMapPin,
  FiFlag,
  FiLink,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import {
  MdOutlineImageNotSupported,
  MdOutlineDescription,
} from "react-icons/md";
import { BsGrid, BsFileEarmarkPdf } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaBirthdayCake } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../../utils/getApiUrl";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const BACKEND_URL = getApiUrl();

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "or", name: "Oromo", flag: "🇪🇹" },
];

// Multilingual election types
const electionTypeOptions = [
  {
    value: "Parliament",
    label: { en: "Parliament", am: "ፓርላማ", or: "Paarlamaa" },
    icon: "🏛️",
  },
  {
    value: "Regional Council",
    label: {
      en: "Regional Council",
      am: "ክልል ምክር ቤት",
      or: "Manni Maree Naannoo",
    },
    icon: "🏢",
  },
  {
    value: "City Mayor",
    label: { en: "City Mayor", am: "ከንቲባ", or: "Kaantiba" },
    icon: "🏙️",
  },
  {
    value: "Zonal Council",
    label: { en: "Zonal Council", am: "ዞን ምክር ቤት", or: "Manni Maree Godinaa" },
    icon: "🗺️",
  },
  {
    value: "Woreda Council",
    label: { en: "Woreda Council", am: "ወረዳ ምክር ቤት", or: "Manni Maree Aanaa" },
    icon: "🏘️",
  },
];

// Multilingual regions
const regionOptions = [
  {
    value: "Addis Ababa",
    label: { en: "Addis Ababa", am: "አዲስ አበባ", or: "Finfinnee" },
    icon: "🏙️",
  },
  {
    value: "Afar",
    label: { en: "Afar", am: "አፋር", or: "Afar" },
    icon: "🏜️",
  },
  {
    value: "Amhara",
    label: { en: "Amhara", am: "አማራ", or: "Amhaaraa" },
    icon: "⛰️",
  },
  {
    value: "Benishangul-Gumuz",
    label: {
      en: "Benishangul-Gumuz",
      am: "ቤንሻንጉል ጉሙዝ",
      or: "Benishaangul-Gumuz",
    },
    icon: "🌳",
  },
  {
    value: "Dire Dawa",
    label: { en: "Dire Dawa", am: "ድሬ ዳዋ", or: "Dirree Dhawaa" },
    icon: "🏛️",
  },
  {
    value: "Gambela",
    label: { en: "Gambela", am: "ጋምቤላ", or: "Gambellaa" },
    icon: "🌴",
  },
  {
    value: "Harari",
    label: { en: "Harari", am: "ሐረሪ", or: "Hararii" },
    icon: "🏰",
  },
  {
    value: "Oromia",
    label: { en: "Oromia", am: "ኦሮሚያ", or: "Oromiyaa" },
    icon: "🌄",
  },
  {
    value: "Sidama",
    label: { en: "Sidama", am: "ሲዳማ", or: "Sidaamaa" },
    icon: "🌺",
  },
  {
    value: "Somali",
    label: { en: "Somali", am: "ሶማሌ", or: "Somaalee" },
    icon: "🐪",
  },
  {
    value: "South West Ethiopia",
    label: {
      en: "South West Ethiopia",
      am: "ደቡብ ምዕራብ ኢትዮጵያ",
      or: "Dhihaa Kibbaa Itoophiyaa",
    },
    icon: "🌿",
  },
  {
    value: "Southern Nations",
    label: { en: "Southern Nations", am: "ደቡብ ብሔሮች", or: "Saboota Kibbaa" },
    icon: "🏞️",
  },
  {
    value: "Tigray",
    label: { en: "Tigray", am: "ትግራይ", or: "Tigraay" },
    icon: "🏔️",
  },
];

// Status options for candidates
const statusOptions = [
  {
    value: "active",
    label: { en: "Active", am: "ንቁ", or: "Aktiivii" },
    color: "green",
  },
  {
    value: "inactive",
    label: { en: "Inactive", am: "ንቁ ያልሆነ", or: "Hin aktiivne" },
    color: "orange",
  },
  {
    value: "withdrawn",
    label: { en: "Withdrawn", am: "ያፈገፈገ", or: "Ka'ee" },
    color: "red",
  },
  {
    value: "elected",
    label: { en: "Elected", am: "የተመረጠ", or: "Filatame" },
    color: "blue",
  },
];

const CandidateAdmin = () => {
  const { t } = useTranslation();
  const [candidates, setCandidates] = useState([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [filterRegion, setFilterRegion] = useState(null);
  const [filterElectionType, setFilterElectionType] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [error, setError] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [policyInput, setPolicyInput] = useState("");

  // Store form values for all languages
  const [formValues, setFormValues] = useState({
    name: { en: "", am: "", or: "" },
    party: { en: "", am: "", or: "" },
    bio: { en: "", am: "", or: "" },
  });

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BACKEND_URL}api/candidates`;
      const params = new URLSearchParams();
      if (filterRegion) params.append("region", filterRegion);
      if (filterElectionType)
        params.append("election_type", filterElectionType);
      if (filterStatus) params.append("status", filterStatus);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      setCandidates(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          t("candidateAdmin.fetchError"),
      );
      message.error(t("candidateAdmin.fetchErrorMessage"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [filterRegion, filterElectionType, filterStatus]);

  const handlePhotoUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploadingPhoto(true);
    try {
      const res = await axios.post(`${BACKEND_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldsValue({ photo_url: res.data.path });
      setPreviewImage(res.data.path);
      message.success(t("candidateAdmin.photoUploadSuccess"));
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        t("candidateAdmin.photoUploadFailed");
      message.error(errorMsg);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addPolicy = () => {
    if (policyInput.trim()) {
      const newPolicies = [...policies, policyInput.trim()];
      setPolicies(newPolicies);
      form.setFieldsValue({ policies: newPolicies });
      setPolicyInput("");
    }
  };

  const removePolicy = (index) => {
    const newPolicies = policies.filter((_, i) => i !== index);
    setPolicies(newPolicies);
    form.setFieldsValue({ policies: newPolicies });
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BACKEND_URL}uploads/${path}`;
  };

  // Handle form field changes for multilingual fields
  const handleLanguageFieldChange = (field, lang, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleFormSubmit = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const values = await form.validateFields();

      // Get all language values from formValues state
      const nameValues = { ...formValues.name };
      const partyValues = { ...formValues.party };
      const bioValues = { ...formValues.bio };

      // Update with current active language field
      nameValues[activeLanguage] = values[`name_${activeLanguage}`] || "";
      partyValues[activeLanguage] = values[`party_${activeLanguage}`] || "";
      bioValues[activeLanguage] = values[`bio_${activeLanguage}`] || "";

      // Prepare multilingual data structure
      const data = {
        name: {
          en: nameValues.en || nameValues[activeLanguage] || "",
          am: nameValues.am || nameValues[activeLanguage] || "",
          or: nameValues.or || nameValues[activeLanguage] || "",
        },
        party: {
          en: partyValues.en || partyValues[activeLanguage] || "",
          am: partyValues.am || partyValues[activeLanguage] || "",
          or: partyValues.or || partyValues[activeLanguage] || "",
        },
        photo_url: values.photo_url || null,
        age: values.age,
        bio: {
          en: bioValues.en || bioValues[activeLanguage] || "",
          am: bioValues.am || bioValues[activeLanguage] || "",
          or: bioValues.or || bioValues[activeLanguage] || "",
        },
        policies: values.policies || [],
        region: values.region,
        election_type: values.election_type,
        status: values.status || "active",
        social_links: {
          facebook: values.facebook || "",
          twitter: values.twitter || "",
          instagram: values.instagram || "",
          linkedin: values.linkedin || "",
        },
      };

      console.log("Submitting candidate data:", data);

      let response;
      if (editingItem) {
        response = await axios.put(
          `${BACKEND_URL}api/candidates/${editingItem.id}`,
          data,
        );
        message.success(t("candidateAdmin.updateSuccess"));
      } else {
        response = await axios.post(`${BACKEND_URL}api/candidates`, data, {
          headers: { "Content-Type": "application/json" },
        });
        message.success(t("candidateAdmin.createSuccess"));
      }

      console.log("Server response:", response.data);
      await fetchCandidates();

      // Reset form and close modal
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      setPreviewImage(null);
      setPolicies([]);
      setFormValues({
        name: { en: "", am: "", or: "" },
        party: { en: "", am: "", or: "" },
        bio: { en: "", am: "", or: "" },
      });
      setError(null);
    } catch (err) {
      console.error("Form submission error:", {
        error: err,
        response: err.response,
      });
      setError(
        err.response?.data?.error ||
          err.message ||
          t("candidateAdmin.operationFailed"),
      );
      message.error(t("candidateAdmin.operationFailedMessage"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}api/candidates/${id}`);
      message.success(t("candidateAdmin.deleteSuccess"));
      await fetchCandidates();
    } catch (err) {
      console.error("Delete error:", err);
      message.error(
        err.response?.data?.error ||
          err.message ||
          t("candidateAdmin.deleteFailed"),
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    setPolicies(record.policies || []);

    // Set form values state with all languages
    setFormValues({
      name: {
        en: record.name?.en || "",
        am: record.name?.am || "",
        or: record.name?.or || "",
      },
      party: {
        en: record.party?.en || "",
        am: record.party?.am || "",
        or: record.party?.or || "",
      },
      bio: {
        en: record.bio?.en || "",
        am: record.bio?.am || "",
        or: record.bio?.or || "",
      },
    });

    // Set form fields
    form.setFieldsValue({
      name_en: record.name?.en || "",
      name_am: record.name?.am || "",
      name_or: record.name?.or || "",
      party_en: record.party?.en || "",
      party_am: record.party?.am || "",
      party_or: record.party?.or || "",
      bio_en: record.bio?.en || "",
      bio_am: record.bio?.am || "",
      bio_or: record.bio?.or || "",
      photo_url: record.photo_url,
      age: record.age,
      policies: record.policies || [],
      region: record.region,
      election_type: record.election_type,
      status: record.status || "active",
      facebook: record.social_links?.facebook || "",
      twitter: record.social_links?.twitter || "",
      instagram: record.social_links?.instagram || "",
      linkedin: record.social_links?.linkedin || "",
    });
    setPreviewImage(record.photo_url);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: t("candidateAdmin.columns.photo"),
      dataIndex: "photo_url",
      render: (text, record) => (
        <div className="flex justify-center">
          {text ? (
            <Avatar
              src={getFullImageUrl(text)}
              size={50}
              className="rounded-full shadow-sm border-2 border-blue-100"
            />
          ) : (
            <Avatar
              size={50}
              icon={<FiUser />}
              className="bg-blue-500 rounded-full"
            />
          )}
        </div>
      ),
    },
    {
      title: t("candidateAdmin.columns.name"),
      dataIndex: "name",
      render: (name) => (
        <div>
          <div className="font-medium">
            {name?.en || t("candidateAdmin.noName")}
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
      title: t("candidateAdmin.columns.party"),
      dataIndex: "party",
      render: (party) => (
        <div>
          <div className="font-medium">{party?.en || ""}</div>
          <div className="text-xs text-gray-500">
            {party?.am && <span className="mr-2">🇪🇹 {party.am}</span>}
            {party?.or && <span>🇪🇹 {party.or}</span>}
          </div>
        </div>
      ),
    },
    {
      title: t("candidateAdmin.columns.age"),
      dataIndex: "age",
      sorter: (a, b) => a.age - b.age,
      render: (age) => (
        <div className="flex items-center">
          <FaBirthdayCake className="mr-1 text-pink-500" />
          <span>
            {age} {t("candidateAdmin.years")}
          </span>
        </div>
      ),
    },
    {
      title: t("candidateAdmin.columns.region"),
      dataIndex: "region",
      render: (region) => {
        const regionObj = regionOptions.find((r) => r.value === region);
        return (
          <div className="flex items-center">
            <span className="mr-1">{regionObj?.icon || "📍"}</span>
            <span>{regionObj?.label[activeLanguage] || region}</span>
          </div>
        );
      },
      filters: regionOptions.map((opt) => ({
        text: opt.label.en,
        value: opt.value,
      })),
      onFilter: (value, record) => record.region === value,
    },
    {
      title: t("candidateAdmin.columns.electionType"),
      dataIndex: "election_type",
      render: (type) => {
        const electionObj = electionTypeOptions.find((e) => e.value === type);
        return (
          <Tag color="purple" className="px-3 py-1">
            <span className="mr-1">{electionObj?.icon || "🗳️"}</span>
            {electionObj?.label[activeLanguage] || type}
          </Tag>
        );
      },
      filters: electionTypeOptions.map((opt) => ({
        text: opt.label.en,
        value: opt.value,
      })),
      onFilter: (value, record) => record.election_type === value,
    },
    {
      title: t("candidateAdmin.columns.status"),
      dataIndex: "status",
      render: (status) => {
        const statusObj = statusOptions.find((opt) => opt.value === status);
        return (
          <Badge
            color={statusObj?.color || "gray"}
            text={statusObj?.label[activeLanguage] || status}
          />
        );
      },
      filters: statusOptions.map((opt) => ({
        text: opt.label.en,
        value: opt.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t("candidateAdmin.columns.policies"),
      dataIndex: "policies",
      render: (policies) => (
        <div className="max-w-xs">
          {policies?.slice(0, 2).map((policy, index) => (
            <Tag key={index} color="blue" className="mb-1">
              {policy.length > 20 ? `${policy.substring(0, 20)}...` : policy}
            </Tag>
          ))}
          {policies?.length > 2 && (
            <Tag color="default">
              +{policies.length - 2} {t("candidateAdmin.more")}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: t("candidateAdmin.columns.actions"),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("candidateAdmin.edit")}>
            <Button
              shape="circle"
              icon={<FiEdit className="text-blue-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title={t("candidateAdmin.deleteConfirm.title")}
            description={t("candidateAdmin.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("candidateAdmin.yes")}
            cancelText={t("candidateAdmin.no")}
            okButtonProps={{ loading: actionLoading }}
          >
            <Tooltip title={t("candidateAdmin.delete")}>
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

  const gridView = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <Card
          key={candidate.id}
          hoverable
          className="shadow-sm hover:shadow-md transition-shadow"
          cover={
            candidate.photo_url ? (
              <div className="h-48 overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <img
                  src={getFullImageUrl(candidate.photo_url)}
                  alt={candidate.name?.en || t("candidateAdmin.candidate")}
                  className="object-cover h-full w-full"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <FiUser className="text-gray-400 text-6xl" />
              </div>
            )
          }
          actions={[
            <Tooltip title={t("candidateAdmin.edit")}>
              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => openEditModal(candidate)}
              />
            </Tooltip>,
            <Popconfirm
              title={t("candidateAdmin.deleteConfirm.title")}
              description={t("candidateAdmin.deleteConfirm.description")}
              onConfirm={() => handleDelete(candidate.id)}
              okText={t("candidateAdmin.yes")}
              cancelText={t("candidateAdmin.no")}
              okButtonProps={{ loading: actionLoading }}
            >
              <Tooltip title={t("candidateAdmin.delete")}>
                <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
              </Tooltip>
            </Popconfirm>,
          ]}
        >
          <Card.Meta
            title={
              <div>
                <div className="font-medium text-lg">
                  {candidate.name?.en || t("candidateAdmin.noName")}
                </div>
                <div className="text-xs text-gray-500">
                  {candidate.name?.am && <div>🇪🇹 {candidate.name.am}</div>}
                  {candidate.name?.or && <div>🇪🇹 {candidate.name.or}</div>}
                </div>
                <div className="text-sm text-purple-600 mt-1">
                  {candidate.party?.en || ""}
                </div>
              </div>
            }
            description={
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <FaBirthdayCake className="mr-2 text-pink-500" />
                  <span>
                    {candidate.age} {t("candidateAdmin.yearsOld")}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-2 text-green-500" />
                  <span>
                    {regionOptions.find((r) => r.value === candidate.region)
                      ?.label[activeLanguage] || candidate.region}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiFlag className="mr-2 text-orange-500" />
                  <span>
                    {electionTypeOptions.find(
                      (e) => e.value === candidate.election_type,
                    )?.label[activeLanguage] || candidate.election_type}
                  </span>
                </div>
                <div>
                  <Badge
                    color={
                      statusOptions.find((s) => s.value === candidate.status)
                        ?.color || "gray"
                    }
                    text={
                      statusOptions.find((s) => s.value === candidate.status)
                        ?.label[activeLanguage] || candidate.status
                    }
                  />
                </div>
                <Divider className="my-2" />
                <div className="text-sm text-gray-700 line-clamp-2">
                  {candidate.bio?.en || t("candidateAdmin.noBio")}
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">
                    {t("candidateAdmin.keyPolicies")}:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {candidate.policies?.slice(0, 2).map((policy, idx) => (
                      <Tag key={idx} color="blue" className="text-xs">
                        {policy.length > 15
                          ? `${policy.substring(0, 15)}...`
                          : policy}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl">
      <Card
        title={
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {t("candidateAdmin.title")}
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <Tooltip title={t("candidateAdmin.tableView")}>
                <Button
                  shape="circle"
                  icon={<AiOutlineUnorderedList />}
                  onClick={() => setViewMode("table")}
                  type={viewMode === "table" ? "primary" : "default"}
                />
              </Tooltip>
              <Tooltip title={t("candidateAdmin.gridView")}>
                <Button
                  shape="circle"
                  icon={<BsGrid />}
                  onClick={() => setViewMode("grid")}
                  type={viewMode === "grid" ? "primary" : "default"}
                />
              </Tooltip>
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => {
                  form.resetFields();
                  setEditingItem(null);
                  setPreviewImage(null);
                  setPolicies([]);
                  setFormValues({
                    name: { en: "", am: "", or: "" },
                    party: { en: "", am: "", or: "" },
                    bio: { en: "", am: "", or: "" },
                  });
                  setError(null);
                  setIsModalOpen(true);
                }}
                className="ml-2"
              >
                {t("candidateAdmin.addCandidate")}
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          <Space>
            <Select
              placeholder={t("candidateAdmin.filterByRegion")}
              allowClear
              onChange={setFilterRegion}
              style={{ width: 180 }}
            >
              {regionOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  <span className="mr-2">{opt.icon}</span>
                  {opt.label[activeLanguage]}
                </Option>
              ))}
            </Select>
            <Select
              placeholder={t("candidateAdmin.filterByElectionType")}
              allowClear
              onChange={setFilterElectionType}
              style={{ width: 180 }}
            >
              {electionTypeOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  <span className="mr-2">{opt.icon}</span>
                  {opt.label[activeLanguage]}
                </Option>
              ))}
            </Select>
            <Select
              placeholder={t("candidateAdmin.filterByStatus")}
              allowClear
              onChange={setFilterStatus}
              style={{ width: 150 }}
            >
              {statusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  <Badge color={opt.color} text={opt.label[activeLanguage]} />
                </Option>
              ))}
            </Select>
          </Space>
        }
      >
        {loading ? (
          <div className="flex justify-center p-8">
            <Spin size="large" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">
              {t("candidateAdmin.noCandidates")}
            </h3>
            <p className="text-gray-400 mt-2">
              {t("candidateAdmin.clickToAdd")}
            </p>
          </div>
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={candidates}
            rowKey="id"
            loading={loading}
            className="border-none"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) =>
                t("candidateAdmin.totalCandidates", { total }),
            }}
          />
        ) : (
          gridView
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            {editingItem ? (
              <>
                <FiEdit className="text-blue-500 mr-2" />
                <span>{t("candidateAdmin.editCandidate")}</span>
              </>
            ) : (
              <>
                <FiPlus className="text-green-500 mr-2" />
                <span>{t("candidateAdmin.addCandidate")}</span>
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
          setPolicies([]);
          setFormValues({
            name: { en: "", am: "", or: "" },
            party: { en: "", am: "", or: "" },
            bio: { en: "", am: "", or: "" },
          });
          setError(null);
        }}
        onOk={handleFormSubmit}
        okText={
          editingItem ? t("candidateAdmin.update") : t("candidateAdmin.create")
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
        width={900}
        destroyOnClose
      >
        <Divider />
        {error && (
          <Alert
            message={t("candidateAdmin.error")}
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}

        <div className="mb-4">
          <Tabs
            defaultActiveKey="en"
            onChange={setActiveLanguage}
            tabBarExtraContent={
              <div className="flex items-center text-sm text-gray-500">
                <FiGlobe className="mr-1" />
                <span>
                  {t("candidateAdmin.language")}:{" "}
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

        <Form form={form} layout="vertical">
          {/* Hidden fields for all languages to keep them in form state */}
          {languages.map((lang) => (
            <React.Fragment key={lang.code}>
              <Form.Item name={`name_${lang.code}`} hidden>
                <Input />
              </Form.Item>
              <Form.Item name={`party_${lang.code}`} hidden>
                <Input />
              </Form.Item>
              <Form.Item name={`bio_${lang.code}`} hidden>
                <Input />
              </Form.Item>
            </React.Fragment>
          ))}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={`name_${activeLanguage}`}
                label={`${t("candidateAdmin.form.fullName")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t("candidateAdmin.form.englishNameRequired"),
                        },
                        {
                          min: 3,
                          message: t("candidateAdmin.form.nameMinLength"),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("candidateAdmin.form.enterName")} ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                  prefix={<FiUser className="text-gray-400" />}
                  onChange={(e) =>
                    handleLanguageFieldChange(
                      "name",
                      activeLanguage,
                      e.target.value,
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={`party_${activeLanguage}`}
                label={`${t("candidateAdmin.form.party")} (${
                  languages.find((l) => l.code === activeLanguage)?.name
                })`}
                rules={
                  activeLanguage === "en"
                    ? [
                        {
                          required: true,
                          message: t(
                            "candidateAdmin.form.englishPartyRequired",
                          ),
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder={`${t("candidateAdmin.form.enterParty")} ${
                    languages.find((l) => l.code === activeLanguage)?.name
                  }`}
                  prefix={<FiFlag className="text-gray-400" />}
                  onChange={(e) =>
                    handleLanguageFieldChange(
                      "party",
                      activeLanguage,
                      e.target.value,
                    )
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label={t("candidateAdmin.form.age")}
                rules={[
                  {
                    required: true,
                    message: t("candidateAdmin.form.ageRequired"),
                  },
                  {
                    type: "number",
                    min: 18,
                    max: 120,
                    message: t("candidateAdmin.form.ageRange"),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t("candidateAdmin.form.enterAge")}
                  prefix={<FaBirthdayCake className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="photo_url"
                label={t("candidateAdmin.form.photo")}
              >
                <div className="space-y-4">
                  <Upload
                    name="photo"
                    showUploadList={false}
                    customRequest={handlePhotoUpload}
                    accept="image/*"
                    disabled={uploadingPhoto}
                    className="w-full"
                  >
                    <Button
                      icon={<FiUpload />}
                      loading={uploadingPhoto}
                      block
                      className="h-12"
                    >
                      {uploadingPhoto
                        ? t("candidateAdmin.uploading")
                        : t("candidateAdmin.form.uploadPhoto")}
                    </Button>
                  </Upload>

                  {previewImage && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={getFullImageUrl(previewImage)}
                        alt="preview"
                        className="max-h-32 rounded-full border-4 border-blue-100"
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="region"
                label={t("candidateAdmin.form.region")}
                rules={[
                  {
                    required: true,
                    message: t("candidateAdmin.form.regionRequired"),
                  },
                ]}
              >
                <Select placeholder={t("candidateAdmin.form.selectRegion")}>
                  {regionOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      <span className="mr-2">{opt.icon}</span>
                      {opt.label[activeLanguage]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="election_type"
                label={t("candidateAdmin.form.electionType")}
                rules={[
                  {
                    required: true,
                    message: t("candidateAdmin.form.electionTypeRequired"),
                  },
                ]}
              >
                <Select
                  placeholder={t("candidateAdmin.form.selectElectionType")}
                >
                  {electionTypeOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      <span className="mr-2">{opt.icon}</span>
                      {opt.label[activeLanguage]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={t("candidateAdmin.form.status")}
                initialValue="active"
                rules={[
                  {
                    required: true,
                    message: t("candidateAdmin.form.statusRequired"),
                  },
                ]}
              >
                <Select>
                  {statusOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      <Badge
                        color={opt.color}
                        text={opt.label[activeLanguage]}
                      />
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={`bio_${activeLanguage}`}
            label={`${t("candidateAdmin.form.bio")} (${
              languages.find((l) => l.code === activeLanguage)?.name
            })`}
            rules={
              activeLanguage === "en"
                ? [
                    {
                      required: true,
                      message: t("candidateAdmin.form.englishBioRequired"),
                    },
                    { min: 50, message: t("candidateAdmin.form.bioMinLength") },
                  ]
                : []
            }
          >
            <TextArea
              rows={4}
              placeholder={`${t("candidateAdmin.form.enterBio")} ${
                languages.find((l) => l.code === activeLanguage)?.name
              }`}
              showCount
              maxLength={1000}
              onChange={(e) =>
                handleLanguageFieldChange("bio", activeLanguage, e.target.value)
              }
            />
          </Form.Item>

          <Form.Item
            name="policies"
            label={t("candidateAdmin.form.policies")}
            rules={[
              {
                required: true,
                message: t("candidateAdmin.form.policiesRequired"),
              },
            ]}
          >
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={policyInput}
                  onChange={(e) => setPolicyInput(e.target.value)}
                  onPressEnter={addPolicy}
                  placeholder={t("candidateAdmin.form.enterPolicy")}
                  className="flex-1"
                />
                <Button onClick={addPolicy} type="primary">
                  {t("candidateAdmin.form.addPolicy")}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {policies.map((policy, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => removePolicy(index)}
                    color="blue"
                    className="px-3 py-1 text-sm"
                  >
                    {policy}
                  </Tag>
                ))}
              </div>
            </div>
          </Form.Item>

          <Divider orientation="left">
            {t("candidateAdmin.form.socialLinks")}
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="facebook" label="Facebook">
                <Input
                  placeholder="https://facebook.com/username"
                  prefix={<FiFacebook className="text-blue-600" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="twitter" label="Twitter">
                <Input
                  placeholder="https://twitter.com/username"
                  prefix={<FiTwitter className="text-blue-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="instagram" label="Instagram">
                <Input
                  placeholder="https://instagram.com/username"
                  prefix={<FiInstagram className="text-pink-600" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="linkedin" label="LinkedIn">
                <Input
                  placeholder="https://linkedin.com/in/username"
                  prefix={<FiLinkedin className="text-blue-700" />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CandidateAdmin;
