const responsesService = require('../services/responseService');

async function createResponse(req, res, next) {
  try {
    const { form_id, answers, user_id } = req.body;

    if (!form_id || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response_id = await responsesService.createResponse(form_id, answers, user_id);

    return res.status(200).json({ response_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getAllResponses(req, res, next) {
    try {
      const { formId } = req.params;
  
      if (!formId) {
        return res.status(400).json({ error: 'Missing formId parameter' });
      }
  
      const allResponses = await responsesService.getAllResponses(formId);
  
      return res.status(200).json({ responses: allResponses });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports = { createResponse, getAllResponses };
