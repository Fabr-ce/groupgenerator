export function chooseRandomElem<T> (arr: T[]) {
    if (arr.length === 0) throw new Error("Not possible to select from empty list")
    const randInd = Math.floor(Math.random() * arr.length)
    const randElem = arr[randInd];
    arr.splice(randInd, 1);
    return randElem;
}