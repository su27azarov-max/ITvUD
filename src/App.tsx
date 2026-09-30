import { useState } from 'react';
import {
  Student,
  CategoryConfig,
  GradeMapping,
  defaultCategories,
  defaultGradeMapping,
  calculateTotal,
  getGroups,
  createEmptyStudent,
} from './data/students';
import RatingTable from './components/RatingTable';
import GroupRating from './components/GroupRating';
import ImportStudents from './components/ImportStudents';
import ScoreModal from './components/ScoreModal';
import StudentInstructions from './components/StudentInstructions';

type TabType = 'general' | 'groups' | 'instructions';

// Демо-данные для начального отображения
const demoStudents: Student[] = [
  { id: 1, fullName: 'Иванов Иван Сергеевич', group: 'ИТ-201', notes: 24, practice: 20, reports: 10, grades: 15, bonus: 5 },
  { id: 2, fullName: 'Петрова Анна Михайловна', group: 'ИТ-201', notes: 28, practice: 25, reports: 20, grades: 18, bonus: 8 },
  { id: 3, fullName: 'Сидоров Алексей Дмитриевич', group: 'ИТ-201', notes: 16, practice: 10, reports: 0, grades: 8, bonus: 2 },
  { id: 4, fullName: 'Козлова Мария Андреевна', group: 'ИТ-201', notes: 22, practice: 20, reports: 10, grades: 14, bonus: 4 },
  { id: 5, fullName: 'Новиков Дмитрий Павлович', group: 'ИТ-201', notes: 10, practice: 5, reports: 0, grades: 4, bonus: 0 },
  { id: 6, fullName: 'Морозова Елена Викторовна', group: 'ИТ-202', notes: 26, practice: 25, reports: 15, grades: 17, bonus: 6 },
  { id: 7, fullName: 'Волков Артём Николаевич', group: 'ИТ-202', notes: 20, practice: 15, reports: 10, grades: 12, bonus: 3 },
  { id: 8, fullName: 'Соколова Дарья Олеговна', group: 'ИТ-202', notes: 24, practice: 22, reports: 10, grades: 16, bonus: 5 },
  { id: 9, fullName: 'Лебедев Максим Игоревич', group: 'ИТ-202', notes: 14, practice: 10, reports: 0, grades: 6, bonus: 1 },
  { id: 10, fullName: 'Кузнецова Ольга Романовна', group: 'ИТ-202', notes: 22, practice: 20, reports: 10, grades: 15, bonus: 4 },
  { id: 11, fullName: 'Попов Никита Александрович', group: 'ИТ-203', notes: 30, practice: 30, reports: 20, grades: 20, bonus: 10 },
  { id: 12, fullName: 'Васильева Татьяна Петровна', group: 'ИТ-203', notes: 18, practice: 15, reports: 10, grades: 10, bonus: 2 },
  { id: 13, fullName: 'Зайцев Роман Владимирович', group: 'ИТ-203', notes: 12, practice: 10, reports: 0, grades: 6, bonus: 0 },
  { id: 14, fullName: 'Павлова Наталья Сергеевна', group: 'ИТ-203', notes: 26, practice: 24, reports: 15, grades: 18, bonus: 7 },
  { id: 15, fullName: 'Семёнов Кирилл Олегович', group: 'ИТ-203', notes: 16, practice: 12, reports: 0, grades: 9, bonus: 1 },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [students, setStudents] = useState<Student[]>(demoStudents);
  const [categories] = useState<CategoryConfig[]>(defaultCategories);
  const [gradeMapping, setGradeMapping] = useState<GradeMapping>(defaultGradeMapping);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showGradeSettings, setShowGradeSettings] = useState(false);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'general', label: 'Общий рейтинг', icon: '📊' },
    { id: 'groups', label: 'Рейтинг по группам', icon: '👥' },
    { id: 'instructions', label: 'Для обучающихся', icon: '📋' },
  ];

  const handleImport = (imported: Student[]) => {
    // Assign new IDs starting after the last existing student
    const maxId = students.reduce((max, s) => Math.max(max, s.id), 0);
    const withNewIds = imported.map((s, i) => ({ ...s, id: maxId + i + 1 }));
    setStudents([...students, ...withNewIds]);
    setShowImport(false);
  };

  const handleSaveStudent = (updated: Student) => {
    setStudents(students.map(s => (s.id === updated.id ? updated : s)));
    setEditingStudent(null);
  };

  const handleClearAll = () => {
    if (confirm('Вы уверены, что хотите удалить всех студентов?')) {
      setStudents([]);
    }
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
                  Рейтинг всех обучающихся по дисциплине (сортировка по убыванию баллов)
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowGradeSettings(!showGradeSettings)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  ⚙️ Настройки оценок
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
              </div>
            </div>

            {/* Grade Settings */}
            {showGradeSettings && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>⚙️</span> Настройки соответствия оценок и баллов
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Укажите, сколько баллов начисляется за каждую оценку на занятии:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Оценка «5» → баллов
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={gradeMapping.grade5}
                      onChange={(e) =>
                        setGradeMapping({ ...gradeMapping, grade5: parseInt(e.target.value) || 5 })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Оценка «4» → баллов
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={gradeMapping.grade4}
                      onChange={(e) =>
                        setGradeMapping({ ...gradeMapping, grade4: parseInt(e.target.value) || 3 })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Оценка «3» → баллов
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={gradeMapping.grade3}
                      onChange={(e) =>
                        setGradeMapping({ ...gradeMapping, grade3: parseInt(e.target.value) || 1 })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Import */}
            {showImport && <ImportStudents onImport={handleImport} existingCount={students.length} />}

            {/* Rating Table */}
            {students.length > 0 ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <RatingTable
                  students={students}
                  categories={categories}
                  onEditStudent={setEditingStudent}
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Список студентов пуст</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Импортируйте студентов или добавьте их вручную
                </p>
                <button
                  onClick={() => setShowImport(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md"
                >
                  📥 Импортировать студентов
                </button>
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
                Просмотр рейтинга с фильтрацией по учебным группам
              </p>
            </div>
            {students.length > 0 ? (
              <GroupRating
                students={students}
                categories={categories}
                onEditStudent={setEditingStudent}
              />
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Нет данных</h3>
                <p className="text-sm text-gray-500">
                  Сначала импортируйте студентов во вкладке «Общий рейтинг»
                </p>
              </div>
            )}
          </div>
        )}

        {/* Student Instructions Tab */}
        {activeTab === 'instructions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Инструкция для обучающихся</h2>
              <p className="text-sm text-gray-500 mt-1">
                Какие баллы и за что можно получить в рамках дисциплины
              </p>
            </div>
            <StudentInstructions categories={categories} gradeMapping={gradeMapping} />
          </div>
        )}
      </main>

      {/* Score Modal */}
      {editingStudent && (
        <ScoreModal
          student={editingStudent}
          categories={categories}
          gradeMapping={gradeMapping}
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

export default App;
