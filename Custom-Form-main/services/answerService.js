const Answer = require('../models/answer-model');

async function getAnswer(questionId, responseId) {
  try {
    const answer = await Answer.findOne({ question_id: questionId, response_id: responseId });
    
    if (!answer) {
      return null; // answer not found
    }

    return {
      answer_id: answer._id,
      text: answer.text,
    };
  } catch (error) {
    throw error;
  }
}

async function getAnswersForResponse(responseId) {
  try {
    const answers = await Answer.find({ response_id: responseId });
    return answers.map(answer => ({
      answer_id: answer._id,
      question_id: answer.question_id,
      text: answer.text,
      // Other answer properties
    }));
  } catch (error) {
    throw error;
  }
}

async function updateAnswer(questionId, responseId, newAnswer) {
  try {
    const existingAnswer = await Answer.findOne({ question_id: questionId, response_id: responseId });

    if (!existingAnswer) {
      return null; 
    }

    existingAnswer.text = newAnswer;

    await existingAnswer.save();

    return {
      answer_id: existingAnswer._id,
      question_id: existingAnswer.question_id,
      text: existingAnswer.text,
    };
  } catch (error) {
    throw error;
  }
}


module.exports = { getAnswer, getAnswersForResponse, updateAnswer };
