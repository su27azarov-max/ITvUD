// === ДИАГНОСТИКА АВТОСОХРАНЕНИЯ ===
// Вставьте этот код в консоль браузера (F12)

console.log('🔍 Диагностика автосохранения...\n');

// 1. Проверка настроек GitHub
console.log('=== 1. ПРОВЕРКА НАСТРОЕК GITHUB ===');
const config = JSON.parse(localStorage.getItem('github_config') || '{}');

if (!config.token) {
    console.log('❌ GitHub не настроен');
    console.log('💡 Нажмите "⚙️ GitHub" и настройте подключение');
} else {
    console.log('✅ GitHub настроен:');
    console.log('   - Владелец:', config.owner);
    console.log('   - Репозиторий:', config.repo);
    console.log('   - Токен:', config.token.substring(0, 10) + '...');
    console.log('   - Путь к файлу:', config.filePath);
    console.log('   - Ветка:', config.branch);
    
    // Проверка пути
    if (config.filePath !== 'docs/kursanty.json') {
        console.log('⚠️ ВНИМАНИЕ: Путь к файлу неправильный!');
        console.log('   Должно быть: docs/kursanty.json');
        console.log('   Сейчас:', config.filePath);
        console.log('💡 Нажмите "⚙️ GitHub" и исправьте путь');
    } else {
        console.log('✅ Путь к файлу правильный');
    }
}

// 2. Проверка данных
console.log('\n=== 2. ПРОВЕРКА ДАННЫХ ===');
console.log('Курсантов в памяти:', students ? students.length : 0);
console.log('Категорий в памяти:', categories ? categories.length : 0);

if (students && students.length > 0) {
    console.log('✅ Данные есть в памяти');
    console.log('Первый курсант:', students[0]);
} else {
    console.log('❌ Данные отсутствуют в памяти');
}

// 3. Проверка автосохранения
console.log('\n=== 3. ПРОВЕРКА АВТОСОХРАНЕНИЯ ===');
if (typeof autoSaveEnabled !== 'undefined') {
    console.log('Автосохранение:', autoSaveEnabled ? '✅ ВКЛ' : '❌ ВЫКЛ');
} else {
    console.log('❌ Переменная autoSaveEnabled не найдена');
}

if (typeof markAsChanged !== 'undefined') {
    console.log('✅ Функция markAsChanged существует');
} else {
    console.log('❌ Функция markAsChanged не найдена');
}

if (typeof writeToGitHub !== 'undefined') {
    console.log('✅ Функция writeToGitHub существует');
} else {
    console.log('❌ Функция writeToGitHub не найдена');
}

// 4. Тест записи в GitHub
console.log('\n=== 4. ТЕСТ ЗАПИСИ В GITHUB ===');
async function testWrite() {
    if (!config.token) {
        console.log('❌ GitHub не настроен');
        return;
    }
    
    try {
        console.log('📤 Тестируем запись в GitHub...');
        
        // Формируем данные в правильном формате
        const testData = {
            kursanty: students || [],
            lastUpdated: new Date().toISOString(),
            version: "1.0"
        };
        
        console.log('📦 Формат данных:', testData);
        console.log('   - kursanty:', testData.kursanty.length, 'курсантов');
        console.log('   - lastUpdated:', testData.lastUpdated);
        console.log('   - version:', testData.version);
        
        const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}`;
        
        // Получаем SHA
        let sha = null;
        const getResponse = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (getResponse.ok) {
            const existingData = await getResponse.json();
            sha = existingData.sha;
            console.log('📝 Файл существует, SHA:', sha.substring(0, 20) + '...');
        } else if (getResponse.status === 404) {
            console.log('⚠️ Файл не существует, будет создан новый');
        } else {
            throw new Error(`Ошибка получения SHA: ${getResponse.status}`);
        }
        
        // Кодируем данные
        const jsonString = JSON.stringify(testData, null, 2);
        const content = btoa(unescape(encodeURIComponent(jsonString)));
        
        const body = {
            message: 'Тест автосохранения',
            content: content,
            branch: config.branch
        };
        
        if (sha) {
            body.sha = sha;
        }
        
        // Отправляем
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
            console.log('   Commit:', result.commit.sha.substring(0, 20) + '...');
            console.log('   URL:', result.content.html_url);
        } else {
            const error = await response.json();
            console.log('❌ Ошибка записи:', response.status);
            console.log('   Сообщение:', error.message);
        }
    } catch (error) {
        console.log('❌ Ошибка:', error.message);
    }
}

testWrite();

console.log('\n=== ДИАГНОСТИКА ЗАВЕРШЕНА ===');
