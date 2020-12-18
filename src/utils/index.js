import cloneDeep from 'clone-deep';
import flat from 'array.prototype.flat';
import { __vue, __plugins } from '../options';

export function debounce(fn, delay) {
    let timer = null;

    return function () {
        let args = arguments;
        let context = this;

        if (timer) {
            clearTimeout(timer);

            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    };
}

export function isArray(value) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value);
    } else {
        return Object.prototype.toString.call(value) === '[object Array]';
    }
}

export function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

export function isNumber(value) {
    return !isNaN(Number(value));
}

export function isFunction(value) {
    return typeof value === 'function';
}

export function isString(value) {
    return typeof value === 'string';
}

export function isNull(value) {
    return !value && value !== 0;
}

export function isBoolean(value) {
    return typeof value === 'boolean';
}

export function isEmpty(value) {
    if (isArray(value)) {
        return value.length === 0;
    }

    if (isObject(value)) {
        return Object.keys(value).length === 0;
    }

    return value === '' || value === undefined || value === null;
}

export function clone(obj) {
    return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

export function certainProperty(obj, keys) {
    return keys.reduce((result, key) => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }

        return result;
    }, {});
}

export function getParent(name) {
    let parent = this.$parent;

    while (parent) {
        if (parent.$options.componentName !== name) {
            parent = parent.$parent;
        } else {
            return parent;
        }
    }

    return null;
}

