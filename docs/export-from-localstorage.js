// === СКОПИРУЙТЕ И ВСТАВЬТЕ ЭТОТ КОД В КОНСОЛЬ БРАУЗЕРА (F12) ===
// Этот скрипт экспортирует данные курсантов из localStorage в файл kursanty.json

console.log('🚀 Начинаем экспорт данных из localStorage...\n');

// Получаем данные из localStorage
const studentsData = localStorage.getItem('rating_students');
const categoriesData = localStorage.getItem('rating_categories');

if (!studentsData) {
    console.log('❌ Ошибка: Данные курсантов не найдены в localStorage');
    console.log('💡 Возможно, вы не вводили курсантов в этом браузере');
    console.log('💡 Введите курсантов через интерфейс сайта, затем запустите этот скрипт снова');
} else {
    try {
        const students = JSON.parse(studentsData);
        const categories = categoriesData ? JSON.parse(categoriesData) : [];
        
        console.log('✅ Найдено курсантов:', students.length);
        console.log('✅ Найдено категорий:', categories.length);
        
        // Создаём объект для экспорта
        const exportData = {
            kursanty: students,
            lastUpdated: new Date().toISOString(),
            version: "1.0"
        };
        
        // Создаём JSON строку
        const jsonString = JSON.stringify(exportData, null, 2);
        
        console.log('\n📄 Предпросмотр файла:');
        console.log('─'.repeat(50));
        console.log(jsonString.substring(0, 500) + '...');
        console.log('─'.repeat(50));
        
        // Создаём Blob и скачиваем файл
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kursanty.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('\n✅ Файл kursanty.json успешно скачан!');
        console.log('\n📋 Следующие шаги:');
        console.log('1. Откройте репозиторий на GitHub');
        console.log('2. Нажмите "Add file" → "Upload files"');
        console.log('3. Загрузите скачанный файл kursanty.json');
        console.log('4. Нажмите "Commit changes"');
        console.log('5. Подождите 1-2 минуты для обновления GitHub Pages');
        console.log('6. Обновите сайт (Ctrl+F5)');
        
    } catch (error) {
        console.error('❌ Ошибка при обработке данных:', error);
    }
}
