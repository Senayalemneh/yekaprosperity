const FolderModel = require("../models/FolderModel");
const FileModel = require("../models/FileModel");
const ActivityModel = require("../models/ActivityModel");

exports.createFolder = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    const created_by = req.user ? req.user.id : null;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: "Folder name is required" });
    }

    const folder = await FolderModel.create({
      name: name.trim(),
      parent_id: parent_id || null,
      created_by: created_by
    });

    // Log activity
    await ActivityModel.log({
      user_id: created_by,
      action: 'folder_create',
      resource_type: 'folder',
      resource_id: folder.id,
      details: `Created folder: ${name}`,
      ip_address: req.ip
    });

    res.status(201).json({ success: true, data: folder, message: "Folder created successfully" });
  } catch (error) {
    console.error("Create folder error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllFolders = async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const folders = await FolderModel.getAll(user_id);
    const tree = FolderModel.buildTree(folders);
    
    res.status(200).json({ success: true, data: tree });
  } catch (error) {
    console.error("Get folders error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFolder = async (req, res) => {
  try {
    const folder_id = parseInt(req.params.id);
    const user_id = req.user ? req.user.id : null;

    const folder = await FolderModel.getById(folder_id);
    if (!folder) {
      return res.status(404).json({ success: false, error: "Folder not found" });
    }

    const files = await FileModel.getByFolderId(folder_id);
    const subfolders = await FolderModel.getSubfolders(folder_id);

    res.status(200).json({ 
      success: true, 
      data: {
        folder: folder,
        files: files,
        subfolders: subfolders
      }
    });
  } catch (error) {
    console.error("Get folder error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateFolder = async (req, res) => {
  try {
    const folder_id = parseInt(req.params.id);
    const { name, parent_id } = req.body;
    const user_id = req.user ? req.user.id : null;

    const folder = await FolderModel.getById(folder_id);
    if (!folder) {
      return res.status(404).json({ success: false, error: "Folder not found" });
    }

    const updated = await FolderModel.updateById(folder_id, {
      name: name,
      parent_id: parent_id
    });

    // Log activity
    await ActivityModel.log({
      user_id: user_id,
      action: 'folder_update',
      resource_type: 'folder',
      resource_id: folder_id,
      details: `Updated folder: ${folder.name} -> ${name}`,
      ip_address: req.ip
    });

    res.status(200).json({ success: true, data: updated, message: "Folder updated successfully" });
  } catch (error) {
    console.error("Update folder error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const folder_id = parseInt(req.params.id);
    const user_id = req.user ? req.user.id : null;

    const folder = await FolderModel.getById(folder_id);
    if (!folder) {
      return res.status(404).json({ success: false, error: "Folder not found" });
    }

    // Check if folder has files or subfolders
    const files = await FileModel.getByFolderId(folder_id);
    const subfolders = await FolderModel.getSubfolders(folder_id);

    if (files.length > 0 || subfolders.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Cannot delete folder that contains files or subfolders" 
      });
    }

    await FolderModel.deleteById(folder_id);

    // Log activity
    await ActivityModel.log({
      user_id: user_id,
      action: 'folder_delete',
      resource_type: 'folder',
      resource_id: folder_id,
      details: `Deleted folder: ${folder.name}`,
      ip_address: req.ip
    });

    res.status(200).json({ success: true, message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Delete folder error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.searchFolders = async (req, res) => {
  try {
    const { q } = req.query;
    const user_id = req.user ? req.user.id : null;

    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, error: "Search query is required" });
    }

    const results = await FolderModel.search(q.trim(), user_id);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Search folders error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};