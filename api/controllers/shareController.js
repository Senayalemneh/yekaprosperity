const ShareModel = require("../models/ShareModel");
const FileModel = require("../models/FileModel");
const FolderModel = require("../models/FolderModel");
const ActivityModel = require("../models/ActivityModel");

exports.shareFile = async (req, res) => {
  try {
    const { file_id, user_id, permission, expires_at, download_limit } = req.body;
    const shared_by = req.user ? req.user.id : null;

    if (!file_id || !user_id) {
      return res.status(400).json({ success: false, error: "File ID and User ID are required" });
    }

    const file = await FileModel.getById(file_id);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    const share = await ShareModel.shareFile({
      file_id: file_id,
      user_id: user_id,
      permission: permission || 'view',
      shared_by: shared_by,
      expires_at: expires_at || null,
      download_limit: download_limit || null
    });

    // Log activity
    await ActivityModel.log({
      user_id: shared_by,
      action: 'file_share',
      resource_type: 'file',
      resource_id: file_id,
      details: `Shared file with user ${user_id}`,
      ip_address: req.ip
    });

    res.status(201).json({ success: true, data: share, message: "File shared successfully" });
  } catch (error) {
    console.error("Share file error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.downloadSharedFile = async (req, res) => {
  try {
    const { token } = req.params;

    const share = await ShareModel.getFileShareByToken(token);
    if (!share) {
      return res.status(404).json({ success: false, error: "Shared file not found or expired" });
    }

    const filePath = path.join(UPLOAD_BASE, share.path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: "File not found on server" });
    }

    // Increment share download count
    await ShareModel.incrementShareDownloadCount(share.id);

    res.setHeader('Content-Disposition', `attachment; filename="${share.original_name}"`);
    res.setHeader('Content-Type', share.mime_type);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download shared file error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.revokeFileShare = async (req, res) => {
  try {
    const { file_id, user_id } = req.body;
    const revoked_by = req.user ? req.user.id : null;

    await ShareModel.revokeFileShare(file_id, user_id);

    // Log activity
    await ActivityModel.log({
      user_id: revoked_by,
      action: 'file_share_revoke',
      resource_type: 'file',
      resource_id: file_id,
      details: `Revoked file share for user ${user_id}`,
      ip_address: req.ip
    });

    res.status(200).json({ success: true, message: "File share revoked successfully" });
  } catch (error) {
    console.error("Revoke file share error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.listFileShares = async (req, res) => {
  try {
    const file_id = parseInt(req.params.file_id);
    const shares = await ShareModel.listFileShares(file_id);
    
    res.status(200).json({ success: true, data: shares });
  } catch (error) {
    console.error("List file shares error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.shareFolder = async (req, res) => {
  try {
    const { folder_id, user_id, permission } = req.body;
    const shared_by = req.user ? req.user.id : null;

    if (!folder_id || !user_id) {
      return res.status(400).json({ success: false, error: "Folder ID and User ID are required" });
    }

    const folder = await FolderModel.getById(folder_id);
    if (!folder) {
      return res.status(404).json({ success: false, error: "Folder not found" });
    }

    const share = await ShareModel.shareFolder({
      folder_id: folder_id,
      user_id: user_id,
      permission: permission || 'view',
      shared_by: shared_by
    });

    // Log activity
    await ActivityModel.log({
      user_id: shared_by,
      action: 'folder_share',
      resource_type: 'folder',
      resource_id: folder_id,
      details: `Shared folder with user ${user_id}`,
      ip_address: req.ip
    });

    res.status(201).json({ success: true, data: share, message: "Folder shared successfully" });
  } catch (error) {
    console.error("Share folder error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.revokeFolderShare = async (req, res) => {
  try {
    const { folder_id, user_id } = req.body;
    const revoked_by = req.user ? req.user.id : null;

    await ShareModel.revokeFolderShare(folder_id, user_id);

    // Log activity
    await ActivityModel.log({
      user_id: revoked_by,
      action: 'folder_share_revoke',
      resource_type: 'folder',
      resource_id: folder_id,
      details: `Revoked folder share for user ${user_id}`,
      ip_address: req.ip
    });

    res.status(200).json({ success: true, message: "Folder share revoked successfully" });
  } catch (error) {
    console.error("Revoke folder share error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.listFolderShares = async (req, res) => {
  try {
    const folder_id = parseInt(req.params.folder_id);
    const shares = await ShareModel.listFolderShares(folder_id);
    
    res.status(200).json({ success: true, data: shares });
  } catch (error) {
    console.error("List folder shares error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};