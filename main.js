import { tasks } from './tasks.js';
const tasksContainer = document.querySelector('.tasks');
const finishedContainer = document.querySelector('.done');
const addBtn = document.querySelector('.add-btn');
const input = document.querySelector('.add-task');
let clearbtn = document.querySelector('.clear.btn.btn-secondary');

window.onload = () => {
	if (localStorage.length != 0) {
		let pastTasks = JSON.parse(localStorage.getItem('tasks'));
		pastTasks.map((el) => {
			tasks.push(el);
			showTasks();
		});
	}

	if (tasks.length == 0) {
		tasksContainer.textContent = 'No tasks today, enjoy the silence.';
	}

	if (finishedContainer.children.length > 0) {
		clearbtn.classList.add('active');
	} else if (finishedContainer.children.length == 0) {
		clearbtn.classList.remove('active');
	}
	console.log(finishedContainer.children.length);
};
// Show the tasks in the tasks array
const showTasks = () => {
	if (tasksContainer.textContent == 'No tasks today, enjoy the silence.') {
		tasksContainer.textContent = '';
	}
	let unfinishedContent = '';
	let finishedContent = '';

	tasks.map((task) => {
		let component = `
            <div id="${task.id}" class="task ${
			task.priority !== '' ? task.priority : ''
		} d-flex justify-content-between align-items-center bg-white border rounded-3 w-75 px-3 py-2">
            <div class="info d-flex">
                <input
                    type="checkbox"
                    data-id="check"
                    ${task.done ? 'checked' : ''}
                    class="check me-3" />
                <p class="m-0">${task.name}</p>
            </div>
            <div class="dropdown">
            <button
                    id="moreinfo"
                    class="btn dropdown-toggle pt-0"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="true">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-three-dots-vertical pt-0"
                        viewBox="0 0 16 16">
                        <path
                        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a
                            data-id='rename'
                            class="dropdown-item"
                            href="#"
                            >Rename</a
                        >
                    </li>
                    <li>
                        <a
                            data-id='delete'
                            class="dropdown-item"
                            href="#"
                            >Delete</a
                        >
                    </li>
                    <li>
                        <a
                            data-id='priority'
                            class="dropdown-item"
                            href="#"
                            >Priority</a
                        >
                    </li>
                </ul>
            </div>
            </div>
        `;

		if (task.done) {
			finishedContent += component;
		} else {
			unfinishedContent += component;
		}
	});

	tasksContainer.innerHTML = unfinishedContent;
	finishedContainer.innerHTML = finishedContent;
	localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Save the task as an object in the array of tasks on click
const addTaskToFile = (e) => {
	e.preventDefault();
	if (input.value.trim() != '') {
		let task = {
			id: new Date().getTime(),
			name: input.value,
			priority: '',
			priorityNo: 3,
			done: false,
		};

		tasks.push(task);
		input.value = '';
		showTasks();
	}
};

const handlePriority = (taskName, taskID) => {
	let popup = document.createElement('div');
	popup.classList.add('popup');
	popup.innerHTML = `<div class="task-info">
					${taskName.textContent}
				</div>
				<div class="priorities">
					<button class="priority high" data-id='high'>
						High
					</button>
					<button class="priority medium" data-id='medium'>
						Medium
					</button>
					<button class="priority low" data-id='low'>
						Low
					</button>
					<button class="priority no" data-id='no'>
						No priority
					</button>
				</div>
				`;
	document.querySelector('.dark').classList.add('active');
	document.body.appendChild(popup);

	document.querySelectorAll('.priority').forEach((btn) => {
		btn.onclick = () => {
			let pri = btn.getAttribute('data-id');

			tasks.map((task) => {
				if (task.id == taskID) {
					task.priority = pri;
					if (pri == 'high') {
						task.priorityNo = 0;
					} else if (pri == 'medium') {
						task.priorityNo = 1;
					} else if (pri == 'low') {
						task.priorityNo = 2;
					} else if (pri == 'no') {
						task.priorityNo = 3;
					}
				}
			});
			document.body.removeChild(popup);
			document.querySelector('.dark').classList.remove('active');
			tasks.sort((a, b) => a.priorityNo - b.priorityNo);
			showTasks();
		};
	});
};

const renameTask = (taskName, taskID) => {
	taskName.contentEditable = true;
	taskName.focus();
	taskName.onblur = () => {
		if (taskName.textContent.trim() != '') {
			taskName.contentEditable = false;
			tasks.map((task) =>
				task.id == taskID ? (task.name = taskName.textContent) : ''
			);
		}
	};
	taskName.onkeydown = (e) => {
		if (e.keyCode == 13) {
			e.preventDefault();
			if (taskName.textContent.trim() != '') {
				taskName.contentEditable = false;
				tasks.map((task) =>
					task.id == taskID ? (task.name = taskName.textContent) : ''
				);
			}
		}
	};
};

const deleteTask = (taskID) => {
	tasks.map((task, index) => {
		task.id == taskID ? tasks.splice(index, 1) : '';
	});
	showTasks();
};

const checkTask = (target) => {
	let id = target.parentElement.parentElement.getAttribute('id');
	let task;
	tasks.map((t) => {
		if (t.id == id) {
			task = t;
		}
	});
	task.done = !task.done;

	showTasks();
	if (finishedContainer.children.length === 0) {
		clearbtn.classList.remove('active');
	} else if (finishedContainer.children.length > 0) {
		clearbtn.classList.add('active');
	}
	console.log(finishedContainer.children.length);
};

const moveTaskBack = (taskID) => {
	tasks.map((task) => {
		if (task.id == taskID) {
			task.done = false;
		}
	});
	showTasks();
};

finishedContainer.addEventListener('change', (e) => {
	if (e.target && e.target.matches('.check')) {
		const taskID = e.target.parentElement.parentElement.getAttribute('id');
		moveTaskBack(taskID);
	}
});
const tasksControl = (e) => {
	// Get the target task
	let target = e.target;
	let taskID =
		target.parentElement.parentElement.parentElement.parentElement.getAttribute(
			'id'
		);
	let taskName =
		target.parentElement.parentElement.parentElement.parentElement.children[0]
			.children[1];

	// Rename the task or delete it
	if (target.getAttribute('data-id') === 'rename') {
		renameTask(taskName, taskID);
	} else if (target.getAttribute('data-id') === 'delete') {
		deleteTask(taskID);
	} else if (target.getAttribute('data-id') === 'priority') {
		handlePriority(taskName, taskID);
	} else if (target.getAttribute('data-id') === 'check') {
		checkTask(target);
	}
};

const clearAllFinished = () => {
	for (let i = 0; i < finishedContainer.children.length; i++) {
		tasks.map((el, index) => {
			el.id == finishedContainer.children[i].getAttribute('id')
				? tasks.splice(index, 1)
				: '';
		});
	}
	showTasks();
	clearbtn.classList.remove('active');
};

addBtn.addEventListener('click', addTaskToFile);
tasksContainer.addEventListener('click', tasksControl);

clearbtn.addEventListener('click', clearAllFinished);
