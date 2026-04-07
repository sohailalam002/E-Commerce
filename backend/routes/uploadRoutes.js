import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  console.log('--- Upload Filter ---');
  console.log(`File: ${file.originalname}`);
  console.log(`MimeType: ${file.mimetype}`);
  console.log(`Ext check: ${extname}, Mime check: ${mimetype}`);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png, webp, gif)'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Wrapper to handle multer errors properly
const uploadMiddleware = upload.single('image');

router.post('/', (req, res) => {
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).send({ message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Success
    res.send({
      message: 'Image uploaded successfully',
      imageUrl: `/${req.file.path.replace(/\\/g, '/')}`,
    });
  });
});

export default router;
