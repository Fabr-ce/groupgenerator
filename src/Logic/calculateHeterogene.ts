import { levelNumbers } from '../Components/Students/ThopicSelector';
import { Group } from './Group';
import { HeterogeneGroup } from './HeterogeneGroup';

const calculateHeterogene = (encoding: Group, groupSize: number, restGroups: number) => {
    const assignemnt = assignRandom(encoding, groupSize, restGroups)
    assignemnt.sort((a, b) => a.weighted - b.weighted)
    while (imporoveAssingment(assignemnt)) {
        assignemnt.sort((a, b) => a.weighted - b.weighted)
    }
    return assignemnt
}

export default calculateHeterogene

const imporoveAssingment = (assingment: HeterogeneGroup[]) => {
    const first = assingment[0]
    const last = assingment[assingment.length - 1]
    return first.improvePair(last)
}



const assignRandom = (encoding: Group, groupSize: number, restGroups: number): HeterogeneGroup[] => {
    const fullGroups = (encoding.count - restGroups * (groupSize - 1)) / groupSize
    const totalGroups = fullGroups + restGroups;

    const assignment = createEmptyAssignment(totalGroups);

    for (let i = 0; i < totalGroups; i++) {
        const group = assignment[i];
        const size = i < fullGroups ? groupSize : groupSize - 1;
        for (let x = 0; x < size; x++) {
            const rand = Math.floor(Math.random() * encoding.count);
            const level = findLevel(encoding, rand);

            group.addMember(level)
            encoding.removeMember(level);
        }
    }
    return assignment;
}



const findLevel = (encoding: Group, index: number) => {
    let rest = index;
    for (let i = 0; i < levelNumbers; i++) {
        rest -= encoding.getLevelCount(i);
        if (rest < 0) return i;
    }
    throw new Error("Wrong input for level finding")
}



const createEmptyAssignment = (groups: number) => {
    const assignment: HeterogeneGroup[] = [];
    for (let i = 0; i < groups; i++) {
        assignment[i] = new HeterogeneGroup();
    }
    return assignment
}