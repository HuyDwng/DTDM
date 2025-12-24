const minioClient = require('../config/minio');
const { File } = require('../models/file.model');

// -------------------------
// Lấy tất cả file của user
// Route: GET /my-files
// -------------------------
const getFilesByUser = async (req, res) => {
  try {
    // req.user phải có từ middleware authenticate
    const userId = req.user?.id;

    if (!userId) {
      // Nếu user chưa login, trả về mảng rỗng
      return res.json([]);
    }

    const files = await File.findAll({ where: { userId } });

    // Luôn trả về mảng để FE dùng .map mà không lỗi
    res.json(Array.isArray(files) ? files : []);
  } catch (err) {
    console.error('Get files error:', err);
    // Trả về mảng rỗng khi lỗi
    res.json([]);
  }
};

// -------------------------
// Xem file
// Route: GET /:id/view
// -------------------------
const viewFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Tìm file thuộc user
    const file = await File.findOne({ where: { id: fileId, userId } });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const bucket = process.env.MINIO_BUCKET;
    const expiry = 60 * 5; // 5 phút

    // Tạo presigned URL
    minioClient.presignedGetObject(bucket, file.key, expiry, (err, url) => {
      if (err) {
        console.error('MinIO presigned error:', err);
        return res.status(500).json({ message: 'Cannot generate view url' });
      }

      // Redirect → FE chỉ cần window.open
      res.redirect(url);
    });
  } catch (err) {
    console.error('View file error:', err);
    res.status(500).json({ message: 'View file failed', error: err.message });
  }
};
//// -------------------------
// Xóa file
// Route: DELETE /:id
// -------------------------
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Tìm file thuộc user
    const file = await File.findOne({ where: { id: fileId, userId } });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const bucket = process.env.MINIO_BUCKET;

    // Xóa trên MinIO
    minioClient.removeObject(bucket, file.key, async (err) => {
      if (err) {
        console.error('MinIO delete error:', err);
        return res.status(500).json({ message: 'Failed to delete file on MinIO' });
      }

      // Xóa metadata trong MySQL
      await file.destroy();

      res.json({ message: 'File deleted successfully' });
    });

  } catch (err) {
    console.error('Delete file error:', err);
    res.status(500).json({ message: 'Delete file failed', error: err.message });
  }
};

//// -------------------------
// Đổi tên file
// Route: PUT /:id/rename
// -------------------------
const renameFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user?.id;
    const { newName } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!newName || newName.trim() === '') return res.status(400).json({ message: 'Invalid new name' });

    const file = await File.findOne({ where: { id: fileId, userId } });
    if (!file) return res.status(404).json({ message: 'File not found' });

    file.name = newName.trim();
    await file.save();

    res.json({ message: 'File renamed successfully', file });
  } catch (err) {
    console.error('Rename file error:', err);
    res.status(500).json({ message: 'Rename file failed', error: err.message });
  }
};

module.exports = {
  getFilesByUser,
  viewFile,
  deleteFile,
  renameFile
};
