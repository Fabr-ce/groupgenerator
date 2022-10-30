import { levelNumbers } from '../../Students/ThopicSelector';
import { StudentType } from '../../helpers/types';

export const subjects = ['M', 'D', 'BS'];
export const subjectIdMapping: { [key: string]: number } = { "M": 1, "D": 2, "BS": 3 }

export interface StudentExport {
    name: string;
    skills: StudentType["skills"]
}


interface LehrerOfficeType {
    name: string;
    short: string;
    subjects: { [key: string]: number };
}

export const importFromLehrerOffice = async (students: StudentType[], classId: number, update: (item: StudentType) => Promise<void>, remove: (id: number) => Promise<void>) => {
    const text = await navigator.clipboard.readText();
    const lines = text.split('\n');
    if (lines.length < 4) throw new Error("Bitte kopiere die Tabelle vom LehrerOffice nochmals!")
    const subjectInds = getSubjectIndices(lines);




    //remove mean of table at the end
    lines.pop()

    const newStudents: LehrerOfficeType[] = [];

    for (const line of lines) {
        const cells = line.split('\t');
        const name = cells[0];
        const short = name.split(" ")[0];
        const studentSubjects: LehrerOfficeType["subjects"] = {};
        for (let i = 0; i < subjects.length; i++) {
            const number = parseFloat(cells[subjectInds[i]]);
            if (!isNaN(number)) studentSubjects[subjects[i]] = number;
        }
        newStudents.push({ name, short, subjects: studentSubjects });
    }

    const resultStudents: StudentExport[] = [];
    for (const student of newStudents) {
        const name = getShortestName(student, newStudents)
        resultStudents.push({ name, skills: {} })
    }

    const studentLevelAssignment = subjectStatistics(newStudents, resultStudents);

    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        const thopicId = subjectIdMapping[subject]
        for (let l = 0; l < levelNumbers; l++) {
            const levelAss = studentLevelAssignment[i][l];
            if (!levelAss) continue;
            for (const student of levelAss) {
                student.skills[thopicId] = l;
            }
        }
    }

    await renewStudents(students, resultStudents, classId, update, remove)
    return resultStudents;
}

export const renewStudents = async (students: StudentType[], resultStudents: StudentExport[], classId: number, update: (item: StudentType) => Promise<void>, remove: (id: number) => Promise<void>) => {
    //remove all current students
    await clearStudents(students, remove)
    await createStudents(resultStudents, classId, update);
}


const getSubjectIndices = (arr: string[]) => {
    arr.shift();
    const subjectLine = arr.shift()?.split('\t');
    if (!subjectLine) throw new Error('Bitte kopiere die Tabelle vom LehrerOffice nochmals!');

    const subjectCols = subjects.map((s) => subjectLine.indexOf(s));

    if (subjectCols.includes(-1))
        throw new Error('Ein Fach wurde nicht gefunden!');

    return subjectCols;
};


const subjectStatistics = (students: LehrerOfficeType[], endStudents: StudentExport[]) => {
    const resultStudents: StudentExport[][][] = []
    for (const subject of subjects) {

        const valArr = students.map(s => s.subjects[subject]).filter(s => !!s)
        const mean = valArr.reduce((pre, curr) => pre + curr, 0) / valArr.length || 0;

        const mapping = students.map((s, i) => ({ student: endStudents[i], value: s.subjects[subject] || mean }))
        mapping.sort((a, b) => a.value - b.value)


        //group students with their grade
        let lastGrade = mapping[0].value;
        let currentBuffer: StudentExport[] = [];
        const studentGrouping: StudentExport[][] = [];
        for (const { student, value } of mapping) {
            if (value === lastGrade) {
                currentBuffer.push(student)
            } else {
                lastGrade = value;
                studentGrouping.push(currentBuffer);
                currentBuffer = [student]
            }
        }
        studentGrouping.push(currentBuffer)

        const averageCount = Math.round(students.length / levelNumbers);
        const levelAssignment: StudentExport[][] = []
        let currentLevel: StudentExport[] = [];
        let nextCuroff = averageCount;
        for (const group of studentGrouping) {
            const exclude = Math.abs(currentLevel.length - nextCuroff)
            const include = Math.abs(currentLevel.length + group.length - nextCuroff)
            if (exclude < include) {
                levelAssignment.push(currentLevel)
                currentLevel = [...group];
            } else {
                currentLevel.push(...group);
            }
        }
        levelAssignment.push(currentLevel)
        resultStudents.push(levelAssignment)
    }

    return resultStudents;
}


const getShortestName = (student: LehrerOfficeType, students: LehrerOfficeType[]) => {
    let sameShort = students.filter(s => s.short === student.short)
    if (sameShort.length === 1) return student.short;

    let len = student.short.length + 2;
    while (sameShort.length !== 1 || len >= student.name.length) {
        for (const st of sameShort) {
            st.short = st.name.substring(0, len);
        }
        sameShort = sameShort.filter(s => s.short === student.short)
        len++;
    }
    return student.short;
}


export const clearStudents = async (students: StudentType[], remove: (id: number) => Promise<void>) => {
    for (const student of students) {
        await remove(student.id)
    }
    return null;
}

export const createStudents = async (students: StudentExport[], classId: number, update: (item: StudentType) => Promise<void>) => {
    let i = 0;
    for (const { name, skills } of students) {
        await update({ id: ++i, classId, active: true, name, skills })
    }
    return null;
}