export function dataset(obj, key, value) {
    const isGet = value === undefined;
    let d = obj;

    let arr = flat(
        key.split('.').map((e) => {
            if (e.includes('[')) {
                return e.split('[').map((e) => e.replace(/"/g, ''));
            } else {
                return e;
            }
        })
    );

    try {
        for (let i = 0; i < arr.length; i++) {
            let e = arr[i];
            let n = null;

            if (e.includes(']')) {
                let [k, v] = e.replace(']', '').split(':');

                if (v) {
                    n = d.findIndex((x) => x[k] == v);
                } else {
                    n = Number(n);
                }
            } else {
                n = e;
            }

            if (i != arr.length - 1) {
                d = d[n];
            } else {
                if (isGet) {
                    return d[n];
                } else {
                    d[n] = value;
                }
            }
        }

        return obj;
    } catch (e) {
        console.error('格式错误', `${key}`);
        return {};
    }
}

export function print(title, value) {
    console.log(title);

    if (value) {
        if (typeof value == 'object') {
            let obj = {};

            for (let i in value) {
                obj[i] = value[i];
            }

            if (console.table) {
                console.table(obj);
            } else {
                console.log(obj);
            }
        } else {
            console.log(value);
        }
    } else {
        console.log(value);
    }
}

export function resetForm(items, form) {
    items.forEach((e) => {
        if (isArray(e.value)) {
            form[e.prop] = [];
        } else if (isObject(e.value)) {
            form[e.prop] = {};
        } else {
            form[e.prop] = undefined;
        }
    });
}

export function clearForm(form) {
    for (let i in form) {
        if (isArray(form[i])) {
            form[i] = [];
        } else if (isObject(form[i])) {
            form[i] = {};
        } else {
            form[i] = undefined;
        }
    }
}

export function deepMerge(a, b) {
    let k;
    for (k in b) {
        a[k] =
            a[k] && a[k].toString() === '[object Object]' ? deepMerge(a[k], b[k]) : (a[k] = b[k]);
    }
    return a;
}

export function renderNode(vnode, options = {}) {
    const h = this.$createElement;
    const { scope } = options;

    if (isFunction(vnode)) {
        return vnode({ scope, h });
    } else if (isString(vnode)) {
        if (vnode.includes('slot-')) {
            let rn = this.crud ? this.crud.$scopedSlots[vnode] : this.$scopedSlots[vnode];

            if (rn) {
                return rn({ scope });
            }
        } else {
            return h(vnode);
        }
    } else {
        if (vnode.render) {
            if (!vnode.name) {
                console.error('Component name is required');
                return <span />;
            }

            if (!this.$root.$options.components[vnode.name]) {
                __vue.component(vnode.name, vnode);
            }

            return h(vnode.name, vnode);
        } else if (vnode.context) {
            return vnode;
        } else {
            console.error('Component invalid');
            return <span />;
        }
    }
}

let formItemNameIndex = 0;

export function renderForm(options = {}) {
    const h = this.$createElement;
    const scope = this.form;
    const { appendEl, forceUpdate } = options;

    const items = this.items.map((e, i) => {
        if (!e.hidden) {
            let vnode = null;

            if (isFunction(e.component)) {
                vnode = e.component({ scope, h });
            } else {
                let {
                    name,
                    attrs = {},
                    props,
                    on = {},
                    options = [],
                    children = [],
                    context,
                    render,
                    domProps = {},
                    style = {},
                    ['class']: _class = {},
                    nativeOn = {},
                    directives = {},
                    scopedSlots = {},
                    slot,
                    key,
                    ref,
                    refInFor,
                    width = '100%',
                } = e.component || {};

                if (!style.width) {
                    style.width = width;
                }

                let jsx = {
                    ...e.component,
                    ['class']: _class,
                    domProps,
                    style,
                    nativeOn,
                    directives,
                    scopedSlots,
                    slot,
                    key,
                    ref,
                    refInFor,
                    attrs: {
                        ...attrs,
                        value: this.form[e.prop],
                    },
                    props: {
                        ...props,
                    },
                    on: {
                        input: (val) => {
                            this.form[e.prop] = val;
                        },
                        ...on,
                    },
                };

                if (context) {
                    vnode = e.component;
                } else if (render) {
                    if (!name) {
                        name = 'error-text';
                        jsx.domProps.innerHTML = 'Component name is required';
                        jsx.style.color = 'red';
                    }

                    const fn = function () {
                        name = name + '-' + formItemNameIndex++;
                    };

                    if (isBoolean(e.forceUpdate)) {
                        if (e.forceUpdate) {
                            fn();
                        }
                    } else {
                        if (forceUpdate) {
                            fn();
                        }
                    }

                    if (!this.$root.$options.components[name]) {
                        __vue.component(name, jsx);
                    }

                    // Delete jsx props, avoid props is null.
                    delete jsx.props;

                    vnode = h(name, jsx);
                } else if (name) {
                    if (name.includes('slot-')) {
                        let rn = this.crud ? this.crud.$scopedSlots[name] : this.$scopedSlots[name];

                        if (rn) {
                            vnode = rn({ scope });
                        }
                    } else {
                        children = (e.component.options || []).map((e, i) => {
                            switch (name) {
                                case 'el-select':
                                    return (
                                        <el-option
                                            key={i}
                                            label={e.label}
                                            value={e.value}
                                            {...{ props: e.props }}
                                        />
                                    );

                                case 'el-radio-group':
                                    return (
                                        <el-radio key={i} label={e.value} {...{ props: e.props }}>
                                            {e.label}
                                        </el-radio>
                                    );

                                case 'el-checkbox-group':
                                    return (
                                        <el-checkbox
                                            key={i}
                                            label={e.value}
                                            {...{ props: e.props }}>
                                            {e.label}
                                        </el-checkbox>
                                    );
                            }
                        });

                        vnode = h(name, jsx, children);
                    }
                }
            }

            return (
                <el-col
                    xs={e.xs}
                    sm={e.sm}
                    md={e.md}
                    lg={e.lg}
                    xl={e.xl}
                    span={e.span}
                    offset={e.offset}
                    key={i}>
                    <el-form-item
                        label={e.label}
                        prop={e.prop}
                        rules={e.rules}
                        {...{ props: e.props }}>
                        {vnode}
                    </el-form-item>
                </el-col>
            );
        }
    });

    const form = (
        <el-form
            ref="form"
            class="cl-form"
            {...{
                props: {
                    disabled: this.saving,
                    model: this.form,
                    ...this.props,
                },
            }}>
            <el-row
                v-loading={this.loading}
                {...{
                    attrs: {
                        ...this['v-loading'],
                    },
                }}>
                {items}
                {appendEl}
            </el-row>
        </el-form>
    );

    return form;
}

export function contains(parent, node) {
    if (document.documentElement.contains) {
        return parent !== node && parent.contains(node);
    } else {
        while (node && (node = node.parentNode)) if (node === parent) return true;
        return false;
    }
}

export { cloneDeep, flat };
