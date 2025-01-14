const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  response_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response',
    required: true,
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  text: {
    type: String
  },
  metadata: { type: Object, default: {} },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
