import { useState } from 'react';
import { Student, getGroups } from '../data/students';
import RatingTable from './RatingTable';

interface GroupRatingProps {
  students: Student[];
}

export default function GroupRating({ students }: GroupRatingProps) {
  const groups = getGroups(students);
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0] || '');

  const filteredStudents = students.filter(s => s.group === selectedGroup);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="font-medium text-gray-700">Выберите группу:</label>
        <div className="flex flex-wrap gap-2">
          {groups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedGroup === group
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            Группа <span className="text-indigo-600">{selectedGroup}</span>
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Студентов: {filteredStudents.length}
          </span>
        </div>
        <RatingTable students={filteredStudents} />
      </div>

      {/* Summary cards for each group */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map(group => {
          const groupStudents = students.filter(s => s.group === group);
          const totals = groupStudents.map(s => s.attendance + s.homework + s.test1 + s.test2 + s.project);
          const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
          const max = Math.max(...totals);
          const min = Math.min(...totals);

          return (
            <div
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedGroup === group
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-gray-100 bg-white hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">{group}</span>
                <span className="text-xs text-gray-500">{groupStudents.length} чел.</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-indigo-600">{avg.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Средний</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{max}</div>
                  <div className="text-xs text-gray-500">Макс.</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{min}</div>
                  <div className="text-xs text-gray-500">Мин.</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
