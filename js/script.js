const snowFallContainer = document.getElementById('snow-fall');

// функция для добавления снежного скрипта и структуры
function addSnowFall(count = 100) {
	// добавляем <script> в документ
	const script = document.createElement('script');
	script.type = 'module';
	script.src = 'js/snow-fall.js';
	document.body.appendChild(script);

	// добавляем HTML-структуру
	snowFallContainer.innerHTML = `
		<is-land class="snow-fall" on:media="(prefers-reduced-motion: no-preference)">
			<snow-fall count="${count}"></snow-fall>
		</is-land>
	`;
}

// кол-во снежинок
const count = 30;
// проверяем текущую дату
const now = new Date();
const start = new Date(now.getFullYear(), 11, 6); // 6 декабря
const end = new Date(now.getFullYear() + 1, 0, 6); // 6 января

if (now >= start && now < end && snowFallContainer) {
	addSnowFall(count);
}


const callbackPolicyCheckbox = document.querySelector('#policy')
const callbackSendButton = document.querySelector('#send')

function changeCallbackSendButton() {
	callbackSendButton.disabled = !callbackPolicyCheckbox.checked
	callbackSendButton.innerHTML = callbackSendButton.disabled ? callbackSendButton.dataset.textDisabled : callbackSendButton.dataset.textEnabled
}

function validationCallbackInput(input) {
	if (input.validity.patternMismatch && input.dataset.messagePattern) {
		input.setCustomValidity(input.dataset.messagePattern)
	} else if (input.validity.valueMissing && input.dataset.messageEmpty) {
		input.setCustomValidity(input.dataset.messageEmpty)
	} else {
		input.setCustomValidity('')
	}
}

document.addEventListener('DOMContentLoaded', () => {
	changeCallbackSendButton()
	const formDataFromStorage = JSON.parse(localStorage.getItem('callback'))
	const formData = new FormData(document.querySelector('#form'))
	console.log(formDataFromStorage, formData);
	for (const id in formDataFromStorage) {
		formData.set(id, formDataFromStorage[id])
		document.querySelector(`#${id}`).value = formDataFromStorage[id]
	}
})
callbackPolicyCheckbox.addEventListener('change', changeCallbackSendButton)


document.querySelectorAll('input[required]').forEach(input => {
	input.addEventListener('change', () => {
		validationCallbackInput(input)
	})
})

document.querySelector('#form').addEventListener('submit', event => {
	event.preventDefault();
	const formDataToJson = (formData) => JSON.stringify(Object.fromEntries(formData));
	const formData = formDataToJson(new FormData(event.target));
	localStorage.setItem('callback', formData);
})
