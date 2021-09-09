import {
    reactive,
    effect,
}
from './reactive.js';

import {
    Component,
}
from './Component.js';

import {
    createApp,
}
from './createApp.js';

import {
    h,
    cloneVNode,
}
from './h.js';

const myVue = {
    h,
    cloneVNode,
    createApp,
    Component,
    reactive,
    effect,
};

window.myVue = myVue;