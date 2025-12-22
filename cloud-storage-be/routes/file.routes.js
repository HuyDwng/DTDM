const express = require('express');
const router = express.Router();
const multer = require('multer');
const minioClient = require('../config/minio');
const { File } = require('../models/file.model'); // model lưu thông tin file
const path = require('path');
const crypto = require('crypto');
const { getFilesByUser } = require('../controllers/file.controller');
const authenticate = require('../middleware/auth.middleware'); // import đúng

// Sử dụng memory storage của multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route upload file (FE gửi field name là 'file')
// Thêm authenticate để biết user nào đang upload
router.post('/upload', authenticate, upload.array('file'), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = [];

        for (let file of files) {
            // Tạo tên file duy nhất
            const ext = path.extname(file.originalname);
            const fileName = crypto.randomBytes(8).toString('hex') + ext;

            console.log('Uploading file:', file.originalname, '=>', fileName);

            // Upload lên MinIO (bật khi cần)
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
                userId: req.user.id // <-- dùng userId từ authenticate
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

// Route lấy tất cả file của user đang login
router.get('/my-files', authenticate, getFilesByUser);

module.exports = router;
