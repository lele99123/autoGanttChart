const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true
  },
  planDate: {
    type: Date,
    required: true
  },
  tasks: [{
    taskName: String,
    taskDate: Date,
    taskStatus: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema); 