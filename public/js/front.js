const newTaskFormElement = document.querySelector('#newTaskForm');
const newTaskElement = document.querySelector('#newTask');
const taskListElement = document.querySelector('#taskList');
const actionsTab = document.querySelector('#actions');
const markAllBtn = document.querySelector('#mark-all');
const unmarkAllBtn = document.querySelector('#unmark-all');
const deleteAllBtn = document.querySelector('#delete-all');

let currentTaskList;

const loadTaskList = async () => {
    const response = await fetch('../tasks/list', {method: 'GET'});
    const data = await response.json();
    const parsedData = JSON.parse(data);
    currentTaskList = parsedData || [];
    return parsedData;
} //end of loadTaskList()

const renderTaskList = async () => {
    const taskList = await loadTaskList();
    taskListElement.innerHTML = '';

    taskList.forEach((el, index) => {
        const newLi = document.createElement('li');
        const newSpan = document.createElement('span');
        const newDelBtn = document.createElement('button');
        newDelBtn.innerText = 'Del';
        newDelBtn.classList.add('delBtn');
        newDelBtn.dataset.id = index;
        newDelBtn.addEventListener('click', deleteTask);
        newSpan.innerText = el.task;
        newSpan.dataset.id = index;
        newSpan.addEventListener('click', markTask);
        newLi.appendChild(newSpan);
        newLi.appendChild(newDelBtn);

        if (el.completed === true) {
            newLi.classList.add('completed');
        }

        taskListElement.appendChild(newLi);
    });

    newTaskElement.value = '';

    if (taskList.length > 0) {
        actionsTab.classList.remove('hidden');
    } else {
        actionsTab.classList.add('hidden');
    }
} //end of renderTaskList()

const saveTaskList = async (newTaskList) => {
    const response = await fetch('../tasks/new', {
        method: 'PUT',
        body: JSON.stringify(newTaskList),
        headers: {
            'Content-type': 'application/json'
        }
    });

    const data = await response.json();
    await renderTaskList();
    return data;
} //end of saveTaskList()

const addNewTask = async (e) => {
    e.preventDefault();
    const taskList = currentTaskList;

    if (!newTaskElement.value) {
        throw new Error(`Well, you don't need to plan doing nothing, pal. Just do it. Or.. just don't do it? Damn!! :)`)
    }

    taskList.push({task: newTaskElement.value.toString(), completed: false});
    await saveTaskList(taskList);
} //end of addNewTask()

const deleteTask = async e => {
    e.target.parentNode.classList.add('removing');
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(500);
    currentTaskList.splice(e.target.dataset.id, 1);
    await saveTaskList(currentTaskList);
}

const markTask = async e => {
    taskStatus = currentTaskList[e.target.dataset.id].completed;
    if (taskStatus) {
        currentTaskList[e.target.dataset.id].completed = false;
    } else {
        currentTaskList[e.target.dataset.id].completed = true;
    }
    await saveTaskList(currentTaskList);
}

const markAllTasks = async () => {
    console.log(currentTaskList);
    currentTaskList.forEach(el => {
        el.completed = true;
    });

    await saveTaskList(currentTaskList);
}

const unmarkAllTasks = async () => {
    console.log(currentTaskList);
    currentTaskList.forEach(el => {
        el.completed = false;
    });

    await saveTaskList(currentTaskList);
}

const deleteAllTasks = async () => {
    currentTaskList = [];
    await saveTaskList(currentTaskList);
}

newTaskFormElement.addEventListener('submit', addNewTask);
markAllBtn.addEventListener('click', markAllTasks);
unmarkAllBtn.addEventListener('click', unmarkAllTasks);
deleteAllBtn.addEventListener('click', deleteAllTasks);

renderTaskList();