import {
    h,
    cloneVNode,
} from '../h.js';
import {
    Component
} from '../Component.js';

import {
    createApp
} from '../createApp.js';
import {
    reactive,
    effect,
} from '../reactive.js';
import {
    mount
} from '../mount.js';

import {
    patch
} from '../patch.js';
import {
    qs
} from '../domFuncs.js';

//test

// let vnode1 = h('div', {
//     class: 'class1',
//     style: 'width: 100px; background-color: pink;',
//     comt: 'Pee',
// }, [h('ul', {}, [
//     h('li', {
//         onclick: () => {
//             console.log(123);
//         }
//     }, ['1']),
//     h('li', {}, ['2']),
//     h('li', {}, ['3']),
// ]), 'Bare TestText', h('p', {
//     class: 'good'
// }, ["i'm a paragraph."])]);

let comp1 = new Component({
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
}, function() {
    return h('div', {
        style: 'width: 500px; height: 500px; background-color: silver; display: grid; grid-template-columns: 1fr 1fr 1fr;',
    }, this.array.map((item, index) => h('div', {
        style: item % 2 === 0 ? 'background-color: pink;' : 'background-color: gold;',
    }, [this.array[index] + ''])));
});

let comp2 = new Component({
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
}, function() {
    return h('div', {
        style: 'width: 500px; height: 500px; background-color: silver; display: grid; grid-template-columns: 1fr 1fr 1fr;',
    }, this.array.map((item, index) => h('div', {
        style: item % 2 === 0 ? 'background-color: pink;' : 'background-color: gold;',
    }, [this.array[index] + ''])));
});

createApp(comp1, '#app1');
createApp(comp2, '#app2');

function shuffle(arr) {
    let cur = arr.length - 1;
    while (cur > 0) {
        let pick = Math.floor(Math.random()*(cur+1));
        [arr[pick], arr[cur]] = [arr[cur], arr[pick]];
        cur -= 1;
    }
}

document.querySelector('button').addEventListener('click', () => {
    // let rand = Math.floor(Math.random() * comp1.data.array.length);
    // comp1.data.array.splice(rand, 1);
    comp1.data.array.push(comp1.data.array.length);
    shuffle(comp1.data.array);
});