document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

taskForm.addEventListener('submit', addTask);

function addTask(e) {
  e.preventDefault();
  const taskText = taskInput.value;

  if (taskText === '') {
    alert('Please add a task');
    return;
  }

  const taskItem = createTaskElement(taskText);
  taskList.appendChild(taskItem);

  saveTask(taskText);
  taskInput.value = '';
}

function createTaskElement(taskText, isCompleted = false) {
  const li = document.createElement('li');
  if (isCompleted) li.classList.add('completed');

  const span = document.createElement('span');
  span.textContent = taskText;
  li.appendChild(span);

  const actions = document.createElement('div');
  actions.classList.add('actions');

  const completeBtn = document.createElement('button');
  completeBtn.textContent = isCompleted ? 'Uncomplete' : 'Complete';
  completeBtn.addEventListener('click', () => toggleCompleteTask(li, taskText));

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => editTask(li, taskText));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(li, taskText));

  actions.appendChild(completeBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(actions);

  return li;
}

function toggleCompleteTask(taskElement, taskText) {
  taskElement.classList.toggle('completed');
  const taskStatus = taskElement.classList.contains('completed');
  updateTaskStatus(taskText, taskStatus);
}

function editTask(taskElement, oldTaskText) {
  const newTaskText = prompt('Edit Task', oldTaskText);

  if (newTaskText && newTaskText !== oldTaskText) {
    taskElement.querySelector('span').textContent = newTaskText;
    updateTaskText(oldTaskText, newTaskText);
  }
}

function deleteTask(taskElement, taskText) {
  if (confirm('Are you sure you want to delete this task?')) {
    taskElement.remove();
    removeTask(taskText);
  }
}

function saveTask(taskText) {
  const tasks = getTasks();
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskStatus(taskText, isCompleted) {
  const tasks = getTasks();
  const task = tasks.find(t => t.text === taskText);
  task.completed = isCompleted;
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskText(oldTaskText, newTaskText) {
  const tasks = getTasks();
  const task = tasks.find(t => t.text === oldTaskText);
  task.text = newTaskText;
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(taskText) {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => {
    const taskItem = createTaskElement(task.text, task.completed);
    taskList.appendChild(taskItem);
  });
}
