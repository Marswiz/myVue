import {
    reactive,
} from './reactive.js';

class Component {
    constructor(data = {}, render = () => {}) {
        this.data = reactive(data);
        this.render = render.bind(this.data);
    }
}

export {
    Component,
};