// Контейнер для добавления снежинок
const snowFallContainer = document.querySelector('#snow-fall');

/**
 * Функция для добавления снежного скрипта и структуры.
 *
 * @param {number} count - Количество снежинок, которые будут добавлены на страницу (по умолчанию 100)
 */
function addSnowFall(count = 100) {
	// Создаем элемент <script> и добавляем его в документ
	const script = document.createElement('script');
	script.type = 'module';
	script.src = 'js/snow-fall.js';
	document.body.appendChild(script);

	// Добавляем HTML-структуру для снежинок
	snowFallContainer.innerHTML = `
		<is-land class="snow-fall" on:media="(prefers-reduced-motion: no-preference)">
			<snow-fall count="${count}"></snow-fall>
		</is-land>
	`;
}

// Количество снежинок.
const count = 30;

// Определяем текущую дату.
const now = new Date();
const start = new Date(now.getFullYear(), 11, 6); // 6 декабря
const end = new Date(now.getFullYear() + 1, 0, 6); // 6 января

// Если текущая дата находится между 6 декабря и 6 января, добавляем снежинки
if (now >= start && now < end && snowFallContainer) {
	addSnowFall(count);
}







let countdownInterval;

const callbackPolicyCheckbox = document.querySelector('#policy');
const callbackSendButton = document.querySelector('#send');
const formNotify = document.querySelector('.form__notify');
const hiddenInput = document.querySelector('#wall');
const timeLimitCounter = document.querySelector('#timeLimitCounter');

/**
 * Функция изменяет состояние кнопки отправки формы в зависимости от состояния чекбокса согласия.
 */
function toggleSendButton() {
	callbackSendButton.disabled = !callbackPolicyCheckbox.checked;
	// Если чекбокс согласия не активен, кнопка становится недоступной и отображает текст с подсказкой о недоступности.
	// Если чекбокс согласия активен, кнопка становится доступной и отображает текст с подсказкой о доступности.
	callbackSendButton.innerHTML = callbackSendButton.disabled ? callbackSendButton.dataset.textDisabled : callbackSendButton.dataset.textEnabled;
}

/**
 * Функция выполняет валидацию элемента формы.
 * 
 * @param {HTMLInputElement} input - элемент формы для валидации.
 */
function validateInput(input) {
	// Если у поля при валидации произошла ошибка несоответствия паттерну и у поля есть сообщение об ошибке несоответствия паттерну, то показать это сообщение
	if (input.validity.patternMismatch && input.dataset.messagePattern) {
		input.setCustomValidity(input.dataset.messagePattern);
	}
	// Если у поля при валидации произошла ошибка отсутствия значения и у поля есть сообщение об ошибке отсутствия значения, то показать это сообщение
	else if (input.validity.valueMissing && input.dataset.messageEmpty) {
		input.setCustomValidity(input.dataset.messageEmpty);
	}
	else {
		input.setCustomValidity('');
	}
}

/**
 * Функция получает значение куки по ее имени.
 * 
 * @param {string} name - имя куки, которую нужно получить
 * @returns {string|null} значение куки, если она существует, иначе null
 */
function getCookie(name) {
	// Добавляет `; ` в начало строки `document.cookie` для формирования правильного разделителя
	const value = `; ${document.cookie}`;
	// Разделяет строку `document.cookie` на части с учетом имени куки
	const parts = value.split(`; ${name}=`);
	
	// Если длина частей равна 2, кука существует
	if (parts.length === 2) {
		// Возвращает значение куки, разделенное по `;` и первым вхождением `;`
		return parts.pop().split(';').shift();
	}
	// Если кука не найдена, возвращает null
	return null;
}

/**
 * Функция очищает форму и обновляет данные в localStorage.
 * 
 * @param {HTMLFormElement} form - форма, которую необходимо очистить.
 */
function clearForm(form) {
	// Сбрасывает значения всех элементов формы
	form.reset();

	// Получает данные из localStorage
	const formDataFromStorage = JSON.parse(localStorage.getItem('callback') || '{}');

	// Создает новый объект с сохраненными данными формы, оставляя только ключ `wall`
	const newFormData = { wall: formDataFromStorage.wall };

	// Обновляет данные в localStorage, заменяя старое хранилище на новый формат данных в JSON
	localStorage.setItem('callback', formDataToJson(new Map(Object.entries(newFormData))));
}

/**
 * Функция преобразует данные формы в JSON.
 * 
 * @param {Map} form - данные формы в виде объекта `Map` (ключи и значения).
 * @returns {string} строка в формате JSON, представляющая данные формы.
 */
function formDataToJson(form) {
	// Преобразует данные формы из объекта Map в объект JavaScript с ключами и значениями
	const jsonObject = Object.fromEntries(form);
	// Возвращает строку JSON, представляющую объект
	return JSON.stringify(jsonObject);
}

/**
 * Функция управляет таймером обратного отсчета - очищает предыдущий таймер, если он есть, и устанавливает новый.
 *
 * @param {number} seconds - количество секунд для отсчета.
 */
