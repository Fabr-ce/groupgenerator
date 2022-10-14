import { StudentType } from '../../helpers/types';
import { StudentExport } from './importHelpters';

export const exportStudents = (students: StudentType[]): StudentExport[] => {
  return students.map((s) => ({ name: s.name, skills: s.skills }));
};
