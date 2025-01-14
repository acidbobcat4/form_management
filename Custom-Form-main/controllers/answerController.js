const answersService = require('../services/answerService');

async function getAnswer(req, res, next) {
  try {
    const { questionId, responseId } = req.params;

    if (!questionId || !responseId) {
      return res.status(400).json({ error: 'Missing questionId or responseId parameter' });
    }

    const answer = await answersService.getAnswer(questionId, responseId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    return res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getAnswersForResponse(req, res, next) {
  try {
    const { responseId } = req.params;

    if (!responseId) {
      return res.status(400).json({ error: 'Missing responseId parameter' });
    }

    const answers = await answersService.getAnswersForResponse(responseId);

    return res.status(200).json({ answers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateAnswer(req, res, next) {
  try {
    const { questionId, responseId } = req.params;
    const { newAnswer } = req.body;

    if (!questionId || !responseId || !newAnswer) {
      return res.status(400).json({ error: 'Missing questionId, responseId, or newAnswer in the request' });
    }

    const updatedAnswer = await answersService.updateAnswer(questionId, responseId, newAnswer);

    if (!updatedAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    return res.status(200).json({ updatedAnswer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getAnswer, getAnswersForResponse, updateAnswer };
