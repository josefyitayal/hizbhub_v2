import Compressor from 'compressorjs';

export const compressImage = (file: File, maxSizeMB: number): Promise<File | Blob> => {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 0.6, // Adjust quality (0 to 1) for better compression
            maxWidth: 1920,
            maxHeight: 1920,
            // Optional: limit file size approximately
            convertSize: maxSizeMB * 1024 * 1024,
            success: resolve,
            error: reject,
        });
    });
};
