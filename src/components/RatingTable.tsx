import { Student, CategoryConfig, calculateTotal, calculateMaxTotal, getGrade, getGradeColor } from '../data/students';

interface RatingTableProps {
  students: Student[];
  categories: CategoryConfig[];
  title?: string;
  onEditStudent?: (student: Student) => void;
  isTeacher?: boolean;
}

export default function RatingTable({ students, categories, title, onEditStudent, isTeacher = false }: RatingTableProps) {
  const sorted = [...students].sort((a, b) => calculateTotal(b) - calculateTotal(a));
  // Фильтруем категории с нулевым максимумом
  const activeCategories = categories.filter(cat => cat.maxTotal > 0);

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-indigo-500"></span>
          {title}
        </h3>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <th className="px-3 py-3 text-left font-medium">№</th>
              <th className="px-3 py-3 text-left font-medium">ФИО студента</th>
              {activeCategories.map(cat => (
                <th key={cat.key} className="px-3 py-3 text-center font-medium">
                  {cat.name}
                  {isTeacher && <span className="block text-xs opacity-80 font-normal">(макс. {cat.maxTotal})</span>}
                </th>
              ))}
              <th className="px-3 py-3 text-center font-medium">
                Итого
              </th>
              <th className="px-3 py-3 text-center font-medium">Оценка</th>
              {onEditStudent && (
                <th className="px-3 py-3 text-center font-medium">Действия</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((student, index) => {
              const total = calculateTotal(student);
              const maxTotal = calculateMaxTotal(categories);
              return (
                <tr
                  key={student.id}
                  className={`border-b border-gray-100 hover:bg-indigo-50/50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-3 py-3 text-center font-medium text-gray-500">{index + 1}</td>
                  <td className="px-3 py-3 font-medium text-gray-800">{student.fullName}</td>
                  {activeCategories.map(cat => (
                    <td key={cat.key} className="px-3 py-3 text-center">
                      <span className="font-medium text-gray-700">{student[cat.key]}</span>
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center">
                    <span className="font-bold text-indigo-700 text-base">{total}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getGradeColor(total, maxTotal)}`}>
                      {getGrade(total, maxTotal)} ({maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0}%)
                    </span>
                  </td>
                  {onEditStudent && (
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => onEditStudent(student)}
                        className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-200 transition-colors"
                      >
                        ✏️ Баллы
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></span> Отлично (≥90%)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span> Хорошо (75-89%)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300"></span> Удовл. (60-74%)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></span> Неудовл. (&lt;60%)</span>
      </div>
    </div>
  );
}
