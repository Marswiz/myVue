import {
    VNode
} from './VNode.js';
import {
    isEmpty,
    isString,
    getType,
} from './is.js';

function h(type, props = {}, children = []) {
    let VNodeType = type === '' ? VNode.TYPE.TEXT : VNode.TYPE.ELEMENT;
    if (!isEmpty(children)) {
        children = children.map(child => {
            if (isString(child)) return h('', {
                text: child
            }, []);
            return child;
        });
    }
    let res = new VNode(type, props, children);
    res._.type = VNodeType;
    return res;
}

function cloneVNode(vnode) {
    let res = h(vnode.type, Object.assign({}, vnode.props), vnode.children.map(child => cloneVNode(child)));
    res._.el = vnode._.el;
    res._.clonedFromIndex = vnode._.index;
    return res;
}

export {
    h,
    cloneVNode,
};