// 🎨 Palet warna lembut untuk setiap todo
const todoColors = [
  "#fef3c7", // soft orange
  "#dbeafe", // soft blue
  "#dcfce7", // soft green
  "#fae8ff", // soft purple
  "#fee2e2", // soft red
  "#f0f9ff", // soft sky
  "#fef9c3", // soft yellow
];

// Default todos (muncul kalau localStorage kosong)
const defaultTodos = [
  {
    todo: "Belajar JavaScript",
    completed: false,
    priority: "medium",
    category: "Belajar",
    deadline: "2025-09-30",
  },
  {
    todo: "Mengerjakan Tugas Kampus",
    completed: false,
    priority: "high",
    category: "Kerja",
    deadline: "2025-10-05",
  },
  {
    todo: "Olahraga Ringan",
    completed: true,
    priority: "low",
    category: "Pribadi",
    deadline: "",
  },
];

// Load dari localStorage atau pake default
let todos = JSON.parse(localStorage.getItem("todos")) || defaultTodos;

// Update Statistik + Progress Bar
function updateStats() {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statCompleted").textContent = completed;
  document.getElementById("statPending").textContent = pending;

  // Progress bar
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  document.getElementById("progressBar").style.width = progress + "%";
  document.getElementById(
    "progressText"
  ).textContent = `${progress}% Completed`;
}

// Render Todo List
function renderTodos() {
  const todoList = document.getElementById("todoList");
  const filter = document.getElementById("filter").value;
  const search = document.getElementById("search").value.toLowerCase();
  todoList.innerHTML = "";

  todos
    .filter((item) => {
      if (filter === "completed" && !item.completed) return false;
      if (filter === "pending" && item.completed) return false;
      if (search && !item.todo.toLowerCase().includes(search)) return false;
      return true;
    })
    .forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "todo-item fade-in";
      div.dataset.id = index;

      // 🎨 kasih warna dari palet, supaya tiap todo beda
      div.style.backgroundColor =
        todoColors[index % todoColors.length] || "#ffffff";

      const left = document.createElement("div");
      left.className = "d-flex align-items-center gap-3";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.completed;
      checkbox.addEventListener("change", () => {
        item.completed = checkbox.checked;
        saveTodos();
        renderTodos();
      });

      const details = document.createElement("div");
      details.innerHTML = `
        <strong style="text-decoration:${
          item.completed ? "line-through" : "none"
        }">
          ${item.todo}
        </strong><br>
        <small>Kategori: ${item.category} | Deadline: ${
        item.deadline || "-"
      } </small>
      `;

      left.appendChild(checkbox);
      left.appendChild(details);

      const actions = document.createElement("div");
      actions.className = "todo-actions d-flex align-items-center gap-2";

      // badge prioritas
      const priorityBadge = document.createElement("span");
      priorityBadge.className = "badge";
      if (item.priority === "high") {
        priorityBadge.classList.add("bg-danger");
        priorityBadge.textContent = "Tinggi";
      } else if (item.priority === "medium") {
        priorityBadge.classList.add("bg-warning", "text-dark");
        priorityBadge.textContent = "Sedang";
      } else {
        priorityBadge.classList.add("bg-success");
        priorityBadge.textContent = "Rendah";
      }

      const editBtn = document.createElement("button");
      editBtn.innerHTML = '<i class="bi bi-pencil-square text-primary"></i>';
      editBtn.addEventListener("click", () => {
        const newTodo = prompt("Edit todo:", item.todo);
        if (newTodo && !todos.some((t) => t.todo === newTodo && t !== item)) {
          item.todo = newTodo;
          saveTodos();
          renderTodos();
        } else if (todos.some((t) => t.todo === newTodo && t !== item)) {
          alert("Todo dengan judul sama sudah ada!");
        }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = '<i class="bi bi-trash text-danger"></i>';
      deleteBtn.addEventListener("click", () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      });

      actions.appendChild(priorityBadge);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      div.appendChild(left);
      div.appendChild(actions);
      todoList.appendChild(div);
    });

  updateStats();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formData");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoInput = form.todo.value.trim();
    const priority = form.priority.value;
    const category = form.category.value;
    const deadline = form.deadline.value;

    if (!todoInput) {
      alert("Todo tidak boleh kosong!");
      return;
    }
    if (todos.some((t) => t.todo === todoInput)) {
      alert("Todo dengan judul sama sudah ada!");
      return;
    }

    todos.unshift({
      todo: todoInput,
      completed: false,
      priority,
      category,
      deadline,
    });
    form.reset();
    saveTodos();
    renderTodos();
  });

  document.getElementById("filter").addEventListener("change", renderTodos);
  document.getElementById("search").addEventListener("input", renderTodos);

  renderTodos();

  // Drag and drop
  new Sortable(document.getElementById("todoList"), {
    animation: 150,
    onEnd: (evt) => {
      const [removed] = todos.splice(evt.oldIndex, 1);
      todos.splice(evt.newIndex, 0, removed);
      saveTodos();
      renderTodos();
    },
  });
});
