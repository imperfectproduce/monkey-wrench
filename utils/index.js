// Merge together two pre-sorted arrays of objects using a given comparator function
// Based on: https://stackoverflow.com/a/41170834
export const mergeSortedArraysBy = (array1, array2, comparator) => {
    const mergedArray = [];
    let i = 0;
    let j = 0;
    while (i < array1.length && j < array2.length) {
        if (comparator(array1[i], array2[j])) {
            mergedArray.push(array1[i]);
            i++;
        } else {
            mergedArray.push(array2[j]);
            j++;
        }
    }
    if (i < array1.length) {
        for (let p = i; p < array1.length; p++) {
            mergedArray.push(array1[p]);
        }
    } else {
        for (let p = j; p < array2.length; p++) {
            mergedArray.push(array2[p]);
        }
    }
    return mergedArray;
};
