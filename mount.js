import {
    VNode
} from './VNode.js';
import {
    isEmpty,
    isUndef,
    isString,
} from './is.js';
import {
    h
} from './h.js';
import * as dom from './domFuncs.js';

function mount(vnode, container, anchor) {
    if (isUndef(vnode)) {
        console.warn(`There are something undefined when mounting a VNode. (You may try to modify an array's length larger directly.)`);
        vnode = h('', {}, ['undefined']);
    }
    if (vnode._.type & VNode.TYPE.ELEMENT) {
        let tag = vnode.type;
        let {
            props,
            children
        } = vnode;
        let el = dom.ce(tag);
        vnode._.el = el;
        if (!isEmpty(props)) {
            for (let prop of Reflect.ownKeys(props)) {
                dom.setAttr(el, prop, Reflect.get(props, prop));
            }
        }
        if (!isEmpty(children)) {
            for (let child of children) {
                mount(child, el);
            }
        }
        if (isUndef(anchor)) dom.append(el, container);
        else dom.insert(el, container, anchor);
    } else if (vnode._.type & VNode.TYPE.TEXT) {
        let text = vnode.props.text;
        let el = dom.ct(text);
        vnode._.el = el;
        if (isUndef(anchor)) dom.append(el, container);
        else dom.insert(el, container, anchor);
    }
}

export {
    mount,
};