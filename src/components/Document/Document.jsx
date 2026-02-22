import React, { useEffect, useState } from "react";
import { getApiUrl } from "../../utils/getApiUrl";
import axios from "axios";
import {
  Table,
  Pagination,
  Input,
  Empty,
  Modal,
  Tag,
  Button,
  Space,
  Card,
  Row,
  Col,
  Badge,
  Spin,
  Alert,
  Divider,
  Typography,
  Image,
  Tabs,
} from "antd";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import {
  FiDownload,
  FiExternalLink,
  FiSearch,
  FiCalendar,
  FiFileText,
  FiGrid,
  FiList,
  FiEye,
  FiBookOpen,
  FiFilter,
  FiX,
  FiPlay,
  FiCode,
} from "react-icons/fi";
import { BsFileEarmarkPdf, BsFileWord, BsClockHistory } from "react-icons/bs";
import { MdOutlineCategory, MdOutlineDescription } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const { Search } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const ResourceFilesViewer = () => {
  const apiUrl = getApiUrl();
  const { t, i18n } = useTranslation();

  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [previewContent, setPreviewContent] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}api/resource-files?status=active`
      );
      if (response.data.success) {
        const resourcesData = response.data.data || [];
        setResources(resourcesData);
        setFilteredResources(resourcesData);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            resourcesData.map((resource) =>
              getLocalizedValue(resource.category)
            )
          ),
        ];
        setCategories(uniqueCategories);
      } else {
        setError(t("resourcefe.fetchError"));
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setError(error.message || t("resourcefe.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = resources.filter((resource) => {
      const title = getLocalizedValue(resource.title);
      const category = getLocalizedValue(resource.category);
      const description = getLocalizedValue(resource.description);
      const searchTerm = value.toLowerCase();

      return (
        title.toLowerCase().includes(searchTerm) ||
        category.toLowerCase().includes(searchTerm) ||
        description.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredResources(filtered);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredResources(resources);
    } else {
      const filtered = resources.filter(
        (resource) => getLocalizedValue(resource.category) === category
      );
      setFilteredResources(filtered);
    }
    setCurrentPage(1);
  };

  const getLocalizedValue = (obj) => {
    if (!obj) return "";
    return obj[i18n.language] || obj.en || "";
  };

  const getFullUrl = (path) => {
    if (!path) return null;

    // If the path already starts with http, return as is
    if (path.startsWith("http")) return path;

    // If the path already includes "uploads/", just prepend the API URL without adding extra "uploads/"
    if (path.includes("uploads/")) {
      return `${apiUrl}${path}`;
    }

    // Otherwise, use the default path structure (for backward compatibility)
    return `${apiUrl}uploads/${path}`;
  };

  const getFileIcon = (filename) => {
    if (!filename)
      return <MdOutlineDescription className="text-gray-400 text-2xl" />;
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return <BsFileEarmarkPdf className="text-red-500 text-2xl" />;
      case "doc":
      case "docx":
        return <BsFileWord className="text-blue-500 text-2xl" />;
      case "txt":
      case "rtf":
        return <FiFileText className="text-green-500 text-2xl" />;
      case "js":
      case "jsx":
        return <FiCode className="text-yellow-500 text-2xl" />;
      case "html":
      case "htm":
        return <FiCode className="text-orange-500 text-2xl" />;
      case "css":
        return <FiCode className="text-blue-400 text-2xl" />;
      case "py":
        return <FiCode className="text-blue-600 text-2xl" />;
      case "java":
        return <FiCode className="text-red-400 text-2xl" />;
      case "cpp":
      case "c":
      case "h":
        return <FiCode className="text-blue-800 text-2xl" />;
      case "php":
        return <FiCode className="text-purple-500 text-2xl" />;
      case "xml":
      case "json":
        return <FiCode className="text-gray-600 text-2xl" />;
      default:
        return <FiFileText className="text-gray-500 text-2xl" />;
    }
  };

  const getFileExtension = (filename) => {
    if (!filename) return "";
    return filename.split(".").pop().toUpperCase();
  };

  const isPreviewable = (filename) => {
    if (!filename) return false;
    const ext = filename.split(".").pop().toLowerCase();

    // Extended list of previewable file types including source files
    const previewableTypes = [
      // Documents
      "pdf",
      "txt",
      "rtf",
      "md",
      // Source code files
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "htm",
      "css",
      "scss",
      "sass",
      "py",
      "java",
      "cpp",
      "c",
      "h",
      "hpp",
      "php",
      "xml",
      "json",
      "yaml",
      "yml",
      "sql",
      "sh",
      "bat",
      "ps1",
      "rb",
      "go",
      "rs",
      "swift",
      "kt",
      "dart",
    ];

    return previewableTypes.includes(ext);
  };

  const isTextBasedFile = (filename) => {
    if (!filename) return false;
    const ext = filename.split(".").pop().toLowerCase();

    const textBasedTypes = [
      "txt",
      "rtf",
      "md",
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "htm",
      "css",
      "scss",
      "sass",
      "py",
      "java",
      "cpp",
      "c",
      "h",
      "hpp",
      "php",
      "xml",
      "json",
      "yaml",
      "yml",
      "sql",
      "sh",
      "bat",
      "ps1",
      "rb",
      "go",
      "rs",
      "swift",
      "kt",
      "dart",
    ];

    return textBasedTypes.includes(ext);
  };

  const getLanguageForHighlighting = (filename) => {
    if (!filename) return "plaintext";
    const ext = filename.split(".").pop().toLowerCase();

    const languageMap = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      html: "html",
      htm: "html",
      css: "css",
      scss: "scss",
      sass: "sass",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      h: "c",
      hpp: "cpp",
      php: "php",
      xml: "xml",
      json: "json",
      yaml: "yaml",
      yml: "yaml",
      sql: "sql",
      sh: "bash",
      bat: "batch",
      ps1: "powershell",
      rb: "ruby",
      go: "go",
      rs: "rust",
      swift: "swift",
      kt: "kotlin",
      dart: "dart",
      md: "markdown",
    };

    return languageMap[ext] || "plaintext";
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <Badge
          status="success"
          text={t("resourcefe.active")}
          className="bg-green-100 text-[#008830] px-3 py-1 rounded-full text-xs font-medium"
        />
      );
    }

    return (
      <Badge
        status="default"
        text={t("resourcefe.inactive")}
        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
      />
    );
  };

  const handlePreview = async (resource) => {
    if (!resource.file) return;

    setPreviewLoading(true);
    setPreviewError(null);
    setSelectedResource(resource);
    setIsPreviewModalVisible(true);

    try {
      const fileUrl = getFullUrl(resource.file);
      const fileExtension = getFileExtension(resource.file).toLowerCase();

      console.log("Preview URL:", fileUrl);
      console.log("File extension:", fileExtension);
      console.log("Full resource:", resource);

      if (fileExtension === "pdf") {
        // For PDF files, use iframe embedding with better error handling
        setPreviewContent(
          <div className="w-full h-full">
            <iframe
              src={`${fileUrl}#view=fitH`}
              className="w-full h-full min-h-[70vh] border-0 rounded-lg"
              title={`PDF Preview - ${getLocalizedValue(resource.title)}`}
              onLoad={() => {
                console.log("PDF loaded successfully");
                setPreviewLoading(false);
              }}
              onError={(e) => {
                console.error("PDF loading error:", e);
                setPreviewLoading(false);
                setPreviewError(
                  "Failed to load PDF preview. The file might be corrupted or the URL might be incorrect."
                );
              }}
            />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <Text className="text-blue-800 text-sm">
                <strong>Tip:</strong> If the PDF doesn't load, you can{" "}
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  open it in a new tab
                </a>{" "}
                or download it directly.
              </Text>
            </div>
          </div>
        );
      } else if (isTextBasedFile(resource.file)) {
        // For text-based files including source code, fetch and display content
        try {
          console.log("Fetching text file from:", fileUrl);

          // Add cache busting to avoid cached errors
          const cacheBustedUrl = `${fileUrl}?t=${Date.now()}`;

          const response = await fetch(cacheBustedUrl, {
            method: "GET",
            headers: {
              Accept: "text/plain, */*",
            },
            mode: "cors",
          });

          if (response.ok) {
            const text = await response.text();
            const language = getLanguageForHighlighting(resource.file);

            setPreviewContent(
              <div className="w-full h-full min-h-[70vh] bg-gray-900 text-gray-100 rounded-lg overflow-auto">
                <div className="flex items-center justify-between bg-gray-800 px-4 py-2 sticky top-0">
                  <div className="flex items-center">
                    <FiCode className="mr-2 text-[#ffca40]" />
                    <Text className="text-white font-mono text-sm">
                      {resource.file.split("/").pop()}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="bg-[#ffca40] text-[#136094] border-none font-mono">
                      {fileExtension}
                    </Tag>
                    <Button
                      size="small"
                      icon={<FiExternalLink />}
                      onClick={() => window.open(fileUrl, "_blank")}
                      className="bg-[#136094] border-none text-white"
                    >
                      Open in New Tab
                    </Button>
                  </div>
                </div>
                <pre className="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  <code className={`language-${language}`}>{text}</code>
                </pre>
              </div>
            );
            setPreviewLoading(false);
          } else {
            throw new Error(
              `Failed to load file content: ${response.status} ${response.statusText}`
            );
          }
        } catch (fetchError) {
          console.error("Fetch error:", fetchError);
          throw new Error(`Failed to fetch file: ${fetchError.message}`);
        }
      } else {
        // For non-previewable files, show download option
        setPreviewError(
          `Preview not available for .${fileExtension} files. Please download the file to view it.`
        );
        setPreviewLoading(false);
      }
    } catch (error) {
      console.error("Preview error:", error);
      setPreviewError(
        error.message ||
          "Failed to load preview. Please try downloading the file instead."
      );
      setPreviewLoading(false);
    }
  };

  const columns = [
    {
      title: t("resourcefe.title"),
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <Text strong className="text-[#136094]">
          {getLocalizedValue(title)}
        </Text>
      ),
    },
    {
      title: t("resourcefe.category"),
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3">
          {getLocalizedValue(category)}
        </Tag>
      ),
    },
    {
      title: t("resourcefe.fileType"),
      dataIndex: "file",
      key: "file",
      render: (file) => (
        <div className="flex items-center text-[#136094]">
          {getFileIcon(file)}
          <Text className="ml-2 font-mono text-sm">
            {getFileExtension(file)}
          </Text>
          {isPreviewable(file) && (
            <Badge
              count="Preview"
              style={{
                backgroundColor: "#008830",
                marginLeft: "8px",
                fontSize: "10px",
              }}
            />
          )}
        </div>
      ),
    },
    {
      title: t("resourcefe.postedDate"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <div className="flex items-center text-[#136094]">
          <FiCalendar className="mr-2" />
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: t("resourcefe.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
    {
      title: t("resourcefe.actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {isPreviewable(record.file) &&
            {
              /* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                icon={<FiPlay />}
                onClick={() => handlePreview(record)}
                className="bg-[#008830] hover:bg-[#007a2a] border-none"
              >
                {t("resourcefe.preview")}
              </Button>
            </motion.div> */
            }}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              icon={<FiEye />}
              onClick={() => handleView(record)}
              className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
            >
              {t("resourcefe.view")}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="default"
              icon={<FiExternalLink />}
              onClick={() => window.open(getFullUrl(record.file), "_blank")}
              className="border-[#136094] text-[#136094] hover:bg-[#136094] hover:text-white"
            >
              Open
            </Button>
          </motion.div>
        </Space>
      ),
    },
  ];

  const renderResourceCard = (resource, index) => {
    const isFilePreviewable = isPreviewable(resource.file);

    return (
      <Col key={resource.id} xs={24} sm={12} lg={8} className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card
            hoverable
            className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden"
            cover={
              resource.cover_image ? (
                <div className="h-64 text-center overflow-hidden relative">
                  <Image
                    src={getFullUrl(resource.cover_image)}
                    alt={getLocalizedValue(resource.title)}
                    preview={false}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(resource.status)}
                  </div>
                  {isFilePreviewable && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        count="Preview Available"
                        style={{
                          backgroundColor: "#008830",
                          fontSize: "10px",
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-[#136094]/10 to-[#008830]/10 flex items-center justify-center relative">
                  <FiBookOpen className="text-[#136094] text-4xl opacity-50" />
                  {isFilePreviewable && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        count="Preview"
                        style={{
                          backgroundColor: "#008830",
                          fontSize: "10px",
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            }
            onClick={() => handleView(resource)}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3 py-1 text-xs font-medium">
                    {getLocalizedValue(resource.category)}
                  </Tag>
                  <div className="flex items-center text-gray-500 text-xs">
                    {getFileIcon(resource.file)}
                    <span className="ml-1 font-mono">
                      {getFileExtension(resource.file)}
                    </span>
                  </div>
                </div>

                <Title level={5} className="!mb-3 !text-[#136094] line-clamp-2">
                  {getLocalizedValue(resource.title)}
                </Title>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MdOutlineCategory className="mr-2 text-[#136094]" />
                    <Text className="text-sm">
                      {getLocalizedValue(resource.category)}
                    </Text>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 text-[#136094]" />
                    <Text className="text-sm">
                      {new Date(resource.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                </div>

                <div className="mt-3">
                  <Text className="text-gray-600 text-sm line-clamp-2">
                    {getLocalizedValue(resource.description)}
                  </Text>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex gap-2">
                  {isFilePreviewable && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* <Button
                        type="default"
                        icon={<FiPlay />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(resource);
                        }}
                        className="flex-1 bg-[#008830] hover:bg-[#007a2a] text-white border-none h-10 font-semibold rounded-lg"
                      >
                        {t("resourcefe.preview")}
                      </Button> */}
                    </motion.div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(resource);
                      }}
                      className={`bg-gradient-to-r from-[#136094] to-[#008830] hover:from-[#0f4a7a] hover:to-[#007a2a] border-none h-10 font-semibold rounded-lg ${
                        isFilePreviewable ? "flex-1" : "w-full"
                      }`}
                    >
                      {t("resourcefe.viewDetails")}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="default"
                      icon={<FiExternalLink />}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(getFullUrl(resource.file), "_blank");
                      }}
                      className="border-[#136094] text-[#136094] hover:bg-[#136094] hover:text-white h-10 font-semibold rounded-lg"
                    >
                      Open
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Col>
    );
  };

  const handleView = (record) => {
    setSelectedResource(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedResource(null);
  };

  const handlePreviewCancel = () => {
    setIsPreviewModalVisible(false);
    setSelectedResource(null);
    setPreviewContent("");
    setPreviewError(null);
  };

  const downloadFile = (fileUrl, filename) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename || "resource-file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="bg-gradient-to-br from-[#136094]/5 to-[#008830]/5 py-16 px-4 lg:px-8"
      data-aos="fade-up"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            level={1}
            className="!text-4xl !font-bold !text-[#136094] mb-4"
          >
            {t("resourcefe.libraryTitle")}
          </Title>
          <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("resourcefe.librarySubtitle")}
          </Text>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="rounded-2xl shadow-lg border border-[#136094]/10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <Search
                  placeholder={t("resourcefe.searchPlaceholder")}
                  allowClear
                  enterButton={
                    <Button
                      type="primary"
                      icon={<FiSearch />}
                      className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
                    >
                      {t("resourcefe.search")}
                    </Button>
                  }
                  size="large"
                  onSearch={handleSearch}
                  className="max-w-md"
                />
              </div>

              <Space size="middle">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type={viewMode === "list" ? "primary" : "default"}
                    icon={<FiList />}
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list"
                        ? "bg-[#136094] border-[#136094]"
                        : "border-[#136094] text-[#136094]"
                    }
                  >
                    {t("resourcefe.listView")}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type={viewMode === "grid" ? "primary" : "default"}
                    icon={<FiGrid />}
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-[#136094] border-[#136094]"
                        : "border-[#136094] text-[#136094]"
                    }
                  >
                    {t("resourcefe.gridView")}
                  </Button>
                </motion.div>
              </Space>
            </div>

            {/* Category Filters */}
            <div className="mt-6">
              <div className="flex items-center mb-3">
                <MdOutlineCategory className="text-[#136094] mr-2" />
                <Text strong className="text-[#136094]">
                  Filter by Category:
                </Text>
              </div>
              <div className="flex flex-wrap gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type={activeCategory === "all" ? "primary" : "default"}
                    size="small"
                    onClick={() => handleCategoryFilter("all")}
                    className={
                      activeCategory === "all"
                        ? "bg-[#ffca40] border-[#ffca40] text-[#136094]"
                        : "border-[#136094] text-[#136094]"
                    }
                  >
                    All Resources
                  </Button>
                </motion.div>
                {categories.map((category) => (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type={activeCategory === category ? "primary" : "default"}
                      size="small"
                      onClick={() => handleCategoryFilter(category)}
                      className={
                        activeCategory === category
                          ? "bg-[#ffca40] border-[#ffca40] text-[#136094]"
                          : "border-[#136094] text-[#136094]"
                      }
                    >
                      {category}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Resources Content */}
        {loading ? (
          <div className="text-center py-16">
            <Spin size="large" className="text-[#136094]" />
          </div>
        ) : error ? (
          <Alert
            message={t("resourcefe.error")}
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="rounded-2xl"
          />
        ) : filteredResources.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <Row gutter={[24, 24]}>
                  {filteredResources
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((resource, index) =>
                      renderResourceCard(resource, index)
                    )}
                </Row>
              ) : (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="rounded-2xl shadow-lg border border-[#136094]/10">
                    <Table
                      columns={columns}
                      dataSource={filteredResources}
                      pagination={false}
                      rowKey="id"
                      loading={loading}
                      className="custom-table"
                    />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <Text type="secondary" className="text-[#136094]">
                {t("resourcefe.showing")} {(currentPage - 1) * pageSize + 1}{" "}
                {t("resourcefe.to")}{" "}
                {Math.min(currentPage * pageSize, filteredResources.length)}{" "}
                {t("resourcefe.of")} {filteredResources.length}{" "}
                {t("resourcefe.entries")}
              </Text>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredResources.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
                className="custom-pagination"
                itemRender={(current, type, originalElement) => {
                  if (type === "page") {
                    return (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          type={current === currentPage ? "primary" : "default"}
                          className={
                            current === currentPage
                              ? "bg-[#136094] border-[#136094]"
                              : "border-[#136094] text-[#136094]"
                          }
                        >
                          {current}
                        </Button>
                      </motion.div>
                    );
                  }
                  return originalElement;
                }}
              />
            </div>
          </>
        ) : (
          <Card className="shadow-lg rounded-2xl border border-[#136094]/10">
            <Empty
              description={
                <Text className="text-gray-600 text-lg">
                  {t("resourcefe.noResources")}
                </Text>
              }
              imageStyle={{ height: 120 }}
            />
          </Card>
        )}

        {/* Resource Details Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <FiBookOpen className="text-[#136094] text-xl mr-2" />
              <span className="text-[#136094] font-bold">
                {t("resourcefe.resourceDetails")}
              </span>
            </div>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
          destroyOnClose
          className="resource-details-modal"
        >
          {selectedResource && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <Title level={3} className="!mb-2 !text-[#136094]">
                    {getLocalizedValue(selectedResource.title)}
                  </Title>
                  <div className="flex flex-wrap gap-2">
                    <Tag className="bg-[#ffca40] bg-opacity-20 text-[#136094] border-none rounded-full px-3 py-1">
                      {getLocalizedValue(selectedResource.category)}
                    </Tag>
                    {getStatusBadge(selectedResource.status)}
                    <Tag className="bg-blue-100 text-[#136094] border-none rounded-full px-3 py-1">
                      {getFileExtension(selectedResource.file)}
                    </Tag>
                    {isPreviewable(selectedResource.file) && (
                      <Tag className="bg-[#008830] text-white border-none rounded-full px-3 py-1">
                        Preview Available
                      </Tag>
                    )}
                  </div>
                </div>
              </div>

              <Divider className="my-4 border-[#136094]/20" />

              {/* Resource Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <MdOutlineCategory className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("resourcefe.category")}
                    </Text>
                    <Text className="text-gray-700">
                      {getLocalizedValue(selectedResource.category)}
                    </Text>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <FiCalendar className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("resourcefe.postedDate")}
                    </Text>
                    <Text className="text-gray-700">
                      {new Date(selectedResource.created_at).toLocaleString()}
                    </Text>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#ffca40] bg-opacity-20 p-3 rounded-lg mr-4">
                    <FiFileText className="text-[#136094] text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-[#136094] mb-1">
                      {t("resourcefe.fileType")}
                    </Text>
                    <Text className="text-gray-700">
                      {getFileExtension(selectedResource.file)}
                    </Text>
                  </div>
                </div>
              </div>

              <Divider className="my-4 border-[#136094]/20" />

              {/* Description */}
              <div>
                <Text strong className="block text-[#136094] mb-3 text-lg">
                  {t("resourcefe.description")}
                </Text>
                <div className="p-4 bg-gradient-to-r from-[#136094]/5 to-[#008830]/5 rounded-xl whitespace-pre-line border border-[#136094]/10">
                  {getLocalizedValue(selectedResource.description) ||
                    t("resourcefe.noDescription")}
                </div>
              </div>

              {/* Cover Image */}
              {selectedResource.cover_image && (
                <div className="mt-6">
                  <Text strong className="block text-[#136094] mb-3 text-lg">
                    {t("resourcefe.coverImage")}
                  </Text>
                  <Image
                    src={getFullUrl(selectedResource.cover_image)}
                    alt={getLocalizedValue(selectedResource.title)}
                    className="rounded-xl shadow-lg"
                    preview={false}
                  />
                </div>
              )}

              {/* Resource File Actions */}
              {selectedResource.file && (
                <div className="mt-6">
                  <Text strong className="block text-[#136094] mb-3 text-lg">
                    {t("resourcefe.resourceFile")}
                  </Text>
                  <div className="p-4 border border-[#136094]/20 rounded-xl flex items-center justify-between bg-white">
                    <div className="flex items-center">
                      {getFileIcon(selectedResource.file)}
                      <div className="ml-4">
                        <Text strong className="block text-[#136094]">
                          {selectedResource.file.split("/").pop()}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Resource Document
                        </Text>
                      </div>
                    </div>
                    <Space>
                      {isPreviewable(selectedResource.file) && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* <Button
                            type="primary"
                            icon={<FiPlay />}
                            onClick={() => {
                              handleCancel();
                              handlePreview(selectedResource);
                            }}
                            className="bg-[#008830] hover:bg-[#007a2a] border-none"
                          >
                            {t("resourcefe.preview")}
                          </Button> */}
                        </motion.div>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="default"
                          icon={<FiExternalLink />}
                          onClick={() =>
                            window.open(
                              getFullUrl(selectedResource.file),
                              "_blank"
                            )
                          }
                          className="border-[#136094] text-[#136094] hover:bg-[#136094] hover:text-white"
                        >
                          Open in New Tab
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="primary"
                          icon={<FiDownload />}
                          onClick={() =>
                            downloadFile(
                              getFullUrl(selectedResource.file),
                              selectedResource.file.split("/").pop()
                            )
                          }
                          className="bg-gradient-to-r from-[#136094] to-[#008830] hover:from-[#0f4a7a] hover:to-[#007a2a] border-none"
                        >
                          {t("resourcefe.download")}
                        </Button>
                      </motion.div>
                    </Space>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </Modal>

        {/* Preview Modal */}
        <Modal
          title={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <FiPlay className="text-[#136094] text-xl mr-2" />
                <span className="text-[#136094] font-bold">
                  Preview:{" "}
                  {selectedResource?.title?.[i18n.language] ||
                    selectedResource?.title?.en}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="bg-[#ffca40] text-[#136094] border-none">
                  {selectedResource && getFileExtension(selectedResource.file)}
                </Tag>
                <Button
                  type="text"
                  icon={<FiX />}
                  onClick={handlePreviewCancel}
                  className="text-gray-500 hover:text-gray-700"
                />
              </div>
            </div>
          }
          open={isPreviewModalVisible}
          onCancel={handlePreviewCancel}
          footer={
            selectedResource && (
              <div className="flex justify-between items-center">
                <div>
                  <Text type="secondary" className="text-sm">
                    File: {selectedResource.file.split("/").pop()}
                  </Text>
                </div>
                <Space>
                  <Button
                    icon={<FiExternalLink />}
                    onClick={() =>
                      window.open(getFullUrl(selectedResource.file), "_blank")
                    }
                    className="border-[#136094] text-[#136094]"
                  >
                    Open in New Tab
                  </Button>
                  <Button
                    type="primary"
                    icon={<FiDownload />}
                    onClick={() =>
                      downloadFile(
                        getFullUrl(selectedResource.file),
                        selectedResource.file.split("/").pop()
                      )
                    }
                    className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
                  >
                    Download
                  </Button>
                </Space>
              </div>
            )
          }
          width="95%"
          style={{ top: 20, maxWidth: "1200px" }}
          destroyOnClose
          className="preview-modal"
        >
          <div className="min-h-[80vh]">
            {previewLoading && (
              <div className="flex items-center justify-center h-64">
                <Spin size="large" className="text-[#136094]" />
                <Text className="ml-4 text-[#136094]">Loading preview...</Text>
              </div>
            )}

            {previewError && (
              <div className="text-center py-8">
                <Alert
                  message="Preview Error"
                  description={previewError}
                  type="error"
                  showIcon
                  className="mb-4"
                />
                <Space>
                  <Button
                    type="default"
                    icon={<FiExternalLink />}
                    onClick={() =>
                      window.open(getFullUrl(selectedResource.file), "_blank")
                    }
                    className="border-[#136094] text-[#136094]"
                  >
                    Open in New Tab
                  </Button>
                  <Button
                    type="primary"
                    icon={<FiDownload />}
                    onClick={() =>
                      downloadFile(
                        getFullUrl(selectedResource.file),
                        selectedResource.file.split("/").pop()
                      )
                    }
                    className="bg-[#136094] hover:bg-[#0f4a7a] border-none"
                  >
                    Download Instead
                  </Button>
                </Space>
              </div>
            )}

            {!previewLoading && !previewError && previewContent}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ResourceFilesViewer;
