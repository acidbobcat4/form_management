const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { google } = require('googleapis');
const axios = require('axios');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const CREDENTIALS_PATH = path.join(process.cwd(), './credentials/google-sheets-credentials.json');

async function authorize() {
    // Read the credentials file
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf8'));
    
    const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: SCOPES,
    });

    return auth;
}

let formSpreadsheetMap = {
    "678b8417a0d5d71a55218f7d": '16_8EjZ61J3JiIsTLVMSiRx8wJOMYSaD9DfEpmTePsiE'
};

async function insertDataIntoGoogleSheets(formId, data) {
    try {
        const spreadsheetId = formSpreadsheetMap[formId];
        if (!spreadsheetId) {
            throw new Error('Form ID not mapped to a Google Sheet');
        }

        const auth = await authorize();
        const sheets = google.sheets({ version: 'v4', auth });
        const sheetName = 'Sheet1';

        // Get the current data to determine where to insert new data
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A1:Z`,
        });

        console.log("API Response:", response.data); // Check the response data

        const numRows = response.data.values ? response.data.values.length : 0;
        const insertRowIndex = numRows + 1;

        const rowData = Object.values(data);
        const range = `${sheetName}!A${insertRowIndex}`;

        const result = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [rowData],
            },
        });

        if (result.status === 200) {
            console.log(`Data inserted successfully at row ${insertRowIndex}.`);
        } else {
            console.error("Error inserting data: Unexpected response from Google Sheets API.");
        }
    } catch (err) {
        console.error("Error:", err.message); // Log errors here
    }
}


async function responseIntoGoogleSheets(formId, response) {
    try {
        for (let i = 0; i < response.length; i++) {
            let data = {};
            for (let j = 0; j < response[i].answers.length; j++) {
                data[`data${j}`] = response[i].answers[j].answer_text;
            }
            console.log("formId-data --> ", formId, data);
            await insertDataIntoGoogleSheets(formId, data);
        }
    } catch (err) {
        console.error(err);
    }
}

async function fetchResponses() {
    try {
        const response = await axios.get('http://localhost:3000/getAllResponses/678b8417a0d5d71a55218f7d');
        await responseIntoGoogleSheets("678b8417a0d5d71a55218f7d", response.data.responses);
    } catch (err) {
        console.error("Error fetching responses:", err.message);
    }
}

fetchResponses();
