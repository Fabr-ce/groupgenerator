import { levelNumbers } from '../Components/ThopicSelector';
import { Group } from './Group';

export class HeterogeneGroup extends Group {
    weighted: number;

    constructor(encoding?: number[]) {
        super(encoding);
        if (encoding) {
            this.weighted = weightedSum(encoding);
        } else {
            this.weighted = 0;
        }

    }

    addMember (level: number, count = 1) {
        super.addMember(level, count)
        this.weighted += level * count;
    }

    removeMember (level: number, count = 1) {
        super.removeMember(level, count)
        this.weighted -= level * count;
    }

    computeMaxPoints (studentNr: number) {
        let group = studentNr
        const restGroup = new HeterogeneGroup()
        for (let i = this.encoding.length - 1; i >= 0 && group > 0; i--) {
            const count = this.encoding[i];
            const choose = Math.min(count, group);
            restGroup.addMember(i, choose);
            group -= choose;
        }
        return restGroup;
    }

    improvePair (other: HeterogeneGroup) {
        assert(other.weighted >= this.weighted);
        const diff = (other.weighted - this.weighted) / 2;
        if (diff < 1) return false;

        let bestLevel: number = 0;
        let bestDiff: number = diff;
        let bestArr: number[] = [];
        for (let l = 1; l <= levelNumbers; l++) {
            const [arr, currDiff] = this.calculateShiftPoss(other, l, diff);

            if (currDiff < bestDiff) {
                bestDiff = currDiff;
                bestLevel = l;
                bestArr = arr;
            }
        }
        if (bestLevel === 0) return false;

        //execure best arr
        for (let i = 0; i < bestArr.length; i++) {
            const amount = bestArr[i];
            this.removeMember(i, amount);
            other.addMember(i, amount);

            other.removeMember(i + bestLevel, amount)
            this.addMember(i + bestLevel, amount)
        }
        return true;
    }

    private calculateShiftPoss (other: Group, factor: number, target: number): [number[], number] {
        const arr = []
        let restTarget = target;
        for (let i = 0; i < levelNumbers - factor; i++) {
            const nr = Math.min(this.getLevelCount(i), other.getLevelCount(i + factor))
            if (restTarget > nr * factor) {
                arr[i] = nr
                restTarget -= nr * factor;
            } else {
                const x = Math.round(restTarget / factor)
                arr[i] = x;
                restTarget -= x * factor;
            }

        }
        return [arr, Math.abs(restTarget)];
    }
}

const weightedSum = (arr: number[]) => arr.reduce((pre, curr, i) => pre + curr * (i + 1), 0)

const assert = (cond: boolean) => {
    if (!cond) throw new Error("Assertion violated!")
}