const router = require('express').Router();
const formController = require('./controllers/formController');
const questionController = require('./controllers/questionController');
const answerController = require('./controllers/answerController');
const responseController = require('./controllers/responseController');


// forms routes
router.post('/createForm', formController.createForm);
router.get('/getQuestions/:form_id', questionController.getQuestions);
router.post('/createResponse', responseController.createResponse);
router.get('/getAnswersForResponse/:responseId', answerController.getAnswersForResponse);
router.get('/getAnswer/:questionId/:responseId', answerController.getAnswer);
router.get('/getAllResponses/:formId', responseController.getAllResponses);
router.patch('/updateAnswer/:questionId/:responseId', answerController.updateAnswer);

module.exports = router;
