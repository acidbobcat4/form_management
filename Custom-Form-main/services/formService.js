const Form = require('../models/form-model');
const Question = require('../models/question-model');

async function createForm(title, questions) {
  try {
    // new form create
    const form = await Form.create({
      title,
    });
    // console.log(form);
    
    const form_id = form._id;

    // Create questions and associate them with the form
    const questionPromises = questions.map(async (question) => {
      const newQuestion = await Question.create({
        form_id,
        text: question.text,
        type: question.type
      });
      return newQuestion;
    });

    await Promise.all(questionPromises);

    return form_id;
  } catch (error) {
    throw error;
  }
}

module.exports = { createForm };
