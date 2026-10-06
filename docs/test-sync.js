// === СКОПИРУЙТЕ И ВСТАВЬТЕ ЭТОТ КОД В КОНСОЛЬ БРАУЗЕРА (F12) ===

console.log('🔍 Начинаем диагностику синхронизации GitHub...\n');

// 1. Проверяем настройки
const config = JSON.parse(localStorage.getItem('github_config') || '{}');
if (!config.token) {
    console.log('❌ GitHub не настроен');
    console.log('💡 Войдите как преподаватель и нажмите "⚙️ GitHub"');
} else {
    console.log('✅ GitHub настроен:');
    console.log('   - Владелец:', config.owner);
    console.log('   - Репозиторий:', config.repo);
    console.log('   - Токен:', config.token.substring(0, 10) + '...');
    console.log('   - Файл:', config.filePath || 'data.json');
    console.log('   - Ветка:', config.branch || 'main');
}

// 2. Проверяем данные
console.log('\n📊 Текущие данные:');
console.log('   - Курсантов:', students ? students.length : 0);
console.log('   - Категорий:', categories ? categories.length : 0);

// 3. Тестируем чтение из GitHub
async function testRead() {
    console.log('\n📖 Тестируем чтение из GitHub...');
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath || 'data.json'}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Файл найден');
            console.log('   - Размер:', data.size, 'байт');
            console.log('   - SHA:', data.sha.substring(0, 20) + '...');
            return true;
        } else if (response.status === 404) {
            console.log('⚠️ Файл не найден (это нормально, если вы ещё не сохраняли)');
            return false;
        } else {
            console.log('❌ Ошибка:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.log('❌ Ошибка:', error.message);
        return false;
    }
}

// 4. Тестируем запись в GitHub
async function testWrite() {
    console.log('\n💾 Тестируем запись в GitHub...');
    
    if (!config.token) {
        console.log('❌ GitHub не настроен');
        return false;
    }
    
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath || 'data.json'}`;
        
        // Получаем SHA файла
        let sha = null;
        try {
            const getResponse = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (getResponse.ok) {
                const data = await getResponse.json();
                sha = data.sha;
            }
        } catch (e) {
            // Файл не существует
        }
        
        // Создаём тестовые данные
        const testData = {
            students: [{
                id: 999,
                fullName: 'ТЕСТ',
                group: 'ТЕСТ',
                notes: 0,
                practice: 0,
                reports: 0,
                bonus: 0,
                testing: 0
            }],
            categories: categories || [],
            lastUpdated: new Date().toISOString()
        };
        
        // Кодируем в base64
        const content = btoa(JSON.stringify(testData));
        
        // Формируем запрос
        const body = {
            message: 'Тест синхронизации',
            content: content,
            branch: config.branch || 'main'
        };
        
        if (sha) {
            body.sha = sha;
        }
        
        // Отправляем запрос
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Запись успешна!');
            console.log('   - Commit:', result.commit.sha.substring(0, 20) + '...');
            console.log('   - URL:', result.content.html_url);
            return true;
        } else {
            const error = await response.json();
            console.log('❌ Ошибка записи:', response.status);
            console.log('   - Сообщение:', error.message);
            
            if (response.status === 401) {
                console.log('💡 Неверный токен. Создайте новый на https://github.com/settings/tokens');
            } else if (response.status === 403) {
                console.log('💡 Недостаточно прав. Убедитесь, что токен имеет права "repo"');
            } else if (response.status === 404) {
                console.log('💡 Репозиторий не найден. Проверьте имя владельца и репозитория');
            } else if (response.status === 422) {
                console.log('💡 Ошибка валидации. Возможно, нужно указать SHA файла');
            }
            return false;
        }
    } catch (error) {
        console.log('❌ Ошибка:', error.message);
        return false;
    }
}

// 5. Запускаем тесты
(async () => {
    const readResult = await testRead();
    const writeResult = await testWrite();
    
    console.log('\n=== РЕЗУЛЬТАТЫ ===');
    console.log('Чтение:', readResult ? '✅' : '❌');
    console.log('Запись:', writeResult ? '✅' : '❌');
    
    if (readResult && writeResult) {
        console.log('\n🎉 Синхронизация работает!');
        console.log('💡 Теперь вы можете использовать кнопку "💾 Сохранить" в приложении');
    } else {
        console.log('\n⚠️ Обнаружены проблемы');
        console.log('💡 Проверьте файл STEP_BY_STEP_FIX.md для решения проблем');
    }
})();
