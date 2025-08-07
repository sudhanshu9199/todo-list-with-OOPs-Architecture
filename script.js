class Task {
    constructor(text, dateTime, completed = false) {
        this.text = text;
        this.dateTime = dateTime;
        this.completed = completed;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});

class TaskManager {
    constructor() {
        this.form = document.querySelector('form');
        this.input = document.getElementById('inputBox');
        this.taskList = document.querySelector('.area');

        this.loadTaskFromStorage();

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(e) {
        e.preventDefault();

        const taskText = this.input.value.trim();
        if (!taskText) return;

        const now = new Date();
        const formattedDateTime = now.toLocaleDateString('en-GB') + " " + now.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});

        const task = new Task(taskText, formattedDateTime);
        this.saveTaskToStorage(task);
        this.input.value = '';
    }

    renderTask(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        const isChecked = task.completed ? 'checked' : '';

        taskDiv.innerHTML = `<label class="custom-checkbox">
            <input type="checkbox" ${isChecked} />
            <span class="checkmark"></span>
          </label>
          <div class="display">
            <p class="text">${task.text}</p>
            <p class="day-time">${task.dateTime}</p>
          </div>
          <i class="ri-delete-bin-5-line delete-icon"></i>`;
        
        //   Delete icon event
        taskDiv.querySelector('.delete-icon').addEventListener('click', () => {
            taskDiv.remove();
            this.deleteTaskFromStorage(task);
        });

        // Checkbox toggle event
        taskDiv.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            task.completed = e.target.checked;
            this.updateTaskStatusInStorage(task);
        });
        this.taskList.appendChild(taskDiv);
    }

    saveTaskToStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    loadTaskFromStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((taskData) => {
            const task = new Task(taskData.text, taskData.dateTime, taskData.completed);
            this.renderTask(task);
        });
    }

    deleteTaskFromStorage(taskToDelete) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(
            (task) => !(task.text === taskToDelete.text && task.dateTime === taskToDelete.dateTime)
        );
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    updateTaskStatusInStorage(updateTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map((task) => {
            if (task.text === updateTask.text && task.dateTime === updateTask.dateTime) {
                task.completed = updateTask.completed;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

