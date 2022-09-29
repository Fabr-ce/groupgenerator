import { Group } from './Group';
import { HomogeneGroup } from './HomogeneGroup';

export default (encoding: Group, groupSize: number) => {
    const fullGroups = Math.floor(encoding.count / groupSize);
    const restNumber = encoding.count - fullGroups * groupSize;
    const restGroups = restNumber === 0 ? 0 : groupSize - restNumber
    const fullCount = (encoding.count - restGroups * (groupSize - 1)) / groupSize
    if (fullCount < 0) return [];

    const homogeneGroup = new HomogeneGroup(encoding.encoding);
    const assignment = homogeneGroup.assignDBGroups(groupSize, restGroups)
    return assignment;
}
