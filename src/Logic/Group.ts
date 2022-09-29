import { levelNumbers } from '../Components/ThopicSelector';

export class Group {
    encoding: number[];
    count: number;

    constructor(encoding?: number[]) {
        if (encoding) {
            this.encoding = encoding
            this.count = sum(encoding);
        } else {
            this.encoding = new Array(levelNumbers).fill(0);
            this.count = 0;
        }
    }

    getLevelCount (level: number) {
        if (level >= 0 && level < levelNumbers) return this.encoding[level]
        return 0;
    }

    addMember (level: number, count = 1) {
        assert(level >= 0 && level < levelNumbers)
        this.encoding[level] += count;
        this.count += count;
    }

    removeMember (level: number, count = 1) {
        assert(level >= 0 && level < levelNumbers)
        if (this.encoding[level] < count) throw new Error("No student in Team")
        this.encoding[level] -= count;
        this.count -= count;
    }


    subtractGroup (group: Group) {
        for (let i = 0; i < this.encoding.length; i++) {
            this.removeMember(i, group.getLevelCount(i))
        }
    }
}


const sum = (arr: number[]) => arr.reduce((pre, curr) => pre + curr, 0)


const assert = (cond: boolean) => {
    if (!cond) throw new Error("Assertion violated!")
}
