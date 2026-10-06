# 🔧 Пошаговое исправление синхронизации GitHub

## ⚡ БЫСТРАЯ ПРОВЕРКА (2 минуты)

### Шаг 1: Откройте консоль браузера
1. Откройте сайт
2. Нажмите **F12** (или Ctrl+Shift+I)
3. Перейдите на вкладку **Console**

### Шаг 2: Проверьте настройки GitHub
Введите в консоли:
```javascript
const config = JSON.parse(localStorage.getItem('github_config'));
console.log('Настройки GitHub:', config);
```

**Что должно быть:**
- ✅ `owner` - ваш username на GitHub
- ✅ `repo` - название репозитория
- ✅ `token` - начинается с `ghp_` или `github_pat_`
- ✅ `filePath` - `data.json`
- ✅ `branch` - `main`

**Если чего-то нет:**
1. Войдите как преподаватель (пароль: `05072020`)
2. Нажмите **"⚙️ GitHub"**
3. Заполните все поля
4. Нажмите **"Сохранить"**

### Шаг 3: Проверьте соединение
Введите в консоли:
```javascript
// Проверка соединения с GitHub
async function checkConnection() {
    const config = JSON.parse(localStorage.getItem('github_config'));
    if (!config || !config.token) {
        console.log('❌ GitHub не настроен');
        return;
    }
    
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.repo}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Соединение работает!');
            console.log('Репозиторий:', data.full_name);
        } else {
            console.log('❌ Ошибка:', response.status, response.statusText);
            if (response.status === 401) {
                console.log('💡 Неверный токен. Создайте новый на https://github.com/settings/tokens');
            }
        }
    } catch (error) {
        console.log('❌ Ошибка соединения:', error.message);
    }
}

checkConnection();
```

### Шаг 4: Проверьте файл data.json
Введите в консоли:
```javascript
// Проверка файла data.json
async function checkFile() {
    const config = JSON.parse(localStorage.getItem('github_config'));
    if (!config || !config.token) {
        console.log('❌ GitHub не настроен');
        return;
    }
    
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath || 'data.json'}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Файл найден!');
            console.log('Размер:', data.size, 'байт');
            console.log('SHA:', data.sha);
        } else if (response.status === 404) {
            console.log('⚠️ Файл data.json не найден');
            console.log('💡 Создайте файл вручную или нажмите "💾 Сохранить"');
        } else {
            console.log('❌ Ошибка:', response.status);
        }
    } catch (error) {
        console.log('❌ Ошибка:', error.message);
    }
}

checkFile();
```

---

## 🐛 ЧАСТЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ

### Проблема 1: "GitHub не настроен"

**Решение:**
1. Войдите как преподаватель
2. Нажмите **"⚙️ GitHub"**
3. Заполните все поля:
   - **Владелец**: ваш username на GitHub (например: `ivanov`)
   - **Репозиторий**: название репозитория (например: `rating-system`)
   - **Token**: ваш токен (начинается с `ghp_...`)
   - **Путь**: `data.json`
   - **Ветка**: `main`
4. Нажмите **"Сохранить"**

### Проблема 2: "Неверный токен"

**Решение:**
1. Перейдите на https://github.com/settings/tokens
2. Удалите старый токен
3. Создайте новый:
   - Нажмите **"Generate new token (classic)"**
   - Note: `Rating System`
   - Expiration: `90 days`
   - ✅ Отметьте **`repo`**
   - Нажмите **"Generate token"**
4. Скопируйте токен (начинается с `ghp_...`)
5. Вставьте в настройки GitHub

### Проблема 3: "Репозиторий не найден"

**Решение:**
1. Проверьте имя владельца (username)
   - Должно быть точно как на GitHub
   - Пример: если URL `github.com/ivanov/rating-system`, то владелец = `ivanov`

2. Проверьте имя репозитория
   - Должно быть точно как на GitHub
   - Пример: если URL `github.com/ivanov/rating-system`, то репозиторий = `rating-system`

3. Убедитесь, что репозиторий **публичный**
   - Откройте репозиторий
   - Settings → прокрутите вниз
   - Должно быть "Public"

### Проблема 4: "Файл data.json не найден"

**Решение:**

