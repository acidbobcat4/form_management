const formsService = require('../services/formService');

async function createForm(req, res, next) {
  try {
    const { title, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Invalid questions array in the request body' });
    } 

    const form_id = await formsService.createForm(title, questions);

    return res.status(200).json({ form_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { createForm };
