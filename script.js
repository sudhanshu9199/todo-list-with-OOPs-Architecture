let form = document.querySelector("form");
let input = document.getElementById("inputBox");
let taskList = document.querySelector(".area");

window.addEventListener("DOMContentLoaded", loadTaskFromStorage);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(input.value);

  const taskText = input.value.trim();
  if (!taskText) return;

  // Get current date and time
  const now = new Date();
  console.log(now);
  const formattedDateTime =
    now.toLocaleDateString("en-GB") +
    " " +
    now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  console.log(formattedDateTime);

  const task = {
    text: taskText,
    dateTime: formattedDateTime,
    completed: false,
  };

  // Save to localStorage
  saveTaskToStorage(task);

  
  // Render task // create task div
  renderTask(task);
  input.value = "";
});

function renderTask(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
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

    let deleteIcon = taskDiv.querySelector('.delete-icon');

    // Add event for delete
    deleteIcon.addEventListener('click', () => {
        taskDiv.remove();
        deleteTaskFromStorage(task);
    });

    // Checkbox event
    taskDiv.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
        task.completed = e.target.checked;
        updateTaskStatusInStorage(task);
    });
  taskList.appendChild(taskDiv);
}

function saveTaskToStorage(task) {
    // `JSON.parse(...)` → converts that string back to a JavaScript array.
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTaskFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
}

function deleteTaskFromStorage(taskToDelete) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => !(task.text === taskToDelete.text && task.dateTime === taskToDelete.dateTime));
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function updateTaskStatusInStorage(updateTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.text === updateTask.text && task.dateTime === updateTask.dateTime) {
            task.completed = updateTask.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}