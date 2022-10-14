import { Options } from "../Components/helpers/Context/OptionsContext";
import { StudentType, GroupType, GroupSelection } from '../Components/helpers/types';
import calculateHeterogene from './calculateHeterogene';
import calculateHomogene from './calculateHomogene';
import { encodeStudents, randomDecodeStudents } from './convertStudent';
import { Group } from './Group';

// Erweitert Mittel Grund: E M G


type settingsInput = { students: StudentType[] } & Options



const main = ({ students, ...options }: settingsInput): StudentType[][] => {
    const encodedStudents = encodeStudents(students, options.thopicId)
    const groupAssignment = calculateAssignment(encodedStudents, options)
    groupAssignment.sort((a, b) => b.count - a.count)
    const studentAssignment = randomDecodeStudents(students, options.thopicId, groupAssignment)
    return studentAssignment;
}

export default main


const calculateAssignment = (students: Group, options: Options) => {
    let groupSize = 0;
    let restGroups = 0;

    if (options.groupSelection === GroupSelection.GroupSize) {
        groupSize = options.groupSize;
        const fullGroups = Math.floor(students.count / options.groupSize);
        const restNumber = students.count - fullGroups * groupSize;
        restGroups = restNumber === 0 ? 0 : groupSize - restNumber
    } else if (options.groupSelection === GroupSelection.GroupNumber) {
        groupSize = Math.ceil(students.count / options.groupNumber);
        // students.count = x * groupSize + y * (groupSize - 1)
        // x + y = nr

        // sc = (nr-y) * gs + y * (gs - 1) => sc = nr * gs - y =>  y = nr * gs - sc
        restGroups = options.groupNumber * groupSize - students.count
    } else {
        throw new Error("No such groupSelection")
    }


    const fullCount = (students.count - restGroups * (groupSize - 1)) / groupSize
    if (fullCount < 0 || (groupSize === 1 && restGroups > 0)) return [];


    if (options.groupType === GroupType.Heterogene) {
        return calculateHeterogene(students, groupSize, restGroups)
    } else if (options.groupType === GroupType.Homogene) {
        return calculateHomogene(students, groupSize, restGroups)
    } else {
        throw new Error("No such groupType")
    }
}