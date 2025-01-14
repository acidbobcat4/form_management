const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const axios = require('axios');


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './credentials/google-sheets-credentials.json');


async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}


async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}


async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

let formSpreadsheetMap = {
    "65bbeb108ee13404384f1a84": '1Sdnw0S49Z1PxtcgUng-NmZ00dr2fVzL1rlkC-9OM8pg'
}

async function insertDataIntoGoogleSheets(formId, data) {
    try {

        const spreadsheetId = formSpreadsheetMap[formId];
        const auth = await authorize();

        const sheets = google.sheets({ version: 'v4', auth });
        const sheetName = 'Sheet1';

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A1:Z`,
        });

        // console.log("Response:", response);
        // console.log("Response data is: ", response.data, "response value is: ", response.data.values, "response value length is: ", response.data.values.length);

        let insertRowIndex = 0;
        const numRows = response.data.values ? response.data.values.length : 0;
        const numCols = response.data.values && response.data.values[0] ? response.data.values[0].length : 0;
        // console.log("Num rows and columns:", numRows, numCols);

        insertRowIndex = numRows + 1;
        // console.log("Insert row index:", insertRowIndex);

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

    }
    catch (err) {
        console.log("errror is:", err);
    }
}
async function responseIntoGoogleSheets(formId, response) {

    try {
        for (let i = 0; i < response.length; i++) {
            let data = {};
            for (let j = 0; j < response[i].answers.length; j++) {
                data[`data${j}`] = response[i].answers[j].answer_text;
            }
            console.log("formId-data --> ", formId, data)
            await insertDataIntoGoogleSheets(formId, data)
        }
    }
    catch (err) {
        console.log(err)
    }

}


async function fetchResponses() {
    const response = await axios.get('http://localhost:3000/getAllResponses/65bbeb108ee13404384f1a84');
    await responseIntoGoogleSheets("65bbeb108ee13404384f1a84", response.data.responses);
}

fetchResponses();
