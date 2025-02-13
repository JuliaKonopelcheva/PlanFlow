(function loadChecklist() {
    const main = document.querySelector("main");

    main.innerHTML = `
        <section class="checklist-container">
            <h2>📋 To-Do List</h2>

            <!-- Форма для добавления задач -->
            <div class="task__add">
                <div class="task__add-input">
                    <input class="task-iput" type="text" id="taskInput" placeholder="Новая задача...">
                </div>
                <div class="task__add-settings section__block">
                    <select id="category">
                        <option value="Работа">Работа</option>
                        <option value="Учёба">Учёба</option>
                        <option value="Личное">Личное</option>
                        <option value="Ежедневно">Ежедневно</option>
                    </select>
                    <input type="date" id="taskDate">
                    <input type="time" id="taskTime">
                    <button id="addTaskBtn">Добавить</button>
                </div>
            </div>

            <!-- Фильтр задач -->
            <div class="filter__settings section__block">
                <label for="filter">Фильтр: </label>
                <select id="filter">
                    <option value="all">Все</option>
                    <option value="active">Активные</option>
                    <option value="completed">Выполненные</option>
                </select>

                <label for="categoryFilter">Категория:</label>
                <select id="categoryFilter">
                    <option value="all">Все</option>
                    <option value="Работа">Работа</option>
                    <option value="Учёба">Учёба</option>
                    <option value="Личное">Личное</option>
                    <option value="Ежедневно">Ежедневно</option>
                </select>
            </div>

            <!-- Список задач -->
            <ul id="taskList"></ul>

            <!-- Кнопка "Очистить всё" -->
            <button id="clearAllBtn">🗑️ Очистить список</button>
        </section>
    `;

    // Получаем элементы
    let taskInput = document.getElementById("taskInput");
    let taskDateInput = document.getElementById("taskDate");
    let taskTimeInput = document.getElementById("taskTime");
    let addTaskBtn = document.getElementById("addTaskBtn");
    let taskList = document.getElementById("taskList");
    let categorySelect = document.getElementById("category");
    let clearAllBtn = document.getElementById("clearAllBtn");
    let filter = document.getElementById("filter");
    let categoryFilter = document.getElementById("categoryFilter");

    // 📌 Цвета для категорий
    const categoryColors = {
        "Работа": "#FAEBEB",
        "Учёба": "#F9FACA",
        "Личное": "#E4EFFA",
        "Ежедневно": "#EDFADE"
    };

    // 📌 Функция добавления задачи
    function addTask() {
        let taskText = taskInput.value.trim();
        let category = categorySelect.value.trim();
        let taskDate = taskDateInput.value || "";
        let taskTime = taskTimeInput.value || "";

        if (taskText === "") return;

        let li = createTaskElement(taskText, category, taskDate, taskTime, false);
        taskList.appendChild(li);
        taskInput.value = "";
        taskDateInput.value = "";
        taskTimeInput.value = "";
        saveTasks();
    }

    // 📌 Функция обновления фона задачи
    function updateTaskBackground(li, category, isDone) {
        li.style.backgroundColor = isDone ? "#f4f4f4" : (categoryColors[category] || "#f4f4f4");
    }

    // 📌 Функция создания задачи
    function createTaskElement(text, category, date, time, isDone) {
        let formattedDate = formatDateTime(date, time);
        let li = document.createElement("li");
        li.setAttribute("data-category", category);
        if (isDone) li.classList.add("done");

        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${isDone ? "checked" : ""}>
            <div class="task-content">
                <input type="text" class="task-text" value="${text}" readonly>
                <select class="task-category">
                    <option value="Работа">Работа</option>
                    <option value="Учёба">Учёба</option>
                    <option value="Личное">Личное</option>
                    <option value="Ежедневно">Ежедневно</option>
                </select>
                ${formattedDate ? `<small class="task-date" data-date="${date}" data-time="${time}">${formattedDate}</small>` : ""}
            </div>
            <button class="delete-btn">✖</button>
        `;

        let categorySelect = li.querySelector(".task-category");
        categorySelect.value = category;
        categorySelect.addEventListener("change", function () {
            li.setAttribute("data-category", this.value);
            updateTaskBackground(li, this.value, checkbox.checked);
            saveTasks();
        });

        let checkbox = li.querySelector(".checkbox");
        checkbox.addEventListener("change", function () {
            li.classList.toggle("done", this.checked);
            updateTaskBackground(li, categorySelect.value, this.checked);
            saveTasks();
        });

        li.querySelector(".delete-btn").addEventListener("click", function () {
            li.remove();
            saveTasks();
        });

        updateTaskBackground(li, categorySelect.value, checkbox.checked);
        return li;
    }

    // 📌 Функция форматирования даты и времени
    function formatDateTime(date, time) {
        let datePart = date ? new Date(date).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" }) : "";
        return datePart && time ? `Выполнить: ${datePart} ${time}` : datePart || time;
    }

    // 📌 Сохранение задач в localStorage
    function saveTasks() {
        let tasks = [];
        document.querySelectorAll("#taskList li").forEach((li) => {
            let taskDateElement = li.querySelector(".task-date");
            let taskDate = taskDateElement ? taskDateElement.dataset.date || "" : "";
            let taskTime = taskDateElement ? taskDateElement.dataset.time || "" : "";
            let category = li.querySelector(".task-category").value;

            tasks.push({
                text: li.querySelector(".task-text").value,
                category: category,
                date: taskDate,
                time: taskTime,
                done: li.classList.contains("done"),
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // 📌 Загрузка задач
    function loadTasks() {
        let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach((task) => {
            let li = createTaskElement(task.text, task.category, task.date, task.time, task.done);
            taskList.appendChild(li);
        });
    }

    // 📌 Фильтрация задач
    function updateFilters() {
        let filterValue = filter.value;
        let categoryValue = categoryFilter.value;

        document.querySelectorAll("#taskList li").forEach(li => {
            let isDone = li.classList.contains("done");
            let taskCategory = li.getAttribute("data-category");

            let matchesFilter = filterValue === "all" || (filterValue === "completed" && isDone) || (filterValue === "active" && !isDone);
            let matchesCategory = categoryValue === "all" || taskCategory === categoryValue;

            li.style.display = matchesFilter && matchesCategory ? "flex" : "none";
        });
    }

    clearAllBtn.addEventListener("click", () => taskList.innerHTML = "");
    addTaskBtn.addEventListener("click", addTask);
    filter.addEventListener("change", updateFilters);
    categoryFilter.addEventListener("change", updateFilters);
    loadTasks();
})();
