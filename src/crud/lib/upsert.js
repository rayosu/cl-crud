import { renderForm, renderNode, cloneDeep, clearForm } from '@/utils';
import DialogMixin from '@/mixins/dialog';
import Flex1 from './flex1';

export default {
    mixins: [DialogMixin],
    inject: ['crud'],

    components: {
        Flex1,
    },

    data() {
        return {
            // 显隐
            visible: false,
            // 加载
            loading: false,
            saving: false,
            // 是否编辑
            isEdit: false,
            // 表单项
            items: [],
            // 操作栏
            op: {},
            // 窗口栏
            hdr: {},
            // 表单值
            form: {},
            // 弹窗参数
            props: {},
            // 打开同步
            sync: false,
        };
    },

    methods: {
        async open(callback) {
            let { props, items, op, hdr, form, sync } = this.crud.upsert;

            const dataset = () => {
                // 设置参数
                this.props = props;
                // 设置表单项
                this.items = items;
                // 设置表单数据初始值
                this.form = form;
                // 设置操作栏
                this.op = op;
                // 设置窗口栏
                this.hdr = hdr;
                // 是否同步打开
                this.sync = sync;

                if (!props.top) {
                    props.top = '15vh';
                }

                if (!props.width) {
                    props.width = '50%';
                }

                // 是否全屏
                this.dialog.fullscreen = props.fullscreen;

                // 设置表单值
                this.items.forEach((e) => {
                    if (e.prop) {
                        this.$set(this.form, e.prop, cloneDeep(e.value));
                    }
                });
            };

            const expand = callback || new Function();

            // 同步打开
            if (sync) {
                dataset();
                expand();
            }
            // 异步打开
            else {
                this.visible = true;
                dataset();
                this.$nextTick(() => {
                    expand();
                });
            }
        },

        show(...args) {
            this.visible = true;
            this.emit.apply(this, ['open', this.isEdit, ...args]);
        },

        close() {
            // Reset value
            clearForm(this.form);

            // Clear status
            this.visible = false;
            this.loading = false;
            this.saving = false;

            this.emit('close', this.isEdit);
        },

        clear() {
            clearForm(this.form);
        },

        reset() {
            this.resetForm(this.items, this.form);
        },

        emit(name, ...args) {
            const fn = this.crud.fn[name];

            if (fn) {
                fn.apply(this, args);
            }
        },

        edit(data) {
            const { fn, dict, service } = this.crud;

            const done = (obj) => {
                for (let i in obj) {
                    this.form[i] = obj[i];
                }

                this.loading = false;
                this.show(this.form);
            };

            const next = (data) => {
                return new Promise((resolve, reject) => {
                    const reqName = dict.api.info;

                    if (!service[reqName]) {
                        this.loading = false;

                        return reject(`Request function '${reqName}' is not fount`);
                    }

                    service[reqName]({
                        id: data.id,
                    })
                        .then((res) => {
                            done(res);
                            resolve(res);
                        })
                        .catch((err) => {
                            this.$message.error(err);
                            reject(err);
                        })
                        .done(() => {
                            this.loading = false;
                        });
                });
            };

            this.loading = true;
            this.isEdit = true;

            this.open(async () => {
                if (fn.info) {
                    this.emit('info', data, { next, done });
                } else {
                    next(data);
                }
            });
        },

        add() {
            this.isEdit = false;

            this.open(() => {
                this.show(null);
            });
        },

        append(data) {
            this.isEdit = false;

            this.open(() => {
                if (data) {
                    Object.assign(this.form, data);
                }
                this.show(data);
            });
        },

        save() {
            return new Promise((resolve, reject) => {
                this.$refs['form'].validate(async (valid) => {
                    if (valid) {
                        const { conf, dict, service, fn } = this.crud;

                        const done = () => {
                            this.saving = false;
                        };

                        const next = (data) => {
                            const method = this.isEdit ? 'update' : 'add';
                            const tips = this.crud.tips[method];

                            return new Promise((resolve2, reject2) => {
                                const reqName = dict.api[method];

                                if (!service[reqName]) {
                                    this.saving = false;

                                    return reject(`Request function '${reqName}' is not fount`);
                                }

                                service[reqName](data)
                                    .then((res) => {
                                        this.$message.success(tips.success);
                                        this.close();

                                        if (conf['UPSERT_REFRESH']) {
                                            this.crud.refresh();
                                        }

                                        resolve(res);
                                        resolve2(res);
                                    })
                                    .catch((err) => {
                                        this.$message.error(tips.error || err);
                                        reject(err);
                                        reject2(err);
                                    })
                                    .done(() => {
                                        this.saving = false;
                                    });
                            });
                        };

                        let data = cloneDeep(this.form);

                        this.saving = true;

                        if (fn.submit) {
                            this.emit('submit', this.isEdit, data, {
                                next,
                                done,
                                close: this.close,
                            });
                        } else {
                            next(data);
                        }
                    }
                });
            });
        },
    },

    render() {
        const form = renderForm.call(this);
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
