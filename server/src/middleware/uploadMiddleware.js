const multer = require('multer');

const uploadImage = multer({ storage: multer.memoryStorage() });
const uploadPDF   = multer({ storage: multer.memoryStorage() });
const memoryStorage = multer({ storage: multer.memoryStorage() });

module.exports = { uploadImage, uploadPDF, memoryStorage };