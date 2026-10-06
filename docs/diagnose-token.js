// === ДИАГНОСТИКА ТОКЕНА GITHUB ===
// Вставьте этот код в консоль браузера (F12)

console.log('🔍 Диагностика токена GitHub...\n');

// 1. Проверяем токен в localStorage
const config = JSON.parse(localStorage.getItem('github_config') || '{}');

console.log('=== 1. ПРОВЕРКА ТОКЕНА В LOCALSTORAGE ===');
if (!config.token) {
    console.log('❌ Токен не найден в localStorage');
    console.log('💡 Настройте GitHub через кнопку "⚙️ GitHub"');
} else {
    console.log('✅ Токен найден');
    console.log('   Длина токена:', config.token.length);
    console.log('   Начало токена:', config.token.substring(0, 10) + '...');
    console.log('   Конец токена: ...' + config.token.substring(config.token.length - 5));
    
    // Проверка формата
    if (config.token.startsWith('ghp_') || config.token.startsWith('github_pat_')) {
        console.log('✅ Токен имеет правильный формат');
    } else {
        console.log('⚠️ Токен не начинается с ghp_ или github_pat_');
        console.log('💡 Возможно, токен скопирован неправильно');
    }
    
    // Проверка на пробелы
    if (config.token.includes(' ')) {
        console.log('❌ Токен содержит пробелы!');
        console.log('💡 Удалите пробелы из токена');
    } else {
        console.log('✅ Токен не содержит пробелов');
    }
    
    // Проверка на переносы строк
    if (config.token.includes('\n') || config.token.includes('\r')) {
        console.log('❌ Токен содержит переносы строк!');
        console.log('💡 Удалите переносы строк из токена');
    } else {
        console.log('✅ Токен не содержит переносов строк');
    }
}

console.log('\n=== 2. ПРОВЕРКА НАСТРОЕК ===');
console.log('Владелец:', config.owner || '❌ не указан');
console.log('Репозиторий:', config.repo || '❌ не указан');
console.log('Путь к файлу:', config.filePath || '❌ не указан');
console.log('Ветка:', config.branch || '❌ не указана');

// 3. Тестируем запрос к GitHub API
console.log('\n=== 3. ТЕСТ ЗАПРОСА К GITHUB API ===');

async function testToken() {
    if (!config.token || !config.owner || !config.repo) {
        console.log('❌ Настройки неполные');
        return;
    }
    
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}`;
    console.log('📡 URL:', url);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        
        console.log('📥 Статус ответа:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Токен работает!');
            console.log('   Репозиторий:', data.full_name);
            console.log('   Приватность:', data.private ? 'приватный' : 'публичный');
        } else if (response.status === 401) {
            console.log('❌ Ошибка 401: Неверный токен');
            console.log('\n💡 Возможные причины:');
            console.log('   1. Токен не имеет прав repo');
            console.log('   2. Токен истёк');
            console.log('   3. Токен скопирован неправильно');
            console.log('   4. Токен содержит пробелы или переносы строк');
            
            // Попробуем другой формат заголовка
            console.log('\n🔄 Пробуем альтернативный формат заголовка...');
            const response2 = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            console.log('📥 Статус ответа (альтернативный):', response2.status, response2.statusText);
            
            if (response2.ok) {
                console.log('✅ Альтернативный формат работает!');
                console.log('💡 Используйте формат "token" вместо "Bearer"');
            } else {
                console.log('❌ Оба формата не работают');
                console.log('💡 Создайте новый токен с правами repo');
            }
        } else if (response.status === 403) {
            console.log('❌ Ошибка 403: Доступ запрещён');
            console.log('💡 Токен не имеет прав repo');
        } else if (response.status === 404) {
            console.log('❌ Ошибка 404: Репозиторий не найден');
            console.log('💡 Проверьте имя владельца и репозитория');
        }
    } catch (error) {
        console.log('❌ Ошибка:', error.message);
    }
}

testToken();

// 4. Показываем полный токен (для проверки)
console.log('\n=== 4. ПОЛНЫЙ ТОКЕН (для проверки) ===');
if (config.token) {
    console.log('Токен:', config.token);
    console.log('💡 Скопируйте этот токен и сравните с тем, что на GitHub');
}

console.log('\n=== ДИАГНОСТИКА ЗАВЕРШЕНА ===');
