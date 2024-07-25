document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const submitTaskButton = document.getElementById('submitTaskButton');
    const todoBox = document.getElementById('todoBox');
    const progressBox = document.getElementById('progressBox');
    const doneBox = document.getElementById('doneBox');

    window.allowDrop = function (event) {
        event.preventDefault();
    }

    window.drag = function (event) {
        event.dataTransfer.setData("text", event.target.id);
    }

    window.drop = function (event) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text");
        const taskElement = document.getElementById(data);

        // Ensure the drop target is a dropbox
        let dropTarget = event.target;
        while (!dropTarget.classList.contains('dropbox') && dropTarget !== document.body) {
            dropTarget = dropTarget.parentElement;
        }

        if (dropTarget.classList.contains('dropbox')) {
            dropTarget.appendChild(taskElement);
            saveTasks(); // Save the new state to local storage
        }
    }

    // Load tasks from local storage and display them
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || { todo: [], inProgress: [], done: [] };
        displayTasks(tasks.todo, todoBox);
        displayTasks(tasks.inProgress, progressBox);
        displayTasks(tasks.done, doneBox);
    }

    function displayTasks(tasks, container) {
        container.innerHTML = ''; // Reset the container content
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task border border-2 p-1 m-1 text-center';
            taskElement.innerText = task;
            taskElement.id = `${container.id}-task-${index}`;
            taskElement.draggable = true;
            taskElement.ondragstart = drag;
            taskElement.style.backgroundColor = 'aquamarine';
            container.appendChild(taskElement);
        });
    }

    // Add task to local storage
    function addTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || { todo: [], inProgress: [], done: [] };
        tasks.todo.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks(); // Refresh the task list
    }

    submitTaskButton.addEventListener('click', function () {
        const task = taskInput.value.trim();
        if (task) {
            addTask(task);
            taskInput.value = '';
            const closeModalButton = document.querySelector('.btn-close');
            closeModalButton.click();
        }
    });

    // Save tasks to local storage
    function saveTasks() {
        const tasks = {
            todo: Array.from(todoBox.children).map(task => task.innerText),
            inProgress: Array.from(progressBox.children).map(task => task.innerText),
            done: Array.from(doneBox.children).map(task => task.innerText)
        };
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Initial load
    loadTasks();
});