// API ключ и массив для отслеживания истории ввода
const apiKey = "8774eb2043a13010575b487a157aa40e";
const input_history = [];

// Обработчик события отправки формы
$(".top-banner form").submit(function (e) {
  e.preventDefault(); // Предотвращает стандартное поведение формы (перезагрузку страницы)

  // Получаем значение из поля ввода
  let inputVal = $(".top-banner input").val();

  // Поиск города в списке существующих
  const listItems = $(".ajax-section .city");
  let found = false;

  // Проверка существующих городов в списке
  listItems.each(function () {
    const content = $(this).find(".city-name span").text().toLowerCase();
    if (content === inputVal.toLowerCase()) {
      found = true;
      return false; // Прерываем цикл, если город уже есть в списке
    }
  });

  // Если город уже есть в списке
  if (found) {
    $(".top-banner .msg").text(`Вы уже знаете погоду для ${inputVal}... уточните город указав код страны 😉`);
    $(".top-banner form")[0].reset(); // Очищаем форму
    $(".top-banner input").focus(); // Фокус на поле ввода
    return; // Выходим из обработчика
  }

  // Формируем URL для отправки запроса на получение погоды
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  // Проверяем историю ввода
  if (input_history.includes(inputVal.toLowerCase())) {
    $(".top-banner .msg").text("Пожалуйста, введите действительный город 😩");
    alert("Город уже добавлен!!");
  } else {
    // Добавляем город в историю
    input_history.push(inputVal.toLowerCase());

    // Отправляем запрос на сервер для получения данных о погоде
    $.ajax({
      url: url,
      method: "GET",
      success: function (data) {
        const { main, name, weather } = data;
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

        // Создаем HTML разметку с информацией о погоде
        const markup = `
          <li class="city">
            <h2 class="city-name" data-name="${name}">
              <span>${name}</span>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
              <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
              <figcaption>${weather[0]["description"]}</figcaption>
            </figure>
          </li>
        `;
        // Добавляем информацию о погоде в список городов
        $(".ajax-section .cities").prepend(markup);
      },
      error: function () {
        // В случае ошибки выводим сообщение
        $(".top-banner .msg").text("Пожалуйста, введите действительный город 😩");
      },
    });
  }

  // Очищаем сообщение об ошибке
  $(".top-banner .msg").text("");
  $(".top-banner form")[0].reset(); // Очищаем форму
  $(".top-banner input").focus(); // Фокус на поле ввода
});
