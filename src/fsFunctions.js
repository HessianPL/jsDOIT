const { readFile, writeFile } = require('fs').promises;
const { promisify } = require('util');
const randomBytes = promisify(require('crypto').randomBytes);
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

const cookieCheck = async (cookie) => {
    if (!cookie) {
        const sessionID = (await randomBytes(8)).toString('hex');
        return sessionID;
    }

    return cookie;
}

module.exports = {loadFileContent, saveFileContent, cookieCheck};