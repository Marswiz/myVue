//test

// import {
//     patch,
// } from '../src/patch_maxSequence.js';

// import {
//     Component
// } from '../src/Component.js';

// import {
//     h,
// } from '../src/h.js';

// import {
//     createApp,
// } from '../src/createApp.js';
// import {
//     mount
// } from '../src/mount.js';

const {
    h,
    cloneVNode,
    createApp,
    Component,
    reactive,
    effect,
} = myVue;

// let comp1 = new Component({
//     array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
// }, function() {
//     return h('div', {
//         style: 'width: 500px; height: 500px; background-color: silver; display: grid; grid-template-columns: 1fr 1fr 1fr;',
//     }, this.array.map((item, index) => h('div', {
//         style: item % 2 === 0 ? 'background-color: pink;' : 'background-color: gold;',
//     }, [this.array[index] + ''])));
// });
// createApp(comp1, '#app1');


let comp1 = new Component({
    array: [1, 2, 3, 4, 5, 6, -1, -1, -1],
}, function() {
    let children = [];
    for (let i = 0; i < this.array.length; i++) {
        let prop = {};
        if (this.array[i] !== -1) {
            prop.key = this.array[i];
        }
        children.push(h('li', prop, [this.array[i] + '']));
    }
    return h('ul', {
        key: 'ul'
    }, children);
});

createApp(comp1, '#app1');


function shuffle(arr) {
    let cur = arr.length - 1;
    while (cur > 0) {
        let pick = Math.floor(Math.random() * (cur + 1));
        let t = arr[pick];
        arr[pick] = arr[cur];
        arr[cur] = t;
        cur -= 1;
    }
}

document.querySelector('button').addEventListener('click', () => {
    // let rand = Math.floor(Math.random() * comp1.data.array.length);
    // comp1.data.array.splice(rand, 1);
    shuffle(comp1.data.array);
});