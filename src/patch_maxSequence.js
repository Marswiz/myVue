import {
    VNode
} from './VNode.js';
import {
    mount
} from './mount.js';
import {
    rm,
    rmAttr,
    setAttr,
    move,
} from './domFuncs.js';
import {
    getMaxSequence,
    toKebab,
} from './utils.js';
import {
    isUndef,
    isSameVNode,
} from './is.js';

function replace(v1, v2) {
    if ((v1._.type & VNode.TYPE.TEXT) && (v2._.type & VNode.TYPE.TEXT)) {
        v1._.el.nodeValue = v2.props.text;
        v2._.el = v1._.el;
        return;
    }
    let parent = v1._.el.parentNode;
    let anchor = v1._.el.nextSibling || void 0;
    parent.removeChild(v1._.el);
    mount(v2, parent, anchor);
}

function patch(v1, v2) {
    if (isUndef(v1) || isUndef(v2)) {
        // console.log(v1,v2);
        console.warn(`There are something undefined when patching a VNode. (You may try to modify an array's length larger directly.)`);
        return;
    }
    let el = v1._.el;
    if (v1._.type === v2._.type) {
        if (v1._.type & VNode.TYPE.TEXT) {
            if (v1.props.text !== v2.props.text) replace(v1, v2);
            else v2._.el = el;
        } else {
            if (v1.type !== v2.type) replace(v1, v2);
            else {
                // diff algorithum.
                // diff props.
                v2._.el = el;
                let newProps = v2.props;
                let oldProps = v1.props;
                for (let prop of Reflect.ownKeys(newProps)) {
                    if (oldProps[prop] !== newProps[prop]) {
                        if (newProps[prop] === null) rmAttr(el, prop);
                        else setAttr(el, prop, newProps[prop]);
                    }
                }
                for (let prop of Reflect.ownKeys(oldProps)) {
                    if (Object.keys(newProps).indexOf(prop) === -1) rmAttr(el, prop);
                }

                // diff children._.index is at accending order !!!! -- Mars 2021.09.07
                let children1 = v1.children,
                    children2 = v2.children;
                if (children1.length === 0 && children2.length === 0) return;
                // max sequence algorithum.
                let head = 0;
                let e1 = children1.length - 1,
                    e2 = children2.length - 1;
                while (head <= e1 && head <= e2 && isSameVNode(children1[head], children2[head])) {
                    patch(children1[head], children2[head]);
                    head += 1;
                }
                while (head <= e1 && head <= e2 && isSameVNode(children1[e1], children2[e2])) {
                    patch(children1[e1], children2[e2]);
                    e1 -= 1;
                    e2 -= 1;
                }
                if (head > e1 && head <= e2) {
                    while (head <= e2) {
                        mount(children2[head], el);
                        head += 1;
                    }
                } else if (head > e2 && head <= e1) {
                    while (head <= e1) {
                        rm(children1[head]._.el, el);
                        head += 1;
                    }
                } else {
                    let start = head;
                    let totalLength = e2 - start + 1;
                    let newChildrenMap = new Map();
                    let newChildPositionInOldChild = new Array(totalLength).fill(-1);
                    for (let i = start; i <= e2; i++) {
                        if (children2[i].props.key) newChildrenMap.set(children2[i].props.key, i - start);
                    }
                    // find new child position in old children array.
                    for (let i = start; i <= e1; i++) {
                        let pos = -1;
                        if (!isUndef(children1[i].props.key)) {
                            pos = newChildrenMap.get(children1[i].props.key);
                            patch(children1[i], children2[pos + start]);
                        } else {
                            for (let j = start; j <= e2; j++) {
                                if (newChildPositionInOldChild[j - start] === -1 && isSameVNode(children2[j], children1[i])) {
                                    pos = j - start;
                                    patch(children1[i], children2[j]);
                                    break;
                                }
                            }
                        }
                        if (pos === -1) {
                            // console.log(`deleted at old position ${i}.`);
                            // console.log(children1[i]);
                            rm(children1[i]._.el, el);
                        } else {
                            newChildPositionInOldChild[pos] = i - start;
                        }
                    }
                    let maxSequence = getMaxSequence(newChildPositionInOldChild);
                    let j = maxSequence.length - 1;
                    // console.log(v1,v2, newChildrenMap, newChildPositionInOldChild, maxSequence);
                    for (let i = newChildPositionInOldChild.length - 1; i >= 0; i--) {
                        let curNode = children2[start + i];
                        let anchor = start + i < children2.length - 1 ? children2[start + i + 1]._.el : undefined;
                        if (j >= 0 && maxSequence[j] === i) {
                            // exist in maxSequence, has been patched, and no need to move.
                            j -= 1;
                            // console.log(curNode.props.key + ' is stable!');
                            continue;
                        } else {
                            if (newChildPositionInOldChild[i] === -1) {
                                // new vnode in children2 and not exist in children1;
                                mount(curNode, el, anchor);
                            } else {
                                // not exist in maxSequence, has been patched, need to move.
                                move(curNode._.el, el, anchor);
                                // console.log(`${curNode.props.key} is moved to ahead of ${anchor.innerText}`);
                            }
                        }
                    }
                }
            }
        }
    } else {
        replace(v1, v2);
    }
}

export {
    patch
};