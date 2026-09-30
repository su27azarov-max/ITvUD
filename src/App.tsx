import { useState } from 'react';
import {
  Student,
  CategoryConfig,
  defaultCategories,
  calculateTotal,
  calculateMaxTotal,
  getGroups,
  createEmptyStudent,
} from './data/students';
import RatingTable from './components/RatingTable';
import GroupRating from './components/GroupRating';
import ImportStudents from './components/ImportStudents';
import ScoreModal from './components/ScoreModal';
import StudentInstructions from './components/StudentInstructions';
import LoginModal from './components/LoginModal';

type TabType = 'general' | 'groups' | 'instructions';

const TEACHER_PASSWORD = 'teacher123';

// Демо-данные
const demoStudents: Student[] = [
  { id: 1, fullName: 'Иванов Иван Сергеевич', group: 'ИТ-201', notes: 24, practice: 20, reports: 10, bonus: 5, practiceGrades: { '3': 0, '4': 1, '5': 1 }, reportsGrades: { '3': 0, '4': 1, '5': 0 } },
  { id: 2, fullName: 'Петрова Анна Михайловна', group: 'ИТ-201', notes: 28, practice: 25, reports: 20, bonus: 8, practiceGrades: { '3': 0, '4': 0, '5': 2 }, reportsGrades: { '3': 0, '4': 0, '5': 2 } },
  { id: 3, fullName: 'Сидоров Алексей Дмитриевич', group: 'ИТ-201', notes: 16, practice: 10, reports: 0, bonus: 2, practiceGrades: { '3': 2, '4': 0, '5': 0 }, reportsGrades: { '3': 0, '4': 0, '5': 0 } },
  { id: 4, fullName: 'Козлова Мария Андреевна', group: 'ИТ-201', notes: 22, practice: 20, reports: 10, bonus: 4, practiceGrades: { '3': 0, '4': 2, '5': 0 }, reportsGrades: { '3': 0, '4': 1, '5': 0 } },
  { id: 5, fullName: 'Новиков Дмитрий Павлович', group: 'ИТ-201', notes: 10, practice: 5, reports: 0, bonus: 0, practiceGrades: { '3': 1, '4': 0, '5': 0 }, reportsGrades: { '3': 0, '4': 0, '5': 0 } },
  { id: 6, fullName: 'Морозова Елена Викторовна', group: 'ИТ-202', notes: 26, practice: 25, reports: 15, bonus: 6, practiceGrades: { '3': 0, '4': 1, '5': 1 }, reportsGrades: { '3': 0, '4': 0, '5': 1 } },
  { id: 7, fullName: 'Волков Артём Николаевич', group: 'ИТ-202', notes: 20, practice: 15, reports: 10, bonus: 3, practiceGrades: { '3': 1, '4': 1, '5': 0 }, reportsGrades: { '3': 0, '4': 1, '5': 0 } },
  { id: 8, fullName: 'Соколова Дарья Олеговна', group: 'ИТ-202', notes: 24, practice: 22, reports: 10, bonus: 5, practiceGrades: { '3': 0, '4': 1, '5': 1 }, reportsGrades: { '3': 0, '4': 1, '5': 0 } },
  { id: 9, fullName: 'Лебедев Максим Игоревич', group: 'ИТ-202', notes: 14, practice: 10, reports: 0, bonus: 1, practiceGrades: { '3': 2, '4': 0, '5': 0 }, reportsGrades: { '3': 0, '4': 0, '5': 0 } },
  { id: 10, fullName: 'Кузнецова Ольга Романовна', group: 'ИТ-202', notes: 22, practice: 20, reports: 10, bonus: 4, practiceGrades: { '3': 0, '4': 2, '5': 0 }, reportsGrades: { '3': 0, '4': 1, '5': 0 } },
  { id: 11, fullName: 'Попов Никита Александрович', group: 'ИТ-203', notes: 30, practice: 30, reports: 20, bonus: 10, practiceGrades: { '3': 0, '4': 0, '5': 3 }, reportsGrades: { '3': 0, '4': 0, '5': 2 } },
  { id: 12, fullName: 'Васильева Татьяна Петровна', group: 'ИТ-203', notes: 18, practice: 15, reports: 10, bonus: 2, practiceGrades: { '3': 1, '4': 1, '5': 0 }, reportsGrades: { '3': 0, '4': 1, '5': 0 } },
  { id: 13, fullName: 'Зайцев Роман Владимирович', group: 'ИТ-203', notes: 12, practice: 10, reports: 0, bonus: 0, practiceGrades: { '3': 2, '4': 0, '5': 0 }, reportsGrades: { '3': 0, '4': 0, '5': 0 } },
  { id: 14, fullName: 'Павлова Наталья Сергеевна', group: 'ИТ-203', notes: 26, practice: 24, reports: 15, bonus: 7, practiceGrades: { '3': 0, '4': 0, '5': 2 }, reportsGrades: { '3': 0, '4': 0, '5': 1 } },
  { id: 15, fullName: 'Семёнов Кирилл Олегович', group: 'ИТ-203', notes: 16, practice: 12, reports: 0, bonus: 1, practiceGrades: { '3': 1, '4': 1, '5': 0 }, reportsGrades: { '3': 0, '4': 0, '5': 0 } },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : demoStudents;
  });
  const [categories, setCategories] = useState<CategoryConfig[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showWeights, setShowWeights] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isTeacher = isAuthenticated;
  const maxTotal = calculateMaxTotal(categories);

  const handleSaveChanges = () => {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('categories', JSON.stringify(categories));
    setHasChanges(false);
    alert('Изменения успешно сохранены!');
  };

  const handleLogin = (password: string): boolean => {
    if (password === TEACHER_PASSWORD) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'general', label: 'Общий рейтинг', icon: '📊' },
    { id: 'groups', label: 'Рейтинг по группам', icon: '👥' },
    { id: 'instructions', label: isTeacher ? 'Инструкция' : 'Для обучающихся', icon: '📋' },
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
  };

  const handleImport = (imported: Student[]) => {
    const maxId = students.reduce((max, s) => Math.max(max, s.id), 0);
    const withNewIds = imported.map((s, i) => ({ ...s, id: maxId + i + 1 }));
    setStudents([...students, ...withNewIds]);
    setHasChanges(true);
    setShowImport(false);
  };

  const handleSaveStudent = (updated: Student) => {
    setStudents(students.map(s => (s.id === updated.id ? updated : s)));
    setHasChanges(true);
    setEditingStudent(null);
  };

  const handleClearAll = () => {
    if (confirm('Вы уверены, что хотите удалить всех студентов?')) {
      setStudents([]);
      setHasChanges(true);
    }
  };

  const handleUpdateWeight = (key: string, newMax: number) => {
    setCategories(categories.map(c => (c.key === key ? { ...c, maxTotal: Math.max(0, newMax) } : c)));
    setHasChanges(true);
  };

  const totalStudents = students.length;
  const groups = getGroups(students);
  const avgRating =
    students.length > 0
      ? (students.reduce((sum, s) => sum + calculateTotal(s), 0) / students.length).toFixed(1)
      : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white text-lg">🎓</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Рейтинг обучающихся</h1>
                <p className="text-xs text-gray-500">Накопительная система оценивания</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Login/Logout Button */}
              {isTeacher ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all flex items-center gap-1.5"
                >
                  <span>🚪</span>
                  <span>Выйти</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-1.5"
                >
                  <span>🔐</span>
                  <span>Вход для преподавателя</span>
                </button>
              )}
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-indigo-600">{totalStudents}</div>
                  <div className="text-xs text-gray-500">Студентов</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <div className="font-bold text-indigo-600">{groups.length}</div>
                  <div className="text-xs text-gray-500">Групп</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <div className="font-bold text-indigo-600">{avgRating}</div>
                  <div className="text-xs text-gray-500">Ср. балл</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[150px] px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* General Rating Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Общий рейтинг</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Рейтинг всех обучающихся по дисциплине (макс. {maxTotal} баллов)
                </p>
              </div>
              {isTeacher && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowWeights(!showWeights)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    ⚖️ Веса категорий
                  </button>
                  <button
                    onClick={() => setShowImport(!showImport)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    📥 Импорт
                  </button>
                  <button
                    onClick={() => {
                      const maxId = students.reduce((max, s) => Math.max(max, s.id), 0);
                      setEditingStudent(createEmptyStudent(maxId + 1, '', ''));
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-200 hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Добавить
                  </button>
                  {students.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      🗑️ Очистить
                    </button>
                  )}
                  {hasChanges && (
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-2 bg-green-500 text-white border border-green-600 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md"
                    >
                      💾 Сохранить изменения
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Weights Settings (teacher only) */}
            {showWeights && isTeacher && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>⚖️</span> Настройка весов категорий
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Установите максимальное количество баллов для каждой категории. Итого: <strong className="text-indigo-600">{maxTotal}</strong> баллов.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map(cat => (
                    <div key={cat.key} className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {cat.name}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={cat.maxTotal}
                          onChange={(e) => handleUpdateWeight(cat.key, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold"
                        />
                        <span className="text-sm text-gray-500 whitespace-nowrap">баллов</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{cat.shortDesc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-700">
                  💡 Шкала оценок рассчитывается в процентах от суммы весов:
                  Отлично ≥90%, Хорошо 75-89%, Удовл. 60-74%, Неудовл. &lt;60%
                </div>
              </div>
            )}

            {/* Import */}
            {showImport && isTeacher && <ImportStudents onImport={handleImport} existingCount={students.length} />}

            {/* Rating Table */}
            {students.length > 0 ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <RatingTable
                  students={students}
                  categories={categories}
                  onEditStudent={isTeacher ? setEditingStudent : undefined}
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Список студентов пуст</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {isTeacher ? 'Импортируйте студентов или добавьте их вручную' : 'Преподаватель ещё не загрузил данные'}
                </p>
                {isTeacher && (
                  <button
                    onClick={() => setShowImport(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md"
                  >
                    📥 Импортировать студентов
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Group Rating Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Рейтинг по группам</h2>
              <p className="text-sm text-gray-500 mt-1">
                Просмотр рейтинга с фильтрацией по учебным группам (макс. {maxTotal} баллов)
              </p>
            </div>
            {students.length > 0 ? (
              <GroupRating
                students={students}
                categories={categories}
                onEditStudent={isTeacher ? setEditingStudent : undefined}
              />
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Нет данных</h3>
                <p className="text-sm text-gray-500">
                  {isTeacher ? 'Сначала импортируйте студентов' : 'Преподаватель ещё не загрузил данные'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions Tab */}
        {activeTab === 'instructions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isTeacher ? 'Инструкция' : 'Инструкция для обучающихся'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isTeacher
                  ? 'Руководство по работе с системой рейтинга'
                  : 'Какие баллы и за что можно получить в рамках дисциплины'}
              </p>
            </div>
            {isTeacher ? (
              <TeacherInstructions />
            ) : (
              <StudentInstructions categories={categories} />
            )}
          </div>
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {/* Score Modal (teacher only) */}
      {editingStudent && isTeacher && (
        <ScoreModal
          student={editingStudent}
          categories={categories}
          onSave={handleSaveStudent}
          onClose={() => setEditingStudent(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Система рейтинга обучающихся
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Дисциплина: Программирование</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>Семестр: Весна 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Компонент инструкции для преподавателя
function TeacherInstructions() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <p className="text-amber-800 text-sm">
          <strong>📌 Режим преподавателя:</strong> Вы можете импортировать студентов, начислять баллы и настраивать веса категорий.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">📥 Импорт студентов</h3>
        <p className="text-sm text-gray-600 mb-3">
          Используйте кнопку «Импорт» для загрузки списка студентов. Поддерживаются два формата:
        </p>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium text-sm text-gray-700 mb-1">Формат 1 — по группам:</p>
            <pre className="text-xs text-gray-600 overflow-x-auto">{`# Группа ИТ-201
Иванов Иван Сергеевич
Петрова Анна Михайловна

# Группа ИТ-202
Сидоров Алексей Дмитриевич`}</pre>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium text-sm text-gray-700 mb-1">Формат 2 — CSV:</p>
            <pre className="text-xs text-gray-600 overflow-x-auto">{`Иванов Иван Сергеевич;ИТ-201
Петрова Анна Михайловна;ИТ-201`}</pre>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">✏️ Начисление баллов</h3>
        <p className="text-sm text-gray-600 mb-3">
          Нажмите кнопку «Баллы» рядом с именем студента для открытия окна начисления.
          Баллы можно добавлять кнопками или вводить вручную.
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Конспекты</strong> — 2 балла за занятие (макс. 30)</li>
          <li>
            <strong>Практические работы</strong> — система оценок:
            <div className="mt-1 ml-4 text-xs text-gray-500">
              Оценка «3» → 3 балла | Оценка «4» → 7 баллов | Оценка «5» → 10 баллов (макс. 30)
            </div>
          </li>
          <li>
            <strong>Доклады</strong> — система оценок:
            <div className="mt-1 ml-4 text-xs text-gray-500">
              Оценка «3» → 3 балла | Оценка «4» → 6 баллов | Оценка «5» → 8 баллов (макс. 20)
            </div>
          </li>
          <li>• <strong>Дополнительные баллы</strong> — на усмотрение преподавателя (макс. 10)</li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">💾 Сохранение изменений</h3>
        <p className="text-sm text-gray-600 mb-3">
          После внесения изменений (импорт студентов, начисление баллов, настройка весов) 
          появится кнопка <strong>«💾 Сохранить изменения»</strong>. 
          Нажмите её для сохранения всех данных в браузере.
        </p>
        <p className="text-sm text-gray-600">
          Данные сохраняются локально в браузере и будут доступны при следующем входе.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">⚖️ Веса категорий</h3>
        <p className="text-sm text-gray-600 mb-3">
          Нажмите «Веса категорий» для настройки максимального количества баллов по каждой категории.
          Это позволяет гибко определять значимость каждого вида работы.
        </p>
        <p className="text-sm text-gray-600">
          Итоговая оценка рассчитывается в процентах от суммы весов:
          Отлично ≥90%, Хорошо 75-89%, Удовлетворительно 60-74%, Неудовлетворительно &lt;60%.
        </p>
      </div>
    </div>
  );
}

export default App;
