import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory as a buffer

const fileFilter = (req, file, cb) => {
  // Accept only image and video files
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images and videos are allowed."),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

export default upload;
