const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String, 
  },
  metadata: { type: Object, default: {} },
  
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
