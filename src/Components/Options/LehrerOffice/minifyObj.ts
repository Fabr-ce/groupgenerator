import { StudentExport, subjectIdMapping, subjects } from './importHelpters';


export const minifyObj = (arr: StudentExport[]) => {
    const names = arr.map(s => s.name).join(",")
    const skills = arr.map(s => {
        const newSk: number[] = [];
        for (const sub of subjects) {
            const id = subjectIdMapping[sub];
            newSk[id - 1] = s.skills[id]
        }
        return newSk.map(sk => sk === undefined ? " " : sk + "").join("")
    }).join(",")
    return [names, skills]
}

export const parseStr = ([namesStr, skillsStr]: [string, string]): StudentExport[] => {
    const students: StudentExport[] = []
    const names = namesStr.split(",")
    const skills = skillsStr.split(",")
    for (let i = 0; i < names.length; i++) {
        const name = names[i]
        const skill = skills[i]
        const newSk: StudentExport["skills"] = {}
        for (const sub of subjects) {
            const id = subjectIdMapping[sub];
            const val = parseInt(skill[id - 1])
            if (!isNaN(val)) {
                newSk[id] = val;
            }
        }
        students.push({ name, skills: newSk })
    }

    return students
}


export const decode = (str: string): string => atob(str);
export const encode = (str: string): string => btoa(str);
