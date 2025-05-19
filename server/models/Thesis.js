const mongoose = require('mongoose');

const ThesisSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  author: String,
  email: String,
  filePath: String,
  thumbnailPath: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Thesis', ThesisSchema);
