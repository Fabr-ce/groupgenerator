import { StudentType, GroupType } from '../Components/types';
import calculateHeterogene from './calculateHeterogene';
import calculateHomogene from './calculateHomogene';
import { encodeStudents, randomDecodeStudents } from './convertStudent';
import { Group } from './Group';

// Erweitert Mittel Grund: E M G


interface settingsInput {
    groupType: GroupType
    students: StudentType[];
    thopicId: number,
    groupSize: number
}



const main = ({ groupSize, groupType, students, thopicId }: settingsInput): StudentType[][] => {
    const encodedStudents = encodeStudents(students, thopicId)
    const groupAssignment = calculateAssignment(encodedStudents, groupSize, groupType)
    const studentAssignment = randomDecodeStudents(students, thopicId, groupAssignment)
    return studentAssignment;
}

export default main


const calculateAssignment = (students: Group, groupSize: number, groupType: GroupType) => {
    if (groupType === GroupType.Heterogene) {
        return calculateHeterogene(students, groupSize)
    } else if (groupType === GroupType.Homogene) {
        return calculateHomogene(students, groupSize)
    } else {
        throw new Error("No such groupType")
    }
}