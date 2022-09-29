import { levelNumbers } from '../Components/ThopicSelector';
import { Group } from './Group';

export class HomogeneGroup extends Group {
    minLevel: number;
    maxLevel: number;
    maxDiff: number;

    constructor(encoding?: number[]) {
        super(encoding);
        if (encoding) {
            this.minLevel = encoding.findIndex(l => l !== 0)
            this.maxLevel = encoding.reduce((pre, curr, ind) => curr !== 0 ? ind : pre, -1)
        } else {
            this.minLevel = levelNumbers;
            this.maxLevel = 0;
        }
        this.maxDiff = this.maxLevel - this.minLevel;

    }

    addMember (level: number, count = 1) {
        super.addMember(level, count)
        this.minLevel = Math.min(this.minLevel, level)
        this.maxLevel = Math.max(this.maxLevel, level)
        this.maxDiff = this.maxLevel - this.minLevel
    }

    removeMember (level: number, count = 1) {
        const prevCount = this.getLevelCount(level);
        super.removeMember(level, count)
        if (this.minLevel === level && count === prevCount) this.minLevel = this.encoding.findIndex(l => l !== 0)
        if (this.maxLevel === level && count === prevCount) this.maxLevel = this.encoding.reduce((pre, curr, ind) => curr !== 0 ? ind : pre, -1)
        this.maxDiff = this.maxLevel - this.minLevel;
        if (this.count === 0) {
            this.minLevel = levelNumbers;
            this.maxLevel = 0;
            this.maxDiff = Infinity
        }
    }

