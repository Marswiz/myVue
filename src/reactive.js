let activeEffect = null;
const objsMap = new WeakMap();

class Dep {
    constructor() {
        this.dep = new Set();
    }

    add(e) {
        this.dep.add(e);
    }

    trigger() {
        for (let e of this.dep) {
            e();
        }
    }
};

function effect(fn) {
    activeEffect = fn;
    fn(); // may use an reactive obj & cause get/set props opertation.
    activeEffect = null;
};


function track(obj, prop) {
    if (activeEffect !== null) {
        if (!objsMap.has(obj)) objsMap.set(obj, new Map());
        let depsMap = objsMap.get(obj);
        if (!depsMap.has(prop)) depsMap.set(prop, new Dep());
        let dep = depsMap.get(prop);
        dep.add(activeEffect);
    }
};

function trigger(obj, prop) {
    if (objsMap.has(obj)) {
        let depsMap = objsMap.get(obj);
        if (depsMap.has(prop)) {
            depsMap.get(prop).trigger();
        }
    }
};

function reTrackAllExcept(obj, prop) {
    if (objsMap.has(obj)) {
        let depsMap = objsMap.get(obj);
        let effects = new Set();
        for (let key of Reflect.ownKeys(obj)) {
            if (depsMap.has(key) && key !== prop) {
                let curEffects = depsMap.get(key).dep;
                for (let effect of curEffects) {
                    effects.add(effect);
                    curEffects.delete(effect);
                }
            }
        }
        for (let e of effects) {
            activeEffect = e;
            e();
        }
    }
}

function reactive(obj) {
    const reactiveObjHandler = {
        get(obj, prop) {
            track(obj, prop);
            return typeof Reflect.get(obj, prop) === 'object' ? reactive(Reflect.get(obj, prop)) : Reflect.get(obj, prop);
        },
        set(obj, prop, value) {
            if (!obj[prop]) {
                Reflect.set(obj, prop, value);
                reTrackAllExcept(obj, prop);
                return true;
            }
            Reflect.set(obj, prop, value);
            trigger(obj, prop);
            return true;
        }
    };
    return new Proxy(obj, reactiveObjHandler);
};

export {
    reactive,
    effect,
};