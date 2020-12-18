import { __crud, __vue, __components, __plugins, __event } from './options';
import { deepMerge } from './utils';
import { DialogDrag } from './directive';
import Crud from './crud';
import Form from './crud/lib/form';
require('./common');

export const CRUD = {
    version: '1.6.8',

    install: function (Vue, options) {
        const { crud, components, plugins } = options || {};

        // 合并参数
        deepMerge(__crud, crud);
        deepMerge(__vue, Vue);
        deepMerge(__components, components);
        deepMerge(__plugins, plugins);
        deepMerge(__event, new Vue());

        // 窗口拖动指令
        Vue.directive('dialog-drag', DialogDrag);

        // crud 组件
        Vue.component('cl-crud', Crud({ __crud, __components }));

        // 自定义表单组件
        Vue.component('cl-form', Form);

        // 挂载 $crud
        Vue.prototype.$crud = {
            emit: (name, callback) => {
                __event.$emit(name, callback);
            },
        };
    },
};

export default CRUD;
