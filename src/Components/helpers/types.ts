export interface StudentType {
    id: number;
    name: string;
    active: boolean;
    classId: number;
    skills: { [thopicId: number]: number };
}



export interface ThopicType {
    id: number;
    name: string;
    active: boolean;
}

export interface ClassType {
    id: number;
    name: string;
    active: boolean;
}

export enum GroupType {
    Heterogene,
    Homogene,
}

export enum GroupSelection {
    GroupSize,
    GroupNumber
}
