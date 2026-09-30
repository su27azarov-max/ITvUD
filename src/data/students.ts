export interface Student {
  id: number;
  fullName: string;
  group: string;
  notes: number;       // Конспекты
  practice: number;    // Защита практических работ
  reports: number;     // Выступления с докладами
  bonus: number;       // Дополнительные баллы
}

export interface CategoryConfig {
  key: keyof Pick<Student, 'notes' | 'practice' | 'reports' | 'bonus'>;
  name: string;
  maxPerItem: number;
  maxTotal: number; // настраивается преподавателем
  description: string;
  shortDesc: string;
}

export const defaultCategories: CategoryConfig[] = [
  {
    key: 'notes',
    name: 'Конспекты',
    maxPerItem: 2,
    maxTotal: 30,
    description: 'Наличие конспектов на занятиях',
    shortDesc: '2 балла за занятие',
  },
  {
    key: 'practice',
    name: 'Практические работы',
    maxPerItem: 5,
    maxTotal: 30,
    description: 'Защита практических работ',
    shortDesc: '5 баллов за защиту',
  },
  {
    key: 'reports',
    name: 'Доклады',
    maxPerItem: 10,
    maxTotal: 20,
    description: 'Выступление с докладами',
    shortDesc: '10 баллов за доклад',
  },
  {
    key: 'bonus',
    name: 'Дополнительные баллы',
    maxPerItem: 5,
    maxTotal: 10,
    description: 'Дополнительные баллы от преподавателя',
    shortDesc: 'На усмотрение преподавателя',
  },
];

export function calculateTotal(student: Student): number {
  return student.notes + student.practice + student.reports + student.bonus;
}

export function calculateMaxTotal(categories: CategoryConfig[]): number {
  return categories.reduce((sum, c) => sum + c.maxTotal, 0);
}

export function getGrade(total: number, maxTotal: number): string {
  // Шкала в процентах от максимума
  const pct = (total / maxTotal) * 100;
  if (pct >= 90) return 'Отлично';
  if (pct >= 75) return 'Хорошо';
  if (pct >= 60) return 'Удовлетворительно';
  return 'Неудовлетворительно';
}

export function getGradeColor(total: number, maxTotal: number): string {
  const pct = (total / maxTotal) * 100;
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
  return { id, fullName, group, notes: 0, practice: 0, reports: 0, bonus: 0 };
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
