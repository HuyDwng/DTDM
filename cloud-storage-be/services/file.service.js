const minioClient = require('../config/minio');
const File = require('../models/file.model');

/**
 * Upload file:
 * - Lưu metadata MySQL trước
 * - Upload MinIO sau (nếu bật)
 */
const uploadFiles = async (files, userId) => {
    if (!files || files.length === 0) {
        throw new Error('No files provided');
    }

    const uploadedFiles = [];
    const enableMinio = process.env.ENABLE_MINIO === 'true';

    for (const file of files) {
        const filePath = `${userId}/${Date.now()}-${file.originalname}`;

        /** 1️⃣ LƯU METADATA MYSQL (LUÔN LUÔN) */
        const savedFile = await File.create({
            filename: file.originalname,
            path: filePath,
            size: file.size,
            mimetype: file.mimetype,
            userId
        });

        /** 2️⃣ UPLOAD MINIO (CÓ ĐIỀU KIỆN) */
        if (enableMinio) {
            try {
                await minioClient.putObject(
                    process.env.MINIO_BUCKET,
                    filePath,
                    file.buffer,
                    {
                        'Content-Type': file.mimetype
                    }
                );
            } catch (err) {
                console.error('❌ MinIO upload failed:', err.message);

                // ⚠️ rollback DB nếu muốn chặt chẽ
                // await savedFile.destroy();

                // KHÔNG throw → tránh crash API
            }
        }

        uploadedFiles.push(savedFile);
    }

    return uploadedFiles;
};

module.exports = { uploadFiles };
