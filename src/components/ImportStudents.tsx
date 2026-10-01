import { useState } from 'react';
import { Student, parseImportText } from '../data/students';

interface ImportStudentsProps {
  onImport: (students: Student[]) => void;
  existingCount: number;
}

export default function ImportStudents({ onImport, existingCount }: ImportStudentsProps) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<Student[]>([]);
  const [mode, setMode] = useState<'append' | 'replace'>('append');
  const [showHelp, setShowHelp] = useState(false);

  const handlePreview = () => {
    const parsed = parseImportText(text);
    setPreview(parsed);
  };

  const handleImport = () => {
    if (preview.length === 0) return;
    onImport(preview);
    setText('');
    setPreview([]);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">📥</span>
          Импорт обучающихся
        </h3>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {showHelp ? 'Скрыть справку' : 'Формат ввода'}
        </button>
      </div>

      {showHelp && (
        <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800">
          <p className="font-semibold mb-2">Поддерживаемые форматы:</p>
          <div className="space-y-3">
            <div>
              <p className="font-medium">1. По группам:</p>
              <pre className="bg-white rounded-lg p-3 mt-1 text-xs overflow-x-auto border border-indigo-100">{`# Группа ИТ-201
Иванов Иван Сергеевич
Петрова Анна Михайловна

# Группа ИТ-202
Сидоров Алексей Дмитриевич`}</pre>
            </div>
            <div>
              <p className="font-medium">2. CSV (ФИО;Группа):</p>
              <pre className="bg-white rounded-lg p-3 mt-1 text-xs overflow-x-auto border border-indigo-100">{`Иванов Иван Сергеевич;ИТ-201
Петрова Анна Михайловна;ИТ-201
Сидоров Алексей Дмитриевич;ИТ-202`}</pre>
            </div>
          </div>
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setPreview([]); }}
        placeholder={'Вставьте список студентов...\n\n# Группа ИТ-201\nИванов Иван Сергеевич\nПетрова Анна Михайловна'}
        className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm font-mono"
      />

      <div className="flex flex-wrap items-center gap-3 mt-3">
        <button
          onClick={handlePreview}
          disabled={!text.trim()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Предпросмотр
        </button>
        <button
          onClick={handleImport}
          disabled={preview.length === 0}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-200 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Импортировать ({preview.length} чел.)
        </button>
        {existingCount > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-600">Режим:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'append' | 'replace')}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="append">Добавить к текущим</option>
              <option value="replace">Заменить всех</option>
            </select>
          </div>
        )}
      </div>

      {preview.length > 0 && (
        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
            Будет импортировано: {preview.length} студентов из {new Set(preview.map(s => s.group)).size} групп
          </div>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">№</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">ФИО</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Группа</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((s, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-2 text-gray-800">{s.fullName}</td>
                    <td className="px-3 py-2">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">{s.group}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
