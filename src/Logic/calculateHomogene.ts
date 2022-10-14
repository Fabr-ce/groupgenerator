import { Group } from './Group';
import { HomogeneGroup } from './HomogeneGroup';

const calculateHomogene = (encoding: Group, groupSize: number, restGroups: number) => {
    const homogeneGroup = new HomogeneGroup(encoding.encoding);
    const assignment = homogeneGroup.assignDBGroups(groupSize, restGroups)
    return assignment;
}

export default calculateHomogene;
