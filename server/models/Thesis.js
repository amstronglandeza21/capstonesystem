// server/models/Thesis.js
const mongoose = require('mongoose');

const ThesisSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  author: String,
  email: String,
  filePath: String,
  thumbnailPath: String,
}, { timestamps: true });

module.exports = mongoose.model('Thesis', ThesisSchema);
