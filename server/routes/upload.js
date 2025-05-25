const express = require('express');
const multer = require('multer');
const Thesis = require('../models/Thesis');
const { convert } = require('pdf-poppler');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const router = express.Router();

// Multer setup for storing uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const { title, author } = req.body;
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
    // Destructure all necessary fields from req.body
    const {
      title,
      abstract,
      author,
      email,
      studentNumber,
      groupMembers,
      course,
      year,
      section,
      adviser,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const pdfPath = req.file.path;
    const fileNameNoExt = path.parse(req.file.filename).name.toLowerCase().replace(/[^a-z]/g, '');
    const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');
    const generatedFileWithSuffix = path.join(thumbnailDir, `${fileNameNoExt}-01.png`);
    const generatedFileNoSuffix = path.join(thumbnailDir, `${fileNameNoExt}.png`);
    const webThumbnailPath = `uploads/thumbnails/${fileNameNoExt}.png`.replace(/\\/g, '/');

    // Ensure thumbnail directory exists
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Convert first page of PDF to PNG thumbnail
    await convert(pdfPath, {
      format: 'png',
      out_dir: thumbnailDir,
      out_prefix: fileNameNoExt,
      page: 1,
    });

    // Rename the thumbnail to remove '-01' suffix if present
    if (fs.existsSync(generatedFileWithSuffix)) {
      fs.renameSync(generatedFileWithSuffix, generatedFileNoSuffix);
    }

    // Extract full text from PDF
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const fullText = pdfData.text;

    // Helper to extract IMRAD sections (case-insensitive)
    const extractSection = (label) => {
      const regex = new RegExp(`${label}\\s*\\n([\\s\\S]*?)(\\n[A-Z][a-zA-Z\\s]+\\n|$)`, 'i');
      const match = fullText.match(regex);
      return match ? match[1].trim() : '';
    };

    // Check for duplicate thesis by title and author
    const existing = await Thesis.findOne({ title, author });
    if (existing) {
      return res.status(400).json({ error: 'Duplicate thesis for same author.' });
    }

    // Create new Thesis document with all fields
    const thesis = new Thesis({
      title,
      abstract,
      author,
      email,
      studentNumber,
      groupMembers,
      course,
      year,
      section,
      adviser,
      filePath: req.file.path.replace(/\\/g, '/'),
      thumbnailPath: webThumbnailPath,
      introduction: extractSection('Introduction'),
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