**Вариант 1: Создать вручную**
1. Откройте репозиторий на GitHub
2. Нажмите **"Add file"** → **"Create new file"**
3. Имя файла: `data.json`
4. Содержимое:
```json
{
  "students": [],
  "categories": [],
  "lastUpdated": ""
}
```
5. Нажмите **"Commit new file"**

**Вариант 2: Автоматическое создание**
1. Внесите любые изменения в приложении
2. Нажмите **"💾 Сохранить"**
3. Файл создастся автоматически

### Проблема 5: CORS ошибка

**Решение:**
1. Убедитесь, что используете HTTPS (GitHub Pages автоматически использует HTTPS)
2. Очистите кэш браузера: **Ctrl+Shift+Delete**
3. Попробуйте другой браузер
4. Если проблема сохраняется - используйте ручной экспорт/импорт

---

## 🧪 ПОЛНАЯ ПРОВЕРКА

### Введите в консоли:
```javascript
// Полная проверка синхронизации
async function fullCheck() {
    console.log('=== ПРОВЕРКА СИНХРОНИЗАЦИИ ===\n');
    
    // 1. Проверка конфигурации
    const config = JSON.parse(localStorage.getItem('github_config'));
    if (!config || !config.token) {
        console.log('❌ GitHub не настроен');
        console.log('💡 Настройте GitHub через кнопку "⚙️ GitHub"');
        return;
    }
    console.log('✅ GitHub настроен');
    console.log('   Владелец:', config.owner);
    console.log('   Репозиторий:', config.repo);
    console.log('   Токен:', config.token.substring(0, 10) + '...');
    
    // 2. Проверка соединения
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.repo}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            console.log('❌ Ошибка соединения:', response.status);
            return;
        }
        console.log('✅ Соединение работает');
    } catch (error) {
        console.log('❌ Ошибка:', error.message);
        return;
    }
    
    // 3. Проверка файла
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath || 'data.json'}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Файл data.json найден');
        } else if (response.status === 404) {
            console.log('⚠️ Файл data.json не найден');
            console.log('💡 Создайте файл или нажмите "💾 Сохранить"');
        }
    } catch (error) {
        console.log('❌ Ошибка проверки файла:', error.message);
    }
    
    // 4. Проверка данных
    console.log('\n=== ДАННЫЕ ===');
    console.log('Курсантов:', students.length);
    console.log('Категорий:', categories.length);
    
    // 5. Тест сохранения
    console.log('\n=== ТЕСТ СОХРАНЕНИЯ ===');
    try {
        await saveAllChanges();
        console.log('✅ Сохранение работает');
    } catch (error) {
        console.log('❌ Ошибка сохранения:', error.message);
    }
    
    console.log('\n=== ПРОВЕРКА ЗАВЕРШЕНА ===');
}

fullCheck();
```

---

## 🔄 РУЧНАЯ СИНХРОНИЗАЦИЯ

Если автоматическая синхронизация не работает, используйте ручной экспорт/импорт:

### На первом устройстве:
1. Внесите изменения
2. Нажмите **"💾 Экспорт"**
3. Сохраните JSON файл

### На втором устройстве:
1. Нажмите **"📂 Загрузить"**
2. Выберите JSON файл
3. Данные загрузятся

---

## 📞 ЕСЛИ НИЧЕГО НЕ ПОМОГЛО

### Соберите информацию:

1. **Скриншот настроек GitHub** (скройте токен!)
2. **Результат проверки из консоли** (скопируйте все сообщения)
3. **URL репозитория** на GitHub
4. **Текст ошибки** (если есть)

### Попробуйте:

1. **Очистить все данные:**
```javascript
localStorage.clear();
location.reload();
```

2. **Создать новый репозиторий:**
   - https://github.com/new
   - Public
   - Add README
   - Создать файл `data.json`

3. **Создать новый токен:**
   - https://github.com/settings/tokens
   - Generate new token (classic)
   - ✅ repo
   - Скопировать и вставить

---

## ✅ ПРИЗНАКИ УСПЕШНОЙ СИНХРОНИЗАЦИИ

### В консоли:
```
✅ GitHub настроен
✅ Соединение работает
✅ Файл data.json найден
✅ Сохранение работает
```

### На GitHub:
- Файл `data.json` обновлён
- Последний коммит: "Обновление данных рейтинга курсантов"

### На другом устройстве:
- После "🔄 Синхронизация" данные обновляются

---

**Удачи!** 🚀
