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