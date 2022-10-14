export interface StudentType {
    id: number;
    name: string;
    active: boolean;
    skills: { [key: string]: number };
}



export interface ThopicType {
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
