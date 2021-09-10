# myVue 

2021.09.06 Created By Mars.

My attempt to accomplish a Vue.js

# Directory & Function.

- **reactive.js:**
  - reactive an object;
- **VNode.js:**
  - define a VNode class;
- **h.js:**
  - create a VNode instance; 
- **is.js:**
  - helper to get something is or not another thing;
- **utils.js:**
  - helper functions;
- **domFunc.js:**
  - easy to use DOM functions;
- **mount.js:**
  - mount a VNode to a DOM container;
- **patch.js:**
  - patch two VNode tree (find the diff and refresh the diff in real DOM)
- **Component.js**
  - define a Component class;
- **createApp.js**
  - render a component to DOM container and keep it's `[data]` reactive;

# APIs

> main file location (for Browser): `./dist/myVue.js` 

window.myVue:
- **h(tag : string, props : object, children: array):**
  - Create a VNode. If tag is empty string, VNode type is pure text. Or you will create a element VNode and the tag means the HTMLElement tag.
  - props is the attributes set onto matching DOM Node;
  - children are the children VNodes, which must be an array type, a child can be a string (pure text) or a VNode (HTML element). 
- **createApp(component: Component, container : queryString | HTMLElement):**
  - mount a component to a app container, and keep it's data reactive;
- **Component(data : object, render):**
  - Contructor of a component, you should input a data object which will be reactive after the component is mounted.
  - render should be function type, and return VNode type to be rendered into the container; 
- **reactive(obj: object):**
  - Change an object to reactive object;
- **effect(fn: function):**
  - run a function as effect, which means that all the reactive objects it used inside itself will track the function as an effect in their own deps.
- **cloneVNode:**
  - cloneVNode from one to another;