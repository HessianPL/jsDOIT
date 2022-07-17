const { readFile, writeFile } = require('fs').promises;
const PATH = process.env.FILEPATH;

const loadFileContent = async (src = PATH) => {
    let fileContent;
    try {
        fileContent =  JSON.parse(await readFile(PATH, "utf-8"));
    } catch(e) {
        fileContent = [];
    }
    return fileContent;
}

const saveFileContent = async (newTaskList, sessionID) => {
    const currentFileContent = await loadFileContent();
    currentFileContent[sessionID] = newTaskList;

    await writeFile(PATH, JSON.stringify(currentFileContent), {
        encoding: "utf-8"
    });
}

module.exports = {loadFileContent, saveFileContent};