import { renderNode, certainProperty } from '@/utils';

export default {
    data() {
        return {
            dialog: {
                fullscreen: false,
            },
        };
    },

    methods: {
        onFullScreen() {
            const { width, top } = this.props;
            const { fullscreen } = this.dialog;

            const dlg = this.$el.querySelector('.el-dialog');

            this.dialog.fullscreen = !fullscreen;

            if (!fullscreen) {
                dlg.style.marginTop = 0;
                dlg.style.marginBottom = 0;
                dlg.style.left = 0;
                dlg.style.top = 0;
                dlg.style['min-height'] = '100%';
                dlg.style.width = '100%';
            } else {
                dlg.style['min-height'] = 'auto';
                dlg.style.height = 'auto';
                dlg.style.width = width;
                dlg.style.top = top;
                dlg.style.left = 0;
                dlg.style.marginBottom = '50px';
            }

            this.crud.$emit('fullscreen', this.dialog.fullscreen);
        },

        renderHeader() {
            const { title, drag } = this.props;
            const { layout = [] } = this.hdr;
            const { fullscreen } = this.dialog;

            return (
                <div
                    class="el-dialog__header-slot"
                    {...{
                        class: {
                            _drag: drag && !fullscreen,
                        },
                        directives: [
                            {
                                name: 'dialog-drag',
                                value: certainProperty(this, ['props', 'dialog']),
                            },
                        ],
                        on: {
                            dblclick: () => {
                                this.onFullScreen();
                            },
                        },
                    }}>
                    <span class="el-dialog__header-slot-title">
                        {title || (this.isEdit ? '编辑' : '新增')}
                    </span>

                    <div class="el-dialog__header-slot-button">
                        {layout.map((vnode) => {
                            if (vnode === 'fullscreen') {
                                return fullscreen ? (
                                    <button class="minimize" on-click={this.onFullScreen}>
                                        <i class="el-icon-minus" />
                                    </button>
                                ) : (
                                    <button class="maximize" on-click={this.onFullScreen}>
                                        <i class="el-icon-full-screen" />
                                    </button>
                                );
                            } else if (vnode === 'close') {
                                return (
                                    <button class="close" on-click={this.close}>
                                        <i class="el-icon-close" />
                                    </button>
                                );
                            } else {
                                return renderNode.call(this, vnode);
                            }
                        })}
                    </div>
                </div>
            );
        },

        renderDialog({ form, footer }, options) {
            return (
                this.visible && (
                    <el-dialog
                        class="cl-form"
                        visible={this.visible}
                        {...{
                            props: {
                                ...this.props,
                            },

                            on: {
                                open: this.open,
                                close: this.close,
                            },

                            directives: [
                                {
                                    name: 'dialog-drag',
                                    value: certainProperty(this, ['props', 'dialog', 'win']),
                                },
                            ],

                            ...options,
                        }}>
                        <template slot="title">{this.renderHeader()}</template>
                        {form}
                        <template slot="footer">{this.op.visible && footer}</template>
                    </el-dialog>
                )
            );
        },
    },
};
