export interface Student {
  id: number;
  fullName: string;
  group: string;
  attendance: number; // 0-30 баллов
  homework: number;   // 0-30 баллов
  test1: number;      // 0-20 баллов
  test2: number;      // 0-20 баллов
  project: number;    // 0-10 баллов (итоговый проект)
}

export const initialStudents: Student[] = [
  { id: 1, fullName: "Иванов Иван Сергеевич", group: "ИТ-201", attendance: 28, homework: 27, test1: 18, test2: 17, project: 9 },
  { id: 2, fullName: "Петрова Анна Михайловна", group: "ИТ-201", attendance: 30, homework: 29, test1: 20, test2: 19, project: 10 },
  { id: 3, fullName: "Сидоров Алексей Дмитриевич", group: "ИТ-201", attendance: 22, homework: 20, test1: 14, test2: 13, project: 7 },
  { id: 4, fullName: "Козлова Мария Андреевна", group: "ИТ-201", attendance: 26, homework: 25, test1: 16, test2: 15, project: 8 },
  { id: 5, fullName: "Новиков Дмитрий Павлович", group: "ИТ-201", attendance: 18, homework: 15, test1: 10, test2: 11, project: 5 },
  { id: 6, fullName: "Морозова Елена Викторовна", group: "ИТ-202", attendance: 29, homework: 28, test1: 19, test2: 18, project: 9 },
  { id: 7, fullName: "Волков Артём Николаевич", group: "ИТ-202", attendance: 24, homework: 22, test1: 15, test2: 14, project: 7 },
  { id: 8, fullName: "Соколова Дарья Олеговна", group: "ИТ-202", attendance: 27, homework: 26, test1: 17, test2: 16, project: 8 },
  { id: 9, fullName: "Лебедев Максим Игоревич", group: "ИТ-202", attendance: 20, homework: 18, test1: 12, test2: 11, project: 6 },
  { id: 10, fullName: "Кузнецова Ольга Романовна", group: "ИТ-202", attendance: 25, homework: 24, test1: 16, test2: 15, project: 8 },
  { id: 11, fullName: "Попов Никита Александрович", group: "ИТ-203", attendance: 30, homework: 30, test1: 20, test2: 20, project: 10 },
  { id: 12, fullName: "Васильева Татьяна Петровна", group: "ИТ-203", attendance: 23, homework: 21, test1: 14, test2: 13, project: 7 },
  { id: 13, fullName: "Зайцев Роман Владимирович", group: "ИТ-203", attendance: 19, homework: 17, test1: 11, test2: 12, project: 6 },
  { id: 14, fullName: "Павлова Наталья Сергеевна", group: "ИТ-203", attendance: 27, homework: 26, test1: 18, test2: 17, project: 9 },
  { id: 15, fullName: "Семёнов Кирилл Олегович", group: "ИТ-203", attendance: 21, homework: 19, test1: 13, test2: 12, project: 6 },
];

export function calculateTotal(student: Student): number {
  return student.attendance + student.homework + student.test1 + student.test2 + student.project;
}

export function getGrade(total: number): string {
  if (total >= 90) return "Отлично";
  if (total >= 75) return "Хорошо";
  if (total >= 60) return "Удовлетворительно";
  return "Неудовлетворительно";
}

export function getGradeColor(total: number): string {
  if (total >= 90) return "text-green-700 bg-green-100";
  if (total >= 75) return "text-blue-700 bg-blue-100";
  if (total >= 60) return "text-yellow-700 bg-yellow-100";
  return "text-red-700 bg-red-100";
}

export function getGroups(students: Student[]): string[] {
  const groups = new Set(students.map(s => s.group));
  return Array.from(groups).sort();
}
