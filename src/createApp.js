import {
    reactive,
    effect,
} from './reactive.js';

import {
    mount
} from './mount.js';

import {
    patch
} from './patch_maxSequence.js';

function createApp(component, container) {
    let mounted = false;
    let prevTree;
    effect(() => {
        let newTree = component.render();
        if (mounted) {
            patch(prevTree, newTree);
        } else {
            mount(newTree, container);
            mounted = true;
        }
        prevTree = newTree;
    });
}

export {
    createApp,
};