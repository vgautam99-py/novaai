import multer from "multer";

// Disk storage for temporary local files (like images we upload to Cloudinary)
const diskStorage = multer.diskStorage({});
export const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Memory storage for files processed on the fly (like PDFs parsed by pdf-parse)
const memoryStorage = multer.memoryStorage();
export const memoryUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
