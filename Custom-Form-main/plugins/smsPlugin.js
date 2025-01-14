const config = require('./credentials/twilio-credentials');
const axios = require('axios');

const smsSid = config.SMS_SID;
const smsAuthToken = config.SMS_AUTH_TOKEN;
const twilio = require('twilio')(smsSid, smsAuthToken, {
    lazyLoading: true,
});


async function sendBySms(phone, msg) {
    return await twilio.messages.create({
        to: phone,
        from: config.SMS_FROM_NUMBER,
        body: `Your entered data is --> ${msg}`,
    });
}


async function fetchData(questionId, responseId) {
    const response = await axios.get(`http://localhost:3000/getAnswer/${questionId}/${responseId}`);
    const answersResp = await axios.get(`http://localhost:3000/getAnswersForResponse/${responseId}`);
    let msg = [];
    for (let i = 0; i < answersResp.data.answers.length; i++) {
        msg.push(answersResp.data.answers[i].text);
    }
    await sendBySms(response.data.answer.text, msg);
}

let questionId = "65bc9ffd9c8747a00b18c3f9", responseId = "65bca0da9c8747a00b18c400";
fetchData(questionId, responseId);