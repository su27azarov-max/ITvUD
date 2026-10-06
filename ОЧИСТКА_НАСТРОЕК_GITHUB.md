# 🔧 Очистка настроек GitHub и повторная настройка

## 🎯 Проблема

В localStorage сохранён старый путь `kursanty.json`, но файл находится в `docs/kursanty.json`.

## ✅ Решение

### Шаг 1: Очистите настройки GitHub

1. Откройте сайт: https://su27azarov-max.github.io/ITvUD/
2. Нажмите **F12** (консоль разработчика)
3. Перейдите на вкладку **Console**
4. Вставьте эту команду:

```javascript
localStorage.removeItem('github_config');
location.reload();
```

5. Нажмите **Enter**

### Шаг 2: Настройте GitHub заново

1. Войдите как преподаватель (пароль: `05072020`)
2. Нажмите **"⚙️ GitHub"**
3. Заполните поля:
   - **Владелец**: `su27azarov-max`
   - **Репозиторий**: `ITvUD`
   - **Token**: ваш токен (начинается с `ghp_...`)
   - **Путь к файлу данных**: `docs/kursanty.json` ⚠️ **ВАЖНО!**
   - **Ветка**: `main`
4. Нажмите **"Сохранить"**
5. Нажмите **"🔍 Тест"**

### Шаг 3: Проверьте работу

1. Выставьте оценку курсанту
2. Через 2 секунды должно появиться: **"✅ Данные автоматически сохранены в GitHub!"**
3. В логах консоли (F12) должно быть:
   ```
   📡 Попытка 1/3 записи в GitHub...
   📝 Файл существует, SHA: ...
   📤 Отправка данных в GitHub...
   📥 Ответ GitHub: 200 OK
   ✅ Данные сохранены в GitHub
   ```

---

## 🔍 Проверка пути к файлу

### Вариант 1: Файл в корне репозитория

Если файл `kursanty.json` находится в **корне репозитория**:
- URL для чтения: `https://su27azarov-max.github.io/ITvUD/kursanty.json`
- Путь для GitHub API: `kursanty.json`

### Вариант 2: Файл в папке docs/

Если файл `kursanty.json` находится в **папке docs/**:
- URL для чтения: `https://su27azarov-max.github.io/ITvUD/kursanty.json` (GitHub Pages обслуживает из docs/)
- Путь для GitHub API: `docs/kursanty.json`

---

## 📋 Как проверить, где находится файл?

### Шаг 1: Откройте репозиторий на GitHub

Перейдите по адресу: https://github.com/su27azarov-max/ITvUD

### Шаг 2: Проверьте структуру

**Если файл в корне:**
```
ITvUD/
├── kursanty.json          ← здесь
├── index.html
└── ...
```

**Если файл в папке docs/:**
```
ITvUD/
├── docs/
│   └── kursanty.json      ← здесь
├── index.html
└── ...
```

### Шаг 3: Укажите правильный путь в настройках

- Если файл в корне → путь: `kursanty.json`
- Если файл в docs/ → путь: `docs/kursanty.json`

---

## 💡 Быстрая проверка

Вставьте в консоль браузера (F12):

```javascript
// Проверка текущего пути
const config = JSON.parse(localStorage.getItem('github_config'));
console.log('Текущий путь:', config.filePath);

// Изменить путь на docs/kursanty.json
config.filePath = 'docs/kursanty.json';
localStorage.setItem('github_config', JSON.stringify(config));
console.log('✅ Путь изменён на:', config.filePath);
console.log('🔄 Перезагрузите страницу...');

// Перезагрузка через 2 секунды
setTimeout(() => location.reload(), 2000);
```

---

## 🎯 Итог

После очистки настроек и повторной настройки с правильным путём `docs/kursanty.json`:
- ✅ Автосохранение будет работать корректно
- ✅ Данные будут записываться в правильный файл
- ✅ Ошибка 409 больше не возникнет

---

**Дата:** 2026-01-15  
**Статус:** ✅ **РЕШЕНИЕ ГОТОВО**
