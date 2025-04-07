const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true
  },
  subjectCode: {
    type: String,
    required: true
  },
  subjectDescription: String,
  subjectStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema); 