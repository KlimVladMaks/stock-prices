"use strict";

// Получаем форму ввода тикера
const form = document.querySelector("#form");

// Получаем поле ввода тикера
const input = document.querySelector("#input");

// Получаем контейнер для хранения карточки
const cardContainer = document.querySelector("#card-container");

/* 
Функция для получения данных об акции из API MOEX.

@param {string} ticker - Тикер акции.
@return {json} - Данные об акции в формате JSON.
*/
async function getStockData(ticker) {

    // URL для запроса к API
    const url = `https://iss.moex.com/iss/engines/stock/markets/shares/securities/${ticker.toLowerCase()}.json?iss.meta=off`

    // Отправляем запрос к API и получаем ответ
    const response = await fetch(url);

    // Преобразуем ответ к JSON-формату
    const data = await response.json();

    // Возвращаем полученные данные
    return data;
}

/* 
Функция для вывода карточки с информацией об акции.

@param {string} ticker - Тикер акции.
@param {string} name - Название компании.
@param {number} price - Цена акции.
*/
function showCard(ticker, name, price) {

    // Подготавливаем HTML-код для карточки
    const html = `
    <div class="card-container">
        <div class="card">
            <p class="company-info"><span>${ticker.toUpperCase()}</span>${name}</p>
            <p class="price">${price} ₽</p>
        </div>
    </div>`;

    // Вставляем созданный HTML-код в контейнер для карточки
    cardContainer.innerHTML = html;
}

/* 
Функция для вывода сообщения об ошибке.

@param {string} ticker - Тикер акции для которой не удалось найти информацию.
*/
function showError(ticker) {

    // Выводим сообщение об ошибке
    alert(`Акций с тикером "${ticker.toUpperCase()}" не найдено.`);
}

// При отправке формы вызываем соответствующую функцию
// (e - событие, возникшее при отправке формы)
form.onsubmit = async function(e) {

    // Отменяем событие по-умолчанию при отправке формы
    e.preventDefault();

    // Извлекаем тикер из поля ввода и приводим его к верхнему регистру
    let ticker = input.value.trim();

    // Получаем данные об акции
    const data = await getStockData(ticker);

    // Если данные об акции не найдены
    if (data.securities.data.length === 0) {

        // Выводим сообщение об ошибке
        showError(ticker);
    }

    // Иначе
    else {

        // Получаем название компании
        const secName = data.securities.data[data.securities.data.length - 1][data.securities.columns.indexOf("SECNAME")];

        // Получаем цену акции
        const price = data.marketdata.data[data.marketdata.data.length - 1][data.marketdata.columns.indexOf("LAST")];

        // Выводим карточку с полученными данными
        showCard(ticker, secName, price);
    }
}
