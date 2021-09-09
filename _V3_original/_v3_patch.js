const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1; // prev ending index
    let e2 = l2 - 1; // next ending index

    // [Mars] : 1. Compare the head and the tail first.

    // 1. sync from start
    // (a b) c
    // (a b) d e
    while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = (c2[i] = optimized ?
            cloneIfMounted(c2[i]) :
            normalizeVNode(c2[i]));
        if (isSameVNodeType(n1, n2)) { // type and key are the same.
            patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
            break;
        }
        i++;
    }

    // 2. sync from end
    // a (b c)
    // d e (b c)
    while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = (c2[e2] = optimized ?
            cloneIfMounted(c2[e2]) :
            normalizeVNode(c2[e2]));
        if (isSameVNodeType(n1, n2)) { // type and key are the same.
            patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
            break;
        }
        e1--;
        e2--;
    }

    // [Mars] : 2. Compare the head and the tail first.

    // 3. common sequence + mount
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0
    if (i > e1) {
        if (i <= e2) {
            const nextPos = e2 + 1;
            const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
            while (i <= e2) {
                // mount new added vnodes not contained in oldChilds.
                patch(null, (c2[i] = optimized ?
                    cloneIfMounted(c2[i]) :
                    normalizeVNode(c2[i])), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
                i++;
            }
        }
    }

    // 4. common sequence + unmount
    // (a b) c
    // (a b)
    // i = 2, e1 = 2, e2 = 1
    // a (b c)
    // (b c)
    // i = 0, e1 = 0, e2 = -1
    else if (i > e2) {
        while (i <= e1) {
            unmount(c1[i], parentComponent, parentSuspense, true);
            i++;
        }
    }

    // 5. unknown sequence
    // [i ... e1 + 1]: a b [c d e] f g
    // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
        const s1 = i; // prev starting index
        const s2 = i; // next starting index

        // 5.1 build key:index map for newChildren
        const keyToNewIndexMap = new Map(); // use hashMap, cause it's easy to search an index of a key.
        for (i = s2; i <= e2; i++) {
            const nextChild = (c2[i] = optimized ?
                cloneIfMounted(c2[i]) :
                normalizeVNode(c2[i]));
            if (nextChild.key != null) {
                if (keyToNewIndexMap.has(nextChild.key)) {
                    warn$1(`Duplicate keys found during update:`, JSON.stringify(nextChild.key), `Make sure keys are unique.`);
                }
                keyToNewIndexMap.set(nextChild.key, i);
            }
        }

        // 5.2 loop through old children left to be patched and try to patch
        // matching nodes & remove nodes that are no longer present
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        // used to track whether any node has moved
        let maxNewIndexSoFar = 0;
        // works as Map<newIndex, oldIndex>
        // Note that oldIndex is offset by +1
        // and oldIndex = 0 is a special value indicating the new node has
        // no corresponding old node.
        // used for determining longest stable subsequence
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++)
            newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
            const prevChild = c1[i];
            if (patched >= toBePatched) {
                // all new children have been patched so this can only be a removal
                unmount(prevChild, parentComponent, parentSuspense, true);
                continue;
            }
            let newIndex;
            if (prevChild.key != null) {
                newIndex = keyToNewIndexMap.get(prevChild.key);
            } else {
                // key-less node, try to locate a key-less node of the same type
                for (j = s2; j <= e2; j++) {
                    if (newIndexToOldIndexMap[j - s2] === 0 &&
                        isSameVNodeType(prevChild, c2[j])) { // type and key are the same.
                        newIndex = j;
                        break;
                    }
                }
            }
            if (newIndex === undefined) {
                unmount(prevChild, parentComponent, parentSuspense, true);
            } else {
                newIndexToOldIndexMap[newIndex - s2] = i + 1; // n:[h,c,d,e]  o:[c,d,e,h]  ->  newIndexToOldIndexMap: [4,1,2,3]
             z   if (newIndex >= maxNewIndexSoFar) {
                    maxNewIndexSoFar = newIndex;
                } else {
                    moved = true;
                }
                patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
                patched++;
            }
        }

        // 5.3 move and mount
        // generate longest stable subsequence only when nodes have moved
        const increasingNewIndexSequence = moved ?
            getSequence(newIndexToOldIndexMap) :
            EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        // looping backwards so that we can use last patched node as anchor !!!!!!★★★
        for (i = toBePatched - 1; i >= 0; i--) {
            const nextIndex = s2 + i;
            const nextChild = c2[nextIndex];
            const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
            if (newIndexToOldIndexMap[i] === 0) {
                // mount new
                patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            } else if (moved) {
                // move if:
                // There is no stable subsequence (e.g. a reverse)
                // OR current node is not among the stable sequence
                if (j < 0 || i !== increasingNewIndexSequence[j]) {
                    move(nextChild, container, anchor, 2 /* REORDER */ );
                } else {
                    // position is matched, no movement.
                    j--;
                }
            }
        }
    }
};