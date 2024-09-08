// script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskDeadline = document.getElementById('taskDeadline');
    const taskRepetitive = document.getElementById('taskRepetitive');
    const taskList = document.getElementById('taskList');
    const progressBar = document.getElementById('progressBar');
    const progressMessage = document.getElementById('progressMessage');
    const filters = document.querySelectorAll('input[name="filter"]');

    let tasks = [];

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const category = taskCategory.value;
        const deadline = taskDeadline.value;
        const isRepetitive = taskRepetitive.checked;

        if (taskText) {
            addTask({ text: taskText, category, deadline, isRepetitive, isCompleted: false });
            taskForm.reset();
            updateTaskList();
            updateProgress();
        }
    });

    filters.forEach(filter => {
        filter.addEventListener('change', updateTaskList);
    });

    function addTask(task) {
        tasks.push(task);
        updateTaskList();
    }

    function updateTaskList() {
        const filterValue = document.querySelector('input[name="filter"]:checked').value;
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            return filterValue === 'all' || task.category === filterValue;
        });

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <label>
                    <input type="checkbox" ${task.isCompleted ? 'checked' : ''} data-index="${index}">
                    ${task.text} (Categoria: ${task.category}, Prazo: ${task.deadline}, ${task.isRepetitive ? 'Repetitivo' : 'Não Repetitivo'})
                </label>
                <button class="remove-btn" data-index="${index}">Remover</button>
            `;

            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            const removeButton = taskItem.querySelector('.remove-btn');

            checkbox.addEventListener('change', (e) => {
                const taskIndex = e.target.getAttribute('data-index');
                tasks[taskIndex].isCompleted = e.target.checked;
                updateTaskList();
                updateProgress();
            });

            removeButton.addEventListener('click', () => {
                const taskIndex = removeButton.getAttribute('data-index');
                tasks.splice(taskIndex, 1);
                updateTaskList();
                updateProgress();
            });

            taskList.appendChild(taskItem);
        });

        updateProgress();
    }

    function updateProgress() {
        const totalTasks = tasks.length;
        if (totalTasks === 0) {
            progressBar.style.width = '0%';
            progressMessage.textContent = 'Adicione suas tarefas para ver o progresso.';
            return;
        }

        const completedTasks = tasks.filter(task => task.isCompleted).length;
        const progressPercentage = (completedTasks / totalTasks) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        if (progressPercentage < 50) {
            progressMessage.textContent = 'Você está abaixo da meta de produtividade. Considere adicionar tarefas mais simples ou revisar sua agenda.';
        } else if (progressPercentage < 80) {
            progressMessage.textContent = 'Você está indo bem, mas ainda há espaço para melhorar. Continue se esforçando!';
        } else {
            progressMessage.textContent = 'Ótimo trabalho! Você está se mantendo produtivo e focado.';
        }
    }
});
