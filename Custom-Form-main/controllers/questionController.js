const questionsService = require('../services/questionService');

async function getQuestions(req, res, next) {
  try {
    const { form_id } = req.params;

    if (!form_id) {
      return res.status(400).json({ error: 'Missing form_id parameter' });
    }

    const questions = await questionsService.getQuestions(form_id);

    return res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getQuestions };
