import { useState } from 'react';
import { Student, CategoryConfig, GradeMapping, defaultGradeMapping } from '../data/students';

interface ScoreModalProps {
  student: Student;
  categories: CategoryConfig[];
  gradeMapping: GradeMapping;
  onSave: (student: Student) => void;
  onClose: () => void;
}

export default function ScoreModal({ student, categories, gradeMapping, onSave, onClose }: ScoreModalProps) {
  const [formData, setFormData] = useState<Student>({ ...student });
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.key || 'notes');

  const handleAddScore = (categoryKey: string, amount: number) => {
    const cat = categories.find(c => c.key === categoryKey);
    if (!cat) return;

    const current = formData[categoryKey as keyof Student] as number;
    const newVal = Math.min(current + amount, cat.maxTotal);
    setFormData({ ...formData, [categoryKey]: newVal });
  };

  const handleSetScore = (categoryKey: string, value: number) => {
    const cat = categories.find(c => c.key === categoryKey);
    if (!cat) return;
    const clamped = Math.max(0, Math.min(value, cat.maxTotal));
    setFormData({ ...formData, [categoryKey]: clamped });
  };

  const handleAddGrade = (grade: number) => {
    let points = 0;
    if (grade === 5) points = gradeMapping.grade5;
    else if (grade === 4) points = gradeMapping.grade4;
    else if (grade === 3) points = gradeMapping.grade3;

    const cat = categories.find(c => c.key === 'grades');
    if (!cat) return;
    const newVal = Math.min(formData.grades + points, cat.maxTotal);
    setFormData({ ...formData, grades: newVal });
  };

  const total = formData.notes + formData.practice + formData.reports + formData.grades + formData.bonus;

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
              <div className="text-xs opacity-80">из 100 баллов</div>
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
                {formData[cat.key]}/{cat.maxTotal}
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

                {cat.key === 'grades' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Текущие баллы: <strong>{formData.grades}</strong> / {cat.maxTotal}
                    </p>
                    <p className="text-sm text-gray-600">
                      Соответствие оценок: 5→{gradeMapping.grade5}б, 4→{gradeMapping.grade4}б, 3→{gradeMapping.grade3}б
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddGrade(5)}
                        className="flex-1 py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-colors"
                      >
                        + Оценка «5» (+{gradeMapping.grade5}б)
                      </button>
                      <button
                        onClick={() => handleAddGrade(4)}
                        className="flex-1 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                      >
                        + Оценка «4» (+{gradeMapping.grade4}б)
                      </button>
                      <button
                        onClick={() => handleAddGrade(3)}
                        className="flex-1 py-3 bg-yellow-100 text-yellow-700 rounded-xl font-bold hover:bg-yellow-200 transition-colors"
                      >
                        + Оценка «3» (+{gradeMapping.grade3}б)
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSetScore('grades', Math.max(0, formData.grades - (gradeMapping.grade5 || 5)))}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
                      >
                        ↩ Отменить последнюю
                      </button>
                      <button
                        onClick={() => handleSetScore('grades', 0)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
                      >
                        ✕ Сбросить
                      </button>
                    </div>
                  </div>
                ) : cat.key === 'bonus' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Текущие баллы: <strong>{formData.bonus}</strong> / {cat.maxTotal}
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max={cat.maxTotal}
                        value={formData.bonus}
                        onChange={(e) => handleSetScore('bonus', parseInt(e.target.value) || 0)}
                        className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-gray-500">/ {cat.maxTotal} баллов</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 5, 10].map(val => (
                        <button
                          key={val}
                          onClick={() => handleSetScore('bonus', val)}
                          className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                        >
                          Установить {val}б
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Текущие баллы: <strong>{formData[cat.key]}</strong> / {cat.maxTotal}
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
                        onClick={() => handleSetScore(cat.key, Math.max(0, formData[cat.key] - cat.maxPerItem))}
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
                        max={cat.maxTotal}
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
            Сумма по категориям: {formData.notes} + {formData.practice} + {formData.reports} + {formData.grades} + {formData.bonus} = <strong className="text-indigo-600">{total}</strong>
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
