import { levelNumbers } from '../Components/ThopicSelector'
import { Group } from './Group';
import { HeterogeneGroup } from './HeterogeneGroup';

const calculateHeterogene = (encoding: Group, groupSize: number) => {
    const [assignemnt, rest] = assignRandom(encoding, groupSize)
    assignemnt.sort((a, b) => a.weighted - b.weighted)
    while (imporoveAssingment(assignemnt)) {
        assignemnt.sort((a, b) => a.weighted - b.weighted)
    }
    if (rest) assignemnt.push(rest);
    return assignemnt
}

export default calculateHeterogene

const imporoveAssingment = (assingment: HeterogeneGroup[]) => {
    const first = assingment[0]
    const last = assingment[assingment.length - 1]
    return first.improvePair(last)
}



const assignRandom = (encoding: Group, groupSize: number): [HeterogeneGroup[], HeterogeneGroup | null] => {
    const fullGroups = Math.floor(encoding.count / groupSize);
    const allGroups = Math.ceil(encoding.count / groupSize);
    const restNumber = encoding.count - fullGroups * groupSize;

    let groupNr = allGroups
    let rest = null
    if (restNumber !== 0) {
        const heterogeneGroup = new HeterogeneGroup(encoding.encoding);
        const restGroup = heterogeneGroup.computeMaxPoints(restNumber)
        const meanPoints = heterogeneGroup.weighted / allGroups;
        if (restGroup.weighted < meanPoints) {
            encoding.subtractGroup(restGroup);
            rest = restGroup;
            groupNr--;
        }
    }


    const assignment = createEmptyAssignment(groupNr);
    for (let i = 0; i < groupNr; i++) {
        const group = assignment[i];

        const size = Math.min(groupSize, encoding.count)
        for (let x = 0; x < size; x++) {
            const rand = Math.floor(Math.random() * encoding.count);
            const level = findLevel(encoding, rand);

            group.addMember(level)
            encoding.removeMember(level);
        }
    }
    return [assignment, rest];
}



const findLevel = (encoding: Group, index: number) => {
    let rest = index;
    for (let i = 1; i <= levelNumbers; i++) {
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