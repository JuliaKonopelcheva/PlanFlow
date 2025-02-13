(function loadSettings() {
  const main = document.querySelector("main");
  main.innerHTML = `
      <h2>Настройки</h2>
      <label>
          <input type="checkbox" id="dark-mode"> Темный режим
      </label>
  `;

  document.getElementById("dark-mode").addEventListener("change", function () {
      document.body.classList.toggle("dark");
  });
})();
