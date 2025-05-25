// server/models/Thesis.js
const mongoose = require('mongoose');

const ThesisSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  author: String,
  email: String,
  studentNumber: String,
  groupMembers: String,
  course: String,
  year: String,
  section: String,
  adviser: String,
  introduction: String,
  textContent: String,
  methodology: String,
  results: String,
  analysis: String,
  discussion: String,
  filePath: String,
  thumbnailPath: String,
}, { timestamps: true });

module.exports = mongoose.model('Thesis', ThesisSchema);
