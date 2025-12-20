const minioClient = require('../config/minio');
const File = require('../models/file.model');

/**
 * Upload một hoặc nhiều file lên MinIO và lưu metadata vào MySQL
 * @param {File[]} files - array of files từ multer (req.files)
 * @param {string|number} userId - ID của user
 * @returns {Promise<Array>} - mảng các file đã lưu
 */
const uploadFiles = async (files, userId) => {
    if (!files || files.length === 0) throw new Error('No files provided');

    const uploadedFiles = [];

    for (const file of files) {
        const metaData = { 'Content-Type': file.mimetype };
        const filePath = `${userId}/${Date.now()}-${file.originalname}`;

        // Upload lên MinIO
        await minioClient.putObject(
            process.env.MINIO_BUCKET,
            filePath,
            file.buffer,
            metaData
        );

        // Lưu metadata vào MySQL
        const savedFile = await File.create({
            filename: file.originalname,
            path: filePath,
            size: file.size,
            userId: userId
        });

        uploadedFiles.push(savedFile);
    }

    return uploadedFiles;
};

module.exports = { uploadFiles };
