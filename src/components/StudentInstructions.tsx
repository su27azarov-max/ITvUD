import { CategoryConfig, GradeMapping } from '../data/students';

interface StudentInstructionsProps {
  categories: CategoryConfig[];
  gradeMapping: GradeMapping;
}

export default function StudentInstructions({ categories, gradeMapping }: StudentInstructionsProps) {
  const maxTotal = categories.reduce((sum, cat) => sum + cat.maxTotal, 0);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-indigo-800 mb-2">📊 Система рейтинга</h3>
        <p className="text-indigo-700 text-sm leading-relaxed">
          Рейтинг формируется по накопительной системе в течение семестра. 
          Максимальный рейтинг — <strong>{maxTotal} баллов</strong>. 
          Итоговая оценка выставляется автоматически на основе набранных баллов.
        </p>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white">Категории оценивания</h3>
          <p className="text-indigo-100 text-sm">За что можно получить баллы</p>
        </div>
        <div className="divide-y divide-gray-100">
          {categories.map((cat, index) => (
            <div key={cat.key} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-gray-800">{cat.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">{cat.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-indigo-600">{cat.maxTotal}</div>
                  <div className="text-xs text-gray-500">макс. баллов</div>
                </div>
              </div>
              <div className="mt-3 ml-11 bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <strong>Как начисляется:</strong> {cat.shortDesc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade mapping */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          Соответствие оценок и баллов
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600">5</div>
            <div className="text-sm text-green-700 mt-1">→ {gradeMapping.grade5} баллов</div>
            <div className="text-xs text-green-600 mt-1">за каждый ответ на занятии</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">4</div>
            <div className="text-sm text-blue-700 mt-1">→ {gradeMapping.grade4} балла</div>
            <div className="text-xs text-blue-600 mt-1">за каждый ответ на занятии</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-yellow-700 mt-1">→ {gradeMapping.grade3} балл</div>
            <div className="text-xs text-yellow-600 mt-1">за каждый ответ на занятии</div>
          </div>
        </div>
        <p className="text-sm text-gray-500 italic">
          * Преподаватель может изменить соответствие оценок и баллов
        </p>
      </div>

      {/* Final grades */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🏆</span>
          Итоговые оценки
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-xl border border-green-100">
            <span className="w-20 text-center font-bold text-green-700 text-lg">90–100</span>
            <span className="text-sm text-gray-600">баллов</span>
            <span className="ml-auto px-4 py-1.5 bg-green-100 text-green-700 rounded-full font-bold text-sm">Отлично (5)</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <span className="w-20 text-center font-bold text-blue-700 text-lg">75–89</span>
            <span className="text-sm text-gray-600">баллов</span>
            <span className="ml-auto px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">Хорошо (4)</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
            <span className="w-20 text-center font-bold text-yellow-700 text-lg">60–74</span>
            <span className="text-sm text-gray-600">баллов</span>
            <span className="ml-auto px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full font-bold text-sm">Удовлетворительно (3)</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-red-50 rounded-xl border border-red-100">
            <span className="w-20 text-center font-bold text-red-700 text-lg">&lt; 60</span>
            <span className="text-sm text-gray-600">баллов</span>
            <span className="ml-auto px-4 py-1.5 bg-red-100 text-red-700 rounded-full font-bold text-sm">Неудовлетворительно (2)</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          <span className="text-xl">💡</span>
          Как набрать максимум баллов
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>Регулярно посещайте занятия и ведите конспекты — это гарантирует до {categories.find(c => c.key === 'notes')?.maxTotal || 30} баллов</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>Своевременно выполняйте и защищайте практические работы — до {categories.find(c => c.key === 'practice')?.maxTotal || 30} баллов</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>Подготовьте и выступите с докладами по темам курса — до {categories.find(c => c.key === 'reports')?.maxTotal || 20} баллов</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>Активно отвечайте на занятиях — каждая оценка «5» приносит {gradeMapping.grade5} баллов</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>Проявляйте дополнительную активность — преподаватель может начислить до {categories.find(c => c.key === 'bonus')?.maxTotal || 10} дополнительных баллов</span>
          </li>
        </ul>
      </div>

      {/* Important notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          Важная информация
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Студенты, набравшие менее 60 баллов, допускаются к пересдаче</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Баллы начисляются накопительно в течение всего семестра</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Вы можете отслеживать свой рейтинг в любой момент на данной странице</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>При возникновении вопросов по начислению баллов обращайтесь к преподавателю</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
