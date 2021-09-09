class VNode {

    // private props: 
    _ = {
        el: null,
        type: null,
        index: ++VNode.INDEX,
        clonedFromIndex: 0,
    };

    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }

    static TYPE = {
        ELEMENT: 1,
        TEXT: 1 << 1,
    }

    static INDEX = 0;
}

export {
    VNode
};
