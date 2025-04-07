const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true
  },
  taskDate: {
    type: Date,
    required: true
  },
  taskStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema); 