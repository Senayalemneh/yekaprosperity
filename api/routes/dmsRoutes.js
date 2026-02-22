const express = require('express');
const router = express.Router();

// Controllers
const folderController = require('../controllers/folderController');
const fileController = require('../controllers/fileController');
const shareController = require('../controllers/shareController');
const favoriteController = require('../controllers/favoriteController');
const activityController = require('../controllers/activityController');

// Upload middleware
const { uploadSingle, uploadMultiple } = require('../config/upload');

// Folder routes
router.post('/folders', folderController.createFolder);
router.get('/folders', folderController.getAllFolders);
router.get('/folders/:id', folderController.getFolder);
router.put('/folders/:id', folderController.updateFolder);
router.delete('/folders/:id', folderController.deleteFolder);
router.get('/folders/search', folderController.searchFolders);

// File routes
router.post('/files/upload', uploadSingle, fileController.uploadFile);
router.post('/files/upload-multiple', uploadMultiple, fileController.uploadFile);
router.get('/files/:id', fileController.getFile);
router.get('/files/:id/download', fileController.downloadFile);
router.get('/files/:id/preview', fileController.previewFile);
router.put('/files/:id', fileController.updateFile);
router.delete('/files/:id', fileController.deleteFile);
router.get('/files/search', fileController.searchFiles);
router.get('/files/recent', fileController.getRecentFiles);

// Share routes
router.post('/shares/file', shareController.shareFile);
router.get('/shares/file/:token/download', shareController.downloadSharedFile);
router.delete('/shares/file', shareController.revokeFileShare);
router.get('/shares/file/:file_id', shareController.listFileShares);

router.post('/shares/folder', shareController.shareFolder);
router.delete('/shares/folder', shareController.revokeFolderShare);
router.get('/shares/folder/:folder_id', shareController.listFolderShares);

// Favorite routes
router.post('/favorites', favoriteController.addFavorite);
router.delete('/favorites', favoriteController.removeFavorite);
router.get('/favorites', favoriteController.getFavorites);
router.get('/favorites/check', favoriteController.checkFavorite);

// Activity routes
router.get('/activities', activityController.getActivities);
router.get('/activities/user', activityController.getUserActivities);

module.exports = router;