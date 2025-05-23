const express = require('express');
const multer = require('multer');
const Thesis = require('../models/Thesis');
const { convert } = require('pdf-poppler');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const { title, author } = req.body;
    // Keep only lowercase letters, no spaces, no numbers, no symbols
    const baseName = `${title}${author}`
      .toLowerCase()
      .replace(/[^a-z]/g, '');

    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${baseName}${extension}`);
  }
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
    const fileNameNoExt = path.parse(req.file.filename).name.toLowerCase().replace(/[^a-z]/g, '');
    const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');
    const generatedFile = path.join(thumbnailDir, `${fileNameNoExt}-01.png`);
    const cleanFile = path.join(thumbnailDir, `${fileNameNoExt}.png`);
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

    // Rename the file to remove the '-01' suffix
    if (fs.existsSync(generatedFile)) {
      fs.renameSync(generatedFile, cleanFile);
    } else {
      console.warn(`Expected thumbnail ${generatedFile} not found.`);
    }

    // Full-text extraction
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const fullText = pdfData.text;

    // Simple MRAD section extractor
    const extractSection = (label) => {
      const regex = new RegExp(`${label}\\s*\\n([\\s\\S]*?)(\\n[A-Z][a-zA-Z\\s]+\\n|$)`, 'i');
      const match = fullText.match(regex);
      return match ? match[1].trim() : '';
    };

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
      textContent: fullText,
      methodology: extractSection('Methodology'),
      results: extractSection('Results'),
      analysis: extractSection('Analysis'),
      discussion: extractSection('Discussion'),
    });

    await thesis.save();

    res.status(200).json({ message: 'Uploaded successfully' });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
