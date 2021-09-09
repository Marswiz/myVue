function getType(e) {
    return Object.prototype.toString.call(e).slice(8, -1);
}

function isHtmlElement(e) {
    return e instanceof HTMLElement || e instanceof Text;
}

function isString(e) {
    return getType(e) === 'String';
}

function isUndef(e) {
    return e === void 0;
}

function isEmpty(e) {
    if (getType(e) === 'Object') {
        return Reflect.ownKeys(e).length === 0;
    }
    if (getType(e) === 'Array') {
        return e.length === 0;
    }
}

export {
    getType,
    isHtmlElement,
    isString,
    isEmpty,
    isUndef,
};