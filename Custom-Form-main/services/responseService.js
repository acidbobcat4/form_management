const Response = require('../models/response-model');
const Answer = require('../models/answer-model');
const Question = require('../models/question-model');
// const googleSheet = require('../plugins/googleSheetsPlugin');

async function createResponse(form_id, answers, user_id) {
  try {
    // new response create
    const response = await Response.create({ 
      form_id, 
      user_id,
     });

    const response_id = response._id;

    // Create answers and associate them with the response
    const answerPromises = answers.map(async (answer) => {
      const newAnswer = await Answer.create({
        response_id,
        question_id: answer.question_id,
        text: answer.text,
      });
      return newAnswer;
    });

    await Promise.all(answerPromises);

    return response_id;
  } catch (error) {
    throw error;
  }
}

async function getAllResponses(formId) {
  try {
    // console.log(formId, typeof formId);
    const responses = await Response.find({ form_id: formId });
    const responseArray = [];
    for (const response of responses) {
      const answers = await Answer.find({ response_id: response._id });

      const formattedAnswers = await Promise.all(answers.map(async (answer) => {
        const question = await Question.findOne({ _id: answer.question_id });
        return {
          question_id: answer.question_id,
          question_text: question.text,
          answer_id: answer._id,
          answer_text: answer.text,
        };
      }));

      responseArray.push({
        responseId: response._id,
        answers: formattedAnswers,
      });
    }

    // Google Sheets Update
    // await googleSheet.responseIntoGoogleSheets(formId, responseArray);

    return responseArray;
  } catch (error) {
    throw error;
  }
}
module.exports = { createResponse, getAllResponses };
