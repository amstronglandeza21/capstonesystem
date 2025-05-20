// server/routes/upload.js
const express = require('express');
const multer = require('multer');
const Thesis = require('../models/Thesis');
const { convert } = require('pdf-poppler');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, abstract, author, email } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const pdfPath = req.file.path;
    const fileNameNoExt = path.parse(req.file.filename).name;
    const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');
    const thumbnailOutputPath = path.join(thumbnailDir, `${fileNameNoExt}.png`);
    const webThumbnailPath = `uploads/thumbnails/${fileNameNoExt}.png`.replace(/\\/g, '/');

    // Ensure thumbnail directory exists
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Convert first page of PDF to PNG
    await convert(pdfPath, {
      format: 'png',
      out_dir: thumbnailDir,
      out_prefix: fileNameNoExt,
      page: 1,
    });

    const existing = await Thesis.findOne({ title, author });
    if (existing) {
      return res.status(400).json({ error: 'Duplicate thesis for same author.' });
    }

    const thesis = new Thesis({
      title,
      abstract,
      author,
      email,
      filePath: req.file.path.replace(/\\/g, '/'),
      thumbnailPath: webThumbnailPath,
    });

    await thesis.save();

    res.status(200).json({ message: 'Uploaded successfully' });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
