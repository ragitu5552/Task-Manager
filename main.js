// Get DOM elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskFormModal = document.getElementById("task-form-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Get search elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Load tasks from localStorage or initialize with predefined tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [
    {
        id: 1,
        title: "Complete Project",
        description: "Finish the task management app",
        dueDate: "2023-12-31",
        priority: "high",
    },
    {
        id: 2,
        title: "Buy Groceries",
        description: "Milk, Bread, Eggs",
        dueDate: "2023-11-15",
        priority: "medium",
    },
    {
        id: 3,
        title: "Call Mom",
        description: "Wish her a happy birthday",
        dueDate: "2023-11-20",
        priority: "low",
    },
];

// Function to filter tasks based on search query
function filterTasks(query) {
    return tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
    );
}


// Get filter buttons
const filterCompletedBtn = document.getElementById("filter-completed");
const filterOverdueBtn = document.getElementById("filter-overdue");
const filterUpcomingBtn = document.getElementById("filter-upcoming");

// Function to filter tasks based on the filter type
function filterTasksByType(filterType) {
    const now = new Date();
    let filteredTasks = [];

    switch (filterType) {
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        case 'overdue':
            filteredTasks = tasks.filter(task => new Date(task.dueDate) < now);
            break;
        case 'upcoming':
            filteredTasks = tasks.filter(task => new Date(task.dueDate) >= now);
            break;
    }

    renderTasks(filteredTasks);
}

// Add event listeners to filter buttons
filterCompletedBtn.addEventListener("click", () => filterTasksByType('completed'));
filterOverdueBtn.addEventListener("click", () => filterTasksByType('overdue'));
filterUpcomingBtn.addEventListener("click", () => filterTasksByType('upcoming'));



// Function to render tasks
function renderTasks(tasksToRender) {
    taskList.innerHTML = ""; // Clear the task list
    tasksToRender.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p><strong>Due Date:</strong> ${task.dueDate}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <div class="task-actions">
                <button class="edit-btn" data-id="${task.id}">Edit</button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

// Handle search button click
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        const filteredTasks = filterTasks(query);
        renderTasks(filteredTasks); // Render only the filtered tasks
    } else {
        renderTasks(tasks); // If search is empty, render all tasks
    }
});

// Handle search input keypress (optional)
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            const filteredTasks = filterTasks(query);
            renderTasks(filteredTasks); // Render only the filtered tasks
        } else {
            renderTasks(tasks); // If search is empty, render all tasks
        }
    }
});

// Show modal
addTaskBtn.addEventListener("click", () => {
    taskFormModal.classList.add("show");
});

// Hide modal
closeModalBtn.addEventListener("click", () => {
    taskFormModal.classList.remove("show");
});

// Hide modal when clicking outside the form
window.addEventListener("click", (event) => {
    if (event.target === taskFormModal) {
        taskFormModal.classList.remove("show");
    }
});

// Handle form submission
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get form values
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("due-date").value;
    const priority = document.getElementById("priority").value;

    // Create a task object
    const task = {
        id: tasks.length + 1,
        title,
        description,
        dueDate,
        priority,
    };

    // Add the task to the tasks array
    tasks.push(task);

    // Save to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Render all tasks
    renderTasks(tasks);

    // Hide modal and reset form
    taskFormModal.classList.remove("show");
    taskForm.reset();
});

// Handle edit and delete
taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const taskId = parseInt(event.target.getAttribute("data-id"));
        tasks = tasks.filter((task) => task.id !== taskId);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks(tasks); // Render all tasks after deletion
    } else if (event.target.classList.contains("edit-btn")) {
        const taskId = parseInt(event.target.getAttribute("data-id"));
        const task = tasks.find((task) => task.id === taskId);
        if (task) {
            document.getElementById("title").value = task.title;
            document.getElementById("description").value = task.description;
            document.getElementById("due-date").value = task.dueDate;
            document.getElementById("priority").value = task.priority;
            taskFormModal.classList.add("show");

            // Remove the task from the list
            tasks = tasks.filter((task) => task.id !== taskId);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks(tasks); // Render all tasks after editing
        }
    }
});

// Initial render of all tasks
renderTasks(tasks);