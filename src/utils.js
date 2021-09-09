function toKebab(str) {
    if (typeof str !== 'string') return '';
    let arr = str.split('');
    for (let cur = str.length - 1; cur >= 0; cur--) {
        if (arr[cur] >= 'A' && arr[cur] <= 'Z') {
            arr[cur] = arr[cur].toLowerCase();
            arr.splice(cur, 0, '-');
        }
    }
    return arr.join('');
}

// Get max asscending sequence of an pure number array.
// getMaxSequence(arr);
// eg. [2,3,6,1,7]  -> [2,3,6,7]

// Algorithum (greedy) :
// Time: O(n*logn)
// Steps:
//      1. Maintain an accending order array:[result], and an array:[p] whose length is the same with given array.
//      2. result[i] = n, means that at current status, we have found a max accending sequence of length i+1, and the minimum number at the tail of the sequence is [n]. 
//      3. p[i] is setted when we take an element form the original given array and refresh the result array with it. p[i] records the previous number of result array of where we put the current element array[i] into at the result array;
//      4. result array is an accending array, we iterate the original array and pick current element (arr[i]), then find the first element which is larger than current element in result array (assume that position is [pos]), and replace it with current element value;
//      5. then we get the previous element of result array (result[pos-1]), and set p[i] with it;
//      6. after we iterate all the elements, the last element of result array must be the real number of the max sequence, other elements can be replaced during the precess above, so they may be not the real number of the result max sequence;
//      7. Luckily, we record the real element when we refresh every element of result, which is in array p. 
//      8. everytime, we get the element of result array, and find the position of it in the original array [pos], the real previous element of max subsquence  is p[pos];
//      9. repeat the step.8 until all the sequence is found.

function getMaxSequence(arr) {
    let result = [];
    let p = arr.slice(); // same length of arr.

    function bs(tar) {
        // find the first num which [ >= tar ].
        let l = 0,
            r = result.length - 1;
        while (l < r) {
            let m = Math.floor((l + r) / 2);
            if (arr[result[m]] >= tar) r = m;
            else l = m + 1;
        }
        return l;
    }

    for (let i = 0; i < arr.length; i++) {
        if (result.length === 0) {
            result.push(i);
            p[i] = null;
        } else {
            let pos = bs(arr[i]);
            if (arr[result[pos]] >= arr[i]) {
                if (pos === 0) {
                    result[pos] = i;
                    p[i] = null;
                } else {
                    result[pos] = i;
                    p[i] = result[pos - 1];
                }
            } else {
                p[i] = result[result.length - 1];
                result.push(i);
            }
        }
    }

    let cur = result.length;
    let prev = result[result.length - 1];
    while (cur > 0) {
        cur -= 1;
        result[cur] = prev;
        prev = p[result[cur]];
    }

    return result;
}

export {
    toKebab,
    getMaxSequence,
};