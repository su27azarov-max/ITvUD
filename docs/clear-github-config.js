// === СКРИПТ ДЛЯ ОЧИСТКИ НАСТРОЕК GITHUB ===
// Вставьте этот код в консоль браузера (F12)

console.log('🧹 Очистка настроек GitHub...\n');

// Удаляем старые настройки
localStorage.removeItem('github_config');
console.log('✅ Настройки GitHub удалены из localStorage');

// Перезагружаем страницу через 2 секунды
console.log('🔄 Перезагрузка страницы через 2 секунды...');
setTimeout(() => {
    location.reload();
}, 2000);

console.log('\n📋 Следующие шаги:');
console.log('1. Дождитесь перезагрузки страницы');
console.log('2. Войдите как преподаватель (пароль: 05072020)');
console.log('3. Нажмите "⚙️ GitHub"');
console.log('4. Заполните настройки:');
console.log('   - Владелец: su27azarov-max');
console.log('   - Репозиторий: ITvUD');
console.log('   - Token: ваш токен (начинается с ghp_...)');
console.log('   - Путь к файлу данных: docs/kursanty.json');
console.log('   - Ветка: main');
console.log('5. Нажмите "Сохранить"');
console.log('6. Нажмите "🔍 Тест" для проверки');
