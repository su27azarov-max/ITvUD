// === СКОПИРУЙТЕ И ВСТАВЬТЕ ЭТОТ КОД В КОНСОЛЬ БРАУЗЕРА (F12) ===
// Этот скрипт проверит все необходимые файлы и настройки для синхронизации GitHub

console.log('🔍 Начинаем проверку файлов для синхронизации GitHub...\n');

async function checkAllFiles() {
    const results = {
        localStorage: {},
        githubConfig: {},
        connection: {},
        file: {},
        write: {}
    };
    
    // 1. Проверка localStorage
    console.log('=== 1. ПРОВЕРКА LOCALSTORAGE ===');
    results.localStorage.students = !!localStorage.getItem('rating_students');
    results.localStorage.categories = !!localStorage.getItem('rating_categories');
    results.localStorage.githubConfig = !!localStorage.getItem('github_config');
    
    console.log('   Курсанты:', results.localStorage.students ? '✅' : '❌');
    console.log('   Категории:', results.localStorage.categories ? '✅' : '❌');
    console.log('   GitHub config:', results.localStorage.githubConfig ? '✅' : '❌');
    
    if (!results.localStorage.githubConfig) {
        console.log('\n❌ GitHub не настроен в localStorage');
        console.log('💡 Войдите как преподаватель и нажмите "⚙️ GitHub"');
        return results;
    }
    
    // 2. Проверка настроек GitHub
    console.log('\n=== 2. ПРОВЕРКА НАСТРОЕК GITHUB ===');
    const config = JSON.parse(localStorage.getItem('github_config'));
    results.githubConfig.owner = !!config.owner;
    results.githubConfig.repo = !!config.repo;
    results.githubConfig.token = !!config.token;
    results.githubConfig.filePath = config.filePath || 'data.json';
    results.githubConfig.branch = config.branch || 'main';
    
    console.log('   Владелец:', config.owner || '❌');
    console.log('   Репозиторий:', config.repo || '❌');
    console.log('   Токен:', config.token ? `${config.token.substring(0, 10)}...` : '❌');
    console.log('   Файл:', results.githubConfig.filePath);
    console.log('   Ветка:', results.githubConfig.branch);
    
    if (!results.githubConfig.owner || !results.githubConfig.repo || !results.githubConfig.token) {
        console.log('\n❌ Не все настройки заполнены');
        return results;
    }
    
    // 3. Тест соединения с GitHub
    console.log('\n=== 3. ТЕСТ СОЕДИНЕНИЯ С GITHUB ===');
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.repo}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        
        results.connection.status = response.status;
        results.connection.ok = response.ok;
        
        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Соединение работает');
            console.log('   Репозиторий:', data.full_name);
            console.log('   Приватность:', data.private ? 'приватный' : 'публичный');
            console.log('   Описание:', data.description || 'не указано');
        } else {
            console.log('   ❌ Ошибка:', response.status, response.statusText);
            if (response.status === 401) {
                console.log('   💡 Неверный токен');
            } else if (response.status === 403) {
                console.log('   💡 Доступ запрещён. Проверьте права токена');
            } else if (response.status === 404) {
                console.log('   💡 Репозиторий не найден');
            }
            return results;
        }
    } catch (error) {
        console.log('   ❌ Ошибка:', error.message);
        return results;
    }
    
    // 4. Проверка файла data.json
    console.log('\n=== 4. ПРОВЕРКА ФАЙЛА data.json ===');
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${results.githubConfig.filePath}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        
        results.file.status = response.status;
        results.file.ok = response.ok;
        
        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Файл найден');
            console.log('   Размер:', data.size, 'байт');
            console.log('   SHA:', data.sha.substring(0, 20) + '...');
            console.log('   Путь:', data.path);
            results.file.sha = data.sha;
        } else if (response.status === 404) {
            console.log('   ⚠️ Файл не найден');
            console.log('   💡 Создайте файл вручную или нажмите "💾 Сохранить"');
        } else {
            console.log('   ❌ Ошибка:', response.status);
        }
    } catch (error) {
        console.log('   ❌ Ошибка:', error.message);
    }
    
    // 5. Тест записи в GitHub
    console.log('\n=== 5. ТЕСТ ЗАПИСИ В GITHUB ===');
    try {
        if (typeof writeToGitHub === 'undefined') {
            console.log('   ❌ Функция writeToGitHub не найдена');
            console.log('   💡 Убедитесь, что страница полностью загружена');
            return results;
        }
        
        const success = await writeToGitHub();
        results.write.success = success;
        
        if (success) {
            console.log('   ✅ Запись успешна');
        } else {
            console.log('   ❌ Запись не удалась');
        }
    } catch (error) {
        console.log('   ❌ Ошибка:', error.message);
        results.write.error = error.message;
    }
    
    // Итоговый отчёт
    console.log('\n=== ИТОГОВЫЙ ОТЧЁТ ===');
    const allOk = Object.values(results.localStorage).every(v => v === true) &&
                  results.connection.ok &&
                  results.write.success;
    
    if (allOk) {
        console.log('🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ!');
        console.log('✅ Синхронизация должна работать');
    } else {
        console.log('⚠️ ОБНАРУЖЕНЫ ПРОБЛЕМЫ:');
        
        if (!Object.values(results.localStorage).every(v => v === true)) {
            console.log('   ❌ localStorage: некоторые данные отсутствуют');
        }
        if (!results.connection.ok) {
            console.log('   ❌ Соединение с GitHub не работает');
        }
        if (!results.write.success) {
            console.log('   ❌ Запись в GitHub не работает');
        }
        
        console.log('\n💡 Прочитайте файл ПРОВЕРКА_ФАЙЛОВ.md для решения проблем');
    }
    
    return results;
}

// Запускаем проверку
checkAllFiles().then(results => {
    console.log('\n=== РЕЗУЛЬТАТЫ ПРОВЕРКИ ===');
    console.log(JSON.stringify(results, null, 2));
});
