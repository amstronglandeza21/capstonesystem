const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { convert } = require('pdf-poppler');
const Thesis = require('../models/Thesis'); // import directly, not destructured

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const { title, author } = req.body;
    const baseName = `${title}${author}`.toLowerCase().replace(/[^a-z]/g, '');
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${baseName}${extension}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const {
      title, abstract, author, email, studentNumber,
      groupMembers, course, year, section, adviser,
    } = req.body;

    const pdfPath = req.file.path;
    const fileNameNoExt = path.parse(req.file.filename).name.toLowerCase().replace(/[^a-z]/g, '');
    const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');

    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Convert PDF first page to PNG thumbnail
    await convert(pdfPath, {
      format: 'png',
      out_dir: thumbnailDir,
      out_prefix: fileNameNoExt,
      page: 1,
    });

    // Rename thumbnail file to remove suffix
    const generatedFileWithSuffix = path.join(thumbnailDir, `${fileNameNoExt}-01.png`);
    const generatedFileNoSuffix = path.join(thumbnailDir, `${fileNameNoExt}.png`);
    if (fs.existsSync(generatedFileWithSuffix)) {
      fs.renameSync(generatedFileWithSuffix, generatedFileNoSuffix);
    }

    const webThumbnailPath = `uploads/thumbnails/${fileNameNoExt}.png`.replace(/\\/g, '/');

    // Extract full text from PDF
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const fullText = pdfData.text;

    // Extract IMRAD sections helper
    const extractSection = (label) => {
      const regex = new RegExp(`${label}\\s*\\n([\\s\\S]*?)(\\n[A-Z][a-zA-Z\\s]+\\n|$)`, 'i');
      const match = fullText.match(regex);
      return match ? match[1].trim() : '';
    };

    // Check for duplicate thesis by title & author
    const existing = await Thesis.findOne({ title, author });
    if (existing) {
      return res.status(400).json({ error: 'Duplicate thesis for same author.' });
    }

    // Save thesis document to DB
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

    // Emit socket.io event for new upload
    const io = req.app.get('io');
    if (io) {
      io.emit('newUpload', {
        title: thesis.title,
        uploadedBy: thesis.author,
        timestamp: new Date(),
      });
    }

    res.status(200).json({ message: 'Uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

module.exports = router;
