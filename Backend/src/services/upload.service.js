'use strict';

const path = require('path');

//OLD VERSION
const handleProductImageUpload = async (file, req) => {
    if (!file) {
        throw new Error('Không có thông tin tệp đơn để xử lý.');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/products/${file.filename}`;

    return imageUrl;
};

// const handleProductImageUpload = async (file) => {
//     if (!file) {
//         throw new Error('Không có thông tin tệp để xử lý.');
//     }

//     // Cloudinary sẽ tự trả về URL trong file.path
//     const fileUrls = file.path; 

//     return fileUrls;
// };

//OLD VERSION
const handleMultipleProductImagesUpload = async (files, req) => {
    if (!files || files.length === 0) {
        throw new Error('Không có thông tin tệp để xử lý.');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrls = files.map(file => {
        return `${baseUrl}/uploads/products/${file.filename}`;
    });

    return imageUrls;
};

// const handleMultipleProductImagesUpload = async (files) => {
//     if (!files || files.length === 0) {
//         throw new Error('Không có thông tin tệp để xử lý.');
//     }

//     const fileUrls = files.map(file => file.path);

//     return fileUrls;
// };

module.exports = {
    handleProductImageUpload,
    handleMultipleProductImagesUpload 
};