function startCountdown(seconds) {
	// Очищает предыдущий таймер
	clearInterval(countdownInterval);

	// Функция для обновления отображаемого времени
	function updateCounter() {
		// Вычисляет количество минут из оставшихся секунд
		const minutes = Math.floor(seconds / 60);
		// Вычисляет оставшиеся секунды
		const secondsLeft = seconds % 60;

		// Обновляет текстовое содержимое элемента с id 'timeLimitCounter'
		timeLimitCounter.textContent = `${minutes}:${secondsLeft.toString().padStart(2, '0')}`;
		// Уменьшает секунды на одну единицу
		seconds--;

		// Если время обратного отсчета закончилось, очищает интервал и скрывает уведомление формы
		if (seconds < 0) {
			clearInterval(countdownInterval);
			formNotify.hidden = true;
		}
	}

	// Выполняет начальную установку времени
	updateCounter();
	// Устанавливает обновление времени каждую секунду
	countdownInterval = setInterval(updateCounter, 1000);
}

/**
 * Событие, срабатывающее когда первоначальный HTML документ будет полностью загружен (без стилей, изображений и фреймов).
 *
 * @type {Document} - целевой объект события
 * @listens document#DOMContentLoaded - пространство имен и название события
 */
document.addEventListener('DOMContentLoaded', () => {
	// Включает или отключает кнопку отправки формы в зависимости от состояния чекбокса согласия
	toggleSendButton();

	// Получает значение куки 'privacyConsent' и устанавливает состояние чекбокса в соответствии с этим значением
	const savedConsent = getCookie('privacyConsent');
	if (savedConsent !== undefined) {
		callbackPolicyCheckbox.checked = savedConsent === 'true';
	}

	// Загружает данные формы из localStorage и обновляет форму
	const formDataFromStorage = JSON.parse(localStorage.getItem('callback'));
	const formData = new FormData(document.querySelector('#form'));
	for (const id in formDataFromStorage) {
		formData.set(id, formDataFromStorage[id]);
		document.querySelector(`#${id}`).value = formDataFromStorage[id];
	}

	// Определяет время последней отправки формы и рассчитывает оставшееся время обратного отсчета
	const now = Date.now();
	const lastSubmitTime = parseInt(hiddenInput.value, 10) || 0;
	const elapsedSeconds = Math.floor((now - lastSubmitTime) / 1000);
	const cooldownTime = 5 * 60; // 5 минут в секундах
	const remainingTime = cooldownTime - elapsedSeconds;

	// Если осталось время для действия таймера, отображает уведомление и запускает обратный отсчет
	if (remainingTime > 0) {
		formNotify.hidden = false;
		startCountdown(remainingTime);
	}
});

/**
 * Обработчик изменения состояния чекбокса согласия.
 *
 * @param {Event} event - событие изменения состояния чекбокса
 */
callbackPolicyCheckbox.addEventListener('change', event => {
	// Включает или отключает кнопку отправки формы в зависимости от состояния чекбокса согласия
	toggleSendButton();

	// Устанавливает значение куки 'privacyConsent' в зависимости от состояния чекбокса
	const consentValue = event.target.checked ? 'true' : 'false';
	document.cookie = `privacyConsent=${consentValue}; path=/; max-age=31536000; SameSite=Lax; Secure`;

	// Если чекбокс не активен, удаляет куку 'privacyConsent' и очищает данные формы
	if (!event.target.checked) {
		document.cookie = `privacyConsent=; path=/; max-age=0; SameSite=None; Secure`;
		clearForm(document.querySelector('#form'));
	}
});

/**
 * Обрабатывает все поля ввода с атрибутом 'required' при их изменении.
 * Каждый раз при изменении значения в этих полях выполняется валидация с использованием функции `validateInput`.
 */
document.querySelectorAll('input[required]').forEach(input => {
	// Добавляет слушатель события 'change' для каждого обязательного поля ввода
	input.addEventListener('change', () => {
		// Валидация поля ввода
		validateInput(input);
	});
});

/**
 * Обрабатывает отправку формы.
 * Проверяет, прошло ли не менее 5 минут с последней отправки формы.
 * Если время еще не прошло, отображает уведомление и запускает обратный отсчет.
 * Если прошло, сохраняет данные формы в localStorage и скрывает уведомление.
 *
 * @param {Event} event - объект события submit
 */
document.querySelector('#form').addEventListener('submit', event => {
	// Предотвращает стандартное поведение отправки формы
	event.preventDefault();

	// Текущее время в миллисекундах
	const now = Date.now();
	// Минимальное время в минутах
	const minutes = 5;
	// Время последней отправки из hidden input, если оно есть
	const lastSubmitTime = parseInt(hiddenInput.value, 10) || 0;
	// Время, прошедшее с последней отправки в минутах
	const timeElapsed = (now - lastSubmitTime) / 60000;

	// Если время, прошедшее с последней отправки меньше 5 минут
	if (timeElapsed < minutes) {
		// Отображает уведомление
		formNotify.hidden = false;
		// Запускает обратный отсчет времени до следующей возможной отправки
		startCountdown(Math.ceil((minutes - timeElapsed) * 60));
		console.warn('Еще не прошло 5 минут с вашей прошлой отправки формы');
		return;
	}

	// Обновляет timestamp на текущее время
	hiddenInput.value = now;

	// Создает объект FormData из отправленных данных формы
	const formData = new FormData(event.target);
	// Преобразует данные формы в JSON
	const formDataJson = formDataToJson(formData);
	// Сохраняет данные формы в localStorage
	localStorage.setItem('callback', formDataJson);
	// Скрывает уведомление
	formNotify.hidden = true;
	console.info('Форма отправлена');
});
