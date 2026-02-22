const FileModel = require("../models/FileModel");
const FolderModel = require("../models/FolderModel");
const ActivityModel = require("../models/ActivityModel");
const path = require("path");
const fs = require("fs");
const { UPLOAD_BASE } = require("../config/upload");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const { folder_id, description, tags } = req.body;
    const created_by = req.user ? req.user.id : null;

    // Validate folder exists
    if (folder_id) {
      const folder = await FolderModel.getById(folder_id);
      if (!folder) {
        // Delete uploaded file if folder doesn't exist
        fs.unlinkSync(path.join(UPLOAD_BASE, req.file.filename));
        return res
          .status(404)
          .json({ success: false, error: "Folder not found" });
      }
    }

    const fileData = {
      folder_id: folder_id || null,
      filename: req.file.filename,
      original_name: req.file.originalname,
      mime_type: req.file.mimetype,
      size: req.file.size,
      path: req.file.filename,
      description: description || null,
      tags: tags || null,
      created_by: created_by,
    };

    const savedFile = await FileModel.create(fileData);

    // Log activity
    await ActivityModel.log({
      user_id: created_by,
      action: "file_upload",
      resource_type: "file",
      resource_id: savedFile.id,
      details: `Uploaded file: ${req.file.originalname}`,
      ip_address: req.ip,
    });

    res.status(201).json({
      success: true,
      data: savedFile,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload file error:", error);

    // Clean up uploaded file on error
    if (req.file && req.file.filename) {
      try {
        fs.unlinkSync(path.join(UPLOAD_BASE, req.file.filename));
      } catch (cleanupError) {
        console.error("File cleanup error:", cleanupError);
      }
    }

    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFile = async (req, res) => {
  try {
    const file_id = parseInt(req.params.id);
    const file = await FileModel.getById(file_id);

    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    res.status(200).json({ success: true, data: file });
  } catch (error) {
    console.error("Get file error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file_id = parseInt(req.params.id);
    const file = await FileModel.getById(file_id);

    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    const filePath = path.join(UPLOAD_BASE, file.path);

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, error: "File not found on server" });
    }

    // Increment download count
    await FileModel.incrementDownloadCount(file_id);

    // Log activity
    await ActivityModel.log({
      user_id: req.user ? req.user.id : null,
      action: "file_download",
      resource_type: "file",
      resource_id: file_id,
      details: `Downloaded file: ${file.original_name}`,
      ip_address: req.ip,
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.original_name}"`
    );
    res.setHeader("Content-Type", file.mime_type);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download file error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.previewFile = async (req, res) => {
  try {
    const file_id = parseInt(req.params.id);
    const file = await FileModel.getById(file_id);

    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    const filePath = path.join(UPLOAD_BASE, file.path);

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, error: "File not found on server" });
    }

    // For images, PDFs, and text files, we can preview
    const previewableTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "text/html",
      "text/css",
      "text/javascript",
      "application/json",
    ];

    if (!previewableTypes.includes(file.mime_type)) {
      return res.status(400).json({
        success: false,
        error: "File type cannot be previewed",
      });
    }

    res.setHeader("Content-Type", file.mime_type);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.original_name}"`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Preview file error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const file_id = parseInt(req.params.id);
    const { folder_id, description, tags, original_name } = req.body;
    const user_id = req.user ? req.user.id : null;

    const file = await FileModel.getById(file_id);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    // Validate folder if changing
    if (folder_id && folder_id !== file.folder_id) {
      const folder = await FolderModel.getById(folder_id);
      if (!folder) {
        return res
          .status(404)
          .json({ success: false, error: "Folder not found" });
      }
    }

    const updated = await FileModel.updateById(file_id, {
      folder_id: folder_id,
      description: description,
      tags: tags,
      original_name: original_name,
    });

    // Log activity
    await ActivityModel.log({
      user_id: user_id,
      action: "file_update",
      resource_type: "file",
      resource_id: file_id,
      details: `Updated file: ${file.original_name}`,
      ip_address: req.ip,
    });

    res
      .status(200)
      .json({
        success: true,
        data: updated,
        message: "File updated successfully",
      });
  } catch (error) {
    console.error("Update file error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file_id = parseInt(req.params.id);
    const user_id = req.user ? req.user.id : null;

    const file = await FileModel.getById(file_id);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    const filePath = path.join(UPLOAD_BASE, file.path);

    // Delete database record
    await FileModel.deleteById(file_id);

    // Delete physical file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Log activity
    await ActivityModel.log({
      user_id: user_id,
      action: "file_delete",
      resource_type: "file",
      resource_id: file_id,
      details: `Deleted file: ${file.original_name}`,
      ip_address: req.ip,
    });

    res
      .status(200)
      .json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.searchFiles = async (req, res) => {
  try {
    const { q } = req.query;
    const user_id = req.user ? req.user.id : null;

    if (!q || q.trim() === "") {
      return res
        .status(400)
        .json({ success: false, error: "Search query is required" });
    }

    const results = await FileModel.search(q.trim(), user_id);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Search files error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRecentFiles = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const user_id = req.user ? req.user.id : null;

    const files = await FileModel.getRecent(parseInt(limit), user_id);
    res.status(200).json({ success: true, data: files });
  } catch (error) {
    console.error("Get recent files error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
