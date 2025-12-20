const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../services/file.service');

const router = express.Router();
const upload = multer(); // lưu file vào memory

router.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploaded = [];
        for (const file of files) {
            const result = await uploadFile(file);
            uploaded.push(result);
        }

        res.status(200).json({ message: 'Files uploaded successfully', uploaded });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});

module.exports = router;

const { File } = require('../models/file.model');

const getFilesByUser = async (req, res) => {
    try {
        const userId = req.user.id; // Giả sử bạn dùng middleware auth để giải token
        const files = await File.findAll({ where: { userId } });
        res.json(files);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getFilesByUser };
