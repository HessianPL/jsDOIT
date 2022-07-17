require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const {loadFileContent, saveFileContent} = require('./src/fsFunctions');

const { promisify } = require('util');
const randomBytes = promisify(require('crypto').randomBytes);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const cookieHandler = async (cookie) => {
    if (!cookie) {
        const sessionID = (await randomBytes(8)).toString('hex');
        return sessionID;
    }

    return cookie;
}

app.put('/tasks/new', async (req, res) => {
    console.log('New task list from frontend:', req.body);//@TODO wywalić w produkcji
    const sessionID = await cookieHandler(req.cookies['jsDOIT-session']);
    await saveFileContent(req.body, sessionID);
    res.json(JSON.stringify(await loadFileContent()));
})

app.get('/tasks/list', async (req, res) => {
    const sessionID = await cookieHandler(req.cookies['jsDOIT-session']);
    res.cookie('jsDOIT-session', sessionID);

    const fileContent = await loadFileContent();

    if (!fileContent[sessionID]) {
        res.json(JSON.stringify([]));
    }
    res.json(JSON.stringify(fileContent[sessionID]));
});

app.listen(PORT);

