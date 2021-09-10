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
} from './domFuncs.js';
import {
    getMaxSequence,
} from './utils.js';
import {
    isUndef
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
        console.warn(`There are something undefined when patching a VNode. (You may try to modify an array's length larger directly.)`);
        return;
    }
    let container = v1._.el.parentNode;
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
                // simple implimentation (not maxSequence Algorithum.)
                let shorter = children1.length > children2.length ? children2.length : children1.length;
                for (let i = 0; i < shorter; i++) {
                    patch(children1[i], children2[i]);
                }
                if (shorter === children1.length) {
                    for (let i = shorter; i < children2.length; i++) {
                        mount(children2[i], el);
                    }
                } else {
                    for (let i = shorter; i < children1.length; i++) {
                        rm(children1[i]._.el, el);
                    }
                }

                if (v2._.el === null) console.log(v1, v2);
                // max sequence algorithum.
            }
        }
    } else {
        replace(v1, v2);
    }
}

export {
    patch
};