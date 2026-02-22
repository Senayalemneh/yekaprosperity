import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../utils/getApiUrl";
import {
  Card,
  Button,
  Tag,
  Empty,
  Input,
  Select,
  Space,
  Row,
  Col,
  Tooltip,
  Badge,
  Avatar,
  Divider,
  Modal,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "tailwindcss/tailwind.css";
import axios from "axios";
import Loader from "../common/Loader";
import { useTranslation } from "react-i18next";
import {
  TeamOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  ReloadOutlined,
  CrownOutlined,
  StarOutlined,
  ApartmentOutlined,
  RightOutlined,
  DownOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import Header from "./Header";

const { Option } = Select;

// Color constants
const COLORS = {
  primary: "#136094", // Blue
  secondary: "#008830", // Green
  accent: "#ffca40", // Yellow
  white: "#ffffff",
  lightGray: "#f8f9fa",
  darkText: "#2d3748",
};

const OrgStructure = () => {
  const { t, i18n } = useTranslation();
  const apiUrl = getApiUrl();
  const [orgData, setOrgData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(i18n.language);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [viewMode, setViewMode] = useState("tree"); // tree, grid, hierarchy
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [departments, setDepartments] = useState([]);

  // Helper functions
  const getLevelColor = (level) => {
    const levelColors = [
      COLORS.primary, // CEO/Level 0
      COLORS.secondary, // Level 1
      COLORS.accent, // Level 2
      "#8B5CF6", // Level 3 - Purple
      "#EF4444", // Level 4 - Red
    ];
    return levelColors[Math.min(level, levelColors.length - 1)];
  };

  const getLevelBadge = (level) => {
    const badges = [
      { icon: <CrownOutlined />, text: t("orgclient.ceo") },
      { icon: <StarOutlined />, text: t("orgclient.director") },
      { icon: <TeamOutlined />, text: t("orgclient.manager") },
      { icon: <UserOutlined />, text: t("orgclient.lead") },
      { icon: <UserOutlined />, text: t("orgclient.member") },
    ];
    return badges[Math.min(level, badges.length - 1)];
  };

  // Function to get all node IDs (including children recursively)
  const getAllNodeIds = (nodes) => {
    let allIds = new Set();

    const traverse = (nodeList) => {
      nodeList.forEach((node) => {
        allIds.add(node.id);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(nodes);
    return allIds;
  };

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    i18n.on("languageChanged", (lng) => setLanguage(lng));

    const fetchOrgData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}api/org-structures`);
        setOrgData(response.data.data);
        setFilteredData(response.data.data);

        // Extract unique positions/departments
        const uniquePositions = [
          ...new Set(response.data.data.map((item) => item.position)),
        ];
        setDepartments(uniquePositions);
      } catch (error) {
        console.error("Error fetching org data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgData();

    return () => {
      i18n.off("languageChanged", (lng) => setLanguage(lng));
    };
  }, [apiUrl, i18n]);

  useEffect(() => {
    filterData();
  }, [searchQuery, departmentFilter, orgData, language]);

  // Expand all nodes when filtered data changes
  useEffect(() => {
    if (filteredData.length > 0) {
      const treeData = buildTree(filteredData);
      const allNodeIds = getAllNodeIds(treeData);
      setExpandedNodes(allNodeIds);
    }
  }, [filteredData]);

  const filterData = debounce(() => {
    let filtered = [...orgData];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((item) => item.position === departmentFilter);
    }

    setFilteredData(filtered);
  }, 300);

  // Build hierarchical tree structure
  const buildTree = (data, parentId = null, level = 0) => {
    const children = data
      .filter((item) => item.parent_id === parentId)
      .map((item) => ({
        ...item,
        level,
        children: buildTree(data, item.id, level + 1),
      }));

    return children;
  };

  const treeData = buildTree(filteredData);

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const expandAll = () => {
    const allNodeIds = getAllNodeIds(treeData);
    setExpandedNodes(allNodeIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDepartmentChange = (department) => {
    setDepartmentFilter(department);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("all");
    // Don't reset expanded nodes when resetting filters
  };

  const showMemberDetails = (member) => {
    setSelectedMember(member);
    setIsModalVisible(true);
  };

  const getAvatarUrl = (image) => {
    return image ? `${apiUrl}uploads/${image}` : null;
  };

  // Render Tree View (Classic Organizational Chart)
  const renderTreeView = () => {
    const renderTreeNode = (node, isRoot = false) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const levelColor = getLevelColor(node.level);

      return (
        <div
          key={node.id}
          className={`flex flex-col items-center ${isRoot ? "" : "mt-8"}`}
        >
          {/* Node Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: node.level * 0.1 }}
            className="relative group"
          >
            {/* Connecting line from parent */}
            {!isRoot && (
              <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gray-300 transform -translate-x-1/2"></div>
            )}

            <Card
              className={`
                w-64 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 
                cursor-pointer transform hover:scale-105 relative z-10
                ${
                  isRoot
                    ? "bg-gradient-to-r from-blue-50 to-cyan-50"
                    : "bg-white"
                }
              `}
              style={{ borderColor: levelColor }}
              onClick={() => showMemberDetails(node)}
            >
              <div className="text-center">
                <Avatar
                  size={64}
                  src={getAvatarUrl(node.image)}
                  icon={!node.image && <UserOutlined />}
                  className="border-4 mx-auto mb-3 shadow-md"
                  style={{ borderColor: levelColor }}
                />
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {node.name}
                </h3>
                <Tag
                  color={levelColor}
                  className="rounded-full px-3 py-1 mb-2 border-none text-white font-semibold text-xs"
                >
                  {node.position}
                </Tag>
                <div className="flex justify-center space-x-2 text-gray-500 text-sm">
                  <Tooltip title="View Details">
                    <EyeOutlined className="hover:text-blue-500 transition-colors" />
                  </Tooltip>
                  {hasChildren && (
                    <Tooltip
                      title={isExpanded ? "Collapse Team" : "Expand Team"}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNode(node.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Children Container */}
          {hasChildren && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative mt-8"
                >
                  {/* Horizontal connector line */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 transform -translate-x-1/2"></div>

                  {/* Children in a row */}
                  <div className="flex flex-wrap justify-center gap-8 relative">
                    {/* Vertical line connecting to children */}
                    {node.children.length > 0 && (
                      <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 transform -translate-x-1/2"></div>
                    )}

                    {node.children.map((child, index) => (
                      <div key={child.id} className="relative">
                        {/* Horizontal line to child */}
                        {node.children.length > 1 && (
                          <>
                            <div
                              className="absolute top-0 left-1/2 w-full h-0.5 bg-gray-300"
                              style={{
                                width:
                                  index === 0
                                    ? "50%"
                                    : index === node.children.length - 1
                                    ? "50%"
                                    : "100%",
                                left:
                                  index === 0
                                    ? "50%"
                                    : index === node.children.length - 1
                                    ? "0%"
                                    : "0%",
                              }}
                            ></div>
                          </>
                        )}
                        {renderTreeNode(child)}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      );
    };

    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border">
        {/* Tree Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Badge
              count={filteredData.length}
              showZero
              style={{
                backgroundColor: COLORS.primary,
                fontWeight: "bold",
              }}
            >
              <span className="text-gray-700 font-medium">
                {t("orgclient.teamMembers")}
              </span>
            </Badge>
            <Tag color="green" className="ml-2">
              All Expanded
            </Tag>
          </div>
          <Space>
            <Button onClick={expandAll} size="small" type="primary">
              Expand All
            </Button>
            <Button onClick={collapseAll} size="small">
              Collapse All
            </Button>
          </Space>
        </div>

        {/* Tree Container */}
        <div className="overflow-x-auto">
          <div className="min-w-max py-8">
            {treeData.map((rootNode) => renderTreeNode(rootNode, true))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-3">
            Organization Levels:
          </h4>
          <div className="flex flex-wrap gap-4">
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getLevelColor(level) }}
                ></div>
                <span className="text-sm text-gray-600">
                  {getLevelBadge(level).text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render hierarchical list view (previous implementation)
  const renderHierarchyView = () => {
    const renderTreeNode = (node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const levelBadge = getLevelBadge(node.level);
      const levelColor = getLevelColor(node.level);

      return (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: node.level * 0.1 }}
          className="mb-4"
        >
          <div
            className={`relative p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
              node.level === 0
                ? "bg-gradient-to-r from-blue-50 to-cyan-50"
                : "bg-white"
            }`}
            style={{ borderColor: levelColor + "40" }}
          >
            {/* Level Indicator */}
            <div
              className="absolute top-0 left-0 w-2 h-full rounded-l-2xl"
              style={{ backgroundColor: levelColor }}
            ></div>

            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  size={80}
                  src={getAvatarUrl(node.image)}
                  icon={!node.image && <UserOutlined />}
                  className="border-4 shadow-lg"
                  style={{ borderColor: levelColor }}
                />
                <div
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: levelColor }}
                >
                  {levelBadge.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {node.name}
                    </h3>
                    <Tag
                      color={levelColor}
                      className="rounded-full px-3 py-1 border-none text-white font-semibold"
                    >
                      {levelBadge.text}
                    </Tag>
                  </div>
                  <Space>
                    {hasChildren && (
                      <Button
                        type="text"
                        icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
                        onClick={() => toggleNode(node.id)}
                        className="text-gray-500 hover:text-gray-700"
                      />
                    )}
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<EyeOutlined />}
                      onClick={() => showMemberDetails(node)}
                      style={{ backgroundColor: levelColor }}
                    />
                  </Space>
                </div>

                <p
                  className="text-lg font-semibold mb-2"
                  style={{ color: levelColor }}
                >
                  {node.position}
                </p>

                {/* Stats */}
                {hasChildren && (
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <TeamOutlined className="mr-1" />
                      {node.children.length} {t("orgclient.teamMembers")}
                    </span>
                    <Tag color={isExpanded ? "green" : "blue"}>
                      {isExpanded ? "Expanded" : "Collapsed"}
                    </Tag>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Children */}
          <AnimatePresence>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-8 pl-6 border-l-2 border-dashed"
                style={{ borderColor: levelColor + "40" }}
              >
                {node.children.map((child) => renderTreeNode(child))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border">
        <div className="flex justify-between items-center mb-4">
          <Tag color="green">All nodes expanded by default</Tag>
          <Space>
            <Button onClick={expandAll} size="small" type="primary">
              Expand All
            </Button>
            <Button onClick={collapseAll} size="small">
              Collapse All
            </Button>
          </Space>
        </div>
        {treeData.map((node) => renderTreeNode(node))}
      </div>
    );
  };

  // Render grid view
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map((member, index) => {
          const calculateLevel = (member) => {
            if (member.parent_id === null) return 0;
            const parent = orgData.find((m) => m.id === member.parent_id);
            return parent
              ? parent.level !== undefined
                ? parent.level + 1
                : 1
              : 1;
          };

          const level = calculateLevel(member);
          const levelColor = getLevelColor(level);

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card
                bordered={false}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => showMemberDetails(member)}
                cover={
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <Avatar
                      size={120}
                      src={getAvatarUrl(member.image)}
                      icon={!member.image && <UserOutlined />}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 shadow-xl group-hover:scale-110 transition-transform duration-300"
                      style={{ borderColor: levelColor }}
                    />
                  </div>
                }
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <Tag
                    color={levelColor}
                    className="rounded-full px-3 py-1 mb-3 border-none text-white font-semibold"
                  >
                    {member.position}
                  </Tag>
                  <div className="flex justify-center space-x-2 text-gray-500">
                    <Tooltip title="View Profile">
                      <EyeOutlined className="hover:text-blue-500 transition-colors" />
                    </Tooltip>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
    <Header/>
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            }}
          >
            <ApartmentOutlined className="text-3xl text-white" />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            {t("orgclient.title")}
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-600">
            {t("orgclient.subtitle")}
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 mb-8 border shadow-lg"
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder={t("orgclient.searchPlaceholder")}
                value={searchQuery}
                onChange={handleSearch}
                prefix={<SearchOutlined style={{ color: COLORS.primary }} />}
                className="rounded-xl h-12"
                allowClear
              />
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Select
                value={departmentFilter}
                onChange={handleDepartmentChange}
                className="w-full rounded-xl h-12"
                suffixIcon={
                  <FilterOutlined style={{ color: COLORS.primary }} />
                }
              >
                <Option value="all">{t("orgclient.allDepartments")}</Option>
                {departments.map((dept) => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Select
                value={viewMode}
                onChange={setViewMode}
                className="w-full rounded-xl h-12"
              >
                <Option value="tree">{t("orgclient.treeView")}</Option>
                <Option value="hierarchy">
                  {t("orgclient.hierarchyView")}
                </Option>
                <Option value="grid">{t("orgclient.gridView")}</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Button
                icon={<ReloadOutlined />}
                onClick={resetFilters}
                className="w-full h-12 rounded-xl font-semibold"
                style={{
                  backgroundColor: COLORS.accent,
                  color: COLORS.primary,
                  border: "none",
                }}
              >
                {t("orgclient.resetFilters")}
              </Button>
            </Col>

            <Col xs={24} md={5} className="text-center md:text-right">
              <Badge
                count={filteredData.length}
                showZero
                style={{
                  backgroundColor: COLORS.primary,
                  fontWeight: "bold",
                }}
              >
                <span className="text-gray-700 font-medium">
                  {t("orgclient.teamMembers")}
                </span>
              </Badge>
            </Col>
          </Row>
        </motion.div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader />
          </div>
        ) : (
          <>
            {filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-12 shadow-lg border"
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-lg text-gray-600">
                      {t("orgclient.noMembersFound")}
                    </span>
                  }
                >
                  <Button
                    type="primary"
                    onClick={resetFilters}
                    size="large"
                    className="rounded-xl h-11 px-6 font-semibold"
                    style={{
                      backgroundColor: COLORS.primary,
                      border: "none",
                    }}
                  >
                    {t("orgclient.resetFilters")}
                  </Button>
                </Empty>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {viewMode === "tree"
                  ? renderTreeView()
                  : viewMode === "hierarchy"
                  ? renderHierarchyView()
                  : renderGridView()}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Member Detail Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <UserOutlined className="text-blue-500 mr-2" />
            <span>{t("orgclient.memberDetails")}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-2xl"
      >
        {selectedMember && (
          <div className="p-4">
            <div className="text-center mb-6">
              <Avatar
                size={120}
                src={getAvatarUrl(selectedMember.image)}
                icon={!selectedMember.image && <UserOutlined />}
                className="border-4 mx-auto mb-4 shadow-lg"
                style={{ borderColor: COLORS.primary }}
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedMember.name}
              </h2>
              <Tag
                color={COLORS.primary}
                className="rounded-full px-4 py-1 text-lg border-none text-white font-semibold"
              >
                {selectedMember.position}
              </Tag>
            </div>

            <Divider />

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">
                  {t("orgclient.joinDate")}:
                </span>
                <span className="text-gray-600">
                  {new Date(selectedMember.created_at).toLocaleDateString()}
                </span>
              </div>

              {selectedMember.parent_id && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">
                    {t("orgclient.reportsTo")}:
                  </span>
                  <span className="text-gray-600">
                    {orgData.find((m) => m.id === selectedMember.parent_id)
                      ?.name || "N/A"}
                  </span>
                </div>
              )}

              {/* Team Members (if any) */}
              {orgData.filter((m) => m.parent_id === selectedMember.id).length >
                0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {t("orgclient.teamMembers")}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {orgData
                      .filter((m) => m.parent_id === selectedMember.id)
                      .map((member) => (
                        <Tag
                          key={member.id}
                          color="blue"
                          className="rounded-full"
                        >
                          {member.name}
                        </Tag>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
    </div>
  );
};

export default OrgStructure;
