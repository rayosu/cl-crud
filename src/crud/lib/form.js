import {
    renderForm,
    deepMerge,
    renderNode,
    certainProperty,
    dataset,
    cloneDeep,
    resetForm,
    clearForm,
} from '@/utils';
import DialogMixin from '@/mixins/dialog';
import Flex1 from './flex1';
import '../assets/css/index.styl';

export default {
    mixins: [DialogMixin],
    name: 'cl-form',
    components: {
        Flex1,
    },

    data() {
        return {
            items: [],
            hdr: {
                layout: ['fullscreen', 'close'],
            },
            op: {
                visible: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                layout: ['cancel', 'confirm'],
            },
            props: {
                drag: true,
                size: 'small',
                'append-to-body': true,
                'close-on-click-modal': false,
                'destroy-on-close': true,
            },
            form: {},
            on: {
                load: null,
                submit: null,
                close: null,
            },
            fn: {},
            saving: false,
            loading: false,
            visible: false,
            'v-loading': {
                'element-loading-text': '',
                'element-loading-spinner': '',
                'element-loading-background': '',
            },
            aid: {
                forceUpdate: null,
            },
        };
    },

    computed: {
        crud() {
            return this;
        },
    },

    methods: {
        open(options) {
            if (!options) {
                return console.error(`can't open form, because argument is null`);
            }

            let { props = {}, items = [], on = {}, op = {}, hdr = {}, forceUpdate } = options;

            // 显示窗口
            this.visible = true;
            // 辅助参数：强制更新
            this.aid.forceUpdate = forceUpdate;

            // 设置表单项
            if (items) {
                this.items = items;
            }

            // 窗口配置
            if (!props.top) {
                props.top = '15vh';
            }

            if (!props.width) {
                props.width = '50%';
            }

            // 是否全屏
            this.dialog.fullscreen = props.fullscreen;

            // 参数合并
            if (props) {
                deepMerge(this.props, props);
            }

            // 事件合并
            if (on) {
                this.on = on;
            }

            // 操作栏合并
            if (op) {
                deepMerge(this.op, op);
            }

            // 窗口栏合并
            if (hdr) {
                deepMerge(this.hdr, hdr);
            }

            // 设置表单值
            this.items.forEach((e) => {
                if (e.prop) {
                    this.$set(this.form, e.prop, cloneDeep(e.value));
                }
            });

            // 互动
            const res = this.cb();

            // 加载完事件
            if (on.load) {
                on.load(res);
            }

            return res;
        },

        done() {
            this.saving = false;
        },

        reset() {
            resetForm(this.items, this.form);
        },

        close() {
            clearForm(this.form);

            this.visible = false;
            this.saving = false;

            if (this.on.close) {
                this.on.close();
            }
        },

        showLoading(text) {
            this['v-loading']['element-loading-text'] = text;
            this.loading = true;
        },

        hideLoading() {
            this.loading = false;
        },

        getRef() {
            return this.$refs.form;
        },

        getData(p) {
            return dataset(certainProperty(this, ['items']), p);
        },

        setData(p, d) {
            deepMerge(this, dataset(certainProperty(this, ['items']), p, d));
        },

        getForm(prop) {
            return this.form[prop];
        },

        setForm(prop, value) {
            this.form[prop] = value;
        },

        hiddenItem(prop, flag = true) {
            this.setData(`items[prop:${prop}].hidden`, flag);
        },

        cb() {
            return {
                data: this.form,
                ...certainProperty(this, [
                    'done',
                    'items',
                    'save',
                    'close',
                    'reset',
                    'showLoading',
                    'hideLoading',
                    'setData',
                    'getData',
                    'setForm',
                    'getForm',
                    'getRef',
                    'hiddenItem',
                ]),
            };
        },

        save() {
            const next = () => {
                if (this.on.submit) {
                    this.saving = true;

                    this.on.submit(this.cb());
                } else {
                    console.error('Submit is not found');
                }
            };

            if (this.$refs.form) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        next();
                    }
                });
            } else {
                next();
            }
        },
    },

    render() {
        const form = this.$slots.default || renderForm.call(this, this.aid);
        const footer = (this.op.layout || []).map((vnode) => {
            if (vnode == 'confirm') {
                return (
                    <el-button
                        size={this.props.size}
                        type="success"
                        {...{
                            on: {
                                click: this.save,
                            },

                            props: {
                                loading: this.saving,
                                disabled: this.loading,
                            },
                        }}>
                        {this.op.confirmButtonText}
                    </el-button>
                );
            } else if (vnode == 'cancel') {
                return (
                    <el-button size={this.props.size} on-click={this.close}>
                        {this.op.cancelButtonText}
                    </el-button>
                );
            } else if (vnode == 'flex1') {
                return <flex1 />;
            } else {
                return renderNode.call(this, vnode);
            }
        });

        return this.renderDialog({ form, footer });
    },
};
