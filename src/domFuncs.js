import {
    isHtmlElement,
    isString,
    getType,
} from './is.js';
import {
    toKebab
} from './utils.js';

function qs(container, query) {
    if (isString(container)) container = qs(document, container);
    return container.querySelector(query);
}

// create DOM element.
function ce(tag) {
    return document.createElement(tag);
}

// create DOM fragment.
function cf() {
    return document.createDocumentFragment();
}

// create DOM Text Node.
function ct(str) {
    return document.createTextNode(str);
}

function append(elem, container) {
    if (isString(container)) {
        container = document.querySelector(container);
    }
    if (isHtmlElement(container)) container.appendChild(elem);
}

function insert(elem, container, anchor) {
    if (!isHtmlElement(elem)) throw new Error('first para must be an HtmlElement object.');
    if (isString(container)) {
        container = qs(document, container);
    };
    if (isHtmlElement(container) && isString(anchor)) {
        anchor = qs(container, anchor);
    }
    if (isHtmlElement(container) && isHtmlElement(anchor)) {
        let isChild = false;
        for (let i of container.childNodes) {
            if (i === anchor) {
                isChild = true;
                break;
            }
        }
        if (isChild) container.insertBefore(elem, anchor);
        else throw new Error(`Can not insert element to an ancestor element.`);
    }
}

function rm(elem, container) {
    container.removeChild(elem);
}

function setAttr(elem, attr, value) {
    if (!isString(attr)) throw new Error(`attr must be a string.`);
    if (isString(elem)) elem = qs(document, elem);
    if (!isHtmlElement(elem)) throw new Error(`Try setAttribute to a non HtmlElement.`);
    if (attr.toLowerCase().slice(0, 2) === 'on') {
        // event listener
        if (getType(value) !== 'Function') throw new Error(`Try to addEventListener with a non function value.`);
        let event = attr.slice(2).toLowerCase();
        elem.removeEventListener(event, value);
        elem.addEventListener(event, value);
    } else {
        attr = toKebab(attr);
        elem.setAttribute(attr, value);
    }
}

function rmAttr(elem, attr) {
    if (!isString(attr)) throw new Error(`attr must be a string.`);
    if (isString(elem)) elem = qs(document, elem);
    if (!isHtmlElement(elem)) throw new Error(`Try setAttribute to a non HtmlElement.`);
    elem.removeAttribute(attr);
}

function move(elem, container, anchor) {
    rm(elem, container);
    insert(elem, container, anchor);
}

export {
    ce,
    cf,
    ct,
    qs,
    rm,
    rmAttr,
    insert,
    append,
    setAttr,
    move,
};

// // test
// append(ce('input'), '#inner span');
// let a = ce('button');
// a.innerText = 'Good!';
// insert(a, document.body, '#outer');