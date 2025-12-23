const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const minioClient = require('../config/minio');
const { File } = require('../models/file.model');
const authenticate = require('../middleware/auth.middleware');

const { getFilesByUser, viewFile, deleteFile } = require('../controllers/file.controller');
const { renameFile } = require('../controllers/file.controller');
// Memory storage cho multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------------
// Upload file
// Route: POST /upload
// FE gửi field name là 'file'
// -------------------------
router.post('/upload', authenticate, upload.array('file'), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = [];

        for (let file of files) {
            const ext = path.extname(file.originalname);
            const fileName = crypto.randomBytes(8).toString('hex') + ext;

            console.log('Uploading file:', file.originalname, '=>', fileName);

            // Upload lên MinIO
            await minioClient.putObject(
                process.env.MINIO_BUCKET,
                fileName,
                file.buffer,
                { 'Content-Type': file.mimetype }
            );

            // Lưu metadata vào MySQL với userId từ token
            const savedFile = await File.create({
                name: file.originalname,
                key: fileName,
                size: file.size,
                mimeType: file.mimetype,
                userId: req.user.id
            });

            uploadedFiles.push(savedFile);
        }

        console.log('All files uploaded:', uploadedFiles.map(f => f.name));
        res.json({ message: 'Files uploaded successfully', files: uploadedFiles });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});

// -------------------------
// Lấy tất cả file của user
// Route: GET /my-files
// -------------------------
router.get('/my-files', authenticate, getFilesByUser);

// -------------------------
// Xem file
// Route: GET /:id/view
// -------------------------
router.get('/:id/view', authenticate, viewFile);
// Route view file công khai (token query) → redirect presigned URL
// GET /:id/view-public?token=...
router.get('/:id/view-public', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    const file = await File.findOne({ where: { id: req.params.id, userId: decoded.id } });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const bucket = process.env.MINIO_BUCKET;
    const expiry = 60 * 5;
    minioClient.presignedGetObject(bucket, file.key, expiry, (err, url) => {
      if (err) return res.status(500).json({ message: 'Cannot generate view url' });
      res.redirect(url);
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Download file (private, user phải login)
router.get('/:id/download', authenticate, async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    // Lấy file từ DB
    const file = await File.findOne({ where: { id: fileId, userId } });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const bucket = process.env.MINIO_BUCKET;
    const expiry = 60 * 5; // 5 phút

    minioClient.presignedGetObject(bucket, file.key, expiry, (err, url) => {
      if (err) return res.status(500).json({ message: 'Cannot generate download url' });

      // Thêm query để force download
      const downloadUrl = url + '&response-content-disposition=attachment; filename="' + encodeURIComponent(file.name) + '"';
      res.redirect(downloadUrl);
    });
  } catch (err) {
    console.error('Download file error:', err);
    res.status(500).json({ message: 'Download failed', error: err.message });
  }
});

// Route download file công khai (token query)
router.get('/:id/download-public', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);

    const file = await File.findOne({ where: { id: req.params.id, userId: decoded.id } });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const bucket = process.env.MINIO_BUCKET;

    minioClient.getObject(bucket, file.key, (err, stream) => {
      if (err) {
        console.error('MinIO download-public error:', err);
        return res.status(500).json({ message: 'Cannot download file' });
      }

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${file.name}"`
      );
      res.setHeader('Content-Type', file.mimeType);

      stream.pipe(res);
    });

  } catch (err) {
    console.error('Download public file error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Route: GET /:id/share
router.get('/:id/share', authenticate, async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    const file = await File.findOne({ where: { id: fileId, userId } });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const bucket = process.env.MINIO_BUCKET;
    const expiry = 60 * 60 * 24; // 24h

    minioClient.presignedGetObject(bucket, file.key, expiry, (err, url) => {
      if (err) return res.status(500).json({ message: 'Cannot generate share url' });

      res.json({ shareUrl: url }); // FE sẽ copy link này
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Share file failed', error: err.message });
  }
});

// Delete file
router.delete('/:id', authenticate, deleteFile);
// Rename file
router.put('/:id/rename', authenticate, renameFile);

module.exports = router;
