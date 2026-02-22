import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  Modal,
  Input,
  Upload,
  Table,
  Space,
  message,
  Popconfirm,
  Breadcrumb,
  Empty,
  Tag,
  Tooltip,
  Dropdown,
  Layout,
  theme,
  FloatButton,
  Form,
  Select,
  List,
  Avatar,
  Badge,
  Tabs,
  Image,
} from "antd";
import {
  FolderOutlined,
  FolderOpenOutlined,
  FileOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
  EyeOutlined,
  MoreOutlined,
  ShareAltOutlined,
  StarOutlined,
  StarFilled,
  SearchOutlined,
  CloudUploadOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  HistoryOutlined,
  HeartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  FiFolder,
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiArchive,
  FiCode,
  FiBook,
} from "react-icons/fi";
import axios from "axios";
import moment from "moment";
import {getApiUrl} from "../../utils/getApiUrl";

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Use your actual backend port (5001 from your Express app)
const BASE = getApiUrl() + "api/dms";
const UPLOADS_BASE = getApiUrl() + "uploads"; // Base URL for file access

const DMS = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("files");
  const uploadRef = useRef();
  const [form] = Form.useForm();

  // Fetch all data
  const fetchFolders = async () => {
    try {
      const res = await axios.get(`${BASE}folders`);
      setFolders(res.data.data);
    } catch (error) {
      console.error("Fetch folders error:", error);
      message.error("Failed to fetch folders");
    }
  };

  const fetchFiles = async (folderId) => {
    try {
      const res = await axios.get(`${BASE}folders/${folderId}`);
      console.log("Files response:", res.data); // Debug log
      // Handle both response formats
      if (res.data.data && res.data.data.files) {
        setFiles(res.data.data.files || []);
      } else if (Array.isArray(res.data.data)) {
        setFiles(res.data.data);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error("Fetch files error:", error);
      message.error("Failed to fetch files");
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${BASE}favorites`);
      setFavorites(res.data.data || []);
    } catch (error) {
      console.error("Fetch favorites error:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${BASE}activities`);
      setActivities(res.data.data || []);
    } catch (error) {
      console.error("Fetch activities error:", error);
    }
  };

  useEffect(() => {
    fetchFolders();
    fetchFavorites();
    fetchActivities();
  }, []);

  const openFolder = (folder) => {
    setSelectedFolder(folder);
    fetchFiles(folder.id);
    setSelectedItems([]);
    setActiveTab("files");
  };

  // Folder operations
  const createFolder = async () => {
    if (!folderName.trim()) return message.error("Folder name required");

    setActionLoading(true);
    try {
      await axios.post(`${BASE}folders`, {
        name: folderName,
        parent_id: selectedFolder?.id || null,
      });
      message.success("Folder created successfully! 🎉");
      fetchFolders();
      setModalOpen(false);
      setFolderName("");
    } catch (error) {
      console.error("Create folder error:", error);
      message.error(error.response?.data?.error || "Failed to create folder");
    } finally {
      setActionLoading(false);
    }
  };

  const renameFolder = async () => {
    if (!folderName.trim()) return message.error("Folder name required");

    try {
      await axios.put(`${BASE}folders/${editingFolder.id}`, {
        name: folderName,
      });
      message.success("Folder renamed successfully! ✏️");
      fetchFolders();
      setEditingFolder(null);
      setFolderName("");
    } catch (error) {
      console.error("Rename folder error:", error);
      message.error(error.response?.data?.error || "Failed to rename folder");
    }
  };

  const deleteFolder = async (folder) => {
    try {
      await axios.delete(`${BASE}folders/${folder.id}`);
      message.success("Folder deleted successfully! 🗑️");
      fetchFolders();
      if (selectedFolder?.id === folder.id) {
        setSelectedFolder(null);
        setFiles([]);
      }
    } catch (error) {
      console.error("Delete folder error:", error);
      message.error(error.response?.data?.error || "Failed to delete folder");
    }
  };

  // File operations
  const uploadProps = {
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      // Client-side validation
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error("File must be smaller than 50MB!");
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      if (!selectedFolder) {
        message.error("Please select a folder first");
        onError(new Error("No folder selected"));
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder_id", selectedFolder.id);

        const response = await axios.post(`${BASE}files/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // You can add progress tracking here
          },
        });

        console.log("Upload response:", response.data); // Debug log

        message.success(`${file.name} uploaded successfully! 📁`);
        fetchFiles(selectedFolder.id);
        fetchActivities();
        onSuccess("ok");
      } catch (error) {
        console.error("Upload error:", error);
        message.error(`Failed to upload ${file.name}`);
        onError(error);
      } finally {
        setUploading(false);
      }
    },
  };

  const deleteFile = async (id) => {
    try {
      await axios.delete(`${BASE}files/${id}`);
      message.success("File deleted successfully! 🗑️");
      fetchFiles(selectedFolder.id);
      fetchActivities();
    } catch (error) {
      console.error("Delete file error:", error);
      message.error(error.response?.data?.error || "Failed to delete file");
    }
  };

  const downloadFile = async (file) => {
    try {
      // Use the direct file URL for download
      const fileUrl = `${UPLOADS_BASE}/${file.filename || file.path}`;
      window.open(fileUrl, "_blank");

      // Optionally call the API endpoint to track download count
      try {
        await axios.get(`${BASE}files/${file.id}/download`);
      } catch (trackError) {
        console.error("Download tracking error:", trackError);
      }
    } catch (error) {
      console.error("Download error:", error);
      message.error("Failed to download file");
    }
  };

  const handlePreview = async (file) => {
    try {
      const fileUrl = `${UPLOADS_BASE}/${file.filename || file.path}`;

      // For images, show in modal preview
      if (file.mime_type && file.mime_type.startsWith("image/")) {
        setPreviewFile({
          ...file,
          previewUrl: fileUrl,
        });
        setPreviewVisible(true);
      } else {
        // For other files, open in new tab
        window.open(fileUrl, "_blank");
      }
    } catch (error) {
      console.error("Preview error:", error);
      message.error("Preview not available for this file type");
    }
  };

  // Get full file URL for display
  const getFileUrl = (file) => {
    return `${UPLOADS_BASE}/${file.filename || file.path}`;
  };

  // Favorite operations
  const toggleFavorite = async (resource_type, resource_id) => {
    try {
      const isFavorited = favorites.some(
        (fav) =>
          fav.resource_type === resource_type && fav.resource_id === resource_id
      );

      if (isFavorited) {
        await axios.delete(`${BASE}favorites`, {
          data: { resource_type, resource_id },
        });
        message.success("Removed from favorites");
      } else {
        await axios.post(`${BASE}favorites`, {
          resource_type,
          resource_id,
        });
        message.success("Added to favorites");
      }
      fetchFavorites();
      fetchActivities();
    } catch (error) {
      console.error("Favorite error:", error);
      message.error("Failed to update favorites");
    }
  };

  const isFavorited = (resource_type, resource_id) => {
    return favorites.some(
      (fav) =>
        fav.resource_type === resource_type && fav.resource_id === resource_id
    );
  };

  // File type detection and icons
  const getFileIcon = (fileName, mime_type = "") => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const iconProps = { size: 20 };

    // Check by MIME type first, then by extension
    if (mime_type.startsWith("image/")) {
      return <FiImage {...iconProps} className="text-green-500" />;
    } else if (mime_type.startsWith("video/")) {
      return <FiVideo {...iconProps} className="text-purple-500" />;
    } else if (mime_type.startsWith("audio/")) {
      return <FiMusic {...iconProps} className="text-yellow-500" />;
    }

    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <FiImage {...iconProps} className="text-green-500" />;
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <FiVideo {...iconProps} className="text-purple-500" />;
      case "mp3":
      case "wav":
      case "flac":
        return <FiMusic {...iconProps} className="text-yellow-500" />;
      case "zip":
      case "rar":
      case "tar":
      case "gz":
        return <FiArchive {...iconProps} className="text-orange-500" />;
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "html":
      case "css":
        return <FiCode {...iconProps} className="text-red-500" />;
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <FiBook {...iconProps} className="text-red-400" />;
      default:
        return <FileOutlined className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Table columns
  const fileColumns = [
    {
      title: "Name",
      dataIndex: "original_name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          {getFileIcon(name, record.mime_type)}
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            {record.description && (
              <span className="text-gray-500 text-xs">
                {record.description}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "mime_type",
      key: "type",
      render: (mimeType) => {
        const type = mimeType ? mimeType.split("/")[1]?.toUpperCase() : "FILE";
        return <Tag color="blue">{type}</Tag>;
      },
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size) => formatFileSize(size),
    },
    {
      title: "Downloads",
      dataIndex: "download_count",
      key: "downloads",
      render: (count) => count || 0,
    },
    {
      title: "Uploaded",
      dataIndex: "created_at",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, file) => (
        <Space>
          <Tooltip title="Download">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => downloadFile(file)}
            />
          </Tooltip>
          <Tooltip title="Preview">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(file)}
            />
          </Tooltip>
          <Tooltip
            title={
              isFavorited("file", file.id)
                ? "Remove Favorite"
                : "Add to Favorites"
            }
          >
            <Button
              type="text"
              icon={
                isFavorited("file", file.id) ? (
                  <StarFilled className="text-yellow-500" />
                ) : (
                  <StarOutlined />
                )
              }
              onClick={() => toggleFavorite("file", file.id)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this file?"
            description="This action cannot be undone."
            onConfirm={() => deleteFile(file.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const folderMenuItems = (folder) => [
    {
      key: "rename",
      icon: <EditOutlined />,
      label: "Rename",
      onClick: () => {
        setEditingFolder(folder);
        setFolderName(folder.name);
      },
    },
    {
      key: "favorite",
      icon: isFavorited("folder", folder.id) ? (
        <StarFilled />
      ) : (
        <StarOutlined />
      ),
      label: isFavorited("folder", folder.id)
        ? "Remove Favorite"
        : "Add to Favorites",
      onClick: () => toggleFavorite("folder", folder.id),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      danger: true,
      onClick: () => deleteFolder(folder),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: colorBgContainer }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        style={{
          background: colorBgContainer,
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`font-bold text-lg ${collapsed ? "hidden" : "block"}`}
            >
              📁 Document Manager
            </h2>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>

          {!collapsed && (
            <>
              <Search
                placeholder="Search files and folders..."
                allowClear
                onSearch={(value) => setSearchText(value)}
                className="mb-4"
              />

              <div className="space-y-2 mb-6">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  block
                  onClick={() => setModalOpen(true)}
                >
                  New Folder
                </Button>
                {selectedFolder && (
                  <Upload {...uploadProps} ref={uploadRef}>
                    <Button
                      icon={<CloudUploadOutlined />}
                      block
                      loading={uploading}
                    >
                      Upload Files
                    </Button>
                  </Upload>
                )}
              </div>

              <Tabs
                defaultActiveKey="browse"
                size="small"
                onChange={(key) => {
                  if (key === "favorites") fetchFavorites();
                  if (key === "activities") fetchActivities();
                }}
              >
                <TabPane tab="Browse" key="browse">
                  <div className="mt-2">
                    <h3 className="font-semibold text-gray-500 mb-3">
                      Folders
                    </h3>
                    {folders.length === 0 ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No folders"
                      />
                    ) : (
                      <div className="space-y-1 max-h-96 overflow-y-auto">
                        {folders.map((folder) => (
                          <div
                            key={folder.id}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                              selectedFolder?.id === folder.id
                                ? "bg-blue-50 border border-blue-200"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className="flex items-center space-x-2 flex-1"
                              onClick={() => openFolder(folder)}
                            >
                              {selectedFolder?.id === folder.id ? (
                                <FolderOpenOutlined className="text-blue-500" />
                              ) : (
                                <FolderOutlined className="text-gray-500" />
                              )}
                              <span className="truncate flex-1">
                                {folder.name}
                              </span>
                              {isFavorited("folder", folder.id) && (
                                <StarFilled className="text-yellow-500 text-xs" />
                              )}
                            </div>

                            <Dropdown
                              menu={{ items: folderMenuItems(folder) }}
                              trigger={["click"]}
                              placement="bottomRight"
                            >
                              <Button
                                type="text"
                                icon={<MoreOutlined />}
                                size="small"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Dropdown>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabPane>

                <TabPane
                  tab="Favorites"
                  key="favorites"
                  icon={<HeartOutlined />}
                >
                  <div className="mt-2">
                    {favorites.length === 0 ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No favorites"
                      />
                    ) : (
                      <div className="space-y-2">
                        {favorites.map((fav) => (
                          <div
                            key={`${fav.resource_type}-${fav.resource_id}`}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              if (fav.resource_type === "folder") {
                                const folder = folders.find(
                                  (f) => f.id === fav.resource_id
                                );
                                if (folder) openFolder(folder);
                              }
                            }}
                          >
                            {fav.resource_type === "folder" ? (
                              <FolderOutlined className="text-blue-500" />
                            ) : (
                              <FileOutlined className="text-gray-500" />
                            )}
                            <span className="truncate flex-1 text-sm">
                              {fav.name}
                            </span>
                            <StarFilled className="text-yellow-500 text-xs" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabPane>

                <TabPane
                  tab="Activities"
                  key="activities"
                  icon={<HistoryOutlined />}
                >
                  <div className="mt-2">
                    {activities.length === 0 ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No activities"
                      />
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {activities.slice(0, 10).map((activity) => (
                          <div
                            key={activity.id}
                            className="text-xs p-2 border-b"
                          >
                            <div className="font-medium">{activity.action}</div>
                            <div className="text-gray-500">
                              {new Date(activity.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </>
          )}
        </div>
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Button type="text" onClick={() => setSelectedFolder(null)}>
                  Home
                </Button>
              </Breadcrumb.Item>
              {selectedFolder && (
                <Breadcrumb.Item>
                  <span className="text-blue-600">{selectedFolder.name}</span>
                </Breadcrumb.Item>
              )}
            </Breadcrumb>

            <Space>
              <Tooltip title={viewMode === "grid" ? "List View" : "Grid View"}>
                <Button
                  icon={
                    viewMode === "grid" ? (
                      <UnorderedListOutlined />
                    ) : (
                      <AppstoreOutlined />
                    )
                  }
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                />
              </Tooltip>
            </Space>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {selectedFolder ? (
            <div className="p-6">
              {/* Header Actions */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {selectedFolder.name}
                  </h1>
                  <p className="text-gray-500">
                    {files.length} files • {selectedFolder.file_count || 0}{" "}
                    total files
                  </p>
                </div>

                <Space>
                  <Upload {...uploadProps}>
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      loading={uploading}
                      size="large"
                    >
                      Upload Files
                    </Button>
                  </Upload>
                </Space>
              </div>

              {/* Files Display */}
              {files.length === 0 ? (
                <Card className="text-center">
                  <Empty
                    description={
                      <div>
                        <p className="text-lg text-gray-600 mb-2">
                          No files in this folder
                        </p>
                        <p className="text-gray-500">
                          Upload your first file to get started
                        </p>
                      </div>
                    }
                  >
                    <Upload {...uploadProps}>
                      <Button
                        type="primary"
                        size="large"
                        icon={<UploadOutlined />}
                      >
                        Upload Files
                      </Button>
                    </Upload>
                  </Empty>
                </Card>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <Card
                      key={file.id}
                      hoverable
                      className="file-card"
                      cover={
                        file.mime_type &&
                        file.mime_type.startsWith("image/") ? (
                          <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-100">
                            <Image
                              alt={file.original_name}
                              src={getFileUrl(file)}
                              preview={false}
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        ) : null
                      }
                      actions={[
                        <Tooltip title="Preview">
                          <EyeOutlined onClick={() => handlePreview(file)} />
                        </Tooltip>,
                        <Tooltip title="Download">
                          <DownloadOutlined
                            onClick={() => downloadFile(file)}
                          />
                        </Tooltip>,
                        <Tooltip
                          title={
                            isFavorited("file", file.id)
                              ? "Remove Favorite"
                              : "Add to Favorites"
                          }
                        >
                          {isFavorited("file", file.id) ? (
                            <StarFilled
                              className="text-yellow-500"
                              onClick={() => toggleFavorite("file", file.id)}
                            />
                          ) : (
                            <StarOutlined
                              onClick={() => toggleFavorite("file", file.id)}
                            />
                          )}
                        </Tooltip>,
                        <Popconfirm
                          title="Delete this file?"
                          onConfirm={() => deleteFile(file.id)}
                        >
                          <Tooltip title="Delete">
                            <DeleteOutlined className="text-red-500" />
                          </Tooltip>
                        </Popconfirm>,
                      ]}
                    >
                      <div className="text-center">
                        {!file.mime_type ||
                          (!file.mime_type.startsWith("image/") && (
                            <div className="text-4xl mb-3">
                              {getFileIcon(file.original_name, file.mime_type)}
                            </div>
                          ))}
                        <h3 className="font-semibold truncate mb-1">
                          {file.original_name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-1">
                          {formatFileSize(file.size)}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {file.download_count || 0} downloads
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Table
                  dataSource={files}
                  columns={fileColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  rowSelection={{
                    selectedRowKeys: selectedItems,
                    onChange: setSelectedItems,
                  }}
                />
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="text-6xl mb-6">📁</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Welcome to Document Management System
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Select a folder from the sidebar to view its contents, or
                  create a new folder to get started.
                </p>
                <Space>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => setModalOpen(true)}
                  >
                    Create Your First Folder
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Content>
      </Layout>

      {/* Create/Rename Folder Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            {editingFolder ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingFolder ? "Rename Folder" : "Create New Folder"}</span>
          </div>
        }
        open={modalOpen || editingFolder}
        onCancel={() => {
          setModalOpen(false);
          setEditingFolder(null);
          setFolderName("");
        }}
        onOk={editingFolder ? renameFolder : createFolder}
        confirmLoading={actionLoading}
        okText={editingFolder ? "Rename" : "Create"}
      >
        <Input
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onPressEnter={editingFolder ? renameFolder : createFolder}
          size="large"
        />
      </Modal>

      {/* File Preview Modal */}
      <Modal
        open={previewVisible}
        title={previewFile?.original_name}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        style={{ top: 20 }}
      >
        {previewFile && (
          <div className="text-center">
            {previewFile.mime_type &&
            previewFile.mime_type.startsWith("image/") ? (
              <Image
                alt={previewFile.original_name}
                src={previewFile.previewUrl}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div>
                <div className="text-6xl mb-4">
                  {getFileIcon(
                    previewFile.original_name,
                    previewFile.mime_type
                  )}
                </div>
                <p className="text-gray-600 mb-4">
                  Preview for {previewFile.original_name}
                </p>
              </div>
            )}
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadFile(previewFile)}
              className="mt-4"
            >
              Download File
            </Button>
          </div>
        )}
      </Modal>

      {/* Floating Action Button */}
      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        {selectedFolder && (
          <FloatButton
            icon={<UploadOutlined />}
            tooltip="Upload Files"
            onClick={() => uploadRef.current?.upload.triggerUpload()}
          />
        )}
        <FloatButton
          icon={<PlusOutlined />}
          tooltip="New Folder"
          onClick={() => setModalOpen(true)}
        />
      </FloatButton.Group>
    </Layout>
  );
};

export default DMS;
