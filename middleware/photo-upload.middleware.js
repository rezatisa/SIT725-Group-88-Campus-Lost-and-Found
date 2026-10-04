const multer = require("multer");

const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: MAX_PHOTOS,
    fileSize: MAX_PHOTO_SIZE,
  },
  fileFilter(req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "photos"));
  },
});

const messages = {
  LIMIT_FILE_COUNT: `You can upload up to ${MAX_PHOTOS} photos.`,
  LIMIT_FILE_SIZE: "Each photo must be 5 MB or smaller.",
  LIMIT_UNEXPECTED_FILE: "Only JPEG, PNG and WebP photos are allowed (up to 3).",
};

// Accepts up to 3 files in the "photos" field and turns upload errors into 400 responses.
function uploadPhotos(req, res, next) {
  upload.array("photos", MAX_PHOTOS)(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: messages[error.code] || error.message });
    }
    return next(error);
  });
}

module.exports = { uploadPhotos, MAX_PHOTOS };
