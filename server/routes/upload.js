const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { fromPath } = require('pdf2pic');
const Thesis = require('../models/Thesis');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, abstract, author, email } = req.body;
    const pdfPath = req.file.path;
    const fileNameNoExt = path.parse(req.file.filename).name;
    const thumbnailDir = 'uploads/thumbnails';
    const thumbnailPath = `${thumbnailDir}/${fileNameNoExt}.png`;

    // Ensure thumbnails directory exists
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Convert first page to image using pdf2pic
    const convert = fromPath(pdfPath, {
      density: 100,
      saveFilename: fileNameNoExt,
      savePath: thumbnailDir,
      format: 'png',
      width: 600,
      height: 800,
    });

    await convert(1); // Convert page 1

    // Check for duplicate
    const existing = await Thesis.findOne({ title, author });
    if (existing) {
      return res.status(400).json({ error: 'Duplicate title for the same author is not allowed.' });
    }

    const thesis = new Thesis({
      title,
      abstract,
      author,
      email,
      filePath: req.file.path,
      thumbnailPath: thumbnailPath.replace(/\\/g, '/'), // normalize path for cross-platform
    });

    await thesis.save();
    res.status(200).json({ message: 'Uploaded successfully' });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
