import { useState } from 'react';
import { initialStudents, Student, calculateTotal, getGroups } from './data/students';
import RatingTable from './components/RatingTable';
import GroupRating from './components/GroupRating';
import Instructions from './components/Instructions';

type TabType = 'general' | 'groups' | 'instructions';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    group: '',
  });

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'general', label: 'Общий рейтинг', icon: '📊' },
    { id: 'groups', label: 'Рейтинг по группам', icon: '👥' },
    { id: 'instructions', label: 'Инструкция', icon: '📋' },
  ];

  const handleAddStudent = () => {
    if (!newStudent.fullName.trim() || !newStudent.group.trim()) return;
    
    const student: Student = {
      id: students.length + 1,
      fullName: newStudent.fullName,
      group: newStudent.group,
      attendance: 0,
      homework: 0,
      test1: 0,
      test2: 0,
      project: 0,
    };
    setStudents([...students, student]);
    setNewStudent({ fullName: '', group: '' });
    setShowAddForm(false);
  };

  const totalStudents = students.length;
  const groups = getGroups(students);
  const avgRating = students.length > 0
    ? (students.reduce((sum, s) => sum + calculateTotal(s), 0) / students.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white text-lg">🎓</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Рейтинг обучающихся</h1>
                <p className="text-xs text-gray-500">Система мониторинга успеваемости</p>
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
          {tabs.map(tab => (
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
                <p className="text-sm text-gray-500 mt-1">Рейтинг всех обучающихся по дисциплине</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-200 hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить студента
              </button>
            </div>

            {/* Add Student Form */}
            {showAddForm && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-in">
                <h3 className="font-semibold text-gray-800 mb-4">Добавить нового студента</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ФИО студента</label>
                    <input
                      type="text"
                      value={newStudent.fullName}
                      onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                      placeholder="Иванов Иван Иванович"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Номер группы</label>
                    <input
                      type="text"
                      value={newStudent.group}
                      onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
                      placeholder="ИТ-201"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddStudent}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Добавить
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Rating Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <RatingTable students={students} />
            </div>
          </div>
        )}

        {/* Group Rating Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Рейтинг по группам</h2>
              <p className="text-sm text-gray-500 mt-1">Просмотр рейтинга с фильтрацией по учебным группам</p>
            </div>
            <GroupRating students={students} />
          </div>
        )}

        {/* Instructions Tab */}
        {activeTab === 'instructions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Инструкция для преподавателя</h2>
              <p className="text-sm text-gray-500 mt-1">Руководство по заполнению и использованию системы рейтинга</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Instructions />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Система рейтинга обучающихся. Все права защищены.
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
