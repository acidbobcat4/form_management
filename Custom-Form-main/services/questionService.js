const Question = require('../models/question-model');

async function getQuestions(form_id) {
  try {
    const questions = await Question.find({ form_id });
    return questions.map(question => ({
      question_id: question._id,
      text: question.text,
    }));
  } catch (error) {
    throw error;
  }
}

module.exports = { getQuestions };