    assignDBGroups (groupSize: number, restCount: number) {
        const DPDiff: number[][] = [];
        const DPGroup: HomogeneGroup[][] = [];
        const DPTook: boolean[][] = [];

        const normalGroupCount = (this.count - (restCount * (groupSize - 1))) / groupSize

        for (let i = 0; i <= restCount; i++) {
            DPDiff[i] = []
            DPGroup[i] = []
            DPTook[i] = [];
        }

        DPDiff[0][0] = 0;
        DPGroup[0][0] = this.clone();
        DPTook[0][0] = false;

        for (let i = 1; i <= restCount; i++) {
            DPGroup[i][0] = DPGroup[i - 1][0].clone()
            const takeRest = DPGroup[i][0].getLowestLevels(groupSize - 1)
            DPDiff[i][0] = takeRest.maxDiff;
            DPTook[i][0] = true;
        }

        for (let i = 1; i <= normalGroupCount; i++) {
            DPGroup[0][i] = DPGroup[0][i - 1].clone()
            const takeNormal = DPGroup[0][i].getLowestLevels(groupSize)
            DPDiff[0][i] = takeNormal.maxDiff;
            DPTook[0][i] = false;
        }

        for (let y = 1; y <= restCount; y++) {
            for (let x = 1; x <= normalGroupCount; x++) {
                const useRest = DPGroup[y - 1][x].clone()
                const useNormal = DPGroup[y][x - 1].clone()

                const restSelfDiff = useRest.getLowestLevels(groupSize - 1).maxDiff;
                const normalSelfDiff = useNormal.getLowestLevels(groupSize).maxDiff;

                const restDiff = Math.max(restSelfDiff, DPDiff[y - 1][x])
                const normalDiff = Math.max(normalSelfDiff, DPDiff[y][x - 1])

                const allSame = restDiff === normalDiff && restSelfDiff === normalSelfDiff
                const tieBreak = Math.random() < .5;
                const restSmaller = restDiff < normalDiff || (restDiff === normalDiff && restSelfDiff < normalSelfDiff) || (allSame && tieBreak)

                if (restSmaller) {
                    DPDiff[y][x] = restDiff;
                    DPGroup[y][x] = useRest;
                    DPTook[y][x] = true
                } else {
                    DPDiff[y][x] = normalDiff;
                    DPGroup[y][x] = useNormal;
                    DPTook[y][x] = false
                }
            }
        }


        // calculate the fastest path back
        const assignment: Group[] = [];
        let y = restCount;
        let x = normalGroupCount;
        while (y !== 0 || x !== 0) {
            const currGroup = DPGroup[y][x]
            if (DPTook[y][x]) y--;
            else x--;
            const prevGroup = DPGroup[y][x].clone()

            prevGroup.subtractGroup(currGroup)
            assignment.unshift(prevGroup)
        }
        assignment.sort((a, b) => b.count - a.count)
        console.log(assignment)
        return assignment





        /*const withoutRestDiff: number[] = new Array(Math.floor(this.count / groupSize));
        const withoutRestGroup: HomogeneGroup[] = new Array(Math.floor(this.count / groupSize));

        const withRestDiff: number[] = new Array(Math.ceil(this.count / groupSize));
        const withRestGroup: HomogeneGroup[] = new Array(Math.ceil(this.count / groupSize));

        if (withoutRestDiff.length === 0) {
            return [this];
        }

        withoutRestGroup[0] = this.clone()
        const lowLevelsNo = withoutRestGroup[0].getLowestLevels(groupSize)
        withoutRestDiff[0] = lowLevelsNo.maxDiff

        for (let i = 1; i < withoutRestDiff.length; i++) {
            withoutRestGroup[i] = withoutRestGroup[i - 1].clone()
            const lowestLevels = withoutRestGroup[i].getLowestLevels(groupSize)
            withoutRestDiff[i] = Math.max(lowestLevels.maxDiff, withoutRestDiff[i - 1])
        }

        const assignment: Group[] = [];

        if (restNr === 0) {
            let last: Group = this;
            for (const restGroup of withoutRestGroup) {
                last.subtractGroup(restGroup)
                assignment.push(last)
                last = restGroup
            }
            return assignment
        }

        const tookRest = [];
        withRestGroup[0] = this.clone()
        const lowLevelsYes = withRestGroup[0].getLowestLevels(restNr)
        withRestDiff[0] = lowLevelsYes.maxDiff
        tookRest[0] = true

        for (let i = 1; i < withRestDiff.length; i++) {
            const useRest = withoutRestGroup[i - 1].clone()
            const useNormal = withRestGroup[i - 1].clone()

            const restSelfDiff = useRest.getLowestLevels(restNr).maxDiff;
            const normalSelfDiff = useNormal.getLowestLevels(groupSize).maxDiff;

            const restDiff = Math.max(restSelfDiff, withoutRestDiff[i - 1])
            const normalDiff = Math.max(normalSelfDiff, withRestDiff[i - 1])

            const allSame = restDiff === normalDiff && restSelfDiff === normalSelfDiff
            const tieBreak = Math.random() < .5;
            const restSmaller = restDiff < normalDiff || (restDiff === normalDiff && restSelfDiff < normalSelfDiff) || (allSame && tieBreak)

            if (restSmaller) {
                withRestDiff[i] = restDiff;
                withRestGroup[i] = useRest;
                tookRest[i] = true
            } else {
                withRestDiff[i] = normalDiff;
                withRestGroup[i] = useNormal;
                tookRest[i] = false
            }
        }



        let last: Group = withRestGroup[withRestGroup.length - 1];
        let hasRest = tookRest[tookRest.length - 1];
        for (let i = withRestGroup.length - 2; i >= 0; i--) {
            const restGroup = withRestGroup[i];
            const withoutGroup = withoutRestGroup[i];
            const usedGroup = hasRest ? withoutGroup : restGroup;
            const usedClone = usedGroup.clone()
            usedClone.subtractGroup(last)
            assignment.push(usedClone)
            last = usedGroup
            hasRest ||= tookRest[i];
        }
        this.subtractGroup(last)
        assignment.push(this)
        assignment.sort((a, b) => b.count - a.count)
        return assignment*/
    }

    getLowestLevels (number: number) {
        let nrLeft = number;
        const lowestLevels = new HomogeneGroup()
        while (nrLeft > 0) {
            const minNr = this.getLevelCount(this.minLevel)
            if (minNr === 0) {
                console.log(this)
                throw new Error("Something went wrong")
            }

            const choose = Math.min(nrLeft, minNr);
            lowestLevels.addMember(this.minLevel, choose)
            this.removeMember(this.minLevel, choose)
            nrLeft -= choose;
        }
        return lowestLevels;
    }


    clone () {
        return new HomogeneGroup(this.encoding.slice())
    }
}
