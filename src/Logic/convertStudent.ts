import { StudentType } from '../Components/helpers/types';
import { defaultLevel, levelNumbers, levels } from '../Components/Students/ThopicSelector';
import { chooseRandomElem } from './helper';
import { Group } from './Group';

export const encodeStudents = (students: StudentType[], thopicId: number) => {
    const encoded = new Group();

    for (const student of students) {
        const stored = student.skills[thopicId]
        const level = stored === undefined ? defaultLevel : stored;
        encoded.addMember(level);
    }

    return encoded;
}

export const randomDecodeStudents = (students: StudentType[], thopicId: number, groupAssignment: Group[]) => {
    const groups = groupAssignment.length;

    const studentLevel: StudentType[][] = [];
    for (let i = 0; i < levelNumbers; i++) {
        studentLevel[i] = []
    }

    for (const student of students) {
        const dbStore = student.skills[thopicId]
        const level = dbStore === undefined ? defaultLevel : dbStore;
        studentLevel[level].push(student);
    }

    const studentAssignment: StudentType[][] = [];
    for (let i = 0; i < groups; i++) {
        studentAssignment[i] = []
    }

    for (let i = 0; i < groups; i++) {
        const group = groupAssignment[i];
        for (let level of levels) {
            const levelCount = group.getLevelCount(level);
            const studentArr = studentLevel[level];
            for (let x = 0; x < levelCount; x++) {
                const student = chooseRandomElem<StudentType>(studentArr);
                studentAssignment[i].push(student);
            }
        }
    }

    return studentAssignment;
}


