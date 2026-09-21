const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    default: null,
  },
  query_subject: {
    type: String,
    default: null,
  },
  query_message: {
    type: String,
    required: true,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
