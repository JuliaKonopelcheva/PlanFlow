// Подключение основных стилей
import './styles/style.css';
import './styles/variables.css';
import './styles/dark.css';
import './styles/light.css';



document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const main = document.querySelector("main");

  function changeTab(tab) {
      // Убираем активный класс со всех вкладок
      tabs.forEach(btn => {
          btn.classList.remove("active");
          btn.disabled = false; // Разблокируем кнопки
      });

      // Добавляем активный класс к выбранной вкладке и делаем её некликабельной
      tab.classList.add("active");
      tab.disabled = true;

      // Получаем имя вкладки
      const tabName = tab.getAttribute("data-tab");

      // Загружаем нужный скрипт и контент
      loadTabContent(tabName);
  }

  function loadTabContent(tabName) {
      main.innerHTML = `<h2>Загрузка...</h2>`;

      // Удаляем старый подключенный скрипт, если он есть
      const oldScript = document.getElementById("dynamic-script");
      if (oldScript) {
          oldScript.remove();
      }

      // Создаём новый скрипт
      const script = document.createElement("script");
      script.src = `components/${tabName}/${tabName}.js`;
      script.id = "dynamic-script";
      script.onload = function () {
          console.log(`${tabName}.js загружен`);
      };
      script.onerror = function () {
          console.error(`Ошибка загрузки ${tabName}.js`);
          main.innerHTML = `<h2>Ошибка загрузки раздела</h2><p>Не удалось загрузить ${tabName}.js.</p>`;
      };

      // Добавляем скрипт в <body>
      document.body.appendChild(script);
  }

  // Назначаем обработчики кликов для вкладок
  tabs.forEach(tab => {
      tab.addEventListener("click", function () {
          changeTab(this);
      });
  });

  // Устанавливаем начальную активную вкладку (Описание)
  changeTab(document.querySelector(".tab[data-tab='description']"));
});

