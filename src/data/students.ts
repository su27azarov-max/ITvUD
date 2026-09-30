export interface Student {
  id: number;
  fullName: string;
  group: string;
  // Категории баллов (суммируются внутри каждой)
  notes: number;       // Конспекты
  practice: number;    // Защита практических работ
  reports: number;     // Выступления с докладами
  grades: number;      // Баллы по оценкам на занятиях
  bonus: number;       // Дополнительные баллы
}

export interface GradeMapping {
  grade5: number;  // Баллы за оценку "5"
  grade4: number;  // Баллы за оценку "4"
  grade3: number;  // Баллы за оценку "3"
}

export interface CategoryConfig {
  key: keyof Pick<Student, 'notes' | 'practice' | 'reports' | 'grades' | 'bonus'>;
  name: string;
  maxPerItem: number;
  maxTotal: number;
  description: string;
  shortDesc: string;
}

export const defaultGradeMapping: GradeMapping = {
  grade5: 5,
  grade4: 3,
  grade3: 1,
};

export const defaultCategories: CategoryConfig[] = [
  {
    key: 'notes',
    name: 'Конспекты',
    maxPerItem: 2,
    maxTotal: 30,
    description: 'Наличие конспектов на занятиях',
    shortDesc: '2 балла за занятие (макс. 30)',
  },
  {
    key: 'practice',
    name: 'Практические работы',
    maxPerItem: 5,
    maxTotal: 30,
    description: 'Защита практических работ',
    shortDesc: '5 баллов за защиту (макс. 30)',
  },
  {
    key: 'reports',
    name: 'Доклады',
    maxPerItem: 10,
    maxTotal: 20,
    description: 'Выступление с докладами',
    shortDesc: '10 баллов за доклад (макс. 20)',
  },
  {
    key: 'grades',
    name: 'Оценки на занятиях',
    maxPerItem: 5,
    maxTotal: 20,
    description: 'Баллы по оценкам, полученным на занятиях',
    shortDesc: '5/3/1 балл за оценку 5/4/3 (макс. 20)',
  },
  {
    key: 'bonus',
    name: 'Дополнительные баллы',
    maxPerItem: 5,
    maxTotal: 10,
    description: 'Дополнительные баллы от преподавателя',
    shortDesc: 'На усмотрение преподавателя (макс. 10)',
  },
];

export function calculateTotal(student: Student): number {
  return student.notes + student.practice + student.reports + student.grades + student.bonus;
}

export function getGrade(total: number): string {
  if (total >= 90) return 'Отлично';
  if (total >= 75) return 'Хорошо';
  if (total >= 60) return 'Удовлетворительно';
  return 'Неудовлетворительно';
}

export function getGradeColor(total: number): string {
  if (total >= 90) return 'text-green-700 bg-green-100';
  if (total >= 75) return 'text-blue-700 bg-blue-100';
  if (total >= 60) return 'text-yellow-700 bg-yellow-100';
  return 'text-red-700 bg-red-100';
}

export function getGroups(students: Student[]): string[] {
  const groups = new Set(students.map(s => s.group));
  return Array.from(groups).sort();
}

export function createEmptyStudent(id: number, fullName: string, group: string): Student {
  return { id, fullName, group, notes: 0, practice: 0, reports: 0, grades: 0, bonus: 0 };
}

export function parseImportText(text: string): Student[] {
  const students: Student[] = [];
  let currentGroup = '';
  let nextId = 1;
  const lines = text.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Формат группы: # Группа ИТ-201 или Группа: ИТ-201 или просто ИТ-201 (строка в скобках)
    const groupMatch = line.match(/^(?:#\s*Группа\s*|Группа\s*[:\-]?\s*)(.+)$/i);
    if (groupMatch) {
      currentGroup = groupMatch[1].trim();
      continue;
    }

    // Формат CSV: ФИО;Группа или ФИО,Группа
    const csvMatch = line.match(/^(.+?)\s*[;,]\s*(.+)$/);
    if (csvMatch && !csvMatch[2].includes(' ')) {
      // Если вторая часть похожа на номер группы (короткая, без пробелов или с дефисом)
      const possibleGroup = csvMatch[2].trim();
      if (possibleGroup.length <= 20 && !possibleGroup.includes('.')) {
        students.push(createEmptyStudent(nextId++, csvMatch[1].trim(), possibleGroup));
        continue;
      }
    }

    // Если группа уже установлена — это студент
    if (currentGroup) {
      students.push(createEmptyStudent(nextId++, line, currentGroup));
    }
  }

  return students;
}
