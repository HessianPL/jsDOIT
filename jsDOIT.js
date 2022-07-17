require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const {loadFileContent, saveFileContent, cookieCheck} = require('./src/fsFunctions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.put('/tasks/new', async (req, res) => {
    console.log('New task list from frontend:', req.body);//@TODO wywalić w produkcji
    const sessionID = await cookieCheck(req.cookies['jsDOIT-session']);
    await saveFileContent(req.body, sessionID);
    res.json(JSON.stringify(await loadFileContent()));
})

app.get('/tasks/list', async (req, res) => {
    const sessionID = await cookieCheck(req.cookies['jsDOIT-session']);
    await res.cookie('jsDOIT-session', sessionID);

    const fileContent = await loadFileContent();

    if (!fileContent[sessionID]) {
        res.json(JSON.stringify([]));
    } else {
        res.json(JSON.stringify(fileContent[sessionID]));
    }

});

app.listen(PORT);

