require('dotenv').config();
const express = require('express');
const {loadFileContent, saveFileContent} = require('./src/fsFunctions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.put('/tasks/new', async (req, res) => {
    console.log('New task list from frontend:', req.body);//@TODO wywalić w produkcji
    await saveFileContent(req.body);
    res.json(JSON.stringify(await loadFileContent()));
})

app.get('/tasks/list', async (req, res) => {
    console.log('Tasklist sent to frontend');//@TODO wywalić w produkcji
    res.json(JSON.stringify(await loadFileContent()));
});

app.listen(PORT);

// Logika aplikacji:
// 1. Fetch na frontendzie żeby pobrać zawartość całego pliku z backendu z zadaniami (fetch get) -OK
// 2. Wygenerowanie zadań na frontendzie na podstawie zawartości pliku -OK
// 3. Modyfikacja całego obiektu na frontendzie - wyzwala dodanie nowego taska
// 4. Odesłanie fetchem zmodyfikowanego obiektu (fetch post)
// Potwórzyć 1-4