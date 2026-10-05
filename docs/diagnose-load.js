// === ДИАГНОСТИЧЕСКИЙ СКРИПТ ===
// Вставьте этот код в консоль браузера (F12) на сайте

console.log('🔍 Диагностика загрузки данных...\n');

// 1. Проверяем текущий URL
console.log('📍 Текущий URL:', window.location.href);
console.log('📍 Origin:', window.location.origin);
console.log('📍 Pathname:', window.location.pathname);

// 2. Формируем URL для загрузки
let repoUrl = window.location.origin + window.location.pathname;
repoUrl = repoUrl.replace(/\/index\.html$/, '').replace(/\/$/, '');
const dataUrl = repoUrl + '/kursanty.json';

console.log('\n📡 URL для загрузки файла:', dataUrl);

// 3. Пытаемся загрузить файл
console.log('\n🔄 Загружаем файл kursanty.json...');

fetch(dataUrl, {
    cache: 'no-store',
    headers: {
        'Accept': 'application/json'
    }
})
.then(response => {
    console.log('📥 Статус ответа:', response.status, response.statusText);
    
    if (!response.ok) {
        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
    }
    
    return response.json();
})
.then(data => {
    console.log('✅ Файл успешно загружен!');
    console.log('📦 Структура файла:', Object.keys(data));
    
    if (data.kursanty && Array.isArray(data.kursanty)) {
        console.log('✅ Найдено курсантов:', data.kursanty.length);
        console.log('\n📋 Первые 3 курсанта:');
        data.kursanty.slice(0, 3).forEach((s, i) => {
            console.log(`  ${i + 1}. ${s.fullName} (${s.group})`);
        });
        
        console.log('\n💾 Сохраняем в localStorage...');
        localStorage.setItem('rating_students', JSON.stringify(data.kursanty));
        console.log('✅ Данные сохранены в localStorage');
        
        console.log('\n🔄 Перезагружаем страницу...');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
    } else {
        console.error('❌ Файл не содержит массив kursanty');
        console.log('📦 Содержимое файла:', data);
    }
})
.catch(error => {
    console.error('❌ Ошибка загрузки:', error.message);
    console.log('\n💡 Возможные причины:');
    console.log('  1. Файл kursanty.json не загружен в репозиторий');
    console.log('  2. GitHub Pages ещё не обновился (подождите 1-2 минуты)');
    console.log('  3. Неправильный URL репозитория');
    console.log('  4. CORS проблемы');
    
    console.log('\n🔧 Проверьте:');
    console.log('  - Откройте URL в новой вкладке:', dataUrl);
    console.log('  - Убедитесь, что файл существует в репозитории');
    console.log('  - Проверьте настройки GitHub Pages');
});
