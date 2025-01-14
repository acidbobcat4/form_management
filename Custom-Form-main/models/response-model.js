const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  user_id: {
    type: String, // Assuming user_id is a string
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  metadata: { type: Object, default: {} },
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
