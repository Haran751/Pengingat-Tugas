const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['PENTING', 'MENENGAH', 'SELESAI'],
      default: 'MENENGAH',
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
