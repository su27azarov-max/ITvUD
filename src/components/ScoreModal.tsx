import { useState } from 'react';
import { Student, CategoryConfig, calculateMaxTotal, calculatePracticeScore, calculateReportsScore } from '../data/students';

interface ScoreModalProps {
  student: Student;
  categories: CategoryConfig[];
  onSave: (student: Student) => void;
  onClose: () => void;
}

export default function ScoreModal({ student, categories, onSave, onClose }: ScoreModalProps) {
  const [formData, setFormData] = useState<Student>({ ...student });
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.key || 'notes');
  const maxTotal = calculateMaxTotal(categories);

  const handleAddScore = (categoryKey: string, amount: number) => {
    const cat = categories.find(c => c.key === categoryKey);
    if (!cat) return;

    const current = formData[categoryKey as keyof Student] as number;
    const newVal = Math.max(0, Math.min(current + amount, cat.maxTotal));
    setFormData({ ...formData, [categoryKey]: newVal });
  };

  const handleSetScore = (categoryKey: string, value: number) => {
    const cat = categories.find(c => c.key === categoryKey);
    if (!cat) return;
    const clamped = Math.max(0, Math.min(value, cat.maxTotal));
    setFormData({ ...formData, [categoryKey]: clamped });
  };

  const handleAddPracticeGrade = (grade: '3' | '4' | '5') => {
    const newGrades = { ...formData.practiceGrades };
    newGrades[grade]++;
    const practiceScore = calculatePracticeScore(newGrades);
    const cat = categories.find(c => c.key === 'practice');
    if (cat && practiceScore <= cat.maxTotal) {
      setFormData({ ...formData, practiceGrades: newGrades, practice: practiceScore });
    }
  };

  const handleRemovePracticeGrade = (grade: '3' | '4' | '5') => {
    const newGrades = { ...formData.practiceGrades };
    if (newGrades[grade] > 0) {
      newGrades[grade]--;
      const practiceScore = calculatePracticeScore(newGrades);
      setFormData({ ...formData, practiceGrades: newGrades, practice: practiceScore });
    }
  };

  const handleAddReportsGrade = (grade: '3' | '4' | '5') => {
    const newGrades = { ...formData.reportsGrades };
    newGrades[grade]++;
    const reportsScore = calculateReportsScore(newGrades);
    const cat = categories.find(c => c.key === 'reports');
    if (cat && reportsScore <= cat.maxTotal) {
      setFormData({ ...formData, reportsGrades: newGrades, reports: reportsScore });
    }
  };

  const handleRemoveReportsGrade = (grade: '3' | '4' | '5') => {
    const newGrades = { ...formData.reportsGrades };
    if (newGrades[grade] > 0) {
      newGrades[grade]--;
      const reportsScore = calculateReportsScore(newGrades);
      setFormData({ ...formData, reportsGrades: newGrades, reports: reportsScore });
    }
  };

  const total = formData.notes + formData.practice + formData.reports + formData.bonus;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{student.fullName}</h3>
              <p className="text-sm opacity-80">Группа: {student.group}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{total}</div>
              <div className="text-xs opacity-80">баллов</div>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeCategory === cat.key
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.name}
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                {formData[cat.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[50vh]">
          {categories.map(cat => (
            activeCategory === cat.key && (
              <div key={cat.key}>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{cat.name}</span>
                    <span className="text-sm text-gray-500">{cat.shortDesc}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(formData[cat.key] / cat.maxTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {cat.key === 'notes' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Конспекты: <strong>{formData.notes}</strong> баллов
                    </p>
                    <p className="text-sm text-gray-500">
                      2 балла за каждый конспект лекции
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleAddScore('notes', 2)}
                        className="px-4 py-2.5 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
                      >
                        + Конспект (2б)
                      </button>
                      <button
                        onClick={() => handleAddScore('notes', -2)}
                        disabled={formData.notes < 2}
                        className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        − Конспект (2б)
                      </button>
                      <button
                        onClick={() => handleSetScore('notes', 0)}
                        className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                      >
                        Сбросить все
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Или введите вручную:</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.notes}
                        onChange={(e) => handleSetScore('notes', parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                ) : cat.key === 'practice' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Оценки за практические работы: <strong>{formData.practice}</strong> баллов
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-bold text-yellow-600">{formData.practiceGrades['3']}</div>
                          <div className="text-xs text-gray-500">оценки «3»</div>
                          <div className="text-xs text-gray-400">× 3 балла</div>
                        </div>
                        <div>
                          <div className="font-bold text-blue-600">{formData.practiceGrades['4']}</div>
                          <div className="text-xs text-gray-500">оценки «4»</div>
                          <div className="text-xs text-gray-400">× 7 баллов</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-600">{formData.practiceGrades['5']}</div>
                          <div className="text-xs text-gray-500">оценки «5»</div>
                          <div className="text-xs text-gray-400">× 10 баллов</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleAddPracticeGrade('3')}
                        className="px-4 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200 transition-colors"
                      >
                        + Оценка «3» (3б)
                      </button>
                      <button
                        onClick={() => handleAddPracticeGrade('4')}
                        className="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                      >
                        + Оценка «4» (7б)
                      </button>
                      <button
                        onClick={() => handleAddPracticeGrade('5')}
                        className="px-4 py-2.5 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
                      >
                        + Оценка «5» (10б)
                      </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleRemovePracticeGrade('3')}
                        disabled={formData.practiceGrades['3'] === 0}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        − «3»
                      </button>
                      <button
                        onClick={() => handleRemovePracticeGrade('4')}
                        disabled={formData.practiceGrades['4'] === 0}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        − «4»
                      </button>
                      <button
                        onClick={() => handleRemovePracticeGrade('5')}
                        disabled={formData.practiceGrades['5'] === 0}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        − «5»
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, practiceGrades: { '3': 0, '4': 0, '5': 0 }, practice: 0 })}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Сбросить все
                      </button>
                    </div>
                  </div>
                ) : cat.key === 'reports' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Оценки за доклады: <strong>{formData.reports}</strong> баллов
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-bold text-yellow-600">{formData.reportsGrades['3']}</div>
                          <div className="text-xs text-gray-500">оценки «3»</div>
                          <div className="text-xs text-gray-400">× 3 балла</div>
                        </div>
                        <div>
                          <div className="font-bold text-blue-600">{formData.reportsGrades['4']}</div>
                          <div className="text-xs text-gray-500">оценки «4»</div>
                          <div className="text-xs text-gray-400">× 6 баллов</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-600">{formData.reportsGrades['5']}</div>
                          <div className="text-xs text-gray-500">оценки «5»</div>
                          <div className="text-xs text-gray-400">× 8 баллов</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleAddReportsGrade('3')}
                        className="px-4 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200 transition-colors"
                      >
                        + Оценка «3» (3б)
                      </button>
                      <button
                        onClick={() => handleAddReportsGrade('4')}
                        className="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                      >
                        + Оценка «4» (6б)
                      </button>
                      <button
                        onClick={() => handleAddReportsGrade('5')}
                        className="px-4 py-2.5 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
                      >
                        + Оценка «5» (8б)
                      </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleRemoveReportsGrade('3')}
                        disabled={formData.reportsGrades['3'] === 0}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        − «3»
                      </button>
                      <button
                        onClick={() => handleRemoveReportsGrade('4')}
                        disabled={formData.reportsGrades['4'] === 0}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        − «4»
                      </button>
                      <button
                        onClick={() => handleRemoveReportsGrade('5')}
                        disabled={formData.reportsGrades['5'] === 0}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        − «5»
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, reportsGrades: { '3': 0, '4': 0, '5': 0 }, reports: 0 })}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Сбросить все
                      </button>
                    </div>
                  </div>
                ) : cat.key === 'bonus' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Текущие баллы: <strong>{formData.bonus}</strong>
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        value={formData.bonus}
                        onChange={(e) => handleSetScore('bonus', parseInt(e.target.value) || 0)}
                        className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-gray-500">баллов</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleAddScore('bonus', 1)}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        +1 балл
                      </button>
                      <button
                        onClick={() => handleAddScore('bonus', 5)}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        +5 баллов
                      </button>
                      <button
                        onClick={() => handleAddScore('bonus', 10)}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        +10 баллов
                      </button>
                      <button
                        onClick={() => handleAddScore('bonus', -1)}
                        disabled={formData.bonus < 1}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        −1 балл
                      </button>
                      <button
                        onClick={() => handleSetScore('bonus', 0)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Сбросить
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Текущие баллы: <strong>{formData[cat.key]}</strong>
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleAddScore(cat.key, cat.maxPerItem)}
                        className="px-4 py-2.5 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
                      >
                        + {cat.maxPerItem} баллов
                      </button>
                      <button
                        onClick={() => handleAddScore(cat.key, Math.ceil(cat.maxPerItem / 2))}
                        className="px-4 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200 transition-colors"
                      >
                        + {Math.ceil(cat.maxPerItem / 2)} балла
                      </button>
                      <button
                        onClick={() => handleAddScore(cat.key, -cat.maxPerItem)}
                        className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                      >
                        − {cat.maxPerItem} баллов
                      </button>
                      <button
                        onClick={() => handleSetScore(cat.key, 0)}
                        className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                      >
                        Сбросить
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Или введите вручную:</label>
                      <input
                        type="number"
                        min="0"
                        value={formData[cat.key]}
                        onChange={(e) => handleSetScore(cat.key, parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-500">
            Сумма: {formData.notes} + {formData.practice} + {formData.reports} + {formData.bonus} = <strong className="text-indigo-600">{total}</strong>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
