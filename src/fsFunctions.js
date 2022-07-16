const { readFile, writeFile } = require('fs').promises;
const PATH = process.env.FILEPATH;

const loadFileContent = async (src = PATH) => {
    let fileContent;
    try {
        fileContent =  JSON.parse(await readFile(PATH, "utf-8"));
    } catch(e) {
        fileContent = {taskList: []};
    }
    return fileContent;
}

const saveFileContent = async (newTaskList) => {
    await writeFile(PATH, JSON.stringify(newTaskList), {
        encoding: "utf-8"
    });
}

module.exports = {loadFileContent, saveFileContent};