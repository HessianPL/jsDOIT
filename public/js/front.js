const newTaskFormElement = document.querySelector('#newTaskForm');
const newTaskElement = document.querySelector('#newTask');
const taskListElement = document.querySelector('#taskList');

let currentTaskList;

const loadTaskList = async () => {
    const response = await fetch('../tasks/list', {method: 'GET'});
    const data = await response.json();
    const parsedData = JSON.parse(data);
    console.log({parsedData});
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
        newDelBtn.innerText = 'Delete';
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

newTaskFormElement.addEventListener('submit', addNewTask);
renderTaskList();