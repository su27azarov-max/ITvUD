export interface Student {
  id: number;
  fullName: string;
  group: string;
  notes: number;       // Конспекты (дополнительные)
  practice: number;    // Защита практических работ
  reports: number;     // Выступления с докладами (дополнительные)
  bonus: number;       // Дополнительные баллы
  testing: number;     // Тестирование
  // Оценки для подсчета
  practiceGrades: { '3': number; '4': number; '5': number }; // Количество оценок за практики
  reportsGrades: { '3': number; '4': number; '5': number };  // Количество оценок за доклады
  notesGrades: { '3': number; '4': number; '5': number };    // Количество оценок за конспекты
  testingGrades: { '3': number; '4': number; '5': number };  // Количество оценок за тестирование
}

export interface GradeToPoints {
  grade3: number;
  grade4: number;
  grade5: number;
}

export interface CategoryConfig {
  key: keyof Pick<Student, 'notes' | 'practice' | 'reports' | 'bonus' | 'testing'>;
  name: string;
  maxPerItem: number;
  maxTotal: number; // настраивается преподавателем
  description: string;
  shortDesc: string;
  useGrades?: boolean; // использовать систему оценок
  gradeMapping?: GradeToPoints; // соответствие оценок и баллов
  isBonus?: boolean; // дополнительные баллы (не учитываются в максимуме)
}

export const defaultCategories: CategoryConfig[] = [
  {
    key: 'practice',
    name: 'Практические работы',
    maxPerItem: 10,
    maxTotal: 500,
    description: 'Защита практических работ',
    shortDesc: 'Оценка 3→3б, 4→7б, 5→10б',
    useGrades: true,
    gradeMapping: { grade3: 3, grade4: 7, grade5: 10 },
  },
  {
    key: 'testing',
    name: 'Тестирование',
    maxPerItem: 10,
    maxTotal: 500,
    description: 'Результаты тестирования',
    shortDesc: 'Оценка 3→3б, 4→7б, 5→10б',
    useGrades: true,
    gradeMapping: { grade3: 3, grade4: 7, grade5: 10 },
  },
  {
    key: 'notes',
    name: 'Конспекты',
    maxPerItem: 2,
    maxTotal: 500,
    description: 'Наличие конспектов на занятиях',
    shortDesc: '2 балла за конспект лекции',
    isBonus: true, // Дополнительные баллы
  },
  {
    key: 'reports',
    name: 'Доклады',
    maxPerItem: 8,
    maxTotal: 500,
    description: 'Выступление с докладами',
    shortDesc: 'Оценка 3→3б, 4→6б, 5→8б',
    useGrades: true,
    gradeMapping: { grade3: 3, grade4: 6, grade5: 8 },
    isBonus: true, // Дополнительные баллы
  },
  {
    key: 'bonus',
    name: 'Дополнительные баллы',
    maxPerItem: 50,
    maxTotal: 500,
    description: 'Дополнительные баллы от преподавателя',
    shortDesc: 'На усмотрение преподавателя',
    isBonus: true, // Дополнительные баллы
  },
];

export function calculateTotal(student: Student): number {
  // Итог включает все баллы, включая дополнительные (если они есть)
  return (student.notes || 0) + (student.practice || 0) + (student.reports || 0) + (student.bonus || 0) + (student.testing || 0);
}

export function calculateMaxTotal(categories: CategoryConfig[]): number {
  // Максимум НЕ включает дополнительные баллы (isBonus = true)
  return categories.reduce((sum, c) => {
    if (c.maxTotal <= 0) return sum;
    if (c.isBonus) return sum; // Исключаем дополнительные категории из максимума
    return sum + c.maxTotal;
  }, 0);
}

export function getGrade(total: number, maxTotal: number): string {
  // Процентная шкала от максимума (без учета бонусов)
  const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
  if (pct >= 90) return 'Отлично';
  if (pct >= 75) return 'Хорошо';
  if (pct >= 60) return 'Удовлетворительно';
  return 'Неудовлетворительно';
}

export function getGradeColor(total: number, maxTotal: number): string {
  const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
  if (pct >= 90) return 'text-green-700 bg-green-100';
  if (pct >= 75) return 'text-blue-700 bg-blue-100';
  if (pct >= 60) return 'text-yellow-700 bg-yellow-100';
  return 'text-red-700 bg-red-100';
}

export function getGroups(students: Student[]): string[] {
  const groups = new Set(students.map(s => s.group));
  return Array.from(groups).sort();
}

export function createEmptyStudent(id: number, fullName: string, group: string): Student {
  return { 
    id, 
    fullName, 
    group, 
    notes: 0, 
    practice: 0, 
    reports: 0, 
    bonus: 0,
    testing: 0,
    practiceGrades: { '3': 0, '4': 0, '5': 0 },
    reportsGrades: { '3': 0, '4': 0, '5': 0 },
    notesGrades: { '3': 0, '4': 0, '5': 0 },
    testingGrades: { '3': 0, '4': 0, '5': 0 }
  };
}

export function parseImportText(text: string): Student[] {
  const students: Student[] = [];
  let currentGroup = '';
  let nextId = 1;
  const lines = text.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const groupMatch = line.match(/^(?:#\s*Группа\s*|Группа\s*[:\-]?\s*)(.+)$/i);
    if (groupMatch) {
      currentGroup = groupMatch[1].trim();
      continue;
    }

    const csvMatch = line.match(/^(.+?)\s*[;,]\s*(.+)$/);
    if (csvMatch && !csvMatch[2].includes(' ')) {
      const possibleGroup = csvMatch[2].trim();
      if (possibleGroup.length <= 20 && !possibleGroup.includes('.')) {
        students.push(createEmptyStudent(nextId++, csvMatch[1].trim(), possibleGroup));
        continue;
      }
    }

    if (currentGroup) {
      students.push(createEmptyStudent(nextId++, line, currentGroup));
    }
  }

  return students;
}

export function ensureStudentFields(student: Partial<Student>): Student {
  return {
    id: student.id || 0,
    fullName: student.fullName || '',
    group: student.group || '',
    notes: student.notes || 0,
    practice: student.practice || 0,
    reports: student.reports || 0,
    bonus: student.bonus || 0,
    testing: student.testing || 0,
    practiceGrades: student.practiceGrades || { '3': 0, '4': 0, '5': 0 },
    reportsGrades: student.reportsGrades || { '3': 0, '4': 0, '5': 0 },
    notesGrades: student.notesGrades || { '3': 0, '4': 0, '5': 0 },
    testingGrades: student.testingGrades || { '3': 0, '4': 0, '5': 0 },
  };
}

// Функции для подсчета баллов по оценкам
export function calculatePracticeScore(grades: { '3': number; '4': number; '5': number }): number {
  return grades['3'] * 3 + grades['4'] * 7 + grades['5'] * 10;
}

export function calculateReportsScore(grades: { '3': number; '4': number; '5': number }): number {
  return grades['3'] * 3 + grades['4'] * 6 + grades['5'] * 8;
}

export function calculateTestingScore(grades: { '3': number; '4': number; '5': number }): number {
  return grades['3'] * 3 + grades['4'] * 7 + grades['5'] * 10;
}
